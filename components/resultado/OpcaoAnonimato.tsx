"use client";

type Propriedades = {
  marcado: boolean;
  salvando?: boolean;
  onAlterar: (valor: boolean) => void;
};

export function OpcaoAnonimato({ marcado, salvando = false, onAlterar }: Propriedades) {
  return (
    <label className="flex max-w-xl cursor-pointer items-start gap-3 text-sm text-zinc-300">
      <input
        type="checkbox"
        checked={marcado}
        disabled={salvando}
        onChange={(evento) => onAlterar(evento.target.checked)}
        className="mt-0.5 size-4 accent-[#e4236b]"
      />
      <span>Aparecer como anônimo na comparação. O resultado entra na média, sem o seu nome.</span>
    </label>
  );
}
