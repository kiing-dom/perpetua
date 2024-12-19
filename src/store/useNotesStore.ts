import { create } from 'zustand';

type Note = {
    id: string;
    title: string;
    content: string;
};

type NotesStore = {
    notes: Note[];
    addNote: (note: Note) => void;
    deleteNote: (id: string) => void;
}

const useNotesStore = create<NotesStore>((set) => ({
    notes: [],
    addNote: (note) =>
        set((state) => ({ notes: [...state.notes, note]})),
    deleteNote: (id) => 
        set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
        })),
}));

export default useNotesStore;