import {
  NECESSIDADES,
  PONTUACAO_MAXIMA,
  ROTULO_FAIXA,
  textoDaFaixa,
} from "@/lib/motivograma/necessidades";
import { juntarNomes, type Perfil } from "@/lib/motivograma/pontuacao";

type Propriedades = {
  perfil: Perfil;
};

export function LeituraPerfil({ perfil }: Propriedades) {
  const nomes = juntarNomes(perfil.predominantes.map((item) => item.nome));
  const mediaPrimaria = formatarMedia(perfil.mediaPrimaria);
  const mediaSecundaria = formatarMedia(perfil.mediaSecundaria);

  return (
    <div className="space-y-10">
      <section className="card-entra border border-fio p-6 sm:p-8">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          Necessidade em destaque
        </p>
        <h2 className="font-display mt-3 text-3xl text-rosa sm:text-4xl">{nomes}</h2>
        <p className="mt-4 max-w-2xl text-zinc-200">{perfil.textoDestaque}</p>
      </section>

      <section className="grid gap-px bg-fio sm:grid-cols-2">
        <div className="card-entra bg-background p-6" style={{ animationDelay: "80ms" }}>
          <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">Primárias</p>
          <p className="font-display mt-3 text-3xl">{mediaPrimaria}</p>
          <p className="mt-2 text-sm text-zinc-400">Média de fisiológicas e segurança</p>
        </div>
        <div className="card-entra bg-background p-6" style={{ animationDelay: "140ms" }}>
          <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">Secundárias</p>
          <p className="font-display mt-3 text-3xl">{mediaSecundaria}</p>
          <p className="mt-2 text-sm text-zinc-400">
            Média de associação, autoestima e autorrealização
          </p>
        </div>
      </section>
      <p className="text-zinc-300">{perfil.textoGrupos}</p>

      <section className="grid gap-4 lg:grid-cols-2">
        {perfil.ranking.map((item, indice) => {
          const necessidade = NECESSIDADES[item.codigo];

          return (
            <article
              key={item.codigo}
              className="card-entra border border-fio p-5"
              style={{ animationDelay: `${180 + indice * 70}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] tracking-[0.22em] text-rosa uppercase">
                    {item.codigo} · {ROTULO_FAIXA[item.faixa]}
                  </p>
                  <h3 className="font-display mt-2 text-2xl">{necessidade.nome}</h3>
                </div>
                <p className="font-display text-3xl text-zinc-100">
                  {item.pontos}
                  <span className="text-base text-zinc-500">/{PONTUACAO_MAXIMA}</span>
                </p>
              </div>
              <p className="mt-4 text-zinc-200">{textoDaFaixa(item.faixa)}</p>
              <p className="mt-3 text-sm text-zinc-400">{necessidade.noTrabalho}</p>
              <p className="mt-3 text-sm text-zinc-300">
                <span className="tracking-[0.16em] text-zinc-500 uppercase">Para a liderança · </span>
                {necessidade.paraLideranca}
              </p>
            </article>
          );
        })}
      </section>

      <section className="border-t border-fio pt-6 text-sm text-zinc-400">
        <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">Como ler</p>
        <p className="mt-3">
          A escala vai de 0 a {PONTUACAO_MAXIMA}. Cada necessidade entra em 12 comparações, e a soma
          das cinco notas é {perfil.soma}. Nota alta é a prioridade agora, em geral uma necessidade
          ainda insatisfeita. Nota baixa é menor prioridade neste momento: ou ela já está
          relativamente atendida, ou outra foi colocada na frente.
        </p>
        <p className="mt-3">
          O desenho muda com o tempo. Esta é uma autoavaliação de estudo, não um diagnóstico.
        </p>
      </section>
    </div>
  );
}

function formatarMedia(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
