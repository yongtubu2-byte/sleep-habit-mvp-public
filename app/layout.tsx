import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "숙면습관 진단실 | 안성경옥당한의원 김성혁 원장",
  description: "1분 수면 습관 진단, 맞춤 실천 3가지, 매일 30초 수면일지와 변화 기록",
  openGraph: {
    title: "숙면습관 진단실",
    description: "1분 진단 · 매일 30초 수면일지",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
