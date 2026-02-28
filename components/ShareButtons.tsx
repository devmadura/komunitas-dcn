"use client";

import { useState } from "react";
import { Copy, Check, Twitter, Facebook, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
    url: string;
    title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const fullUrl = typeof window !== "undefined" && !url.startsWith("http")
        ? `${window.location.origin}${url}`
        : url;

    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%0A${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground mr-2">Bagikan:</span>

            <Button
                variant="outline"
                size="icon"
                className="rounded-full w-9 h-9 cursor-pointer"
                onClick={copyToClipboard}
                title="Salin Tautan"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </Button>

            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full w-9 h-9 cursor-pointer hover:text-green-500 hover:border-green-500" title="Share via WhatsApp">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                    </svg>
                </Button>
            </a>

            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full w-9 h-9 cursor-pointer hover:text-blue-400 hover:border-blue-400" title="Share via Twitter">
                    <Twitter className="w-4 h-4" />
                </Button>
            </a>

            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full w-9 h-9 cursor-pointer hover:text-blue-600 hover:border-blue-600" title="Share via Facebook">
                    <Facebook className="w-4 h-4" />
                </Button>
            </a>

            <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full w-9 h-9 cursor-pointer hover:text-blue-500 hover:border-blue-500" title="Share via Telegram">
                    <Send className="w-4 h-4" />
                </Button>
            </a>
        </div>
    );
}
