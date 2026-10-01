import { NextResponse } from "next/server";
import { COOKIE_PROFESSOR, OPCOES_COOKIE_PROFESSOR } from "@/lib/professor/sessao";

export const dynamic = "force-dynamic";

export async function POST() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE_PROFESSOR, "", { ...OPCOES_COOKIE_PROFESSOR, maxAge: 0 });
  return resposta;
}
