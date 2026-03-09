import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetBrainsMono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat Realtime",
  description: "Chat Realtime with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.variable}  antialiased`}>
        {children}
      </body>
    </html>
  );
}
