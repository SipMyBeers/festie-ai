"use client";

import { useRef, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useFestieStore } from "@/lib/store";

interface JoystickInput {
  x: number; // -1 to 1
  y: number; // -1 to 1
}

// Shared state for PlayerController to read
let joystickInput: JoystickInput = { x: 0, y: 0 };
let jumpRequested = false;

export function getJoystickInput(): JoystickInput {
  return joystickInput;
}

export function getJumpRequested(): boolean {
  const val = jumpRequested;
  jumpRequested = false; // consume
  return val;
}

const JOYSTICK_SIZE = 120;
const KNOB_SIZE = 48;
const MAX_DIST = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

export function VirtualJoystick() {
  const cameraMode = useFestieStore((s) => s.cameraMode);
  const baseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const touchId = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  const isMobile = useSyncExternalStore(
    () => () => {},
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
    () => false
  );

  const handleStart = useCallback((clientX: number, clientY: number, id: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    touchId.current = id;
    setActive(true);
    updateKnob(clientX, clientY);
  }, []);

  const updateKnob = useCallback((clientX: number, clientY: number) => {
    const dx = clientX - centerRef.current.x;
    const dy = clientY - centerRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, MAX_DIST);
    const angle = Math.atan2(dy, dx);

    const nx = Math.cos(angle) * clampedDist;
    const ny = Math.sin(angle) * clampedDist;

    setKnobPos({ x: nx, y: ny });
    joystickInput = {
      x: nx / MAX_DIST,
      y: -ny / MAX_DIST, // invert Y so up = forward
    };
  }, []);

  const handleEnd = useCallback(() => {
    touchId.current = null;
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    joystickInput = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (touchId.current === null) return;
      for (const touch of Array.from(e.touches)) {
        if (touch.identifier === touchId.current) {
          e.preventDefault();
          updateKnob(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchId.current === null) return;
      for (const touch of Array.from(e.changedTouches)) {
        if (touch.identifier === touchId.current) {
          handleEnd();
          break;
        }
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [updateKnob, handleEnd]);

  if (cameraMode !== "exploring" || !isMobile) return null;

  return (
    <div className="fixed bottom-8 left-8 z-30 pointer-events-auto flex items-end gap-4">
      {/* Joystick base */}
      <div
        ref={baseRef}
        className="relative rounded-full"
        style={{
          width: JOYSTICK_SIZE,
          height: JOYSTICK_SIZE,
          background: active
            ? "rgba(124, 58, 237, 0.3)"
            : "rgba(255, 255, 255, 0.1)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          touchAction: "none",
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handleStart(touch.clientX, touch.clientY, touch.identifier);
        }}
      >
        {/* Knob */}
        <div
          className="absolute rounded-full"
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            background: active
              ? "linear-gradient(135deg, #7c3aed, #ec4899)"
              : "rgba(255, 255, 255, 0.3)",
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${knobPos.x}px), calc(-50% + ${knobPos.y}px))`,
            transition: active ? "none" : "transform 0.2s ease-out",
            boxShadow: active ? "0 0 20px rgba(124, 58, 237, 0.5)" : "none",
          }}
        />
      </div>

      {/* Jump button */}
      <button
        className="rounded-full flex items-center justify-center text-white font-bold text-xs"
        style={{
          width: 56,
          height: 56,
          background: "rgba(255, 255, 255, 0.1)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          fontFamily: "var(--font-display)",
          touchAction: "none",
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          jumpRequested = true;
        }}
      >
        JUMP
      </button>
    </div>
  );
}
