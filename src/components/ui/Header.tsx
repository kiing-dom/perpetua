"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegSun, FaRegMoon } from "react-icons/fa";
import { toggleDarkMode } from "../../../utils/darkModeToggle";
import Modal from "@/components/ui/modal";
import Login from "@/components/auth/login-form";
import Register from "@/components/auth/registration-form";
import useAuthStore from "../../store/useAuthStore";

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(true);
    const { uid, displayName, setUser, signOut } = useAuthStore();

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);

    const handleSignOut = () => {
        try {
            signOut();
            alert("You have signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error);
            alert("There was an error signing out. Please try again.");
        }
    };

    const handleLogin = (uid: string, displayName: string | null) => {
        setUser(uid, displayName);
        setIsAuthModalOpen(false);
    };

    const handleRegister = () => {
        setIsRegistered(true);
        setIsAuthModalOpen(false);
    };

    return (
        <nav className="bg-[#0E0C0C] dark:bg-neutral-700 bg-opacity-20 shadow-md fixed top-4 left-1/2 transform -translate-x-1/2 w-auto z-50 rounded-full px-4 py-2 md:px-6 md:py-2">
            <div className="flex justify-between items-center">
                <Link href="/" passHref legacyBehavior>
                    <a className="legacyBehavior pr-4">
                        <img src="/custom/PERPETUA.png" alt="perpetua" className="dark:white-image w-[124px]" />
                    </a>
                </Link>
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/dashboard" passHref legacyBehavior>
                        <a className="text-neutral-700 font-bold dark:text-white hover:text-gray-300 dark:hover:text-gray-300">
                            Dashboard
                        </a>
                    </Link>
                    {uid ? (
                        <>
                            <span className="text-blue-600 font-bold dark:text-green-500">
                                Welcome, {displayName}
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="dark:bg-red-600 dark:text-white text-black bg-red-300 rounded px-4 py-2 shadow-md"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="dark:bg-gray-600 dark:text-white text-black bg-gray-300 rounded px-4 py-2 shadow-md"
                        >
                            Login/Register
                        </button>
                    )}
                    <button
                        onClick={() => {
                            const newTheme = toggleDarkMode();
                            setDarkMode(newTheme);
                        }}
                        className="dark:bg-gray-600 dark:text-white text-black bg-gray-300 rounded px-4 py-2 shadow-md"
                    >
                        {darkMode ? <FaRegSun /> : <FaRegMoon />}
                    </button>
                </div>
            </div>
            <Modal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                title={isRegistered ? "Login" : "Register"}
            >
                {isRegistered ? (
                    <Login onLogin={handleLogin} />
                ) : (
                    <Register onRegister={handleRegister} />
                )}
                <button
                    onClick={() => setIsRegistered(!isRegistered)}
                    className="mt-4 w-full px-4 py-2 dark:bg-transparent bg-transparent dark:text-white text-black rounded hover:text-gray-500"
                >
                    {isRegistered ? "Don't Have an Account? Register" : "Already Have an Account? Login"}
                </button>
            </Modal>
        </nav>
    );
}
