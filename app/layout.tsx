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

const MENSAGEM_COMPARTILHAMENTO =
  "Trinta escolhas. Um desenho do que está movendo você neste momento.";

/** URL pública para o WhatsApp montar o link absoluto da imagem. */
function baseDoSite() {
  const informada = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (informada) {
    return new URL(informada);
  }

  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }

  return undefined;
}

const base = baseDoSite();

export const metadata: Metadata = {
  ...(base ? { metadataBase: base } : {}),
  title: {
    default: "Motivograma",
    template: "%s · Motivograma",
  },
  description:
    "Autoavaliação do perfil de motivação individual, com as cinco necessidades de Maslow.",
  openGraph: {
    title: "Meu Motivograma",
    description: MENSAGEM_COMPARTILHAMENTO,
    locale: "pt_BR",
    type: "website",
    siteName: "Motivograma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meu Motivograma",
    description: MENSAGEM_COMPARTILHAMENTO,
  },
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
