"use client"

import Link from "next/link";
import { toggleDarkMode } from "../../../utils/darkModeToggle";
import { useEffect, useState } from "react";
import { FaRegSun, FaRegMoon } from "react-icons/fa";


export default function Navbar() {

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);

    return (
        <nav className="bg-[#0E0C0C] bg-opacity-20 text-neutral-200 shadow-md fixed top-4 left-1/2 transform -translate-x-1/2 w-auto z-50 rounded-full px-4 py-2 md:px-6 md:py-2">
            <div className="flex justify-between items-center">
                <Link
                    href="/"
                    passHref
                    legacyBehavior
                >
                    <a className="legacyBehavior pr-4">
                        <img src="/custom/PERPETUA.png" alt="perpetua" className="dark:white-image w-[200px]"/>
                    </a>
                </Link>

                <div className="hidden md:flex items-center gap-4">
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
        </nav>
    )
}