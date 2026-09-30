/**
 * Duas coleções no Firestore:
 * - usuarios: RM, nome e o resultado calculado
 * - respostas: as 30 marcações e o item em que a pessoa parou
 * O id do documento é o RM.
 */

import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { obterFirestore } from "@/lib/firebase/cliente";
import { CODIGOS, type CodigoNecessidade } from "@/lib/motivograma/necessidades";
import { montarPerfil, type Perfil } from "@/lib/motivograma/pontuacao";
import { montarSessao, sessaoVazia, type Sessao } from "@/lib/motivograma/sessao";

const USUARIOS = "usuarios";
const RESPOSTAS = "respostas";

function resultadoDe(perfil: Perfil) {
  return {
    notas: Object.fromEntries(perfil.serie.map((item) => [item.codigo, item.pontos])),
    predominantes: perfil.predominantes.map((item) => item.codigo),
    mediaPrimaria: perfil.mediaPrimaria,
    mediaSecundaria: perfil.mediaSecundaria,
    soma: perfil.soma,
  };
}

export async function carregarParticipante(rm: string): Promise<Sessao | null> {
  const db = obterFirestore();
  const [usuario, respostas] = await Promise.all([
    getDoc(doc(db, USUARIOS, rm)),
    getDoc(doc(db, RESPOSTAS, rm)),
  ]);

  if (!usuario.exists() && !respostas.exists()) {
    return null;
  }

  const nomeUsuario = usuario.data()?.nome;

  return montarSessao({
    rm,
    nome: typeof nomeUsuario === "string" ? nomeUsuario : "",
    respostas: respostas.data()?.respostas,
    indice: respostas.data()?.indice,
  });
}

/** Grava o usuário e as respostas. O resultado só entra quando as 30 marcações existem. */
export async function sincronizarSessao(sessao: Sessao) {
  if (!sessao.rm) {
    return;
  }

  const db = obterFirestore();
  const perfil = montarPerfil(sessao.respostas);

  await setDoc(
    doc(db, USUARIOS, sessao.rm),
    {
      rm: sessao.rm,
      nome: sessao.nome,
      resultado: perfil ? resultadoDe(perfil) : null,
      atualizadoEm: serverTimestamp(),
    },
    { merge: true },
  );

  await setDoc(
    doc(db, RESPOSTAS, sessao.rm),
    {
      rm: sessao.rm,
      nome: sessao.nome,
      respostas: sessao.respostas,
      indice: sessao.indice,
      atualizadoEm: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Zera as marcações e o resultado, e mantém o mesmo RM. */
export async function reiniciarTentativa(rm: string, nome: string) {
  await sincronizarSessao(sessaoVazia({ rm, nome }));
}

export type ResultadoComparavel = {
  rm: string;
  nome: string;
  notas: Record<CodigoNecessidade, number>;
  predominantes: CodigoNecessidade[];
};

function eCodigo(valor: unknown): valor is CodigoNecessidade {
  return typeof valor === "string" && (CODIGOS as readonly string[]).includes(valor);
}

function notasValidas(valor: unknown): Record<CodigoNecessidade, number> | null {
  if (!valor || typeof valor !== "object") {
    return null;
  }

  const registro = valor as Record<string, unknown>;
  const notas = {} as Record<CodigoNecessidade, number>;

  for (const codigo of CODIGOS) {
    const pontos = registro[codigo];

    if (typeof pontos !== "number" || !Number.isFinite(pontos)) {
      return null;
    }

    notas[codigo] = pontos;
  }

  const soma = CODIGOS.reduce((total, codigo) => total + notas[codigo], 0);

  if (soma !== 90) {
    return null;
  }

  return notas;
}

/** Quem já fechou as 30 marcações. Quem recomeçou fica de fora até terminar de novo. */
export async function listarResultados(): Promise<ResultadoComparavel[]> {
  const db = obterFirestore();
  const consulta = await getDocs(collection(db, USUARIOS));
  const lista: ResultadoComparavel[] = [];

  consulta.forEach((documento) => {
    const dados = documento.data();
    const resultado = dados.resultado as { notas?: unknown; predominantes?: unknown } | null;
    const notas = notasValidas(resultado?.notas);

    if (!notas) {
      return;
    }

    const nome =
      typeof dados.nome === "string" && dados.nome.trim() ? dados.nome.trim() : documento.id;
    const predominantes = Array.isArray(resultado?.predominantes)
      ? resultado.predominantes.filter(eCodigo)
      : [];

    lista.push({
      rm: documento.id,
      nome,
      notas,
      predominantes,
    });
  });

  lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  return lista;
}
