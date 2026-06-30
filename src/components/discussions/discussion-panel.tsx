"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  User,
  Clock,
  Trophy,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/relative-time";
import { filterProfanity } from "@/lib/profanity";
import type { Discussion } from "@/types/discussion";

const DUPLICATE_KEY = "legends-discussion-last";

export function DiscussionPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const listEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const fetchDiscussions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discussions");
      const data = await res.json();
      if (res.ok) {
        setDiscussions(data.discussions);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchDiscussions();
    }
  }, [isOpen, fetchDiscussions]);

  useEffect(() => {
    if (!loading && discussions.length > 0) {
      listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading, discussions.length]);

  const handlePost = async () => {
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) return;

    const lastSubmission = localStorage.getItem(DUPLICATE_KEY);
    if (lastSubmission) {
      const elapsed = Date.now() - Number(lastSubmission);
      if (elapsed < 30000) {
        showToast("Please wait 30 seconds before posting again");
        return;
      }
    }

    setPosting(true);
    try {
      const filteredMessage = filterProfanity(trimmedMessage);
      const filteredName = filterProfanity(trimmedName);

      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: filteredName,
          message: filteredMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post");
      }

      localStorage.setItem(DUPLICATE_KEY, String(Date.now()));
      setName("");
      setMessage("");
      showToast("Discussion posted successfully!");
      await fetchDiscussions();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const charsLeft = 500 - message.length;

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full",
          "bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl shadow-emerald-500/30",
          "hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300",
          isOpen && "scale-0"
        )}
        aria-label="Open Football Discussion"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 z-50 h-full w-full sm:w-[420px]",
              "bg-[var(--bg-primary)] border-l border-[var(--border-color)]",
              "shadow-2xl flex flex-col"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <MessageSquare className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Discussion
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {discussions.length > 0
                      ? `${discussions.length} message${discussions.length !== 1 ? "s" : ""}`
                      : "Be the first to discuss"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Close discussion"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {loading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && discussions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 mb-4">
                    <Trophy className="h-6 w-6 text-emerald-400" />
                  </div>
                  <p className="text-[var(--text-primary)] font-semibold mb-1">
                    No discussions yet
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] max-w-[220px]">
                    Share your thoughts about the legends ranking!
                  </p>
                </div>
              )}

              {!loading &&
                discussions.map((d, i) => (
                  <div key={d.id}>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-semibold text-[var(--text-primary)]">
                            {d.name}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                            <Clock className="h-3 w-3" />
                            {relativeTime(d.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap break-words">
                          {d.message}
                        </p>
                      </div>
                    </div>
                    {i < discussions.length - 1 && (
                      <div className="mt-4 border-t border-[var(--border-color)]" />
                    )}
                  </div>
                ))}

              <div ref={listEndRef} />
            </div>

            {/* Form */}
            <div className="border-t border-[var(--border-color)] p-5 shrink-0 bg-[var(--bg-surface)]/50">
              <div className="space-y-3">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={50}
                  disabled={posting}
                />
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts..."
                    maxLength={500}
                    rows={3}
                    disabled={posting}
                    className={cn(
                      "flex w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all",
                      "disabled:opacity-50"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-2 right-2 text-[11px]",
                      charsLeft < 50
                        ? "text-red-400"
                        : "text-[var(--text-muted)]"
                    )}
                  >
                    {charsLeft}
                  </span>
                </div>
                <Button
                  onClick={handlePost}
                  disabled={!name.trim() || !message.trim() || posting}
                  className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                >
                  {posting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
