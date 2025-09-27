import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora, Work_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Freedom Life Center Delhi - FLC Delhi",
  description: "Freedom Life Center Delhi (FLC Delhi) is a Christ-centered church family in the heart of Delhi. Join us to worship Jesus, grow in God's Word, and build life-giving community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} ${workSans.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
