/**
 * A pessoa reparte 3 pontos em cada item (3 e 0, ou 2 e 1).
 * Cada necessidade aparece 12 vezes, então o teto de uma coluna é 36.
 * As cinco colunas somam sempre 90.
 */

import {
  CODIGOS,
  NECESSIDADES,
  PONTUACAO_MAXIMA,
  faixaDe,
  type CodigoNecessidade,
  type FaixaPrioridade,
} from "@/lib/motivograma/necessidades";
import { QUESTOES } from "@/lib/motivograma/questoes";

export type PontosPrimeira = 0 | 1 | 2 | 3;

export type Resposta = PontosPrimeira | null;

export type PontoGrafico = {
  codigo: CodigoNecessidade;
  nome: string;
  pontos: number;
  faixa: FaixaPrioridade;
};

export type ItemRanking = PontoGrafico;

export type Perfil = {
  serie: PontoGrafico[];
  ranking: ItemRanking[];
  predominantes: ItemRanking[];
  mediaPrimaria: number;
  mediaSecundaria: number;
  soma: number;
  textoDestaque: string;
  textoGrupos: string;
};

export function pontosDaSegunda(pontosPrimeira: PontosPrimeira): PontosPrimeira {
  return (3 - pontosPrimeira) as PontosPrimeira;
}

export function ePontosPrimeira(valor: unknown): valor is PontosPrimeira {
  return valor === 0 || valor === 1 || valor === 2 || valor === 3;
}

export function respostasCompletas(
  respostas: readonly Resposta[],
): respostas is PontosPrimeira[] {
  return (
    respostas.length === QUESTOES.length &&
    respostas.every((resposta) => ePontosPrimeira(resposta))
  );
}

export function montarPerfil(respostas: readonly Resposta[]): Perfil | null {
  if (!respostasCompletas(respostas)) {
    return null;
  }

  const totais = Object.fromEntries(CODIGOS.map((codigo) => [codigo, 0])) as Record<
    CodigoNecessidade,
    number
  >;

  QUESTOES.forEach((questao, indice) => {
    const pontosPrimeira = respostas[indice];
    const [primeira, segunda] = questao.alternativas;
    totais[primeira.codigo] += pontosPrimeira;
    totais[segunda.codigo] += pontosDaSegunda(pontosPrimeira);
  });

  const serie = CODIGOS.map((codigo) => ({
    codigo,
    nome: NECESSIDADES[codigo].nome,
    pontos: totais[codigo],
    faixa: faixaDe(totais[codigo]),
  }));

  const ranking = [...serie].sort(
    (atual, proximo) =>
      proximo.pontos - atual.pontos ||
      CODIGOS.indexOf(atual.codigo) - CODIGOS.indexOf(proximo.codigo),
  );

  const maior = ranking[0]?.pontos ?? 0;
  const predominantes = ranking.filter((item) => item.pontos === maior);
  const mediaPrimaria = (totais.V + totais.W) / 2;
  const mediaSecundaria = (totais.X + totais.Y + totais.Z) / 3;
  const soma = CODIGOS.reduce((acumulado, codigo) => acumulado + totais[codigo], 0);

  return {
    serie,
    ranking,
    predominantes,
    mediaPrimaria,
    mediaSecundaria,
    soma,
    textoDestaque: textoDoDestaque(predominantes),
    textoGrupos: textoDosGrupos(mediaPrimaria, mediaSecundaria),
  };
}

export function juntarNomes(nomes: readonly string[]): string {
  if (nomes.length <= 1) {
    return nomes[0] ?? "";
  }

  if (nomes.length === 2) {
    return `${nomes[0]} e ${nomes[1]}`;
  }

  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

function textoDoDestaque(predominantes: readonly ItemRanking[]): string {
  if (predominantes.length === CODIGOS.length) {
    return "As cinco necessidades ficaram no mesmo patamar. Nenhuma está puxando o perfil sozinha neste momento.";
  }

  if (predominantes.length === 1) {
    const item = predominantes[0];
    return `${item.nome} concentra a maior prioridade do seu perfil, com ${item.pontos} de ${PONTUACAO_MAXIMA}.`;
  }

  const nomes = juntarNomes(predominantes.map((item) => item.nome));
  return `Há um empate entre ${nomes}, com ${predominantes[0].pontos} de ${PONTUACAO_MAXIMA}. Essas necessidades dividem a maior prioridade agora.`;
}

function textoDosGrupos(mediaPrimaria: number, mediaSecundaria: number): string {
  const diferenca = mediaPrimaria - mediaSecundaria;

  if (Math.abs(diferenca) < 2) {
    return "Necessidades primárias (fisiológicas e de segurança) e secundárias (associação, autoestima e autorrealização) estão próximas. O seu empenho não está concentrado só na base nem só no topo.";
  }

  if (diferenca > 0) {
    return "As necessidades primárias pesam mais. Sustento, condições físicas e segurança estão à frente de vínculo, estima e autorrealização.";
  }

  return "As necessidades secundárias pesam mais. Vínculo, estima ou autorrealização estão à frente do sustento e da segurança.";
}
