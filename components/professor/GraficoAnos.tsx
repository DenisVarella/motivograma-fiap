"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CODIGOS, NECESSIDADES, PONTUACAO_MAXIMA, type CodigoNecessidade } from "@/lib/motivograma/necessidades";
import type { AnoTurma } from "@/lib/professor/painel";

const CORES: Record<CodigoNecessidade, string> = {
  V: "#e4236b",
  W: "#f4f4f5",
  X: "#fb7185",
  Y: "#a1a1aa",
  Z: "#fbbf24",
};

type Propriedades = {
  anos: AnoTurma[];
};

export function GraficoAnos({ anos }: Propriedades) {
  const serie = anos.map((turma) => ({
    ano: String(turma.ano),
    quantidade: turma.quantidade,
    ...turma.medias,
  }));
  const descricao = serie
    .map((turma) => `${turma.ano}: ${CODIGOS.map((codigo) => `${codigo} ${turma[codigo]}`).join(", ")}`)
    .join(". ");

  return (
    <div className="h-80" role="img" aria-label={`Médias por ano da turma. ${descricao}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={serie} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="ano"
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
            content={(propriedades) => (
              <Dica active={propriedades.active} payload={propriedades.payload} />
            )}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
          {CODIGOS.map((codigo) => (
            <Line
              key={codigo}
              type="monotone"
              dataKey={codigo}
              name={`${codigo} ${NECESSIDADES[codigo].nome}`}
              stroke={CORES[codigo]}
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive="auto"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Dica({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
}) {
  const ponto = payload?.[0]?.payload as (Record<CodigoNecessidade, number> & { ano?: string; quantidade?: number }) | undefined;

  if (!active || !ponto?.ano) {
    return null;
  }

  return (
    <div className="border border-fio bg-background px-3 py-2 text-sm">
      <p className="text-[11px] tracking-[0.18em] text-rosa uppercase">{ponto.ano}</p>
      <p className="mt-1 text-zinc-400">{ponto.quantidade} resultados</p>
      {CODIGOS.map((codigo) => (
        <p key={codigo} className="text-zinc-300">
          {codigo} {ponto[codigo].toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
        </p>
      ))}
    </div>
  );
}
