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
  title: "Switch to Claude | AI Migration Made Easy",
  description: "The easiest way to migrate from ChatGPT, Gemini, Copilot, or Perplexity to Claude. Import your conversations, transfer your context, and get set up in minutes.",
  openGraph: {
    title: "Switch to Claude | AI Migration Made Easy",
    description: "Migrate from ChatGPT, Gemini, Copilot, or Perplexity to Claude in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
