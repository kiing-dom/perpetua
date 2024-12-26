"use client";

import { useState, useEffect, useCallback } from "react";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import Modal from "@/components/ui/modal";
import Login from "@/components/auth/login-form";
import useAuthStore from "../../store/useAuthStore";
import useNotesStore from "../../store/useNotesStore";
import TextEditor from '@/components/notes/editor';

export default function Dashboard() {
    const { notes, fetchNotes: rawFetchNotes, addNote, deleteNote } = useNotesStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const fetchNotes = useCallback(() => {
        rawFetchNotes();
    }, [rawFetchNotes]);

    const { uid, setUser } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!uid) {
            setIsAuthModalOpen(true);
        } else {
            fetchNotes();
        }
    }, [uid, fetchNotes]);

    const handleAddNote = async () => {
        if (!title || !content) {
            alert("Please provide both a title and content for the note");
            return;
        }
        await addNote({ title, content });
        setTitle("");
        setContent("");
    };

    const handleDeleteNote = async (id: string) => {
        await deleteNote(id);
    };

    const handleLogin = (userUid: string, displayName: string | null) => {
        setUser(userUid, displayName);
        setIsAuthModalOpen(false);
    };

    return (
        <div className="min-h-screen p-6 my-6">
            {!uid ? (
                <Modal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    title="Login"
                >
                    <Login onLogin={handleLogin} />
                </Modal>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4 dark:text-white text-neutral-600">
                        My Notes
                    </h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Note Title..."
                            className="block w-full p-2 mb-2 dark:bg-neutral-700 bg-neutral-200 dark:text-white text-black rounded shadow"
                        />
                        <TextEditor
            
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <button
                            onClick={handleAddNote}
                            className="flex items-center gap-1 dark:bg-gray-500 bg-neutral-200 dark:text-white text-black font-bold rounded shadow px-2 py-2 mb-4"
                        >
                            Add Note <IoIosAddCircle size={32} />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="dark:bg-neutral-500 bg-neutral-200 bg-opacity-80 rounded shadow px-2 py-2"
                                >
                                    <h2 className="dark:text-white text-black text-lg font-bold">
                                        {note.title}
                                    </h2>
                                    <p className="dark:text-white text-black text-md">
                                        {note.content}
                                    </p>
                                    <button
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="flex items-center gap-2 mt-2 dark:bg-red-500 bg-red-300 text-white font-bold rounded shadow px-2 py-1"
                                    >
                                        Delete <IoIosRemoveCircle />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
