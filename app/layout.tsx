import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "手账风图片生成器",
  description: "上传图片，一键生成白色手写批注风照片",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
