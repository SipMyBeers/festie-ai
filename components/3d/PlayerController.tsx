"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getJoystickInput, getJumpRequested } from "@/components/ui/VirtualJoystick";

const SPEED = 8;
const JUMP_FORCE = 6;
const GRAVITY = -15;
const GROUND_Y = 0.4;

interface Keys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

export function PlayerController() {
  const { camera } = useThree();
  const playerRef = useRef<THREE.Group>(null);
  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const playerPos = useRef(new THREE.Vector3(0, GROUND_Y, 8));
  const cameraAngle = useRef(0);
  const cameraTilt = useRef(0.3);
  const cameraDistance = useRef(6);

  // Mouse/touch drag for camera rotation
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(0);

  const keys = useRef<Keys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW": case "ArrowUp": keys.current.forward = true; break;
        case "KeyS": case "ArrowDown": keys.current.backward = true; break;
        case "KeyA": case "ArrowLeft": keys.current.left = true; break;
        case "KeyD": case "ArrowRight": keys.current.right = true; break;
        case "Space": keys.current.jump = true; e.preventDefault(); break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW": case "ArrowUp": keys.current.forward = false; break;
        case "KeyS": case "ArrowDown": keys.current.backward = false; break;
        case "KeyA": case "ArrowLeft": keys.current.left = false; break;
        case "KeyD": case "ArrowRight": keys.current.right = false; break;
        case "Space": keys.current.jump = false; break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Touch drag on right side of screen for camera orbit
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // On touch devices, only use right half of screen for camera control
      // Left half is reserved for the virtual joystick
      const isTouchDevice = e.pointerType === "touch";
      if (isTouchDevice && e.clientX < window.innerWidth / 2) return;

      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      cameraAngle.current -= dx * 0.005;
      cameraTilt.current = Math.max(0.05, Math.min(0.8, cameraTilt.current + dy * 0.005));
    };
    const handlePointerUp = () => { isDragging.current = false; };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistance.current = Math.max(3, Math.min(15, cameraDistance.current + e.deltaY * 0.01));
    };

    // Pinch-to-zoom on mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastPinchDist.current > 0) {
          const delta = lastPinchDist.current - dist;
          cameraDistance.current = Math.max(3, Math.min(15, cameraDistance.current + delta * 0.03));
        }
        lastPinchDist.current = dist;
      }
    };
    const handleTouchEnd = () => {
      lastPinchDist.current = 0;
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", handlePointerUp);
      canvas.addEventListener("pointerleave", handlePointerUp);
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
      canvas.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerup", handlePointerUp);
        canvas.removeEventListener("pointerleave", handlePointerUp);
        canvas.removeEventListener("wheel", handleWheel);
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  useFrame((_, delta) => {
    if (!playerRef.current) return;
    const dt = Math.min(delta, 0.05);

    // Combine keyboard + virtual joystick input
    const joystick = getJoystickInput();
    const moveDir = new THREE.Vector3(0, 0, 0);

    // Keyboard
    if (keys.current.forward) moveDir.z -= 1;
    if (keys.current.backward) moveDir.z += 1;
    if (keys.current.left) moveDir.x -= 1;
    if (keys.current.right) moveDir.x += 1;

    // Joystick (additive — if both are used, keyboard wins by magnitude)
    if (Math.abs(joystick.x) > 0.1 || Math.abs(joystick.y) > 0.1) {
      moveDir.x += joystick.x;
      moveDir.z -= joystick.y; // joystick Y+ = forward = -Z
    }

    if (moveDir.length() > 0) {
      moveDir.normalize();
      const rotatedDir = moveDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraAngle.current);
      playerPos.current.x += rotatedDir.x * SPEED * dt;
      playerPos.current.z += rotatedDir.z * SPEED * dt;

      const targetAngle = Math.atan2(rotatedDir.x, rotatedDir.z);
      playerRef.current.rotation.y = THREE.MathUtils.lerp(
        playerRef.current.rotation.y,
        targetAngle,
        0.15
      );
    }

    // Jump — keyboard or virtual button
    const virtualJump = getJumpRequested();
    if ((keys.current.jump || virtualJump) && isGrounded.current) {
      velocityY.current = JUMP_FORCE;
      isGrounded.current = false;
    }

    // Gravity
    velocityY.current += GRAVITY * dt;
    playerPos.current.y += velocityY.current * dt;

    // Ground collision
    if (playerPos.current.y <= GROUND_Y) {
      playerPos.current.y = GROUND_Y;
      velocityY.current = 0;
      isGrounded.current = true;
    }

    // Keep player within festival bounds
    const maxDist = 32;
    const dist = Math.sqrt(playerPos.current.x ** 2 + playerPos.current.z ** 2);
    if (dist > maxDist) {
      playerPos.current.x *= maxDist / dist;
      playerPos.current.z *= maxDist / dist;
    }

    playerRef.current.position.copy(playerPos.current);

    // Camera follows player — third person
    const d = cameraDistance.current;
    const camOffset = new THREE.Vector3(
      Math.sin(cameraAngle.current) * Math.cos(cameraTilt.current) * d,
      Math.sin(cameraTilt.current) * d + 1,
      Math.cos(cameraAngle.current) * Math.cos(cameraTilt.current) * d
    );
    const targetCamPos = playerPos.current.clone().add(camOffset);
    camera.position.lerp(targetCamPos, 0.1);

    const lookTarget = playerPos.current.clone().add(new THREE.Vector3(0, 0.8, 0));
    camera.lookAt(lookTarget);
  });

  return (
    <group ref={playerRef} position={[0, GROUND_Y, 8]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 4, 8]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ddb89a" roughness={0.7} />
      </mesh>
      {/* Backpack */}
      <mesh position={[0, 0.3, 0.15]}>
        <boxGeometry args={[0.18, 0.25, 0.1]} />
        <meshStandardMaterial color="#f97316" roughness={0.7} />
      </mesh>
      {/* Name tag */}
      <Text
        position={[0, 1.1, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        You
      </Text>
    </group>
  );
}
