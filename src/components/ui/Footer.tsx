import React from "react";
import Link from "next/link";
import { FaGithub, FaYoutube } from "react-icons/fa";

const socials = [
    {
        link: "https://www.youtube.com/@1KIINGDOM?sub_confirmation=1",
        label: "YouTube",
        Icon: FaYoutube
    },
    {
        link: "https://www.github.com/kiing-dom/perpetua",
        label: "GitHub",
        Icon: FaGithub
    }
]

export default function Footer() {
    return (
        <footer className="dark:bg-[#e3e3e3] dark:bg-opacity-50 dark:text-white bg-[#0E0C0C] rounded-lg text-white py-6 mt-8">
            <div className="container mx-auto flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                    {socials.map((social, i) => {
                        const Icon = social.Icon;

                        return (
                            <Link href={social.link} key={i} aria-label={social.label} legacyBehavior>
                                <a target="_blank" rel="noopener noreferrer">
                                    <Icon className="w-8 h-8 hover:scale-110 transition-all"/>
                                </a>
                            </Link>
                        )
                    })}
                </div>
                <p className="text-sm">&copy; Dominion Gbadamosi {new Date().getFullYear()}</p>
            </div>
        </footer>
    )
}