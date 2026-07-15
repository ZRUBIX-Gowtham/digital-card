import "server-only";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, getDocs, updateDoc, increment } from "firebase/firestore";
import type { CardData } from "@/types/card";

export async function getCardFromStore(slug: string): Promise<CardData | undefined> {
  if (!slug) return undefined;
  try {
    const docRef = doc(db, "cards", slug);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CardData;
    }
  } catch (error) {
    console.error("Error getting card from Firestore:", error);
  }
  return undefined;
}

export async function getAllCardSlugsFromStore(): Promise<string[]> {
  try {
    const snap = await getDocs(collection(db, "cards"));
    return snap.docs.map(d => d.id);
  } catch (error) {
    console.error("Error getting all slugs from Firestore:", error);
    return [];
  }
}

export async function saveCardToStore(card: CardData): Promise<void> {
  if (!card.slug) return;
  try {
    // Firestore SDK throws an error if we pass `undefined` values.
    // JSON.parse(JSON.stringify()) cleanly removes all undefined properties.
    const cleanData = JSON.parse(JSON.stringify(card));
    const docRef = doc(db, "cards", card.slug);
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error("Error saving card to Firestore:", error);
  }
}

export async function incrementCardViews(slug: string): Promise<number | undefined> {
  if (!slug) return undefined;
  try {
    const docRef = doc(db, "cards", slug);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return undefined;

    await updateDoc(docRef, {
      views: increment(1)
    });
    
    return (snap.data().views || 0) + 1;
  } catch (error) {
    console.error("Error incrementing views:", error);
    return undefined;
  }
}
