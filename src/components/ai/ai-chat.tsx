"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Bot,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/player";

const SUGGESTED_QUESTIONS = [
  "Why is Messi ranked first?",
  "Compare Messi and Cristiano Ronaldo.",
  "Who is the greatest defender of all time?",
  "Who has won the most Ballon d'Or awards?",
  "Explain this ranking.",
  "What does World Cup Third Place mean?",
  "Who has won the most Champions League titles?",
  "Which player has the highest score?",
  "Explain Franz Beckenbauer's legacy.",
  "Compare Maldini and Sergio Ramos.",
];

function createMessage(role: "user" | "assistant", content: string): ChatMessage {
  return { role, content, timestamp: Date.now() };
}

const INITIAL_MESSAGE = createMessage(
  "assistant",
  "Hello! I'm your football expert assistant. Ask me anything about football legends, rankings, tournaments, and more!"
);

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  // Keep ref in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const currentMessages = messagesRef.current;
    const userMessage = createMessage("user", content.trim());

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setShowSuggestions(false);

    const conversationHistory = [
      ...currentMessages,
      userMessage,
    ].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => [
        ...prev,
        createMessage("assistant", data.response),
      ]);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to get response";
      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          `I apologize, but I'm having trouble connecting right now. ${errorMsg}`
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setShowSuggestions(true);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full",
          "bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-xl shadow-[#FFD700]/30",
          "hover:shadow-2xl hover:shadow-[#FFD700]/40 transition-all duration-300",
          isOpen && "scale-0"
        )}
        aria-label="Open AI Football Assistant"
      >
        <MessageCircle className="h-6 w-6 text-[#111111]" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 left-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] rounded-2xl border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]">
                  <Bot className="h-4 w-4 text-[#111111]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Football AI
                  </h3>
                  <p className="text-[10px] text-white/40">
                    Football Expert Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearConversation}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  aria-label="Clear conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 mb-4"
                >
                  <p className="text-xs text-white/40 text-center mb-2">
                    Suggested questions
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {SUGGESTED_QUESTIONS.slice(0, 6).map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-xs px-2.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i + msg.timestamp}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center mt-1">
                      <Bot className="h-3.5 w-3.5 text-[#111111]" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5",
                      msg.role === "user"
                        ? "bg-[#FFD700] text-[#111111] rounded-tr-sm"
                        : "bg-white/10 text-white rounded-tl-sm"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] mt-1",
                        msg.role === "user"
                          ? "text-[#111111]/50"
                          : "text-white/30"
                      )}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>

                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center mt-1">
                      <User className="h-3.5 w-3.5 text-white/60" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-[#111111]" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-white/10 bg-white/5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about football..."
                  className="flex-1 bg-white/5 border-white/10 text-sm"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || loading}
                  className="bg-[#FFD700] text-[#111111] hover:bg-[#FFD700]/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
