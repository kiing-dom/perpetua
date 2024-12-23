"use client"

import useNotesStore from "../../store/useNotesStore";
import { useState, useEffect } from 'react';
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import Modal from "@/components/ui/modal"
import Login from "@/components/auth/login-form";
import Register from "@/components/auth/registration-form";

export default function Dashboard() {
    const { notes, fetchNotes, addNote, deleteNote, setUid } = useNotesStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
    const [isRegistered, setIsRegistered] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if(isAuthenticated) {
            fetchNotes();
        }
    }, [fetchNotes, isAuthenticated]);

    const handleAddNote = async () => {
        if (!title || !content) {
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

    const handleLogin = async (uid: string) => {
        setUid(uid);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
    }

    const handleCloseModal = () => {
        if(!isAuthenticated) {
            setIsAuthModalOpen(true);
            alert('You need to either log in or register first');
        }
    }

    return (
        <div className="min-h-screen p-6 my-6">

            <Modal
                isOpen={isAuthModalOpen}
                onClose={handleCloseModal}
                title={isRegistered ? "Login" : "Register"}
                aria-labelledby="auth-modal-title"
                aria-describedby="auth-modal-description"
            >
                
                    {isRegistered ? (
                        <Login onLogin={handleLogin} />
                    ) : (
                        <Register />
                    )
                    }

                    <button
                        onClick={() => setIsRegistered(!isRegistered)}
                        className="mt-4 w-full px-4 py-2 dark:bg-transparent bg-transparent dark:text-white text-black rounded hover:text-gray-500"
                    >
                        {isRegistered ? "Switch to Register" : "Switch to Login"}
                    </button>

            </Modal>


            <h1 className="text-2xl font-bold mb-4 dark:text-white text-neutral-600">My Notes</h1>

            {/* Input Fields */}
            <div className="mb-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Note Title..."
                    className="block w-full p-2 mb-2 dark:bg-neutral-700 bg-neutral-200 dark:text-white text-black rounded shadow"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter Note Content..."
                    className="block w-full p-2 dark:bg-neutral-700 bg-neutral-200 dark:text-white text-black rounded"
                />
            </div>

            <div className="flex flex-col items-center">
                <button
                    onClick={handleAddNote}
                    className="flex items-center gap-1 dark:bg-gray-500 bg-neutral-200 dark:text-white text-black font-bold rounded shadow px-2 py-2 mb-4"
                >
                    Add Note <IoIosAddCircle size={32} />
                </button>

                {/* Listing Created Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="dark:bg-neutral-500 bg-neutral-200 bg-opacity-80 rounded shadow px-2 py-2"
                        >
                            <h2 className="dark:text-white text-black text-lg font-bold">{note.title}</h2>
                            <p className="dark:text-white text-black text-md">{note.content}</p>
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
        </div>
    )
}