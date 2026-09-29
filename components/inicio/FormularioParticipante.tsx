"use client";

import { useState, type FormEvent } from "react";
import { BotaoContorno } from "@/components/visual/BotaoContorno";

type Propriedades = {
  enviando: boolean;
  erro: string | null;
  onConfirmar: (rm: string, nome: string) => void;
  onCancelar: () => void;
};

export function FormularioParticipante({
  enviando,
  erro,
  onConfirmar,
  onCancelar,
}: Propriedades) {
  const [rm, setRm] = useState("");
  const [nome, setNome] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const rmLimpo = rm.trim();
    const nomeLimpo = nome.trim().replace(/\s+/g, " ");

    if (!rmLimpo || !nomeLimpo) {
      setAviso("Informe o RM e o nome.");
      return;
    }

    if (!/^\d{4,12}$/.test(rmLimpo)) {
      setAviso("O RM deve ter de 4 a 12 números.");
      return;
    }

    setAviso(null);
    onConfirmar(rmLimpo, nomeLimpo);
  }

  const mensagem = aviso ?? erro;

  return (
    <form onSubmit={enviar} className="border border-fio p-5 sm:p-6">
      <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">Identificação</p>
      <label className="mt-6 block text-[11px] tracking-[0.22em] text-zinc-500 uppercase" htmlFor="rm">
        RM
      </label>
      <input
        id="rm"
        name="rm"
        inputMode="numeric"
        autoComplete="off"
        value={rm}
        onChange={(evento) => setRm(evento.target.value)}
        className="mt-2 w-full border border-white/25 bg-transparent px-3 py-3 text-zinc-100 outline-none focus:border-rosa"
      />
      <label className="mt-5 block text-[11px] tracking-[0.22em] text-zinc-500 uppercase" htmlFor="nome">
        Nome
      </label>
      <input
        id="nome"
        name="nome"
        autoComplete="name"
        value={nome}
        onChange={(evento) => setNome(evento.target.value)}
        className="mt-2 w-full border border-white/25 bg-transparent px-3 py-3 text-zinc-100 outline-none focus:border-rosa"
      />
      {mensagem ? <p className="mt-4 text-sm text-rosa">{mensagem}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <BotaoContorno type="submit" destaque disabled={enviando}>
          {enviando ? "Buscando" : "Entrar"}
        </BotaoContorno>
        <button
          type="button"
          onClick={onCancelar}
          disabled={enviando}
          className="inline-flex items-center justify-center border border-white/25 px-6 py-3 text-xs tracking-[0.22em] text-zinc-100 uppercase hover:border-rosa hover:text-rosa disabled:opacity-35"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
