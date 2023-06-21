import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ProfileType } from "../types/ProfileTypes";

export async function getProfilesForSessionFromFirebase(sessionId: string): Promise<ProfileType[]> {
  const sessionRef = doc(db, 'sessions', sessionId);
  const firestoreQuery = query(collection(db, 'profiles'), where('session', '==', sessionRef));

  const querySnapshot = await getDocs(firestoreQuery)
  return querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as ProfileType
  })
}
