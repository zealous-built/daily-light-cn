import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${protocol}://${host}` : "http://localhost:4321";
  const imageUrl = new URL("/og-classics.png", origin).toString();

  return {
    title: "日日向光｜每日古文，古今相照",
    description: "每天零点更新一句真实古典诗文与对应白话译文，并呈现一套全新视觉风格。",
    applicationName: "日日向光",
    keywords: ["每日古文", "古诗词", "白话译文", "日签", "日日向光"],
    openGraph: {
      title: "日日向光｜每日古文，古今相照",
      description: "屏幕左读古文，右读今译；每天一句，每天一景。",
      type: "website",
      locale: "zh_CN",
      siteName: "日日向光",
      images: [{ url: imageUrl, width: 1536, height: 1024, alt: "日日向光｜每日古文，古今相照" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "日日向光｜每日古文，古今相照",
      description: "屏幕左读古文，右读今译；每天一句，每天一景。",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
