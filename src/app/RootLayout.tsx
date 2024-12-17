"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { toggleDarkMode } from '../../utils/darkModeToggle';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);


    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-custom-grid min-h-screen`}
            >
                <header
                    className="flex justify-between items-center p-4 bg-opacity-50"
                >
                    <h1 className="text-lg font-bold text-black">Perpetua</h1>
                    <button
                        onClick={toggleDarkMode}
                        className={`px-4 py-2 rounded dark:bg-gray-300 ${darkMode ? "text-[#F8F8FF]" : "text-black"
                            } bg-gray-800`}
                    >
                        {darkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode'}
                    </button>

                </header>
                {children}
            </body>
        </html>
    );
}
