import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "90's Türkçe Pop Quiz",
  description: "90'lar Türkçe pop şarkılarını tahmin etme oyunu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${geist.variable}`}>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
