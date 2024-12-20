"use client"

import useNotesStore from "../../store/useNotesStore";
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const {notes, fetchNotes, addNote, deleteNote } = useNotesStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleAddNote = async () => {
        if(!title || !content) {
            alert("Please provide both a title and content for the note");
            return;
        }

        await addNote({ title, content });

        setTitle('');
        setContent('');
    };

    const handleDeleteNote = async (id: string) => {
        await deleteNote(id);
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