module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[project]/src/context/LanguageContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function LanguageProvider({ children }) {
    const [lang, setLangState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("en");
    const [isTranslating, setIsTranslating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    // Persistent cache backed by localStorage for 0ms instant page switches
    const cache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        hi: {},
        pa: {}
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const savedCache = localStorage.getItem("yo_translation_cache");
            if (savedCache) cache.current = JSON.parse(savedCache);
        } catch  {}
        const savedLang = localStorage.getItem("app_lang");
        if (savedLang) setLangState(savedLang);
    }, []);
    const setLang = (newLang)=>{
        localStorage.setItem("app_lang", newLang);
        setLangState(newLang);
    };
    // Single-Request Batch GTX Translator (Eliminates Lag)
    const translateBatchFast = async (texts, targetLang)=>{
        if (!cache.current[targetLang]) cache.current[targetLang] = {};
        const missing = texts.filter((t)=>!cache.current[targetLang][t]);
        if (missing.length === 0) return;
        try {
            // Join all strings with a newline so Google translates everything in 1 HTTP call
            const combined = missing.join("\n");
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(combined)}`;
            const res = await fetch(url);
            const data = await res.json();
            const fullTranslated = data[0].map((item)=>item[0]).join("");
            const splitTranslated = fullTranslated.split("\n");
            if (splitTranslated.length === missing.length) {
                missing.forEach((orig, i)=>{
                    cache.current[targetLang][orig] = splitTranslated[i].trim();
                });
            } else {
                // Fallback if newline count shifted
                await Promise.all(missing.map(async (str)=>{
                    const singleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(str)}`;
                    const r = await fetch(singleUrl);
                    const d = await r.json();
                    cache.current[targetLang][str] = d[0].map((x)=>x[0]).join("").trim();
                }));
            }
            try {
                localStorage.setItem("yo_translation_cache", JSON.stringify(cache.current));
            } catch  {}
        } catch (err) {
            console.error("Batch translation error:", err);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isCancelled = false;
        const translatePage = async ()=>{
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
            const textNodes = [];
            let currentNode = walker.nextNode();
            while(currentNode){
                const parent = currentNode.parentElement;
                if (parent && ![
                    'SCRIPT',
                    'STYLE',
                    'NOSCRIPT',
                    'TEXTAREA',
                    'CODE',
                    'OPTION'
                ].includes(parent.tagName) && !parent.closest('[data-no-translate="true"]')) {
                    const val = currentNode.nodeValue?.trim() || "";
                    if (val.length > 1 && /[a-zA-Z\u0900-\u097F\u0A00-\u0A7F]/.test(val)) {
                        textNodes.push(currentNode);
                    }
                }
                currentNode = walker.nextNode();
            }
            textNodes.forEach((node)=>{
                if (!node.__origText && /[a-zA-Z]/.test(node.nodeValue || "")) {
                    node.__origText = node.nodeValue;
                }
            });
            if (lang === "en") {
                textNodes.forEach((node)=>{
                    if (node.__origText) {
                        node.nodeValue = node.__origText;
                    }
                });
                return;
            }
            const nodesToUpdate = [];
            textNodes.forEach((node)=>{
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
            nodesToUpdate.forEach(({ node, raw, trimmed })=>{
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
            const uniqueStrings = Array.from(new Set(nodesToUpdate.map((n)=>n.trimmed)));
            await translateBatchFast(uniqueStrings, lang);
            if (isCancelled) return;
            nodesToUpdate.forEach(({ node, raw, trimmed })=>{
                const translated = cache.current[lang]?.[trimmed];
                if (translated) {
                    const targetVal = raw.replace(trimmed, translated);
                    if (node.nodeValue !== targetVal) node.nodeValue = targetVal;
                }
            });
            setIsTranslating(false);
        };
        const timer = setTimeout(translatePage, 60);
        const observer = new MutationObserver(()=>{
            if (lang !== "en") {
                clearTimeout(timer);
                setTimeout(translatePage, 120);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        return ()=>{
            isCancelled = true;
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [
        lang,
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            lang,
            setLang,
            isTranslating
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/LanguageContext.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
function useLanguage() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1tzs9520eq1_u._.js.map