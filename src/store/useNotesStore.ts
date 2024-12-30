import { create } from "zustand";
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import useAuthStore from "./useAuthStore";

type Note = {
    id: string;
    title: string;
    content: string;
};

type NotesStore = {
    notes: Note[];
    fetchNotes: () => Promise<void>;
    addNote: (note: Omit<Note, "id">) => Promise<Note | void>;
    deleteNote: (id: string) => Promise<void>;
    updateNote: (id: string, updates: Partial<Omit<Note, "id">>) => Promise<void>;
};

const useNotesStore = create<NotesStore>((set, get) => ({
    notes: [],

    fetchNotes: async () => {
        const { uid } = useAuthStore.getState();
        if (!uid) return;

        const notesCollection = collection(db, "users", uid, "notes");
        const querySnapshot = await getDocs(notesCollection);
        const fetchedNotes: Note[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Ensure type validation here
            if (typeof data.title === "string" && typeof data.content === "string") {
                return {
                    id: doc.id,
                    title: data.title,
                    content: data.content,
                };
            }
            console.warn("Invalid note data:", data);
            return null; 
        }).filter(Boolean) as Note[];

        set({ notes: fetchedNotes });
    },

    addNote: async (note) => {
        const { uid } = useAuthStore.getState();
        if (!uid) return;

        const notesCollection = collection(db, "users", uid, "notes");
        const docRef = await addDoc(notesCollection, note);
        const newNote: Note = { id: docRef.id, ...note };

        set((state) => ({ notes: [...state.notes, newNote] }));
        return newNote;
    },

    deleteNote: async (id) => {
        const { uid } = useAuthStore.getState();
        if (!uid) return;

        const noteDoc = doc(db, "users", uid, "notes", id);
        await deleteDoc(noteDoc);
        set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
        }));
    },

    updateNote: async (id, updates) => {
        const { uid } = useAuthStore.getState();
        if(!uid) return;

        const noteDoc = doc(db, "users", uid, "notes", id);
        await updateDoc(noteDoc, updates);

        set((state) => ({
            notes: state.notes.map((note) => 
                note.id === id ? { ...note, ...updates} : note
            ),
        }))
    },
}));

export default useNotesStore;
