"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BotaoContorno } from "@/components/visual/BotaoContorno";
import { useMontado } from "@/lib/interface/use-montado";
import { contarRespondidas, lerSessao, limparSessao, type Sessao } from "@/lib/motivograma/sessao";
import { respostasCompletas } from "@/lib/motivograma/pontuacao";
import { QUESTOES } from "@/lib/motivograma/questoes";

export function PainelInicio() {
  const router = useRouter();
  const montado = useMontado();
  const [sessao, setSessao] = useState<Sessao | null>(null);

  if (montado && sessao === null) {
    setSessao(lerSessao());
  }

  const pronta = sessao !== null;
  const respondidas = sessao ? contarRespondidas(sessao.respostas) : 0;
  const completa = sessao ? respostasCompletas(sessao.respostas) : false;

  function comecarDeNovo() {
    limparSessao();
    router.push("/teste");
  }

  return (
    <section className="revela revela-atraso flex flex-col justify-center border-t border-fio px-6 py-16 sm:px-12 lg:border-t-0 lg:border-l lg:px-16 lg:py-14">
      <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">Como responder</p>
      <ol className="mt-8 space-y-6 text-zinc-200">
        <li>
          <span className="mb-1 block text-[11px] tracking-[0.22em] text-rosa uppercase">
            01
          </span>
          São {QUESTOES.length} situações. Em cada uma, as duas alternativas são válidas.
        </li>
        <li>
          <span className="mb-1 block text-[11px] tracking-[0.22em] text-rosa uppercase">
            02
          </span>
          Arraste a bolinha do centro até uma das quatro marcas. As pontas são a aceitação total e as do meio, a parcial. Ela fica rosa quando encaixa.
        </li>
        <li>
          <span className="mb-1 block text-[11px] tracking-[0.22em] text-rosa uppercase">
            03
          </span>
          Não existe resposta certa. O desenho mostra a prioridade deste momento, e ela muda com o tempo.
        </li>
      </ol>

      <div className="mt-12 flex flex-wrap gap-3">
        {!pronta ? (
          <span className="inline-flex h-12 w-44 border border-white/10" aria-hidden />
        ) : completa ? (
          <>
            <BotaoContorno href="/resultado" destaque>
              Ver resultado
            </BotaoContorno>
            <BotaoContorno onClick={comecarDeNovo}>Refazer</BotaoContorno>
          </>
        ) : respondidas > 0 ? (
          <>
            <BotaoContorno href="/teste" destaque>
              Continuar
            </BotaoContorno>
            <BotaoContorno onClick={comecarDeNovo}>Começar de novo</BotaoContorno>
          </>
        ) : (
          <BotaoContorno onClick={comecarDeNovo} destaque>
            Começar
          </BotaoContorno>
        )}
      </div>

      {pronta && respondidas > 0 && !completa ? (
        <p className="mt-4 text-sm text-zinc-500">
          {respondidas} de {QUESTOES.length} itens já respondidos.
        </p>
      ) : null}
    </section>
  );
}
