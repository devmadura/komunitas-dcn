"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log("Service Worker registered:", registration);

                setInterval(() => {
                    registration.update();
                }, 60000);
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });
    }, []);

    return null;
}
