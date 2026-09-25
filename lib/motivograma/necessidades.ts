/**
 * Necessidades do Motivograma, na ordem da hierarquia de Maslow.
 * Nota alta significa maior prioridade neste momento — em geral, uma
 * necessidade ainda insatisfeita. Nota baixa significa menor prioridade agora.
 */

export const CODIGOS = ["V", "W", "X", "Y", "Z"] as const;

export type CodigoNecessidade = (typeof CODIGOS)[number];

export type GrupoNecessidade = "primaria" | "secundaria";

export type FaixaPrioridade = "baixa" | "moderada" | "alta";

export type Necessidade = {
  codigo: CodigoNecessidade;
  nome: string;
  grupo: GrupoNecessidade;
  resumo: string;
  noTrabalho: string;
  paraLideranca: string;
};

export const PONTUACAO_MAXIMA = 36;

export const ROTULO_FAIXA: Record<FaixaPrioridade, string> = {
  baixa: "Baixa prioridade",
  moderada: "Prioridade moderada",
  alta: "Alta prioridade",
};

export const NECESSIDADES: Record<CodigoNecessidade, Necessidade> = {
  V: {
    codigo: "V",
    nome: "Fisiológicas",
    grupo: "primaria",
    resumo: "Sustento, descanso e um corpo que não esteja no limite.",
    noTrabalho:
      "Aparece como salário que cobre o essencial, pausas reais e um lugar fisicamente confortável.",
    paraLideranca:
      "Remuneração compatível com o custo de vida, condições físicas agradáveis e uma jornada que não exija abrir mão do almoço ou da saída todos os dias.",
  },
  W: {
    codigo: "W",
    nome: "Segurança",
    grupo: "primaria",
    resumo: "Previsibilidade, proteção e confiança de que o chão não vai sumir.",
    noTrabalho:
      "Regras claras, estabilidade, benefícios de saúde e um chefe em quem dá para confiar.",
    paraLideranca:
      "Normas explícitas, combinados estáveis, cobertura de saúde e um ambiente em que o trabalho está organizado e o futuro próximo é compreensível.",
  },
  X: {
    codigo: "X",
    nome: "Associação",
    grupo: "secundaria",
    resumo: "Vínculo, aceitação e a sensação de pertencer a um grupo.",
    noTrabalho:
      "Convívio cordial com colegas, chefes e liderados, e equipes em que as pessoas se relacionam bem.",
    paraLideranca:
      "Espaço para trocar ideias, times com relação saudável e cuidado para que a tarefa não isole a pessoa do grupo.",
  },
  Y: {
    codigo: "Y",
    nome: "Autoestima",
    grupo: "secundaria",
    resumo: "Respeito, reconhecimento pelo mérito e um lugar de prestígio.",
    noTrabalho:
      "Ser valorizado pelo que entrega, receber consideração e ocupar um cargo que confira status e influência.",
    paraLideranca:
      "Reconhecimento justo, promoção pelo mérito e cargos em que a pessoa sinta prestígio e poder de influência.",
  },
  Z: {
    codigo: "Z",
    nome: "Autorrealização",
    grupo: "secundaria",
    resumo: "Usar o próprio potencial, criar e ver o efeito do que se faz.",
    noTrabalho:
      "Autonomia para experimentar, desafios à altura e acesso aos resultados do próprio trabalho.",
    paraLideranca:
      "Margem para inovar, tarefas que ainda desafiem e retorno claro sobre o que a pessoa produziu.",
  },
};

export function faixaDe(pontos: number): FaixaPrioridade {
  if (pontos <= 11) {
    return "baixa";
  }

  if (pontos <= 23) {
    return "moderada";
  }

  return "alta";
}

export function textoDaFaixa(faixa: FaixaPrioridade): string {
  if (faixa === "alta") {
    return "Essa necessidade está em primeiro plano. Enquanto permanecer insatisfeita, ela tende a puxar as suas escolhas.";
  }

  if (faixa === "moderada") {
    return "Ela pesa no seu momento, mas divide espaço com outras prioridades.";
  }

  return "Neste momento ela não está à frente. Pode já estar relativamente atendida, ou você está escolhendo cuidar de outra necessidade antes.";
}
