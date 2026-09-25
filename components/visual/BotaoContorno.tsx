"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Propriedades = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  destaque?: boolean;
  className?: string;
};

const BASE =
  "inline-flex items-center justify-center border px-6 py-3 text-xs tracking-[0.22em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-35";

export function BotaoContorno({
  children,
  href,
  onClick,
  disabled = false,
  destaque = false,
  className = "",
}: Propriedades) {
  const visual = destaque
    ? "border-rosa text-rosa"
    : "border-white/25 text-zinc-100 hover:border-rosa hover:text-rosa";
  const classe = `${BASE} ${visual} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classe} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classe} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
