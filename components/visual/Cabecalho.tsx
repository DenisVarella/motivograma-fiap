import Link from "next/link";

export function Cabecalho() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link
        href="/"
        className="font-display text-sm tracking-[0.28em] text-rosa uppercase"
      >
        Motivograma
      </Link>
      <span className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
        Perfil individual
      </span>
    </header>
  );
}
