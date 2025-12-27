import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

type Message = {
    id: string;
    role: 'user' | 'model';
    text: string;
};

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            text: "Hello! 👋 I'm **Ava**, your assistant for the **TrainerMatch/Avalytics** platform. I can help you with questions about our tech stack (**Next.js, NestJS, Firebase**) or assist you in navigating core modules like **Requirements**, **Matches**, **Proposals**, and **Sessions**. How can I help you get started today? 🚀",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const projectContext = `
PROJECT CONTEXT:
Name: TrainerMatch / Avalytics
Description: A platform checking requirements, matches, proposals, and sessions for trainers and colleges.
Tech Stack: Next.js (Frontend), NestJS (Backend), Firebase (Auth/DB).
Core Modules:
- Auth: Users, Login, Firebase.
- Dashboard: Analytics, Graphs.
- Requirements: Job/Training requirements from colleges.
- Matches: Matching trainers to requirements.
- Proposals: Sending proposals to trainers.
- Sessions: Managing training sessions.
- Colleges: Management of institutions.
- Trainers: Management of trainers.
- Documents: Managing files.

Your Goal: Assist the user with questions related to this project. Be helpful, technical yet friendly.
        `;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: projectContext + "\n\nUser Question: " + userMessage.text }],
                            },
                        ],
                        systemInstruction: {
                            parts: [{ text: "You are Ava, a friendly and knowledgeable AI assistant for the TrainerMatch/Avalytics platform. You have access to the project context provided. Use it to answer user queries accurately. Format your responses using Markdown. Use **bold** for key terms, lists for steps, and emojis occasionally to be friendly." }]
                        }
                    }),
                }
            );

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'Gemini API Error');
            }

            const aiResponseText =
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I'm sorry, I couldn't understand that. Could you try again?";

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: aiResponseText,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error: any) {
            console.error('Gemini API Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: `Error: ${error.message || error.toString()}. \n\nPlease check your internet connection and API Key.`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] md:w-[380px] h-[500px] bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col dark:bg-zinc-900/90 dark:border-zinc-800"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between shadow-md">
                            <div className="flex items-center gap-2 text-white">
                                <div className="p-1.5 bg-white/20 rounded-full">
                                    <Sparkles size={18} className="text-yellow-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Ava Assistant</h3>
                                    <p className="text-[10px] text-white/80 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20 scroll-smooth"
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                                                ? 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300'
                                                : 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg'
                                                }`}
                                        >
                                            {msg.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                                        </div>
                                        <div
                                            className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tr-none border border-zinc-200 dark:border-zinc-700'
                                                : 'bg-violet-600 text-white rounded-tl-none shadow-md'
                                                }`}
                                        >
                                            <div className="prose prose-sm prose-invert max-w-none break-words whitespace-pre-wrap">
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 max-w-[80%]">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg flex items-center justify-center shrink-0">
                                            <Bot size={16} />
                                        </div>
                                        <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-zinc-700 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 rounded-full px-4 py-2 border border-transparent focus-within:border-violet-500 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="text-violet-600 disabled:text-gray-400 hover:text-violet-700 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <div className="text-[10px] text-center text-gray-400 mt-2">
                                Powered by Gemini AI • AI can make mistakes.
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-600/40 transition-shadow focus:outline-none"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={28} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle size={28} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default ChatAssistant;
