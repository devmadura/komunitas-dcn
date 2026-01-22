"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Halo! 👋 Saya GENIRA😸 asisten virtual DCN Unira. Ada yang bisa saya bantu tentang komunitas kami?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat-public", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response || "Maaf, saya tidak bisa memproses permintaan Anda saat ini.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-10 right-4 md:bottom-5 md:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-md h-[80vh] max-h-[650px] bg-white border-gray-200 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
                    >
                        {/* Header - Solid Background */}
                        <div className="bg-background p-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-black">DCN UNIRA Assistant</h3>
                                    <p className="text-xs text-green-400 dark:text-green-700">Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-black/90 transition-colors p-1 hover:bg-gray-600/10 rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages - Solid Background */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-800 scrollbar-hide">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center shrink-0">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${message.role === "user"
                                            ? "bg-background text-black shadow-sm"
                                            : "bg-background text-black shadow-sm "
                                            }`}
                                    >
                                        <div className="text-sm whitespace-pre-wrap leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code: ({ node, inline, className, children, ...props }: any) => {
                                                        return inline ? (
                                                            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs" {...props}>
                                                                {children}
                                                            </code>
                                                        ) : (
                                                            <code className="block bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto" {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                    a: ({ node, children, ...props }: any) => (
                                                        <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
                                                            {children}
                                                        </a>
                                                    ),
                                                    ul: ({ node, children, ...props }: any) => (
                                                        <ul className="list-disc list-inside my-1" {...props}>
                                                            {children}
                                                        </ul>
                                                    ),
                                                    ol: ({ node, children, ...props }: any) => (
                                                        <ol className="list-decimal list-inside my-1" {...props}>
                                                            {children}
                                                        </ol>
                                                    ),
                                                    p: ({ node, children, ...props }: any) => (
                                                        <p className="my-1" {...props}>
                                                            {children}
                                                        </p>
                                                    ),
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                        <p className={`text-xs mt-1.5 ${message.role === "user" ? "text-primary" : "text-primary"}`}>
                                            {message.timestamp.toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    {message.role === "user" && (
                                        <div className="w-8 h-8 bg-linear-to-br from-indigo-200 to-indigo-500 rounded-full flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 justify-start">
                                    <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-background rounded-2xl px-4 py-3 shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900 shrink-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ketik Pertanyaan..."
                                    className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    size="icon"
                                    className="rounded-xl h-10 w-10 bg-linear-to-br from-indigo-500 to-indigo-700 cursor-pointer"
                                >
                                    <Send className="w-4 h-4 text-white" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button - Hidden when chat is open */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-white/20 dark:hover:bg-black/30 hover:shadow-primary/30 transition-all cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-primary dark:text-white" />

                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
                            1
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
