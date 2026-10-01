/**
 * Cliente do Firestore, no navegador e nas rotas do servidor.
 * As chaves vêm do .env e precisam do prefixo NEXT_PUBLIC para o Next.js expô-las.
 */

import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export class FirebaseNaoConfiguradoError extends Error {
  constructor() {
    super("Preencha as variáveis do Firebase no arquivo .env e reinicie o servidor.");
    this.name = "FirebaseNaoConfiguradoError";
  }
}

function configuracao() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
}

export function obterFirestore() {
  const config = configuracao();

  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new FirebaseNaoConfiguradoError();
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  return getFirestore(app);
}

export function mensagemDeFirebase(erro: unknown) {
  if (erro instanceof FirebaseNaoConfiguradoError) {
    return erro.message;
  }

  return "Não foi possível falar com o Firebase. Confira o .env e publique as regras do Firestore.";
}
