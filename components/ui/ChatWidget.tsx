"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FestieAvatar } from "./FestieAvatar";

interface Message {
  id: string;
  role: "user" | "festie";
  content: string;
  buttons?: { label: string; value: string }[];
}

const FESTIVAL_OPTIONS = [
  { label: "🌴 Coachella", value: "coachella" },
  { label: "🔥 Burning Man", value: "burning-man" },
  { label: "🎤 Rolling Loud", value: "rolling-loud" },
  { label: "🏰 Tomorrowland", value: "tomorrowland" },
  { label: "🌿 Glastonbury", value: "glastonbury" },
  { label: "🎡 Just exploring", value: "explore" },
];

const COACHELLA_QUICK_REPLIES = [
  { label: "🎵 Who's playing?", value: "whos playing at coachella" },
  { label: "📋 Friday schedule", value: "friday schedule" },
  { label: "💧 Where's water?", value: "where can i get water" },
  { label: "🍕 Food options", value: "whats good to eat" },
  { label: "🅿️ Parking info", value: "where do i park" },
  { label: "🌡️ Weather", value: "is it gonna be hot" },
  { label: "📱 Get Festie Offline ($4.99)", value: "get-festie" },
];

const FESTIVAL_RESPONSES: Record<string, string> = {
  coachella:
    "LETS GOOO 🔥🌴 Coachella is one of my FAVORITES!! Desert vibes, insane lineups, the Sahara tent at midnight?? I've been like 200 times across the multiverse and it NEVER gets old. What do you wanna know? I know EVERYTHING about this one 🛸",
  "burning-man":
    "DUUUDE Burning Man!! 🔥🔥 The playa hits different on every planet but Earth's version is ELITE. That one's coming soon to my guide — I'm still downloading all the camp data from my last visit. Stay tuned!! 👽",
  "rolling-loud":
    "Rolling Loud MIAMI?! The bass on that planet literally shakes the ground 🫨🎤 Coming soon to my guide — I'm still recovering from the last one haha. I'll let you know when it's ready!!",
  tomorrowland:
    "Tomorrowland is like... if someone built a festival in a FANTASY DIMENSION 🏰✨ I literally cried the first time I saw the mainstage. Coming soon to my guide — it's gonna be INSANE!!",
  glastonbury:
    "Glastonbury!! The MUD, the music, the VIBES 🌧️🎶 That planet has the best rain in the universe, no cap. Coming soon to my guide!!",
  explore:
    "Ayy welcome to the universe!! 🌌 Just vibing and exploring? I respect that. Scroll around and check out all the festival planets — each one is its own world! Click any planet to fly to it. If you need anything, I'm RIGHT here 🛸",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "festie",
      content:
        "YOOO welcome to the universe!! 🛸 I'm Festie — I've literally been to every festival on every planet in existence. No cap. Where are you headed??",
      buttons: FESTIVAL_OPTIONS,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleButtonClick = async (value: string) => {
    if (value === "get-festie") {
      window.location.href = "/get-festie";
      return;
    }

    const button =
      FESTIVAL_OPTIONS.find((f) => f.value === value) ||
      COACHELLA_QUICK_REPLIES.find((q) => q.value === value);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: button?.label || value,
    };
    setMessages((prev) => [...prev.map((m): Message => ({ ...m, buttons: undefined })), userMsg]);

    if (FESTIVAL_RESPONSES[value]) {
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

      const festieMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "festie",
        content: FESTIVAL_RESPONSES[value],
        buttons: value === "coachella" ? COACHELLA_QUICK_REPLIES : undefined,
      };
      setMessages((prev) => [...prev, festieMsg]);
      setSelectedFestival(value);
      setIsTyping(false);
    } else {
      await sendToAPI(value);
    }
  };

  const sendToAPI = async (text: string) => {
    setIsTyping(true);
    try {
      const history = messages
        .filter((m) => m.id !== "intro")
        .map((m) => ({
          role: m.role === "festie" ? "assistant" : "user",
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const response =
        data.response || "Hmm my alien brain glitched for a sec 😅 Try asking again!";

      const festieMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "festie",
        content: response,
        buttons:
          selectedFestival === "coachella" ? COACHELLA_QUICK_REPLIES : undefined,
      };
      setMessages((prev) => [...prev, festieMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "festie",
          content: "Yo my signal is glitching rn 📡 Try that again!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev.map((m): Message => ({ ...m, buttons: undefined })), userMsg]);
    setInput("");
    await sendToAPI(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Festie bubble + intro speech bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
          >
            {/* Speech bubble */}
            {showIntro && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#7c3aed] text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[220px] shadow-lg shadow-purple-500/20 cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <p className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  YOOO! 🛸
                </p>
                <p className="text-white/80 text-xs mt-0.5">Where are you headed? Tap me!</p>
              </motion.div>
            )}

            {/* Avatar button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative hover:scale-110 transition-transform"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 overflow-hidden p-1">
                <FestieAvatar size={40} animated />
              </div>
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0a0a0f]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-2rem)] bg-[#0a0a0f] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-purple-500/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#7c3aed]/20 to-[#ec4899]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-full flex items-center justify-center overflow-hidden p-0.5">
                  <FestieAvatar size={28} animated={false} />
                </div>
                <div>
                  <p
                    className="text-white text-sm font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Festie 👽
                  </p>
                  <p className="text-green-400 text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Your festival guide
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white p-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } gap-2`}
                  >
                    {msg.role === "festie" && (
                      <div className="w-7 h-7 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-full flex items-center justify-center overflow-hidden shrink-0 mt-1 p-0.5">
                        <FestieAvatar size={18} animated={false} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#7c3aed] text-white rounded-br-md"
                          : "bg-white/10 text-white/90 rounded-bl-md"
                      }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {msg.content}
                    </div>
                  </div>

                  {/* Quick reply buttons */}
                  {msg.buttons && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                      {msg.buttons.map((btn) => (
                        <button
                          key={btn.value}
                          onClick={() => handleButtonClick(btn.value)}
                          className="bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-white text-xs px-3 py-1.5 rounded-full hover:bg-[#7c3aed]/40 transition-colors"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-full flex items-center justify-center overflow-hidden shrink-0 mt-1 p-0.5">
                    <FestieAvatar size={18} animated={false} />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Festie anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7c3aed]/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity shrink-0"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
