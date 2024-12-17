"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { toggleDarkMode } from '../../utils/darkModeToggle';
import Image from "next/image";

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
                    <Image
                        src="/custom/PERPETUA.png"
                        alt="logo"
                        width={150}
                        height={150}
                        className="dark:white-image"
                    />
                    <button
                        onClick={() => {
                            const newTheme = toggleDarkMode();
                            setDarkMode(newTheme);
                        }}
                        className="dark:bg-gray-800 dark:text-white text-black bg-gray-300 rounded px-4 py-2"
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>

                </header>
                {children}
            </body>
        </html>
    );
}
