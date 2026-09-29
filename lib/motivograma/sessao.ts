/**
 * Cópia local da tentativa, para o teste continuar se a página recarregar.
 * O registro oficial fica no Firestore, ligado ao RM.
 */

import { QUESTOES } from "@/lib/motivograma/questoes";
import {
  ePontosPrimeira,
  type PontosPrimeira,
  type Resposta,
} from "@/lib/motivograma/pontuacao";

const CHAVE = "motivograma.sessao.v1";

export type Participante = {
  rm: string;
  nome: string;
};

export type Sessao = Participante & {
  respostas: Resposta[];
  indice: number;
};

export function sessaoVazia(participante?: Participante): Sessao {
  return {
    rm: participante?.rm ?? "",
    nome: participante?.nome ?? "",
    respostas: Array.from({ length: QUESTOES.length }, () => null),
    indice: 0,
  };
}

export function lerSessao(): Sessao {
  if (typeof window === "undefined") {
    return sessaoVazia();
  }

  try {
    const bruto = window.localStorage.getItem(CHAVE);

    if (!bruto) {
      return sessaoVazia();
    }

    return normalizar(JSON.parse(bruto));
  } catch {
    return sessaoVazia();
  }
}

export function gravarSessao(sessao: Sessao): void {
  window.localStorage.setItem(CHAVE, JSON.stringify(sessao));
}

export function limparSessao(): void {
  window.localStorage.removeItem(CHAVE);
}

export function contarRespondidas(respostas: readonly Resposta[]): number {
  return respostas.filter((resposta) => ePontosPrimeira(resposta)).length;
}

function textoCurto(valor: unknown) {
  return typeof valor === "string" ? valor.trim().slice(0, 120) : "";
}

/** Aceita o JSON local ou o documento lido do Firestore. */
export function montarSessao(valor: unknown): Sessao {
  if (!valor || typeof valor !== "object") {
    return sessaoVazia();
  }

  const registro = valor as {
    rm?: unknown;
    nome?: unknown;
    respostas?: unknown;
    indice?: unknown;
  };
  const respostasRecebidas = Array.isArray(registro.respostas)
    ? registro.respostas
    : [];

  const respostas = Array.from({ length: QUESTOES.length }, (_, indice) => {
    const item = respostasRecebidas[indice];
    return ePontosPrimeira(item) ? item : null;
  });

  const indice =
    typeof registro.indice === "number" &&
    Number.isInteger(registro.indice) &&
    registro.indice >= 0 &&
    registro.indice < QUESTOES.length
      ? registro.indice
      : 0;

  return {
    rm: textoCurto(registro.rm),
    nome: textoCurto(registro.nome),
    respostas,
    indice,
  };
}

function normalizar(valor: unknown): Sessao {
  return montarSessao(valor);
}

export function atualizarResposta(
  sessao: Sessao,
  indice: number,
  pontos: PontosPrimeira,
): Sessao {
  const respostas = sessao.respostas.map((resposta, posicao) =>
    posicao === indice ? pontos : resposta,
  );

  return { ...sessao, respostas };
}
