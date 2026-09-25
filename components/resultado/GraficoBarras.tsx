"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PONTUACAO_MAXIMA } from "@/lib/motivograma/necessidades";
import type { PontoGrafico } from "@/lib/motivograma/pontuacao";

type Propriedades = {
  serie: PontoGrafico[];
  predominantes: readonly string[];
};

export function GraficoBarras({ serie, predominantes }: Propriedades) {
  const descricao = serie
    .map((item) => `${item.nome} ${item.pontos} de ${PONTUACAO_MAXIMA}`)
    .join(", ");

  return (
    <div className="h-80" role="img" aria-label={`Nível das necessidades insatisfeitas. ${descricao}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={serie} margin={{ top: 28, right: 8, left: 0, bottom: 0 }}>
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
              <DicaBarras active={propriedades.active} payload={propriedades.payload} />
            )}
          />
          <Bar dataKey="pontos" isAnimationActive="auto" animationDuration={900} radius={[2, 2, 0, 0]}>
            {serie.map((item) => (
              <Cell
                key={item.codigo}
                fill={predominantes.includes(item.codigo) ? "#e4236b" : "rgba(244,244,245,0.72)"}
              />
            ))}
            <LabelList dataKey="pontos" position="top" fill="#f4f4f5" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DicaBarras({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
}) {
  const ponto = payload?.[0]?.payload as PontoGrafico | undefined;

  if (!active || !ponto) {
    return null;
  }

  return (
    <div className="border border-fio bg-background px-3 py-2 text-sm">
      <p className="text-[11px] tracking-[0.18em] text-rosa uppercase">{ponto.codigo}</p>
      <p className="mt-1 text-zinc-100">{ponto.nome}</p>
      <p className="text-zinc-400">
        {ponto.pontos} de {PONTUACAO_MAXIMA}
      </p>
    </div>
  );
}
