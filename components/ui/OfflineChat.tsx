"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FestieAvatar } from "./FestieAvatar";

type ModelStatus = "idle" | "downloading" | "loading" | "ready" | "thinking" | "error" | "unsupported";

interface ChatMessage {
  id: string;
  role: "user" | "festie";
  content: string;
}

const QUICK_QUESTIONS = [
  { label: "Who's playing now?", value: "whos playing right now?" },
  { label: "Where's water?", value: "where can i get water?" },
  { label: "Food near Sahara?", value: "whats good to eat near sahara tent?" },
  { label: "Parking tips", value: "parking tips?" },
  { label: "Phone charging?", value: "where can i charge my phone?" },
  { label: "Weather today?", value: "whats the weather like?" },
];

export function OfflineChat({ systemPrompt }: { systemPrompt: string }) {
  const [status, setStatus] = useState<ModelStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [progressFile, setProgressFile] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const workerRef = useRef<Worker | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check WebGPU support
  useEffect(() => {
    const gpu = (navigator as unknown as { gpu?: unknown }).gpu;
    if (!gpu && !("WebAssembly" in globalThis)) {
      setStatus("unsupported");
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const initWorker = useCallback(() => {
    if (workerRef.current) return;

    const worker = new Worker("/ai-worker.js", { type: "module" });
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, status: s, percent, file, text, error, note } = e.data;

      if (type === "status") {
        setStatus(s as ModelStatus);
        if (note) setErrorMsg(note);
      }
      if (type === "progress") {
        setProgress(percent);
        if (file) setProgressFile(file.split("/").pop() || "");
      }
      if (type === "response") {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "festie", content: text },
        ]);
        setStatus("ready");
      }
      if (type === "error") {
        setErrorMsg(error);
        setStatus("error");
      }
    };

    worker.postMessage({ type: "load" });
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || status !== "ready" || !workerRef.current) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
      };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");

      workerRef.current.postMessage({
        type: "generate",
        payload: { messages: newMessages, systemPrompt },
      });
    },
    [status, messages, systemPrompt]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Not yet loaded — show download screen
  if (status === "idle" || status === "unsupported") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-festie-purple to-festie-pink rounded-full flex items-center justify-center p-2 mb-6">
          <FestieAvatar size={64} animated />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Festie AI</h2>
        <p className="text-white/50 text-sm mb-1">
          Powered by Gemma 4 — runs 100% on your phone
        </p>
        <p className="text-white/30 text-xs mb-6">
          ~500MB download, then works forever offline
        </p>

        {status === "unsupported" ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-w-sm">
            <p className="text-red-400 text-sm font-display font-bold">Browser Not Supported</p>
            <p className="text-white/50 text-xs mt-1">
              Try Chrome on Android or Safari on iOS 18+. Your browser doesn't support on-device AI.
            </p>
          </div>
        ) : (
          <button
            onClick={initWorker}
            className="bg-gradient-to-r from-festie-purple to-festie-pink text-white font-display font-bold text-lg px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
          >
            Download Festie AI
          </button>
        )}

        <p className="text-white/20 text-xs mt-4">
          Download once on WiFi. No data leaves your phone.
        </p>
      </div>
    );
  }

  // Loading state
  if (status === "downloading" || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-festie-purple to-festie-pink rounded-full flex items-center justify-center p-2 mb-6 animate-pulse">
          <FestieAvatar size={48} animated />
        </div>
        <h2 className="text-xl font-display font-bold mb-2">
          {status === "downloading" ? "Downloading Festie AI..." : "Loading model..."}
        </h2>
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-festie-purple to-festie-pink rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/40 text-xs">
          {progress > 0 ? `${progress}%` : "Initializing..."}{" "}
          {progressFile && `— ${progressFile}`}
        </p>
        {errorMsg && (
          <p className="text-yellow-400/60 text-xs mt-2">{errorMsg}</p>
        )}
        <p className="text-white/20 text-xs mt-4">
          This only happens once — cached for offline use
        </p>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <FestieAvatar size={48} animated={false} />
        </div>
        <h2 className="text-xl font-display font-bold mb-2 text-red-400">Couldn't Load AI</h2>
        <p className="text-white/50 text-sm max-w-xs mb-4">{errorMsg}</p>
        <button
          onClick={() => {
            workerRef.current?.terminate();
            workerRef.current = null;
            setStatus("idle");
            setErrorMsg("");
            setProgress(0);
          }}
          className="bg-white/10 text-white font-display font-bold px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Chat UI — model is ready
  return (
    <div className="flex flex-col h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] max-h-[100dvh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-festie-dark/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-festie-purple to-festie-pink rounded-full flex items-center justify-center overflow-hidden p-0.5">
            <FestieAvatar size={24} animated={false} />
          </div>
          <div>
            <p className="text-white text-sm font-display font-bold">Festie AI</p>
            <p className="text-green-400 text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              On-device — no internet needed
            </p>
          </div>
        </div>
        <div className="bg-green-400/10 rounded-full px-2.5 py-1 border border-green-400/20">
          <span className="text-green-400 text-[10px] font-display font-bold">OFFLINE</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div>
            <div className="flex justify-start gap-2 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-festie-purple to-festie-pink rounded-full flex items-center justify-center overflow-hidden shrink-0 mt-1 p-0.5">
                <FestieAvatar size={18} animated={false} />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm leading-relaxed bg-white/10 text-white/90">
                YOOO I'm running RIGHT on your phone!! No WiFi needed, no data leaving your device. Ask me ANYTHING about Coachella — stages, food, water, set times, vibes, whatever!! 🛸🔥
              </div>
            </div>
            {/* Quick questions */}
            <div className="flex flex-wrap gap-1.5 ml-9">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.value}
                  onClick={() => sendMessage(q.value)}
                  className="bg-festie-purple/20 border border-festie-purple/30 text-white text-xs px-3 py-1.5 rounded-full hover:bg-festie-purple/40 transition-colors font-display"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
          >
            {msg.role === "festie" && (
              <div className="w-7 h-7 bg-gradient-to-br from-festie-purple to-festie-pink rounded-full flex items-center justify-center overflow-hidden shrink-0 mt-1 p-0.5">
                <FestieAvatar size={18} animated={false} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-festie-purple text-white rounded-br-md"
                  : "bg-white/10 text-white/90 rounded-bl-md"
              }`}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {status === "thinking" && (
          <div className="flex justify-start gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-festie-purple to-festie-pink rounded-full flex items-center justify-center overflow-hidden shrink-0 mt-1 p-0.5">
              <FestieAvatar size={18} animated={false} />
            </div>
            <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-white/10 bg-festie-dark shrink-0 pb-safe">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Festie anything..."
            disabled={status === "thinking"}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-festie-purple/50 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || status === "thinking"}
            className="w-10 h-10 bg-gradient-to-r from-festie-purple to-festie-pink rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity shrink-0"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
