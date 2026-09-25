"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Questao } from "@/lib/motivograma/questoes";
import type { PontosPrimeira, Resposta } from "@/lib/motivograma/pontuacao";

type Propriedades = {
  questao: Questao;
  resposta: Resposta;
  onEscolher: (pontos: PontosPrimeira) => void;
};

type Posicao = {
  pontos: PontosPrimeira;
  extremo: boolean;
  rotulo: string;
};

/** Da esquerda para a direita: total e parcial da primeira, parcial e total da segunda. */
const POSICOES: Posicao[] = [
  { pontos: 3, extremo: true, rotulo: "Aceitação total da primeira alternativa" },
  { pontos: 2, extremo: false, rotulo: "Aceitação parcial da primeira alternativa" },
  { pontos: 1, extremo: false, rotulo: "Aceitação parcial da segunda alternativa" },
  { pontos: 0, extremo: true, rotulo: "Aceitação total da segunda alternativa" },
];

const FRACOES = [0.08, 0.36, 0.64, 0.92];
const CENTRO = 0.5;
const RAIO_ENCAIXE = 0.09;

/**
 * A bolinha começa cinza no centro.
 * Ela só fixa nas quatro marcas e fica rosa nesse encaixe.
 */
export function QuestaoCard({ questao, resposta, onEscolher }: Propriedades) {
  const [primeira, segunda] = questao.alternativas;

  return (
    <article>
      <p className="text-[11px] tracking-[0.28em] text-rosa uppercase">
        Item {String(questao.numero).padStart(2, "0")}
      </p>
      <h2 className="font-display mt-4 text-2xl leading-snug text-zinc-50 sm:text-3xl">
        {questao.enunciado}
      </h2>
      <p className="mt-3 text-sm text-zinc-500">
        Arraste até uma marca. Pontas maiores, aceitação total. Meio, aceitação parcial.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <p className={textoAtivo(resposta, "primeira")}>{primeira.texto}</p>
        <p className={`sm:text-right ${textoAtivo(resposta, "segunda")}`}>{segunda.texto}</p>
      </div>

      <BarraMarcacao resposta={resposta} onEscolher={onEscolher} />
    </article>
  );
}

function BarraMarcacao({
  resposta,
  onEscolher,
}: {
  resposta: Resposta;
  onEscolher: (pontos: PontosPrimeira) => void;
}) {
  const trilho = useRef<HTMLDivElement>(null);
  const arraste = useRef<number | null>(null);
  const [fracaoArraste, setFracaoArraste] = useState<number | null>(null);

  const fixada = indiceDaResposta(resposta);
  const arrastando = fracaoArraste !== null;
  const encaixada = arrastando ? encaixe(fracaoArraste) : fixada;
  const rosa = encaixada !== null;
  const fracao =
    arrastando && encaixada !== null
      ? FRACOES[encaixada]
      : arrastando
        ? fracaoArraste
        : fixada !== null
          ? FRACOES[fixada]
          : CENTRO;
  const grande = encaixada === 0 || encaixada === 3;

  function fracaoDoPonteiro(clientX: number) {
    const rect = trilho.current?.getBoundingClientRect();

    if (!rect || rect.width === 0) {
      return CENTRO;
    }

    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  function aoPointerDown(event: PointerEvent<HTMLDivElement>) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Alguns ponteiros não aceitam captura; o arraste segue pelo próprio trilho.
    }
    const fracaoAtual = fracaoDoPonteiro(event.clientX);
    arraste.current = fracaoAtual;
    setFracaoArraste(fracaoAtual);
  }

  function aoPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (arraste.current === null) {
      return;
    }

    const fracaoAtual = fracaoDoPonteiro(event.clientX);
    arraste.current = fracaoAtual;
    setFracaoArraste(fracaoAtual);
  }

  function aoPointerUp() {
    if (arraste.current === null) {
      return;
    }

    const indice = encaixe(arraste.current);
    arraste.current = null;
    setFracaoArraste(null);

    if (indice !== null) {
      onEscolher(POSICOES[indice].pontos);
    }
  }

  function aoTeclado(event: KeyboardEvent<HTMLDivElement>) {
    const atual = fixada ?? -1;
    let proximo = atual;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      proximo = atual < 0 ? 2 : Math.min(POSICOES.length - 1, atual + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      proximo = atual < 0 ? 1 : Math.max(0, atual - 1);
    } else if (event.key === "Home") {
      proximo = 0;
    } else if (event.key === "End") {
      proximo = POSICOES.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    onEscolher(POSICOES[proximo].pontos);
  }

  return (
    <div className="mt-8">
      <div
        ref={trilho}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={fixada ?? undefined}
        aria-valuetext={fixada === null ? "Sem marcação" : POSICOES[fixada].rotulo}
        aria-label="Distribuição entre as duas alternativas"
        onPointerDown={aoPointerDown}
        onPointerMove={aoPointerMove}
        onPointerUp={aoPointerUp}
        onPointerCancel={aoPointerUp}
        onKeyDown={aoTeclado}
        className="relative h-16 touch-none select-none"
      >
        <div className="absolute top-5 right-0 left-0 h-px bg-white/20" />
        {POSICOES.map((posicao, indice) => (
          <span
            key={posicao.pontos}
            aria-hidden
            className={`absolute top-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 ${
              posicao.extremo ? "size-3.5" : "size-2"
            } ${encaixada === indice ? "opacity-0" : "bg-transparent"}`}
            style={{ left: `${FRACOES[indice] * 100}%` }}
          />
        ))}
        <span
          aria-hidden
          className={`marcador absolute top-5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            arrastando ? "cursor-grabbing transition-none" : "cursor-grab"
          } ${rosa ? "bg-rosa" : "bg-zinc-500"} ${
            !rosa ? "size-5" : grande ? "size-6" : "size-3.5"
          }`}
          style={{ left: `${fracao * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-4 text-[10px] tracking-[0.16em] text-zinc-500 uppercase">
        <span>Total</span>
        <span className="text-center">Parcial</span>
        <span className="text-center">Parcial</span>
        <span className="text-right">Total</span>
      </div>
    </div>
  );
}

function textoAtivo(resposta: Resposta, lado: "primeira" | "segunda") {
  const escolhido =
    lado === "primeira" ? resposta === 3 || resposta === 2 : resposta === 1 || resposta === 0;

  return escolhido ? "text-zinc-100" : "text-zinc-400";
}

function indiceDaResposta(resposta: Resposta) {
  const indice = POSICOES.findIndex((posicao) => posicao.pontos === resposta);
  return indice === -1 ? null : indice;
}

function encaixe(fracao: number) {
  let melhor = 0;
  let menorDistancia = Number.POSITIVE_INFINITY;

  FRACOES.forEach((marca, indice) => {
    const distancia = Math.abs(fracao - marca);

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      melhor = indice;
    }
  });

  return menorDistancia <= RAIO_ENCAIXE ? melhor : null;
}
