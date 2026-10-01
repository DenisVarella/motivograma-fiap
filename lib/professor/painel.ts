/**
 * Médias do professor. O ano da turma é o ano da data do resultado atual de cada RM.
 */

import { instanteDe } from "@/lib/firebase/tempo";
import {
  CODIGOS,
  NECESSIDADES,
  type CodigoNecessidade,
} from "@/lib/motivograma/necessidades";

export type Notas = Record<CodigoNecessidade, number>;

export type AlunoPainel = {
  rm: string;
  nome: string;
  ano: number;
  data: string;
  notas: Notas;
  predominantes: CodigoNecessidade[];
};

export type AnoTurma = {
  ano: number;
  quantidade: number;
  medias: Notas;
};

export type PainelProfessor = {
  quantidade: number;
  medias: Notas;
  mediaPrimaria: number;
  mediaSecundaria: number;
  destaque: CodigoNecessidade[];
  anos: AnoTurma[];
  alunos: AlunoPainel[];
};

type RegistroBruto = {
  rm: string;
  nome?: unknown;
  anonimo?: unknown;
  resultado?: unknown;
  atualizadoEm?: unknown;
};

const FUSO = "America/Sao_Paulo";

function anoDe(data: Date) {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: FUSO, year: "numeric" }).format(data),
  );
}

function dataCurta(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO }).format(data);
}

function arredondar(valor: number) {
  return Math.round(valor * 10) / 10;
}

function notasValidas(valor: unknown): Notas | null {
  if (!valor || typeof valor !== "object") {
    return null;
  }

  const registro = valor as Record<string, unknown>;
  const notas = {} as Notas;

  for (const codigo of CODIGOS) {
    const pontos = registro[codigo];

    if (typeof pontos !== "number" || !Number.isFinite(pontos)) {
      return null;
    }

    notas[codigo] = pontos;
  }

  const soma = CODIGOS.reduce((total, codigo) => total + notas[codigo], 0);
  return soma === 90 ? notas : null;
}

function predominantesDe(notas: Notas): CodigoNecessidade[] {
  const maior = Math.max(...CODIGOS.map((codigo) => notas[codigo]));
  return CODIGOS.filter((codigo) => notas[codigo] === maior);
}

function mediaDe(lista: readonly { notas: Notas }[]): Notas {
  return Object.fromEntries(
    CODIGOS.map((codigo) => {
      const soma = lista.reduce((total, item) => total + item.notas[codigo], 0);
      return [codigo, lista.length === 0 ? 0 : arredondar(soma / lista.length)];
    }),
  ) as Notas;
}

function alunoDe(registro: RegistroBruto): AlunoPainel | null {
  const resultado = registro.resultado as { notas?: unknown; registradoEm?: unknown } | null;
  const notas = notasValidas(resultado?.notas);

  if (!notas) {
    return null;
  }

  const quando = instanteDe(resultado?.registradoEm) ?? instanteDe(registro.atualizadoEm);

  if (!quando) {
    return null;
  }

  const nome =
    typeof registro.nome === "string" && registro.nome.trim() ? registro.nome.trim() : registro.rm;

  return {
    rm: registro.rm,
    nome,
    ano: anoDe(quando),
    data: dataCurta(quando),
    notas,
    predominantes: predominantesDe(notas),
  };
}

export function montarPainel(registros: readonly RegistroBruto[]): PainelProfessor {
  const alunos = registros
    .map(alunoDe)
    .filter((aluno): aluno is AlunoPainel => aluno !== null)
    .sort((a, b) => b.ano - a.ano || a.nome.localeCompare(b.nome, "pt-BR"));

  const medias = mediaDe(alunos);
  const contagem = Object.fromEntries(CODIGOS.map((codigo) => [codigo, 0])) as Notas;

  for (const aluno of alunos) {
    for (const codigo of aluno.predominantes) {
      contagem[codigo] += 1;
    }
  }

  const maiorFrequencia = Math.max(...CODIGOS.map((codigo) => contagem[codigo]));
  const anos = [...new Set(alunos.map((aluno) => aluno.ano))]
    .sort((a, b) => a - b)
    .map((ano) => {
      const turma = alunos.filter((aluno) => aluno.ano === ano);
      return { ano, quantidade: turma.length, medias: mediaDe(turma) };
    });

  return {
    quantidade: alunos.length,
    medias,
    mediaPrimaria: arredondar((medias.V + medias.W) / 2),
    mediaSecundaria: arredondar((medias.X + medias.Y + medias.Z) / 3),
    destaque: maiorFrequencia === 0 ? [] : CODIGOS.filter((codigo) => contagem[codigo] === maiorFrequencia),
    anos,
    alunos,
  };
}

export function nomeDaNecessidade(codigo: CodigoNecessidade) {
  return NECESSIDADES[codigo].nome;
}
