import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Load It - Antrenman ve PR Takip Uygulaması",
  description: "Antrenmanlarını takip et, PR'larını paylaş, progressive overload ile gelişimini sürdür",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

