"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { OpcaoAnonimato } from "@/components/resultado/OpcaoAnonimato";
import { mensagemDeFirebase } from "@/lib/firebase/cliente";
import { listarResultados, type ResultadoComparavel } from "@/lib/firebase/registros";
import { CODIGOS, NECESSIDADES, PONTUACAO_MAXIMA } from "@/lib/motivograma/necessidades";
import type { Perfil } from "@/lib/motivograma/pontuacao";
import {
  dentroDaJanela,
  grupoComParticipante,
  mediaDasNotas,
  nomeVisivel,
  notasDoPerfil,
  predominantesDe,
  rotuloPredominante,
  textoDoAfastamento,
} from "@/lib/resultado/comparacao";

type Propriedades = {
  rm: string;
  nome: string;
  perfil: Perfil;
  anonimo: boolean;
  salvandoAnonimo?: boolean;
  onAlterarAnonimato: (valor: boolean) => void;
};

type PontoComparacao = {
  codigo: string;
  nome: string;
  voce: number;
  media: number;
};

export function PainelComparativo({
  rm,
  nome,
  perfil,
  anonimo,
  salvandoAnonimo = false,
  onAlterarAnonimato,
}: Propriedades) {
  const [lista, setLista] = useState<ResultadoComparavel[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    listarResultados()
      .then((resultados) => {
        if (ativo) {
          setLista(resultados);
        }
      })
      .catch((falha: unknown) => {
        if (!ativo) {
          return;
        }

        const codigo = falha && typeof falha === "object" && "code" in falha ? falha.code : "";
        setErro(
          codigo === "permission-denied"
            ? "Publique de novo as regras do Firestore para liberar a comparação do grupo."
            : mensagemDeFirebase(falha),
        );
        setLista([]);
      });

    return () => {
      ativo = false;
    };
  }, []);

  if (erro) {
    return <p className="mt-10 text-sm text-rosa">{erro}</p>;
  }

  if (!lista) {
    return <p className="mt-10 text-sm tracking-[0.18em] text-zinc-500 uppercase">Carregando</p>;
  }

  const recentes = lista.filter((item) => dentroDaJanela(item.registradoEm));
  const euSalvo = lista.find((item) => item.rm === rm);
  const euRecente = !euSalvo || dentroDaJanela(euSalvo.registradoEm);
  const eu: ResultadoComparavel = {
    rm,
    nome: nome.trim() || "Você",
    anonimo,
    registradoEm: euSalvo?.registradoEm ?? new Date(),
    notas: notasDoPerfil(perfil),
    predominantes: perfil.predominantes.map((item) => item.codigo),
  };
  const grupo = (euRecente ? grupoComParticipante(recentes, eu) : recentes).sort((a, b) =>
    nomeVisivel(a).localeCompare(nomeVisivel(b), "pt-BR"),
  );
  const media = mediaDasNotas(grupo);
  const sozinho = grupo.length < 2;
  const serie: PontoComparacao[] = CODIGOS.map((codigo) => ({
    codigo,
    nome: NECESSIDADES[codigo].nome,
    voce: eu.notas[codigo],
    media: Number(media[codigo].toFixed(1)),
  }));

  return (
    <div className="mt-10">
      <OpcaoAnonimato marcado={anonimo} salvando={salvandoAnonimo} onAlterar={onAlterarAnonimato} />
      <p className="mt-6 text-sm text-zinc-400">{textoDaContagem(grupo.length)}</p>
      {!euRecente ? (
        <p className="mt-4 max-w-xl text-zinc-200">
          Seu resultado tem mais de 24 meses e não entra nesta comparação.
        </p>
      ) : null}
      {euRecente && sozinho ? (
        <p className="mt-4 max-w-xl text-zinc-200">
          Você é a primeira pessoa com o teste fechado neste período. A média do grupo aparece
          quando mais alguém terminar.
        </p>
      ) : null}
      {euRecente && !sozinho ? (
        <>
          <p className="mt-4 max-w-2xl text-zinc-200">{textoDoAfastamento(eu.notas, media)}</p>
          <section className="mt-10 border border-fio p-4 sm:p-6">
            <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
              Você e a média do grupo
            </p>
            <div
              className="mt-4 h-80"
              role="img"
              aria-label={serie
                .map((item) => `${item.nome}: você ${item.voce}, média ${item.media}`)
                .join(". ")}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serie} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis
                    dataKey="codigo"
                    tick={{ fill: "#a1a1aa", fontSize: 13 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.14)" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, PONTUACAO_MAXIMA]}
                    ticks={[0, 6, 12, 18, 24, 30, 36]}
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    content={(propriedades) => (
                      <Dica active={propriedades.active} payload={propriedades.payload} />
                    )}
                  />
                  <Bar dataKey="voce" fill="#e4236b" radius={[2, 2, 0, 0]} isAnimationActive="auto" />
                  <Bar
                    dataKey="media"
                    fill="rgba(244,244,245,0.72)"
                    radius={[2, 2, 0, 0]}
                    isAnimationActive="auto"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
              <span className="text-rosa">Rosa · você</span>
              <span>Clara · média do grupo</span>
              {serie.map((item) => (
                <span key={item.codigo}>
                  {item.codigo} {item.nome}
                </span>
              ))}
            </p>
          </section>
        </>
      ) : null}

      {grupo.length === 0 ? null : (
      <div className="mt-10 overflow-x-auto border border-fio">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Resultados de quem concluiu o Motivograma</caption>
          <thead className="text-[11px] tracking-[0.18em] text-zinc-500 uppercase">
            <tr className="border-b border-fio">
              <th className="px-4 py-3 font-medium">Nome</th>
              {CODIGOS.map((codigo) => (
                <th key={codigo} className="px-3 py-3 font-medium">
                  {codigo}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Em destaque</th>
              <th className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {grupo.map((pessoa) => {
              const eVoce = pessoa.rm === rm;
              const destaque = predominantesDe(pessoa.notas);

              return (
                <tr key={pessoa.rm} className={eVoce ? "bg-rosa/10 text-zinc-100" : "text-zinc-300"}>
                  <th className="px-4 py-3 font-medium" scope="row">
                    {nomeVisivel(pessoa)}
                    {eVoce ? <span className="ml-2 text-[11px] tracking-[0.16em] text-rosa">Você</span> : null}
                  </th>
                  {CODIGOS.map((codigo) => (
                    <td key={codigo} className="px-3 py-3 tabular-nums">
                      {pessoa.notas[codigo]}
                    </td>
                  ))}
                  <td className="px-4 py-3">{rotuloPredominante(destaque)}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {pessoa.registradoEm.toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              );
            })}
            {sozinho ? null : (
              <tr className="border-t border-fio text-zinc-400">
                <th className="px-4 py-3 font-medium" scope="row">
                  Média
                </th>
                {CODIGOS.map((codigo) => (
                  <td key={codigo} className="px-3 py-3 tabular-nums">
                    {media[codigo].toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                  </td>
                ))}
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">—</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

function textoDaContagem(total: number) {
  if (total === 0) {
    return "Nenhum resultado dos últimos 24 meses.";
  }

  if (total === 1) {
    return "1 resultado dos últimos 24 meses.";
  }

  return `${total} resultados dos últimos 24 meses.`;
}

function Dica({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
}) {
  const ponto = payload?.[0]?.payload as PontoComparacao | undefined;

  if (!active || !ponto) {
    return null;
  }

  return (
    <div className="border border-fio bg-background px-3 py-2 text-sm">
      <p className="text-[11px] tracking-[0.18em] text-rosa uppercase">{ponto.codigo}</p>
      <p className="mt-1 text-zinc-100">{ponto.nome}</p>
      <p className="text-zinc-400">Você {ponto.voce}</p>
      <p className="text-zinc-400">
        Média {ponto.media.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
      </p>
    </div>
  );
}
