/**
 * A sessão fica só no navegador. Não há conta nem servidor de respostas.
 */

import { QUESTOES } from "@/lib/motivograma/questoes";
import {
  ePontosPrimeira,
  type PontosPrimeira,
  type Resposta,
} from "@/lib/motivograma/pontuacao";

const CHAVE = "motivograma.sessao.v1";

export type Sessao = {
  respostas: Resposta[];
  indice: number;
};

export function sessaoVazia(): Sessao {
  return {
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

function normalizar(valor: unknown): Sessao {
  if (!valor || typeof valor !== "object") {
    return sessaoVazia();
  }

  const registro = valor as { respostas?: unknown; indice?: unknown };
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

  return { respostas, indice };
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
