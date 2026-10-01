/**
 * Sessão do professor: a senha fica no servidor e o cookie só prova que ela foi aceita.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_PROFESSOR = "motivograma.professor";
const DURACAO_MS = 12 * 60 * 60 * 1000;

export class SenhaProfessorNaoConfiguradaError extends Error {
  constructor() {
    super("Defina SENHA_PROFESSOR no arquivo .env.");
    this.name = "SenhaProfessorNaoConfiguradaError";
  }
}

function senhaConfigurada() {
  const senha = process.env.SENHA_PROFESSOR?.trim() ?? "";

  if (!senha) {
    throw new SenhaProfessorNaoConfiguradaError();
  }

  return senha;
}

function resumo(valor: string) {
  return createHmac("sha256", "motivograma-professor").update(valor).digest();
}

export function senhaConfere(informada: string) {
  const esperada = senhaConfigurada();
  const recebida = informada.trim();

  if (!recebida) {
    return false;
  }

  return timingSafeEqual(resumo(recebida), resumo(esperada));
}

export function emitirSessaoProfessor() {
  const expira = Date.now() + DURACAO_MS;
  const corpo = String(expira);
  const assinatura = createHmac("sha256", senhaConfigurada()).update(corpo).digest("base64url");
  return `${corpo}.${assinatura}`;
}

export function sessaoProfessorValida(token: string | undefined) {
  if (!token || !process.env.SENHA_PROFESSOR?.trim()) {
    return false;
  }

  const [corpo, assinatura] = token.split(".");

  if (!corpo || !assinatura) {
    return false;
  }

  const esperada = createHmac("sha256", senhaConfigurada()).update(corpo).digest("base64url");
  const recebida = Buffer.from(assinatura);
  const correta = Buffer.from(esperada);

  if (recebida.length !== correta.length || !timingSafeEqual(recebida, correta)) {
    return false;
  }

  return Number(corpo) > Date.now();
}

export const OPCOES_COOKIE_PROFESSOR = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: DURACAO_MS / 1000,
};
