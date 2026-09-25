/**
 * Fundo discreto de pontos, quadrados e cruzes.
 * A posição nasce de uma função determinística para o servidor e o cliente coincidirem.
 */

type TipoMarca = "ponto" | "quadrado" | "cruz";

type Marca = {
  id: number;
  tipo: TipoMarca;
  rosa: boolean;
  esquerda: string;
  topo: string;
  dx: string;
  dy: string;
  dur: string;
  atraso: string;
  opacidade: number;
};

function fracao(indice: number, sal: number): number {
  const valor = Math.sin(indice * 12.9898 + sal * 78.233) * 43758.5453;
  return valor - Math.floor(valor);
}

const MARCAS: Marca[] = Array.from({ length: 36 }, (_, indice) => {
  const tipoIndice = indice % 5;
  const tipo: TipoMarca =
    tipoIndice === 0 ? "cruz" : tipoIndice === 1 ? "quadrado" : "ponto";

  return {
    id: indice,
    tipo,
    rosa: indice % 7 === 0,
    esquerda: `${(fracao(indice, 1) * 100).toFixed(2)}%`,
    topo: `${(fracao(indice, 2) * 100).toFixed(2)}%`,
    dx: `${Math.round((fracao(indice, 3) - 0.5) * 36)}px`,
    dy: `${Math.round((fracao(indice, 4) - 0.5) * 28)}px`,
    dur: `${18 + Math.round(fracao(indice, 5) * 22)}s`,
    atraso: `${(-fracao(indice, 6) * 20).toFixed(1)}s`,
    opacidade: Number((0.16 + fracao(indice, 7) * 0.28).toFixed(2)),
  };
});

export function CampoPontos() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {MARCAS.map((marca) => (
        <span
          key={marca.id}
          className={`marca absolute ${marca.rosa ? "text-rosa" : "text-white"}`}
          style={{
            left: marca.esquerda,
            top: marca.topo,
            opacity: marca.opacidade,
            ["--dx" as string]: marca.dx,
            ["--dy" as string]: marca.dy,
            ["--dur" as string]: marca.dur,
            animationDelay: marca.atraso,
          }}
        >
          <Forma tipo={marca.tipo} />
        </span>
      ))}
    </div>
  );
}

function Forma({ tipo }: { tipo: TipoMarca }) {
  if (tipo === "ponto") {
    return <span className="block size-[3px] rounded-full bg-current" />;
  }

  if (tipo === "quadrado") {
    return <span className="block size-[4px] border border-current" />;
  }

  return (
    <span className="relative block size-2">
      <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
    </span>
  );
}
