"use client";

import { useSyncExternalStore } from "react";

function inscrever() {
  return () => {};
}

function lerCliente() {
  return true;
}

function lerServidor() {
  return false;
}

/** Distingue o HTML do servidor da leitura do navegador, sem piscar conteúdo errado. */
export function useMontado(): boolean {
  return useSyncExternalStore(inscrever, lerCliente, lerServidor);
}
