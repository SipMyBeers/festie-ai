"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { useFestieStore } from "@/lib/store";

const KEYFRAMES = {
  raveStart: {
    position: new THREE.Vector3(0, 1.6, 3),
    lookAt: new THREE.Vector3(0, 2.5, -8),
  },
  risingAbove: {
    position: new THREE.Vector3(0, 15, 10),
    lookAt: new THREE.Vector3(0, 0, -2),
  },
  planetReveal: {
    position: new THREE.Vector3(0, 30, 40),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
  solarSystem: {
    position: new THREE.Vector3(0, 20, 60),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
};

function lerp3(a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  return new THREE.Vector3(
    THREE.MathUtils.lerp(a.x, b.x, t),
    THREE.MathUtils.lerp(a.y, b.y, t),
    THREE.MathUtils.lerp(a.z, b.z, t)
  );
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function ScrollCamera() {
  const scroll = useScroll();
  const { camera } = useThree();
  const setCameraMode = useFestieStore((s) => s.setCameraMode);
  const lookAtTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const offset = scroll.offset;

    let position: THREE.Vector3;
    let lookAt: THREE.Vector3;

    if (offset < 0.25) {
      const t = smoothstep(offset / 0.25);
      position = lerp3(KEYFRAMES.raveStart.position, KEYFRAMES.risingAbove.position, t);
      lookAt = lerp3(KEYFRAMES.raveStart.lookAt, KEYFRAMES.risingAbove.lookAt, t);
      setCameraMode("hero");
    } else if (offset < 0.5) {
      const t = smoothstep((offset - 0.25) / 0.25);
      position = lerp3(KEYFRAMES.risingAbove.position, KEYFRAMES.planetReveal.position, t);
      lookAt = lerp3(KEYFRAMES.risingAbove.lookAt, KEYFRAMES.planetReveal.lookAt, t);
      setCameraMode("hero");
    } else if (offset < 0.75) {
      const t = smoothstep((offset - 0.5) / 0.25);
      position = lerp3(KEYFRAMES.planetReveal.position, KEYFRAMES.solarSystem.position, t);
      lookAt = lerp3(KEYFRAMES.planetReveal.lookAt, KEYFRAMES.solarSystem.lookAt, t);
      setCameraMode("solar-system");
    } else {
      position = KEYFRAMES.solarSystem.position.clone();
      lookAt = KEYFRAMES.solarSystem.lookAt.clone();
      setCameraMode("solar-system");
    }

    camera.position.lerp(position, 0.1);
    lookAtTarget.current.lerp(lookAt, 0.1);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
