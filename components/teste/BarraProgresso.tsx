type Propriedades = {
  respondidas: number;
  total: number;
};

export function BarraProgresso({ respondidas, total }: Propriedades) {
  const percentual = total === 0 ? 0 : (respondidas / total) * 100;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
        <span>Progresso</span>
        <span>
          {respondidas} de {total}
        </span>
      </div>
      <div
        className="h-0.5 bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={respondidas}
        aria-label="Itens respondidos"
      >
        <div className="barra-progresso h-0.5 bg-rosa" style={{ width: `${percentual}%` }} />
      </div>
    </div>
  );
}
