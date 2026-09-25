"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PONTUACAO_MAXIMA } from "@/lib/motivograma/necessidades";
import type { PontoGrafico } from "@/lib/motivograma/pontuacao";

type Propriedades = {
  serie: PontoGrafico[];
};

export function GraficoRadar({ serie }: Propriedades) {
  const descricao = serie
    .map((item) => `${item.nome} ${item.pontos}`)
    .join(", ");

  return (
    <div className="h-80" role="img" aria-label={`Radar das cinco necessidades. ${descricao}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={serie} outerRadius="68%">
          <PolarGrid stroke="rgba(255,255,255,0.16)" />
          <PolarAngleAxis dataKey="nome" tick={{ fill: "#d4d4d8", fontSize: 12 }} />
          <PolarRadiusAxis
            domain={[0, PONTUACAO_MAXIMA]}
            tick={false}
            axisLine={false}
          />
          <Tooltip
            content={(propriedades) => (
              <DicaRadar active={propriedades.active} payload={propriedades.payload} />
            )}
          />
          <Radar
            dataKey="pontos"
            stroke="#e4236b"
            fill="#e4236b"
            fillOpacity={0.28}
            isAnimationActive="auto"
            animationDuration={900}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DicaRadar({
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
      <p className="text-zinc-100">{ponto.nome}</p>
      <p className="text-zinc-400">
        {ponto.pontos} de {PONTUACAO_MAXIMA}
      </p>
    </div>
  );
}
