"use client"

import { title } from "process";
import useNotesStore from "../../store/useNotesStore";

export default function Dashboard() {
    const {notes, addNote } = useNotesStore();

    const handleAddNote = () => {
        const newNote = {
            id: `${Date.now()}`,
            title: `Note ${notes.length + 1}`,
            content: `This is a new note!`,
        };
        addNote(newNote);
    }

    return (
        <div className="min-h-screen p-6 my-6">
            <h1 className="text-2xl font-bold mb-4 dark:text-white text-neutral-600">My Notes</h1>
            <button
                onClick={handleAddNote}
                className=""
            >
                Add Note
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className=""
                    >
                        <h2 className="text-lg font-bold">{note.title}</h2>
                        <p className="text-md">{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}