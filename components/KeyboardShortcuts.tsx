"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcuts() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleKeyPress = (e: KeyboardEvent) => {
            const isModifier = e.ctrlKey || e.metaKey;

            if (!isModifier) return;

            const shortcuts: Record<string, string> = {
                'd': '/login',
                'h': '/',
            };

            const path = shortcuts[e.key.toLowerCase()];

            if (path) {
                e.preventDefault();
                router.push(path);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [router]);

    return null;
}
