import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let appInstance: App | null = null;

function getPrivateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function ensureApp() {
  if (appInstance) return appInstance;
  if (getApps().length > 0) {
    appInstance = getApps()[0] as App;
    return appInstance;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (projectId && clientEmail && privateKey) {
    appInstance = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    return appInstance;
  }

  // Allows using application default credentials in managed runtimes.
  appInstance = initializeApp();
  return appInstance;
}

export function getFirebaseAdminAuth() {
  return getAuth(ensureApp());
}

export function getFirebaseAdminDb() {
  return getFirestore(ensureApp());
}
