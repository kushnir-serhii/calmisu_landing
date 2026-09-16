import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Held so track() in lib/analytics.ts can log events after consent is granted.
// Null until the user accepts the cookie banner — by design.
let analytics: Analytics | null = null;

// Same Firebase project (com-calmisu-app) as the Calmisu mobile app, so web
// and app events land in one Analytics dashboard.
//
// The SDK is imported dynamically so its ~70 KB only downloads and evaluates
// after consent — not on every page load, where it cost a long main-thread task.
export async function initAnalytics() {
  if (analytics) return analytics;
  const [{ initializeApp }, { isSupported, getAnalytics }] = await Promise.all([
    import("firebase/app"),
    import("firebase/analytics"),
  ]);
  if (!(await isSupported())) return null;
  const app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  return analytics;
}

export function getAnalyticsInstance(): Analytics | null {
  return analytics;
}
