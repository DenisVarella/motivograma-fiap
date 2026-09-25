"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarraProgresso } from "@/components/teste/BarraProgresso";
import { QuestaoCard } from "@/components/teste/QuestaoCard";
import { BotaoContorno } from "@/components/visual/BotaoContorno";
import { Cabecalho } from "@/components/visual/Cabecalho";
import { useMontado } from "@/lib/interface/use-montado";
import { QUESTOES } from "@/lib/motivograma/questoes";
import { ePontosPrimeira, type PontosPrimeira } from "@/lib/motivograma/pontuacao";
import {
  atualizarResposta,
  contarRespondidas,
  gravarSessao,
  lerSessao,
  type Sessao,
} from "@/lib/motivograma/sessao";

type Direcao = "direita" | "esquerda";

export function Wizard() {
  const router = useRouter();
  const montado = useMontado();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [direcao, setDirecao] = useState<Direcao>("direita");

  if (montado && sessao === null) {
    setSessao(lerSessao());
  }

  const indice = sessao?.indice ?? 0;

  useEffect(() => {
    if (!montado) {
      return;
    }

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduzido ? "auto" : "smooth" });
  }, [indice, montado]);

  if (!sessao) {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-3xl px-6 py-10">
        <Cabecalho />
        <p className="mt-16 text-sm tracking-[0.18em] text-zinc-500 uppercase">Carregando</p>
      </main>
    );
  }

  const questao = QUESTOES[indice];
  const resposta = sessao.respostas[indice];
  const respondidas = contarRespondidas(sessao.respostas);
  const pendente = sessao.respostas.findIndex((item) => !ePontosPrimeira(item));
  const completa = pendente === -1;
  const noUltimo = indice === QUESTOES.length - 1;

  function persistir(proxima: Sessao) {
    setSessao(proxima);
    gravarSessao(proxima);
  }

  function escolher(pontos: PontosPrimeira) {
    persistir(atualizarResposta(sessao!, indice, pontos));
  }

  function voltar() {
    if (indice === 0) {
      return;
    }

    setDirecao("esquerda");
    persistir({ ...sessao!, indice: indice - 1 });
  }

  function avancar() {
    if (!ePontosPrimeira(resposta)) {
      return;
    }

    if (!noUltimo) {
      setDirecao("direita");
      persistir({ ...sessao!, indice: indice + 1 });
      return;
    }

    if (!completa) {
      setDirecao(pendente > indice ? "direita" : "esquerda");
      persistir({ ...sessao!, indice: pendente });
      return;
    }

    router.push("/resultado");
  }

  const rotuloAvanco = !noUltimo ? "Próxima" : completa ? "Ver resultado" : "Ir à pendência";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 py-10">
      <Cabecalho />
      <div className="mt-10">
        <BarraProgresso respondidas={respondidas} total={QUESTOES.length} />
      </div>
      <div key={indice} className={`mt-12 ${direcao === "direita" ? "entra-direita" : "entra-esquerda"}`}>
        <QuestaoCard questao={questao} resposta={resposta} onEscolher={escolher} />
      </div>
      <div className="mt-10 flex items-center justify-between gap-4 pb-6">
        <BotaoContorno onClick={voltar} disabled={indice === 0}>
          Voltar
        </BotaoContorno>
        <BotaoContorno onClick={avancar} disabled={!ePontosPrimeira(resposta)} destaque>
          {rotuloAvanco}
        </BotaoContorno>
      </div>
    </main>
  );
}
