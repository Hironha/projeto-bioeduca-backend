import * as dotenv from "dotenv";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./bioeduca-backend-teste.secret.json";

import type { ServiceAccount } from "firebase-admin";

dotenv.config();
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: process.env.DATABASE_URL,
  serviceAccountId: (serviceAccount as ServiceAccount).clientEmail,
  storageBucket: process.env.STORAGE_BUCKET,
});

const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true });

const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
