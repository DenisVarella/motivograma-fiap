"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GraficoBarras } from "@/components/resultado/GraficoBarras";
import { GraficoRadar } from "@/components/resultado/GraficoRadar";
import { LeituraPerfil } from "@/components/resultado/LeituraPerfil";
import { OpcaoAnonimato } from "@/components/resultado/OpcaoAnonimato";
import { PainelComparativo } from "@/components/resultado/PainelComparativo";
import { BotaoContorno } from "@/components/visual/BotaoContorno";
import { Cabecalho } from "@/components/visual/Cabecalho";
import { mensagemDeFirebase } from "@/lib/firebase/cliente";
import {
  definirAnonimato,
  lerAnonimato,
  reiniciarTentativa,
  sincronizarSessao,
} from "@/lib/firebase/registros";
import { useMontado } from "@/lib/interface/use-montado";
import { baixarResultadoPdf } from "@/lib/resultado/baixar-pdf";
import { montarPerfil, type Perfil } from "@/lib/motivograma/pontuacao";
import { gravarSessao, lerSessao, sessaoVazia, type Sessao } from "@/lib/motivograma/sessao";

export function PainelResultado() {
  const router = useRouter();
  const montado = useMontado();
  const areaPdf = useRef<HTMLElement>(null);
  const preferenciaCarregada = useRef(false);
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [gerando, setGerando] = useState(false);
  const [falhaPdf, setFalhaPdf] = useState(false);
  const [falhaSalvar, setFalhaSalvar] = useState<string | null>(null);
  const [comparando, setComparando] = useState(false);
  const [anonimo, setAnonimo] = useState(false);
  const [salvandoAnonimo, setSalvandoAnonimo] = useState(false);

  if (montado && sessao === null) {
    setSessao(lerSessao());
  }

  const perfil: Perfil | null = sessao ? montarPerfil(sessao.respostas) : null;
  const completo = perfil !== null;

  useEffect(() => {
    if (!sessao) {
      return;
    }

    if (!sessao.rm) {
      router.replace("/");
      return;
    }

    if (!completo) {
      router.replace("/teste");
      return;
    }

    void sincronizarSessao(sessao).catch((falha: unknown) => {
      setFalhaSalvar(mensagemDeFirebase(falha));
    });

    if (preferenciaCarregada.current) {
      return;
    }

    void lerAnonimato(sessao.rm)
      .then((valor) => {
        if (!preferenciaCarregada.current) {
          preferenciaCarregada.current = true;
          setAnonimo(valor);
        }
      })
      .catch(() => undefined);
  }, [sessao, completo, router]);

  async function alterarAnonimato(valor: boolean) {
    if (!sessao?.rm) {
      return;
    }

    preferenciaCarregada.current = true;
    setAnonimo(valor);
    setSalvandoAnonimo(true);
    setFalhaSalvar(null);

    try {
      await definirAnonimato(sessao.rm, sessao.nome, valor);
    } catch (falha) {
      setAnonimo(!valor);
      setFalhaSalvar(mensagemDeFirebase(falha));
    } finally {
      setSalvandoAnonimo(false);
    }
  }

  async function refazer() {
    if (!sessao?.rm) {
      return;
    }

    setFalhaSalvar(null);

    try {
      const nova = sessaoVazia({ rm: sessao.rm, nome: sessao.nome });
      await reiniciarTentativa(sessao.rm, sessao.nome);
      gravarSessao(nova);
      router.push("/teste");
    } catch (falha) {
      setFalhaSalvar(mensagemDeFirebase(falha));
    }
  }

  async function baixar() {
    if (!areaPdf.current || gerando) {
      return;
    }

    setGerando(true);
    setFalhaPdf(false);

    try {
      await baixarResultadoPdf(areaPdf.current);
    } catch {
      setFalhaPdf(true);
    } finally {
      setGerando(false);
    }
  }

  return (
    <main ref={areaPdf} className="mx-auto min-h-dvh w-full max-w-6xl bg-background px-6 py-10">
      <Cabecalho />

      {!perfil ? (
        <p className="mt-16 text-sm tracking-[0.18em] text-zinc-500 uppercase">Carregando</p>
      ) : (
        <div className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
                {comparando ? "Grupo" : "Resultado"}
              </p>
              <h1 className="font-display mt-3 text-4xl text-rosa sm:text-5xl">
                {comparando ? "Quem já respondeu" : "Nível das necessidades"}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3" data-pdf-oculto="true">
              {comparando ? (
                <BotaoContorno onClick={() => setComparando(false)} destaque>
                  Meu resultado
                </BotaoContorno>
              ) : (
                <>
                  <BotaoContorno onClick={baixar} disabled={gerando} destaque>
                    {gerando ? "Gerando" : "Download"}
                  </BotaoContorno>
                  <BotaoContorno onClick={() => setComparando(true)}>Comparar</BotaoContorno>
                  <BotaoContorno href="/teste">Revisar respostas</BotaoContorno>
                  <BotaoContorno onClick={refazer}>Refazer</BotaoContorno>
                </>
              )}
            </div>
          </div>
          {falhaPdf ? (
            <p className="mt-4 text-sm text-rosa" data-pdf-oculto="true">
              Não foi possível gerar o PDF. Tente de novo.
            </p>
          ) : null}
          {falhaSalvar ? (
            <p className="mt-4 text-sm text-rosa" data-pdf-oculto="true">
              {falhaSalvar}
            </p>
          ) : null}

          {sessao && !comparando ? (
            <div className="mt-8" data-pdf-oculto="true">
              <OpcaoAnonimato
                marcado={anonimo}
                salvando={salvandoAnonimo}
                onAlterar={alterarAnonimato}
              />
            </div>
          ) : null}

          {comparando && sessao ? (
            <PainelComparativo
              rm={sessao.rm}
              nome={sessao.nome}
              perfil={perfil}
              anonimo={anonimo}
              salvandoAnonimo={salvandoAnonimo}
              onAlterarAnonimato={alterarAnonimato}
            />
          ) : (
          <>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <section className="border border-fio p-4 sm:p-6">
              <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
                Colunas de 0 a 36
              </p>
              <GraficoBarras
                serie={perfil.serie}
                predominantes={perfil.predominantes.map((item) => item.codigo)}
              />
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                {perfil.serie.map((item) => (
                  <span key={item.codigo}>
                    {item.codigo} {item.nome}
                  </span>
                ))}
              </p>
            </section>
            <section className="border border-fio p-4 sm:p-6">
              <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
                As cinco ao mesmo tempo
              </p>
              <GraficoRadar serie={perfil.serie} />
            </section>
          </div>

          <div className="mt-12">
            <LeituraPerfil perfil={perfil} />
          </div>
          </>
          )}
        </div>
      )}
    </main>
  );
}
