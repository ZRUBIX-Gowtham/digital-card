import "server-only";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";

export type LeadType = "enquiry" | "booking";

export interface Lead {
  id: string;
  cardSlug: string;
  type: LeadType;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  service?: string;
  date?: string;
  time?: string;
  createdAt: string;
  read?: boolean;
}

export async function addLead(
  input: Omit<Lead, "id" | "createdAt" | "read">,
): Promise<Lead> {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const lead: Lead = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    read: false,
  };
  
  try {
    const cleanData = JSON.parse(JSON.stringify(lead));
    await setDoc(doc(db, "cards", input.cardSlug, "leads", id), cleanData);
  } catch (error) {
    console.error("Error adding lead to Firestore:", error);
  }
  return lead;
}

export async function getLeadsForCard(cardSlug: string): Promise<Lead[]> {
  if (!cardSlug) return [];
  try {
    const q = query(collection(db, "cards", cardSlug, "leads"));
    const snap = await getDocs(q);
    const leads = snap.docs.map(d => d.data() as Lead);
    return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

export async function getBookedSlots(cardSlug: string, date: string): Promise<string[]> {
  if (!cardSlug || !date) return [];
  try {
    const q = query(
      collection(db, "cards", cardSlug, "leads"),
      where("type", "==", "booking"),
      where("date", "==", date)
    );
    const snap = await getDocs(q);
    const slots = snap.docs.map(d => d.data() as Lead).filter(l => Boolean(l.time)).map(l => l.time as string);
    return slots;
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }
}

export async function countUnreadLeads(cardSlug: string): Promise<number> {
  if (!cardSlug) return 0;
  try {
    const q = query(
      collection(db, "cards", cardSlug, "leads"),
      where("read", "==", false)
    );
    const snap = await getDocs(q);
    return snap.size;
  } catch (error) {
    console.error("Error counting unread leads:", error);
    return 0;
  }
}

export async function markLeadRead(cardSlug: string, id: string): Promise<void> {
  if (!id || !cardSlug) return;
  try {
    await updateDoc(doc(db, "cards", cardSlug, "leads", id), { read: true });
  } catch (error) {
    console.error("Error marking lead as read:", error);
  }
}

export async function markAllLeadsRead(cardSlug: string): Promise<void> {
  if (!cardSlug) return;
  try {
    const q = query(
      collection(db, "cards", cardSlug, "leads"),
      where("read", "==", false)
    );
    const snap = await getDocs(q);
    const batch = snap.docs.map(d => updateDoc(d.ref, { read: true }));
    await Promise.all(batch);
  } catch (error) {
    console.error("Error marking all leads as read:", error);
  }
}

export async function deleteLead(cardSlug: string, id: string): Promise<void> {
  if (!id || !cardSlug) return;
  try {
    await deleteDoc(doc(db, "cards", cardSlug, "leads", id));
  } catch (error) {
    console.error("Error deleting lead:", error);
  }
}
