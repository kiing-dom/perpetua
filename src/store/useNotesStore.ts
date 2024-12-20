import { create } from 'zustand';
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";

type Note = {
    id: string;
    title: string;
    content: string;
};

type NotesStore = {
    notes: Note[];
    uid: string | null;
    setUid: (uid: string) => void;
    fetchNotes: () => Promise<void>;
    addNote: (note: Omit<Note, "id">) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
}

const useNotesStore = create<NotesStore>((set) => ({
    notes: [],
    uid: null,

    setUid: (uid) => set({ uid }),

    fetchNotes: async () => {
        const querySnapshot = await getDocs(collection(db, "notes"));
        const fetchedNotes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Note[];

        set({ notes: fetchedNotes });
    },

    addNote: async (note) => {
        const docRef = await addDoc(collection(db, "notes"), note);
        const newNote: Note = {id: docRef.id, ...note};

        set((state) => ({ notes: [...state.notes, newNote]}));
    },

    deleteNote: async (id) => {
        await deleteDoc(doc(db, "notes", id));
        set((state) => ({
            notes: state.notes.filter((note) => note.id !== id)
        }))
    }
}));

export default useNotesStore;