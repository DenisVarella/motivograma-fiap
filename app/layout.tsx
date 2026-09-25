import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import { CampoPontos } from "@/components/visual/CampoPontos";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["500", "600"],
});

const corpo = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Motivograma",
    template: "%s · Motivograma",
  },
  description:
    "Autoavaliação do perfil de motivação individual, com as cinco necessidades de Maslow.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <CampoPontos />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
