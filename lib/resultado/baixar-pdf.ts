/**
 * Fotografa a tela de resultado e reparte a imagem em páginas A4.
 */

import { domToCanvas } from "modern-screenshot";
import { jsPDF } from "jspdf";

const FUNDO = "#0c0c0e";

export async function baixarResultadoPdf(elemento: HTMLElement) {
  const canvas = await domToCanvas(elemento, {
    backgroundColor: FUNDO,
    scale: 2,
    filter: (no) => !(no instanceof HTMLElement && no.dataset.pdfOculto === "true"),
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margem = 8;
  const larguraPagina = pdf.internal.pageSize.getWidth();
  const alturaPagina = pdf.internal.pageSize.getHeight();
  const larguraUtil = larguraPagina - margem * 2;
  const alturaUtil = alturaPagina - margem * 2;
  const alturaImagem = (canvas.height * larguraUtil) / canvas.width;
  const imagem = canvas.toDataURL("image/jpeg", 0.92);

  let deslocamento = 0;

  do {
    if (deslocamento > 0) {
      pdf.addPage();
    }

    pintarFundo(pdf, larguraPagina, alturaPagina);
    pdf.addImage(imagem, "JPEG", margem, margem - deslocamento, larguraUtil, alturaImagem);
    deslocamento += alturaUtil;
  } while (deslocamento < alturaImagem);

  pdf.save("motivograma-resultado.pdf");
}

function pintarFundo(pdf: jsPDF, largura: number, altura: number) {
  pdf.setFillColor(12, 12, 14);
  pdf.rect(0, 0, largura, altura, "F");
}
