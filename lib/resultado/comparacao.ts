/**
 * Contas da tela que compara o resultado da pessoa com o grupo.
 */

import { CODIGOS, NECESSIDADES, type CodigoNecessidade } from "@/lib/motivograma/necessidades";
import type { Perfil } from "@/lib/motivograma/pontuacao";
import type { ResultadoComparavel } from "@/lib/firebase/registros";

export function notasDoPerfil(perfil: Perfil): Record<CodigoNecessidade, number> {
  return Object.fromEntries(perfil.serie.map((item) => [item.codigo, item.pontos])) as Record<
    CodigoNecessidade,
    number
  >;
}

export function predominantesDe(notas: Record<CodigoNecessidade, number>): CodigoNecessidade[] {
  const maior = Math.max(...CODIGOS.map((codigo) => notas[codigo]));
  return CODIGOS.filter((codigo) => notas[codigo] === maior);
}

/** Garante a pessoa atual na lista, mesmo se o Firestore ainda não devolveu o documento dela. */
export function grupoComParticipante(
  lista: readonly ResultadoComparavel[],
  participante: ResultadoComparavel,
): ResultadoComparavel[] {
  const demais = lista.filter((item) => item.rm !== participante.rm);
  return [...demais, participante].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function mediaDasNotas(
  lista: readonly ResultadoComparavel[],
): Record<CodigoNecessidade, number> {
  return Object.fromEntries(
    CODIGOS.map((codigo) => {
      const soma = lista.reduce((total, item) => total + item.notas[codigo], 0);
      return [codigo, lista.length === 0 ? 0 : soma / lista.length];
    }),
  ) as Record<CodigoNecessidade, number>;
}

export function textoDoAfastamento(
  voce: Record<CodigoNecessidade, number>,
  media: Record<CodigoNecessidade, number>,
): string {
  let codigo: CodigoNecessidade = CODIGOS[0];
  let delta = voce[codigo] - media[codigo];

  for (const atual of CODIGOS) {
    const diferenca = voce[atual] - media[atual];

    if (Math.abs(diferenca) > Math.abs(delta)) {
      codigo = atual;
      delta = diferenca;
    }
  }

  if (Math.abs(delta) < 0.5) {
    return "Seu perfil está perto da média do grupo nas cinco necessidades.";
  }

  const pontos = Math.abs(delta).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const sentido = delta > 0 ? "acima" : "abaixo";

  return `Onde você mais se afasta do grupo é em ${NECESSIDADES[codigo].nome}: ${pontos} pontos ${sentido} da média.`;
}

export function rotuloPredominante(codigos: readonly CodigoNecessidade[]): string {
  if (codigos.length === 0) {
    return "—";
  }

  return codigos.map((codigo) => NECESSIDADES[codigo].nome).join(" e ");
}
