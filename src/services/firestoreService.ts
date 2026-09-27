import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

export const subscribeToCollection = <T>(
  collectionName: string, 
  onData: (items: T[]) => void, 
  onError?: (err: any) => void
) => {
  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(colRef, (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
      });
      onData(items);
    }, (error) => {
      // Gracefully handle offline / connection unavailable without throwing
      if (onError) onError(error);
    });
  } catch (err) {
    return () => {};
  }
};

export const saveItemToFirestore = async <T extends { id: string }>(
  collectionName: string, 
  item: T
) => {
  try {
    const docRef = doc(db, collectionName, String(item.id));
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    // Graceful offline fallback
  }
};

export const updateItemInFirestore = async (
  collectionName: string, 
  itemId: string, 
  data: Record<string, any>
) => {
  try {
    const docRef = doc(db, collectionName, String(itemId));
    await updateDoc(docRef, data);
  } catch (err) {
    try {
      const docRef = doc(db, collectionName, String(itemId));
      await setDoc(docRef, data, { merge: true });
    } catch (fallbackErr) {
      // Graceful offline fallback
    }
  }
};

export const deleteItemFromFirestore = async (
  collectionName: string, 
  itemId: string
) => {
  try {
    const docRef = doc(db, collectionName, String(itemId));
    await deleteDoc(docRef);
  } catch (err) {
    // Graceful offline fallback
  }
};

export const seedInitialDataIfEmpty = async (
  collectionName: string, 
  initialData: any[]
) => {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      for (const item of initialData) {
        if (item.id) {
          const docRef = doc(db, collectionName, String(item.id));
          await setDoc(docRef, item);
        }
      }
    }
  } catch (err) {
    // Graceful offline fallback
  }
};
