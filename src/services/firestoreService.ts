import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  setLogLevel 
} from 'firebase/firestore';
import { db } from '../firebase';

// Enable debug logging for Firestore if needed
// setLogLevel('debug');

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
      console.warn(`Firestore sync warning for ${collectionName}:`, error);
      if (onError) onError(error);
    });
  } catch (err) {
    console.warn(`Failed to subscribe to ${collectionName}:`, err);
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
    console.error(`Failed to save item to ${collectionName}:`, err);
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
    console.error(`Failed to update item in ${collectionName}:`, err);
    // Try setDoc with merge as fallback if doc doesn't exist
    try {
      const docRef = doc(db, collectionName, String(itemId));
      await setDoc(docRef, data, { merge: true });
    } catch (fallbackErr) {
      console.error(`Fallback setDoc failed:`, fallbackErr);
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
    console.error(`Failed to delete item from ${collectionName}:`, err);
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
    console.warn(`Seed initial data warning for ${collectionName}:`, err);
  }
};
