"use client";

import { OfflineChat } from "@/components/ui/OfflineChat";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { useEffect, useState } from "react";
import { FestieAvatar } from "@/components/ui/FestieAvatar";

export default function AIChatPage() {
  const [purchased, setPurchased] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/check-purchase")
      .then((res) => res.json())
      .then((data) => {
        setPurchased(data.purchased === true);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-festie-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!purchased) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-festie-purple to-festie-pink rounded-full flex items-center justify-center p-2 mb-6">
          <FestieAvatar size={48} animated />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">Unlock Festie AI</h1>
        <p className="text-white/50 text-sm mb-6 max-w-xs">
          Get your offline AI festival guide — runs directly on your phone with zero internet.
        </p>
        <a
          href="https://buy.stripe.com/5kQaEX0BY5pB3G88ww3F602"
          className="bg-gradient-to-r from-festie-purple to-festie-pink text-white font-display font-bold text-lg px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
        >
          Get Festie AI — $4.99
        </a>
        <p className="text-white/30 text-xs mt-3">One-time purchase. No subscription.</p>
      </div>
    );
  }

  return <OfflineChat systemPrompt={buildSystemPrompt()} />;
}
