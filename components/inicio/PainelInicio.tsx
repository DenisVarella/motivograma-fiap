"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormularioParticipante } from "@/components/inicio/FormularioParticipante";
import { BotaoContorno } from "@/components/visual/BotaoContorno";
import { mensagemDeFirebase } from "@/lib/firebase/cliente";
import { carregarParticipante, reiniciarTentativa, sincronizarSessao } from "@/lib/firebase/registros";
import { respostasCompletas } from "@/lib/motivograma/pontuacao";
import { QUESTOES } from "@/lib/motivograma/questoes";
import {
  contarRespondidas,
  gravarSessao,
  sessaoVazia,
  type Sessao,
} from "@/lib/motivograma/sessao";

export function PainelInicio() {
  const router = useRouter();
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [identificado, setIdentificado] = useState<Sessao | null>(null);

  const respondidas = identificado ? contarRespondidas(identificado.respostas) : 0;
  const jaRespondeu = respondidas > 0;

  async function confirmar(rm: string, nome: string) {
    setEnviando(true);
    setErro(null);

    try {
      const existente = await carregarParticipante(rm);

      if (existente && contarRespondidas(existente.respostas) > 0) {
        const atualizada = { ...existente, nome };
        await sincronizarSessao(atualizada);
        setIdentificado(atualizada);
        setFormularioAberto(false);
        return;
      }

      const nova = sessaoVazia({ rm, nome });
      await sincronizarSessao(nova);
      gravarSessao(nova);
      router.push("/teste");
    } catch (falha) {
      setErro(mensagemDeFirebase(falha));
    } finally {
      setEnviando(false);
    }
  }

  function continuar() {
    if (!identificado) {
      return;
    }

    gravarSessao(identificado);
    router.push(respostasCompletas(identificado.respostas) ? "/resultado" : "/teste");
  }

  async function comecarDeNovo() {
    if (!identificado) {
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      const nova = sessaoVazia({ rm: identificado.rm, nome: identificado.nome });
      await reiniciarTentativa(identificado.rm, identificado.nome);
      gravarSessao(nova);
      router.push("/teste");
    } catch (falha) {
      setErro(mensagemDeFirebase(falha));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="revela revela-atraso flex flex-col justify-center border-t border-fio px-6 py-16 sm:px-12 lg:border-t-0 lg:border-l lg:px-16 lg:py-14">
      <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">Como responder</p>
      <ol className="mt-8 space-y-6 text-zinc-200">
        <li>
          <span className="mb-1 block text-[11px] tracking-[0.22em] text-rosa uppercase">
            01
          </span>
          São {QUESTOES.length} situações. Em cada uma, as duas alternativas são válidas.
        </li>
        <li>
          <span className="mb-1 block text-[11px] tracking-[0.22em] text-rosa uppercase">
            02
          </span>
          Arraste a bolinha do centro até uma das quatro marcas. As pontas são a aceitação total e as do meio, a parcial.
        </li>
        <li>
          <span className="mb-1 block text-[11px] tracking-[0.22em] text-rosa uppercase">
            03
          </span>
          Não existe resposta certa. O desenho mostra a prioridade deste momento, e ela muda com o tempo.
        </li>
      </ol>

      <div className="mt-12">
        {formularioAberto ? (
          <FormularioParticipante
            enviando={enviando}
            erro={erro}
            onConfirmar={confirmar}
            onCancelar={() => {
              setFormularioAberto(false);
              setErro(null);
            }}
          />
        ) : jaRespondeu && identificado ? (
          <div>
            <p className="text-sm text-zinc-400">
              Olá, {identificado.nome}. Este RM já tem respostas salvas.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BotaoContorno onClick={continuar} destaque disabled={enviando}>
                Continuar
              </BotaoContorno>
              <BotaoContorno onClick={comecarDeNovo} disabled={enviando}>
                Começar de novo
              </BotaoContorno>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              {respondidas} de {QUESTOES.length} itens já respondidos.
            </p>
            {erro ? <p className="mt-3 text-sm text-rosa">{erro}</p> : null}
            <button
              type="button"
              onClick={() => {
                setIdentificado(null);
                setErro(null);
                setFormularioAberto(true);
              }}
              className="mt-5 text-[11px] tracking-[0.22em] text-zinc-500 uppercase hover:text-rosa"
            >
              Usar outro RM
            </button>
          </div>
        ) : (
          <BotaoContorno
            onClick={() => {
              setErro(null);
              setFormularioAberto(true);
            }}
            destaque
          >
            Começar
          </BotaoContorno>
        )}
      </div>
    </section>
  );
}
