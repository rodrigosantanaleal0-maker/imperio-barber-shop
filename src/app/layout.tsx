import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/presentation/providers/SmoothScrollProvider";
import { Cursor } from "@/presentation/components/ui/Cursor";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Império Barber Shop — Seu estilo. Sua presença. Seu Império.",
  description:
    "Mais do que um corte, uma experiência. Precisão, estilo e presença em cada detalhe na Império Barber Shop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-(--color-obsidian) text-(--color-ivory)">
        <SmoothScrollProvider>
          <Cursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
