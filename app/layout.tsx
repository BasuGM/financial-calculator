import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProviderWrapper } from "@/components/common/theme-provider";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Financial Calculators - Plan Your Finances",
  description: "Comprehensive financial calculators for SIP, EMI, tax planning and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProviderWrapper>
          <Header />
          {children}
          <Toaster visibleToasts={1} />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
