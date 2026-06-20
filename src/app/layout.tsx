import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus — Connectivity. Innovation. Solutions.",
  description:
    "Nexus is a secure, unified advisory platform connecting advisors and clients. Connectivity. Innovation. Solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col text-foreground">
        <div className="liquid-bg" aria-hidden="true">
          <div className="liquid-blob" />
        </div>
        {children}
      </body>
    </html>
  );
}
