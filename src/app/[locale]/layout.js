import AuthContext from "@/context/AuthContext";
import { Geist, Geist_Mono } from "next/font/google";
import { getDictionary } from "@/lib/i18n";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Social Media App",
  description: "A simple Next.js social media platform",
};

export default async function LocaleLayout({ children, params }) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className="bg-[#f2f1ed]" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthContext>
          <Header dict={dict} currentLocale={locale} />
          <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4">
            {children}
          </div>
        </AuthContext>
      </body>
    </html>
  );
}
