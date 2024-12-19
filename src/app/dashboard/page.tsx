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
                className="dark:bg-gray-500 bg-neutral-200 dark:text-white text-black font-bold rounded shadow px-2 py-2 mb-4"
            >
                Add Note
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className="dark:bg-neutral-500 bg-neutral-200 bg-opacity-80 rounded px-2 py-2"
                    >
                        <h2 className="dark:text-white text-black text-lg font-bold">{note.title}</h2>
                        <p className="dark:text-white text-black text-md">{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}