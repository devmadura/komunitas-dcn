"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function OfflinePage() {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined') return;

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        setIsOnline(navigator.onLine);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const handleReload = () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
            <div className="text-center max-w-md">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-400/20 blur-3xl rounded-full"></div>
                        <div className="relative bg-white dark:bg-gray-800 p-6 rounded-full shadow-xl">
                            <WifiOff className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Tidak Ada Koneksi Internet
                </h1>

                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Sepertinya kamu sedang offline. Periksa koneksi internet kamu dan coba lagi.
                </p>

                {isOnline && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-green-700 dark:text-green-300 font-medium">
                            ✓ Koneksi kembali! Klik tombol di bawah untuk reload.
                        </p>
                    </div>
                )}

                <button
                    onClick={handleReload}
                    className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <RefreshCw className="w-5 h-5" />
                    <span>Coba Lagi</span>
                </button>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        DCN UNIRA - Dicoding Community Network Universitas Madura
                    </p>
                </div>
            </div>
        </div>
    );
}
