import { collection, getDocs } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { FirebaseNaoConfiguradoError, obterFirestore } from "@/lib/firebase/cliente";
import { montarPainel } from "@/lib/professor/painel";
import { COOKIE_PROFESSOR, sessaoProfessorValida } from "@/lib/professor/sessao";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = (await cookies()).get(COOKIE_PROFESSOR)?.value;

  if (!sessaoProfessorValida(token)) {
    return NextResponse.json({ erro: "Acesso negado." }, { status: 401 });
  }

  try {
    const consulta = await getDocs(collection(obterFirestore(), "usuarios"));
    const painel = montarPainel(
      consulta.docs.map((documento) => ({
        ...documento.data(),
        rm: documento.id,
      })),
    );

    return NextResponse.json(painel);
  } catch (falha) {
    if (falha instanceof FirebaseNaoConfiguradoError) {
      return NextResponse.json({ erro: falha.message }, { status: 503 });
    }

    return NextResponse.json(
      { erro: "Não foi possível ler os resultados." },
      { status: 500 },
    );
  }
}
