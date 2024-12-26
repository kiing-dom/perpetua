"use client";

import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

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

    const setUser = useAuthStore((state) => state.setUser);
    const clearUid = useAuthStore((state) => state.clearUid);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user.uid, user.displayName ?? null);
            } else {
                clearUid();
            }
        });

        return () => unsubscribe();
    }, [setUser, clearUid]);

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-custom-grid min-h-screen`}
            >
                {children}
            </body>
        </html>
    );
}
