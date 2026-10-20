import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || 'ai-studio-kbacademydigital-b1b2c556-88fa-476b-8015-d75d218525e2');
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
// Request Gmail send scope
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');

export const getAccessToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};
