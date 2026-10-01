"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { GraficoAnos } from "@/components/professor/GraficoAnos";
import { GraficoBarras } from "@/components/resultado/GraficoBarras";
import { GraficoRadar } from "@/components/resultado/GraficoRadar";
import { BotaoContorno } from "@/components/visual/BotaoContorno";
import { Cabecalho } from "@/components/visual/Cabecalho";
import { CODIGOS, NECESSIDADES, faixaDe } from "@/lib/motivograma/necessidades";
import { juntarNomes, type PontoGrafico } from "@/lib/motivograma/pontuacao";
import { baixarResultadoPdf } from "@/lib/resultado/baixar-pdf";
import { nomeDaNecessidade, type PainelProfessor } from "@/lib/professor/painel";

type Estado = "carregando" | "senha" | "painel";

export function AcessoProfessor() {
  const areaPdf = useRef<HTMLElement>(null);
  const [estado, setEstado] = useState<Estado>("carregando");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [falhaPdf, setFalhaPdf] = useState(false);
  const [painel, setPainel] = useState<PainelProfessor | null>(null);

  useEffect(() => {
    void carregar();
  }, []);

  async function carregar() {
    const resposta = await fetch("/api/professor/painel");

    if (resposta.status === 401) {
      setEstado("senha");
      setPainel(null);
      return;
    }

    const corpo = (await resposta.json()) as PainelProfessor & { erro?: string };

    if (!resposta.ok) {
      setErro(corpo.erro ?? "Não foi possível abrir o painel.");
      setEstado("senha");
      return;
    }

    setPainel(corpo);
    setErro(null);
    setEstado("painel");
  }

  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      const resposta = await fetch("/api/professor/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      const corpo = (await resposta.json()) as { erro?: string };

      if (!resposta.ok) {
        setErro(corpo.erro ?? "Senha incorreta.");
        return;
      }

      setSenha("");
      await carregar();
    } catch {
      setErro("Não foi possível entrar.");
    } finally {
      setEnviando(false);
    }
  }

  async function sair() {
    await fetch("/api/professor/sair", { method: "POST" });
    setPainel(null);
    setEstado("senha");
  }

  async function baixar() {
    if (!areaPdf.current || gerando) {
      return;
    }

    setGerando(true);
    setFalhaPdf(false);

    try {
      await baixarResultadoPdf(areaPdf.current, "motivograma-turmas.pdf");
    } catch {
      setFalhaPdf(true);
    } finally {
      setGerando(false);
    }
  }

  if (estado === "carregando") {
    return (
      <main className="mx-auto min-h-dvh w-full max-w-6xl px-6 py-10">
        <Cabecalho rotulo="Professores" />
        <p className="mt-16 text-sm tracking-[0.18em] text-zinc-500 uppercase">Carregando</p>
      </main>
    );
  }

  if (estado === "senha" || !painel) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
        <Cabecalho rotulo="Professores" />
        <form onSubmit={entrar} className="mt-16 border border-fio p-6">
          <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">Acesso</p>
          <h1 className="font-display mt-3 text-4xl text-rosa">Painel das turmas</h1>
          <label className="mt-8 block text-[11px] tracking-[0.22em] text-zinc-500 uppercase" htmlFor="senha">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            className="mt-2 w-full border border-white/25 bg-transparent px-3 py-3 text-zinc-100 outline-none focus:border-rosa"
          />
          {erro ? <p className="mt-4 text-sm text-rosa">{erro}</p> : null}
          <div className="mt-6">
            <BotaoContorno type="submit" destaque disabled={enviando}>
              {enviando ? "Entrando" : "Entrar"}
            </BotaoContorno>
          </div>
        </form>
      </main>
    );
  }

  const serie: PontoGrafico[] = CODIGOS.map((codigo) => ({
    codigo,
    nome: NECESSIDADES[codigo].nome,
    pontos: painel.medias[codigo],
    faixa: faixaDe(painel.medias[codigo]),
  }));
  const frequentes = juntarNomes(painel.destaque.map(nomeDaNecessidade));

  return (
    <main ref={areaPdf} className="mx-auto min-h-dvh w-full max-w-6xl bg-background px-6 py-10">
      <Cabecalho rotulo="Professores" />
      <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">Turmas</p>
          <h1 className="font-display mt-3 text-4xl text-rosa sm:text-5xl">Evolução das médias</h1>
        </div>
        <div className="flex flex-wrap gap-3" data-pdf-oculto="true">
          <BotaoContorno onClick={baixar} disabled={gerando} destaque>
            {gerando ? "Gerando" : "Download"}
          </BotaoContorno>
          <BotaoContorno onClick={sair}>Sair</BotaoContorno>
        </div>
      </div>
      {falhaPdf ? (
        <p className="mt-4 text-sm text-rosa" data-pdf-oculto="true">
          Não foi possível gerar o PDF. Tente de novo.
        </p>
      ) : null}

      <p className="mt-8 text-sm text-zinc-400">
        {painel.quantidade === 1
          ? "1 resultado concluído."
          : `${painel.quantidade} resultados concluídos.`}
      </p>
      {painel.quantidade === 0 ? (
        <p className="mt-4 max-w-xl text-zinc-200">Nenhum aluno concluiu o teste ainda.</p>
      ) : (
        <>
          <p className="mt-4 max-w-2xl text-zinc-200">
            Primárias em {painel.mediaPrimaria.toLocaleString("pt-BR")} e secundárias em{" "}
            {painel.mediaSecundaria.toLocaleString("pt-BR")}.
            {frequentes ? ` A necessidade mais frequente é ${frequentes}.` : ""}
          </p>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Cada ano reúne quem concluiu naquele ano. Quem refaz o teste passa a contar no ano da nova conclusão.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <section className="border border-fio p-4 sm:p-6">
              <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">Média geral</p>
              <GraficoBarras serie={serie} predominantes={painel.destaque} />
            </section>
            <section className="border border-fio p-4 sm:p-6">
              <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">As cinco ao mesmo tempo</p>
              <GraficoRadar serie={serie} />
            </section>
          </div>

          <section className="mt-10 border border-fio p-4 sm:p-6">
            <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">Por ano da turma</p>
            <GraficoAnos anos={painel.anos} />
          </section>

          <div className="mt-10 overflow-x-auto border border-fio">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Resultados por aluno e ano da conclusão</caption>
              <thead className="text-[11px] tracking-[0.18em] text-zinc-500 uppercase">
                <tr className="border-b border-fio">
                  <th className="px-4 py-3 font-medium">Ano</th>
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">RM</th>
                  {CODIGOS.map((codigo) => (
                    <th key={codigo} className="px-3 py-3 font-medium">
                      {codigo}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {painel.alunos.map((aluno) => (
                  <tr key={aluno.rm} className="text-zinc-300">
                    <td className="px-4 py-3 tabular-nums">{aluno.ano}</td>
                    <th className="px-4 py-3 font-medium text-zinc-100" scope="row">
                      {aluno.nome}
                    </th>
                    <td className="px-4 py-3 tabular-nums">{aluno.rm}</td>
                    {CODIGOS.map((codigo) => (
                      <td key={codigo} className="px-3 py-3 tabular-nums">
                        {aluno.notas[codigo]}
                      </td>
                    ))}
                    <td className="px-4 py-3 tabular-nums">{aluno.data}</td>
                  </tr>
                ))}
                <tr className="border-t border-fio text-zinc-400">
                  <td className="px-4 py-3">—</td>
                  <th className="px-4 py-3 font-medium" scope="row">
                    Média
                  </th>
                  <td className="px-4 py-3">—</td>
                  {CODIGOS.map((codigo) => (
                    <td key={codigo} className="px-3 py-3 tabular-nums">
                      {painel.medias[codigo].toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                    </td>
                  ))}
                  <td className="px-4 py-3">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
