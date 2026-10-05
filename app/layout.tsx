import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리 반 그림책장",
  description: "사진과 목소리로 남기는 그림책 추천 카드",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

