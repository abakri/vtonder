import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { CreateSession, SessionType, ToggleSession } from "../types/SessionTypes";

export async function getSessionListFromFirestore(): Promise<SessionType[]> {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('No user logged in');

  const userRef = doc(db, 'users', userId);
  const firestoreQuery = query(collection(db, 'sessions'), where('user', '==', userRef));

  const querySnapshot = await getDocs(firestoreQuery)
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as SessionType
  })
}

export async function createSessionInFirestore(data: CreateSession): Promise<SessionType> {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('No user logged in');

  const userRef = doc(db, 'users', userId);

  const docData = {
    ...data,
    // defaults
    open: false,
    user: userRef,
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'sessions'), docData);
  return { id: docRef.id, ...docData };
}

export async function toggleSessionInFirestore(data: ToggleSession): Promise<void> {
  const sessionRef = doc(db, 'sessions', data.id);
  await updateDoc(sessionRef, { open: data.newOpenState });
}

