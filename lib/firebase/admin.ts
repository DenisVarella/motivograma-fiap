/**
 * Firestore do servidor. A conta de serviço não vai para o navegador.
 */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export class FirebaseAdminNaoConfiguradoError extends Error {
  constructor() {
    super("Configure a conta de serviço do Firebase no arquivo .env.");
    this.name = "FirebaseAdminNaoConfiguradoError";
  }
}

export function obterFirestoreAdmin() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim() ?? "";

  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }

  privateKey = privateKey.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new FirebaseAdminNaoConfiguradoError();
  }

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });

  return getFirestore(app);
}
