import { create } from 'zustand';
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import useAuthStore from './useAuthStore';

type Note = {
    id: string;
    title: string;
    content: string;
};

type NotesStore = {
    notes: Note[];
    fetchNotes: () => Promise<void>;
    addNote: (note: Omit<Note, "id">) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
}

const useNotesStore = create<NotesStore>((set, get) => ({
    notes: [],
    

    fetchNotes: async () => {
        const { uid } = useAuthStore.getState();
        if (!uid) return;
        
        const notesCollection = collection(db, "users", uid, "notes")
        const querySnapshot = await getDocs(notesCollection);
        const fetchedNotes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Note[];

        set({ notes: fetchedNotes });
    },

    addNote: async (note) => {
        const { uid } = useAuthStore.getState();
        if (!uid) return;
        
        const notesCollection = collection(db, "users", uid, "notes");
        const docRef = await addDoc(notesCollection, note);
        const newNote: Note = {id: docRef.id, ...note};

        set((state) => ({ notes: [...state.notes, newNote]}));
    },

    deleteNote: async (id) => {
        const { uid } = useAuthStore.getState();
        if (!uid) return;

        const noteDoc = doc(db, "users", uid, "notes", id);
        await deleteDoc(doc(noteDoc, id));
        set((state) => ({
            notes: state.notes.filter((note) => note.id !== id)
        }))
    }
}));

export default useNotesStore;