import Image from "next/image";
import Link from "next/link";

export function Cabecalho({ rotulo = "Perfil individual" }: { rotulo?: string }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt=""
          width={822}
          height={753}
          className="h-8 w-auto"
          priority
        />
        <span className="font-display text-sm tracking-[0.28em] text-rosa uppercase">
          Motivograma
        </span>
      </Link>
      <span className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
        {rotulo}
      </span>
    </header>
  );
}
