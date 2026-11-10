import { LanguageProvider } from '../context/LanguageContext';
import './globals.css';

export const metadata = {
  title: 'KrishiSetu | Yield Optimizer',
  description: 'AI-Powered Crop Yield Prediction & Optimization',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}