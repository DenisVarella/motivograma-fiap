"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraficoBarras } from "@/components/resultado/GraficoBarras";
import { GraficoRadar } from "@/components/resultado/GraficoRadar";
import { LeituraPerfil } from "@/components/resultado/LeituraPerfil";
import { BotaoContorno } from "@/components/visual/BotaoContorno";
import { Cabecalho } from "@/components/visual/Cabecalho";
import { useMontado } from "@/lib/interface/use-montado";
import { montarPerfil, type Perfil } from "@/lib/motivograma/pontuacao";
import { lerSessao, limparSessao, type Sessao } from "@/lib/motivograma/sessao";

export function PainelResultado() {
  const router = useRouter();
  const montado = useMontado();
  const [sessao, setSessao] = useState<Sessao | null>(null);

  if (montado && sessao === null) {
    setSessao(lerSessao());
  }

  const perfil: Perfil | null = sessao ? montarPerfil(sessao.respostas) : null;
  const completo = perfil !== null;

  useEffect(() => {
    if (!sessao || completo) {
      return;
    }

    router.replace("/teste");
  }, [sessao, completo, router]);

  function refazer() {
    limparSessao();
    router.push("/teste");
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-6 py-10">
      <Cabecalho />

      {!perfil ? (
        <p className="mt-16 text-sm tracking-[0.18em] text-zinc-500 uppercase">Carregando</p>
      ) : (
        <div className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">Resultado</p>
              <h1 className="font-display mt-3 text-4xl text-rosa sm:text-5xl">
                Nível das necessidades
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <BotaoContorno href="/teste">Revisar respostas</BotaoContorno>
              <BotaoContorno onClick={refazer}>Refazer</BotaoContorno>
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <section className="border border-fio p-4 sm:p-6">
              <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
                Colunas de 0 a 36
              </p>
              <GraficoBarras
                serie={perfil.serie}
                predominantes={perfil.predominantes.map((item) => item.codigo)}
              />
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                {perfil.serie.map((item) => (
                  <span key={item.codigo}>
                    {item.codigo} {item.nome}
                  </span>
                ))}
              </p>
            </section>
            <section className="border border-fio p-4 sm:p-6">
              <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
                As cinco ao mesmo tempo
              </p>
              <GraficoRadar serie={perfil.serie} />
            </section>
          </div>

          <div className="mt-12">
            <LeituraPerfil perfil={perfil} />
          </div>
        </div>
      )}
    </main>
  );
}
