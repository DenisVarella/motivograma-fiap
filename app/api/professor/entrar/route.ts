import { NextResponse } from "next/server";
import {
  COOKIE_PROFESSOR,
  OPCOES_COOKIE_PROFESSOR,
  SenhaProfessorNaoConfiguradaError,
  emitirSessaoProfessor,
  senhaConfere,
} from "@/lib/professor/sessao";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let senha = "";

  try {
    const corpo = (await request.json()) as { senha?: unknown };
    senha = typeof corpo.senha === "string" ? corpo.senha : "";
  } catch {
    return NextResponse.json({ erro: "Informe a senha." }, { status: 400 });
  }

  try {
    if (!senhaConfere(senha)) {
      return NextResponse.json({ erro: "Senha incorreta." }, { status: 401 });
    }
  } catch (falha) {
    if (falha instanceof SenhaProfessorNaoConfiguradaError) {
      return NextResponse.json({ erro: falha.message }, { status: 503 });
    }

    throw falha;
  }

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE_PROFESSOR, emitirSessaoProfessor(), OPCOES_COOKIE_PROFESSOR);
  return resposta;
}
