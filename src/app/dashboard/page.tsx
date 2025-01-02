"use client"

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import Modal from "@/components/ui/modal";
import Login from "@/components/auth/login-form";
import useAuthStore from "../../store/useAuthStore";
import useNotesStore from "../../store/useNotesStore";
import TextEditor from '@/components/notes/editor';

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function Dashboard() {
    const { notes, fetchNotes: rawFetchNotes, addNote, deleteNote, updateNote } = useNotesStore();
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [localTitle, setLocalTitle] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const fetchNotes = useCallback(() => rawFetchNotes(), [rawFetchNotes]);
    const { uid, setUser } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!uid) {
            setIsAuthModalOpen(true);
        } else {
            fetchNotes();
        }
    }, [uid, fetchNotes]);

    useEffect(() => {
        const active = notes.find(note => note.id == activeNoteId);
        if (active) {
            setLocalTitle(active.title);
        }
    }, [activeNoteId, notes]);

    const handleAddNote = async (): Promise<void> => {
        const newNote = await addNote({ 
            title: "", 
            content: "" 
        });
        if (newNote?.id) {
            setActiveNoteId(newNote.id);
        }
    };

    const handleDeleteNote = async (id: string): Promise<void> => {
        await deleteNote(id);
        if (activeNoteId === id) {
            setActiveNoteId(null);
        }
    };

    const handleLogin = (userUid: string, displayName: string | null): void => {
        setUser(userUid, displayName);
        setIsAuthModalOpen(false);
    };

    const filteredNotes = notes.filter((note: Note) => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeNote = notes.find((note: Note) => note.id === activeNoteId);

    const handleUpdateNoteTitle = (title: string): void => {
        setLocalTitle(title);
        if(activeNoteId) {
            updateNote(activeNoteId, { title });
        }
    };

    const handleUpdateNoteContent = (content: string): void => {
        if(activeNoteId) {
            updateNote(activeNoteId, { content});
        }
    };

    return (
        <div className="flex h-screen bg-[#F8F8FF] dark:bg-neutral-900">
            {!uid ? (
                <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} title="Login">
                    <Login onLogin={handleLogin} />
                </Modal>
            ) : (
                <>
                    {/* Sidebar */}
                    <div className="w-64 border-r border-neutral-800 dark:bg-neutral-900 p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-bold text-neutral-600 dark:text-neutral-200">Notes</h1>
                            <button
                                onClick={handleAddNote}
                                className="p-1 hover:bg-neutral-800 rounded"
                            >
                                <Plus className="text-neutral-400" size={20} />
                            </button>
                        </div>
                        
                        <div className="relative mb-4">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-neutral-800 text-neutral-200 pl-8 pr-4 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto hover:text-white">
                            {filteredNotes.map((note: Note) => (
                                <div
                                    key={note.id}
                                    onClick={() => setActiveNoteId(note.id)}
                                    className={`group p-2 rounded-md mb-1 cursor-pointer flex items-center justify-between ${
                                        activeNoteId === note.id ? 'bg-neutral-800 dark:bg-neutral-600' : 'hover:bg-neutral-800'
                                    }`}
                                >
                                    <div className="truncate">
                                        <h3 className={`group-hover:text-white text-sm font-medium truncate ${
                                            activeNoteId === note.id ? 'text-white dark:text-white' : 'text-neutral-500 dark:text-neutral-300'
                                        }`}>
                                            {note.title || "Untitled"}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNote(note.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-700 rounded"
                                    >
                                        <Trash2 className="text-neutral-400" size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-hidden my-16 dark:bg-neutral-900">
                        {activeNote ? (
                            <div className="h-full flex flex-col">
                                <div className="p-4">
                                    <input
                                        type="text"
                                        value={localTitle}
                                        onChange={(e) => handleUpdateNoteTitle(e.target.value)}
                                        placeholder="Untitled"
                                        className="text-2xl font-bold bg-transparent text-neutral-600 dark:text-neutral-200 w-full focus:outline-none"
                                    />
                                </div>
                                <div className="flex-1 overflow-y-auto px-4 pb-4">
                                    <TextEditor
                                        defaultValue={activeNote?.content}
                                        onChange={handleUpdateNoteContent}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-neutral-500">
                                Select a note or create a new one
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}