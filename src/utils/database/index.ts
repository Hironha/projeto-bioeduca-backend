import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from './bioeduca-backend-teste.secret.json';

import type { ServiceAccount } from 'firebase-admin';

const app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as ServiceAccount),
	databaseURL: 'https://bioeduca-backend-teste.firebaseio.com',
	serviceAccountId: (serviceAccount as ServiceAccount).clientEmail,
	storageBucket: 'bioeduca-backend-teste.appspot.com',
});

const db = getFirestore(app);

db.settings({ ignoreUndefinedProperties: true });

const storage = getStorage(app);

const auth = getAuth(app);

export { db, storage, auth };
