"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<string>("en");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const pathname = usePathname();

  // Persistent cache backed by localStorage for 0ms instant page switches
  const cache = useRef<Record<string, Record<string, string>>>({
    hi: {},
    pa: {}
  });

  useEffect(() => {
    try {
      const savedCache = localStorage.getItem("yo_translation_cache");
      if (savedCache) cache.current = JSON.parse(savedCache);
    } catch {}

    const savedLang = localStorage.getItem("app_lang");
    if (savedLang) setLangState(savedLang);
  }, []);

  const setLang = (newLang: string) => {
    localStorage.setItem("app_lang", newLang);
    setLangState(newLang);
  };

  // Single-Request Batch GTX Translator (Eliminates Lag)
  const translateBatchFast = async (texts: string[], targetLang: string) => {
    if (!cache.current[targetLang]) cache.current[targetLang] = {};
    const missing = texts.filter(t => !cache.current[targetLang][t]);
    if (missing.length === 0) return;

    try {
      // Join all strings with a newline so Google translates everything in 1 HTTP call
      const combined = missing.join("\n");
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(combined)}`;
      const res = await fetch(url);
      const data = await res.json();
      
      const fullTranslated = data[0].map((item: any) => item[0]).join("");
      const splitTranslated = fullTranslated.split("\n");

      if (splitTranslated.length === missing.length) {
        missing.forEach((orig, i) => {
          cache.current[targetLang][orig] = splitTranslated[i].trim();
        });
      } else {
        // Fallback if newline count shifted
        await Promise.all(
          missing.map(async (str) => {
            const singleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(str)}`;
            const r = await fetch(singleUrl);
            const d = await r.json();
            cache.current[targetLang][str] = d[0].map((x: any) => x[0]).join("").trim();
          })
        );
      }

      try {
        localStorage.setItem("yo_translation_cache", JSON.stringify(cache.current));
      } catch {}
    } catch (err) {
      console.error("Batch translation error:", err);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const translatePage = async () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      const textNodes: Text[] = [];
      let currentNode = walker.nextNode();

      while (currentNode) {
        const parent = currentNode.parentElement;
        if (
          parent &&
          !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'OPTION'].includes(parent.tagName) &&
          !parent.closest('[data-no-translate="true"]')
        ) {
          const val = currentNode.nodeValue?.trim() || "";
          if (val.length > 1 && /[a-zA-Z\u0900-\u097F\u0A00-\u0A7F]/.test(val)) {
            textNodes.push(currentNode as Text);
          }
        }
        currentNode = walker.nextNode();
      }

      textNodes.forEach((node: any) => {
        if (!node.__origText && /[a-zA-Z]/.test(node.nodeValue || "")) {
          node.__origText = node.nodeValue;
        }
      });

      if (lang === "en") {
        textNodes.forEach((node: any) => {
          if (node.__origText) {
            node.nodeValue = node.__origText;
          }
        });
        return;
      }

      const nodesToUpdate: { node: any; raw: string; trimmed: string }[] = [];
      textNodes.forEach((node: any) => {
        const orig = node.__origText;
        if (orig) {
          nodesToUpdate.push({
            node,
            raw: orig,
            trimmed: orig.trim()
          });
        }
      });

      if (nodesToUpdate.length === 0) return;

      // Immediately apply any cached translations (0ms delay)
      let needsNetwork = false;
      nodesToUpdate.forEach(({ node, raw, trimmed }) => {
        const cached = cache.current[lang]?.[trimmed];
        if (cached) {
          const targetVal = raw.replace(trimmed, cached);
          if (node.nodeValue !== targetVal) node.nodeValue = targetVal;
        } else {
          needsNetwork = true;
        }
      });

      if (!needsNetwork) return;

      setIsTranslating(true);
      const uniqueStrings = Array.from(new Set(nodesToUpdate.map(n => n.trimmed)));
      await translateBatchFast(uniqueStrings, lang);

      if (isCancelled) return;

      nodesToUpdate.forEach(({ node, raw, trimmed }) => {
        const translated = cache.current[lang]?.[trimmed];
        if (translated) {
          const targetVal = raw.replace(trimmed, translated);
          if (node.nodeValue !== targetVal) node.nodeValue = targetVal;
        }
      });

      setIsTranslating(false);
    };

    const timer = setTimeout(translatePage, 60);

    const observer = new MutationObserver(() => {
      if (lang !== "en") {
        clearTimeout(timer);
        setTimeout(translatePage, 120);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [lang, pathname]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}