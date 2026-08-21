import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserPreferences, SurveySession } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific databaseId if provided
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Anonymous Auth helper
export async function ensureAnonymousAuth(): Promise<FirebaseUser> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  const credential = await signInAnonymously(auth);
  return credential.user;
}

// -------------------------------------------------------------
// FIRESTORE SERVICES: User Preferences & Passport
// -------------------------------------------------------------

export async function saveUserPreferencesToCloud(
  userId: string,
  preferences: UserPreferences
): Promise<void> {
  try {
    const docRef = doc(db, 'userProfiles', userId);
    await setDoc(
      docRef,
      {
        ...preferences,
        userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Could not sync user preferences to Firebase Firestore:', error);
  }
}

export async function loadUserPreferencesFromCloud(
  userId: string
): Promise<UserPreferences | null> {
  try {
    const docRef = doc(db, 'userProfiles', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserPreferences;
    }
  } catch (error) {
    console.warn('Could not fetch user preferences from Firestore:', error);
  }
  return null;
}

export async function deleteUserProfileFromCloud(userId: string): Promise<void> {
  try {
    const docRef = doc(db, 'userProfiles', userId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Could not delete user profile from Firestore:', error);
  }
}

// -------------------------------------------------------------
// FIRESTORE SERVICES: Survey Sessions & History
// -------------------------------------------------------------

export async function saveSurveySessionToCloud(
  session: SurveySession,
  userId: string
): Promise<void> {
  try {
    const docRef = doc(db, 'surveySessions', session.id);
    await setDoc(
      docRef,
      {
        ...session,
        userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Could not save survey session to Firestore:', error);
  }
}

export async function loadUserSurveySessionsFromCloud(
  userId: string
): Promise<SurveySession[]> {
  try {
    const q = query(
      collection(db, 'surveySessions'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const sessions: SurveySession[] = [];
    snap.forEach((d) => {
      sessions.push(d.data() as SurveySession);
    });
    // Sort by createdAt desc
    sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sessions;
  } catch (error) {
    console.warn('Could not load survey sessions from Firestore:', error);
    return [];
  }
}

export async function deleteSurveySessionFromCloud(sessionId: string): Promise<void> {
  try {
    const docRef = doc(db, 'surveySessions', sessionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Could not delete session from Firestore:', error);
  }
}

// -------------------------------------------------------------
// FULL LOGOUT & DATA WIPE (CLOUD + AUTH RESET)
// -------------------------------------------------------------

export async function wipeAllUserDataAndSignOut(userId: string): Promise<FirebaseUser> {
  try {
    // 1. Delete user profile doc in Firestore
    const profileRef = doc(db, 'userProfiles', userId);
    await deleteDoc(profileRef);

    // 2. Query and delete all user survey sessions in Firestore
    const q = query(
      collection(db, 'surveySessions'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    // 3. Sign out
    await signOut(auth);
  } catch (error) {
    console.warn('Error wiping user data in Firebase:', error);
  }

  // 4. Create fresh new anonymous user session
  const newCredential = await signInAnonymously(auth);
  return newCredential.user;
}
