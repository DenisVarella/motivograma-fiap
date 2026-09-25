/**
 * Trinta itens de escolha forçada.
 * Cada item opõe duas necessidades. A ordem dos pares segue o instrumento:
 * a pessoa distribui 3 pontos e a soma das cinco colunas fecha em 90.
 */

import type { CodigoNecessidade } from "@/lib/motivograma/necessidades";

export type Alternativa = {
  codigo: CodigoNecessidade;
  texto: string;
};

export type Questao = {
  numero: number;
  enunciado: string;
  alternativas: [Alternativa, Alternativa];
};

const CICLO = [
  "O que mais acende o meu empenho é",
  "Entre duas organizações, eu escolho a que",
  "O liderado que mais me desgasta é quem",
  "Eu me entrego com mais vontade quando",
  "Na próxima promoção, eu escolheria o posto que",
  "Meu rendimento cai quando",
] as const;

const PARES: Array<[Alternativa, Alternativa]> = [
  [
    {
      codigo: "V",
      texto:
        "uma remuneração que cobre o essencial para mim e para a minha família.",
    },
    {
      codigo: "Z",
      texto:
        "a chance de testar a minha capacidade e de ver os resultados que eu gero.",
    },
  ],
  [
    {
      codigo: "W",
      texto:
        "deixa as regras nítidas, garante a minha permanência e amplia a cobertura de saúde.",
    },
    {
      codigo: "Z",
      texto:
        "me dá autonomia para criar, liberdade para experimentar e autoridade para inovar.",
    },
  ],
  [
    {
      codigo: "V",
      texto: "não valoriza o conforto do ambiente que lhe oferecem.",
    },
    {
      codigo: "Y",
      texto: "não me trata com respeito nem consideração.",
    },
  ],
  [
    {
      codigo: "V",
      texto:
        "a remuneração cobre o essencial para mim e para a minha família.",
    },
    {
      codigo: "X",
      texto:
        "o convívio com colegas, chefes e liderados é cordial e eu me sinto aceito.",
    },
  ],
  [
    {
      codigo: "W",
      texto:
        "me garanta regras claras, estabilidade e uma cobertura de saúde mais ampla.",
    },
    {
      codigo: "Y",
      texto: "me dê mais prestígio e mais poder.",
    },
  ],
  [
    {
      codigo: "X",
      texto:
        "a tarefa exige que eu me dedique sozinho e me tira a chance de trocar ideias com a equipe.",
    },
    {
      codigo: "Z",
      texto: "as minhas responsabilidades deixam de ser um desafio.",
    },
  ],
  [
    {
      codigo: "Y",
      texto:
        "o reconhecimento que recebo, dado só pelo mérito do que eu entrego.",
    },
    {
      codigo: "W",
      texto:
        "eu confio em quem me lidera, o trabalho está organizado e quase tudo já foi previsto.",
    },
  ],
  [
    {
      codigo: "X",
      texto:
        "me convida para uma equipe em que as pessoas se relacionam muito bem.",
    },
    {
      codigo: "V",
      texto:
        "me oferece um lugar confortável, amplo e limpo, com boa luz, temperatura agradável e comida gostosa.",
    },
  ],
  [
    {
      codigo: "Y",
      texto: "não me trata com respeito nem consideração.",
    },
    {
      codigo: "Z",
      texto: "resiste a colaborar quando eu quero experimentar uma ideia nova.",
    },
  ],
  [
    {
      codigo: "Z",
      texto: "posso testar a minha capacidade e tenho acesso aos meus resultados.",
    },
    {
      codigo: "W",
      texto:
        "confio em quem me lidera, o trabalho está organizado e quase nada fica ao acaso.",
    },
  ],
  [
    {
      codigo: "Y",
      texto: "me dê mais prestígio e mais poder.",
    },
    {
      codigo: "V",
      texto:
        "me ofereça conforto, espaço, limpeza, boa luz, temperatura agradável e uma boa refeição.",
    },
  ],
  [
    {
      codigo: "Z",
      texto: "o que eu faço hoje já não me desafia.",
    },
    {
      codigo: "V",
      texto:
        "me pedem tanto que, de forma sistemática, eu sacrifico o almoço ou a hora de ir embora.",
    },
  ],
  [
    {
      codigo: "V",
      texto:
        "uma remuneração compatível com as necessidades básicas minhas e da minha família.",
    },
    {
      codigo: "W",
      texto:
        "um chefe em quem eu confio, condições organizadas e um ambiente em que quase tudo já foi planejado.",
    },
  ],
  [
    {
      codigo: "W",
      texto:
        "define normas claras, assegura estabilidade e amplia a assistência de saúde.",
    },
    {
      codigo: "X",
      texto: "me chama para um time em que a relação entre as pessoas é excelente.",
    },
  ],
  [
    {
      codigo: "X",
      texto:
        "se isola e trata qualquer gesto de convivência como bajulação.",
    },
    {
      codigo: "W",
      texto: "não pensa no dia de amanhã.",
    },
  ],
  [
    {
      codigo: "Y",
      texto: "me reconhecem exclusivamente pelo mérito.",
    },
    {
      codigo: "Z",
      texto:
        "me dão a chance de testar a minha capacidade e de acompanhar os meus resultados.",
    },
  ],
  [
    {
      codigo: "W",
      texto:
        "me ofereça normas claras, estabilidade sólida e uma assistência de saúde mais ampla.",
    },
    {
      codigo: "V",
      texto:
        "me dê um ambiente confortável, amplo e limpo, com boa luz, temperatura agradável e comida saborosa.",
    },
  ],
  [
    {
      codigo: "X",
      texto:
        "me isolam numa tarefa pessoal e eu não consigo compartilhar problemas nem ideias.",
    },
    {
      codigo: "Y",
      texto:
        "promovem, por favoritismo, alguém menos preparado do que eu para o cargo que eu queria.",
    },
  ],
  [
    {
      codigo: "Y",
      texto: "o reconhecimento exclusivo pelo meu mérito.",
    },
    {
      codigo: "X",
      texto:
        "um relacionamento cordial com colegas, chefes e liderados, e a certeza de que me aceitam.",
    },
  ],
  [
    {
      codigo: "Z",
      texto:
        "me dá autonomia para criar, liberdade para experimentar e autoridade para inovar.",
    },
    {
      codigo: "Y",
      texto: "me oferece um cargo de maior prestígio e poder.",
    },
  ],
  [
    {
      codigo: "V",
      texto:
        "não valoriza as boas condições do ambiente: conforto, luz, alimentação.",
    },
    {
      codigo: "X",
      texto: "se isola e lê qualquer aproximação como bajulação.",
    },
  ],
  [
    {
      codigo: "Z",
      texto: "eu testo a minha capacidade e enxergo o que resultou do meu trabalho.",
    },
    {
      codigo: "X",
      texto:
        "mantenho um convívio cordial e me sinto aceito por colegas, chefes e liderados.",
    },
  ],
  [
    {
      codigo: "V",
      texto:
        "me ofereça conforto, amplitude, limpeza, boa iluminação, temperatura agradável e boa comida.",
    },
    {
      codigo: "Z",
      texto:
        "me dê autonomia para criar, liberdade para experimentar e autoridade para inovar.",
    },
  ],
  [
    {
      codigo: "Y",
      texto:
        "um colega com menos qualificação sobe, por favor, ao cargo que eu planejava assumir.",
    },
    {
      codigo: "W",
      texto:
        "perco a confiança no chefe, desconfio da estabilidade do meu posto ou temo pela organização.",
    },
  ],
  [
    {
      codigo: "V",
      texto:
        "um salário à altura das necessidades básicas minhas e da minha família.",
    },
    {
      codigo: "Y",
      texto: "ser reconhecido somente em função dos meus méritos.",
    },
  ],
  [
    {
      codigo: "Y",
      texto: "me coloque num cargo de maior prestígio e poder.",
    },
    {
      codigo: "X",
      texto: "me inclua numa equipe com excelentes relações entre as pessoas.",
    },
  ],
  [
    {
      codigo: "W",
      texto: "não pensa no que vem depois.",
    },
    {
      codigo: "Z",
      texto: "recusa entrar comigo na experimentação de ideias novas.",
    },
  ],
  [
    {
      codigo: "X",
      texto:
        "o relacionamento com colegas, superiores e liderados é harmonioso e eu me sinto bem aceito.",
    },
    {
      codigo: "W",
      texto:
        "tenho um superior confiável, o trabalho está bem organizado e o ambiente é previsível.",
    },
  ],
  [
    {
      codigo: "Z",
      texto:
        "me dê autonomia para criar, liberdade para experimentar e autoridade para inovar.",
    },
    {
      codigo: "X",
      texto: "me deixe integrar uma equipe em que as pessoas se dão muito bem.",
    },
  ],
  [
    {
      codigo: "V",
      texto:
        "sou tão solicitado que sacrifico, quase sempre, o almoço ou o horário de saída.",
    },
    {
      codigo: "W",
      texto:
        "deixo de confiar no chefe, duvido da estabilidade do cargo ou temo pela sobrevivência da organização.",
    },
  ],
];

export const QUESTOES: Questao[] = PARES.map((alternativas, indice) => ({
  numero: indice + 1,
  enunciado: CICLO[indice % CICLO.length],
  alternativas,
}));
