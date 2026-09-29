import Image from "next/image";
import { PainelInicio } from "@/components/inicio/PainelInicio";

export default function PaginaInicial() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="revela flex flex-col justify-between px-6 py-12 sm:px-12 lg:px-16 lg:py-14">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt=""
            width={822}
            height={753}
            className="h-14 w-auto"
            priority
          />
          <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">Autoavaliação</p>
        </div>
        <div>
          <h1 className="font-display text-5xl tracking-tight text-rosa sm:text-6xl lg:text-7xl">
            Meu<br/>Motivograma
          </h1>
          <p className="mt-6 max-w-md text-xl text-zinc-200">
            Veja qual necessidade está puxando o seu empenho agora.
          </p>
        </div>
        <p className="mt-16 max-w-sm text-sm text-zinc-500">
          Perfil de motivação individual. O resultado descreve a prioridade deste momento, não um
          rótulo fixo.
        </p>
      </section>
      <PainelInicio />
    </main>
  );
}
