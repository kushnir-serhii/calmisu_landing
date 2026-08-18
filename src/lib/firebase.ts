import { initializeApp } from "firebase/app";
import { isSupported, getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Same Firebase project (com-calmisu-app) as the Calmisu mobile app, so web
// and app events land in one Analytics dashboard.
export async function initAnalytics() {
  if (!(await isSupported())) return;
  const app = initializeApp(firebaseConfig);
  return getAnalytics(app);
}
