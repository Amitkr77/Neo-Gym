import { Canvas, useFrame } from "@react-three/fiber";
import { ChalkDust, Kettlebell, Plate, useMaterials } from "./parts";
import { useEffect, useRef } from "react";
import { attachScrollStore, damp, isCoarsePointer, pointerState, prefersReducedMotion, scrollState } from "./scrollStore";

/* ---------------------------------------------------------------------------
   The hero's foreground layer. A transparent canvas stacked *above* the giant
   wordmark, so the kettlebells and plate overlap the letters and parallax
   against them. As soon as the walk starts they sink out of frame.
   ------------------------------------------------------------------------- */

function Props({ still }) {
  const materials = useMaterials();
  const left = useRef();
  const right = useRef();
  const plate = useRef();

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.1);
    const t = state.clock.elapsedTime;
    // Anchor the props to the frame edges so they stay in shot on narrow (phone) screens.
    const half = state.viewport.width / 2;
    const fit = Math.min(1, state.viewport.width / 9);
    const leave = Math.min(1, scrollState.y / (scrollState.vh * 0.8)); // 0 → 1 over the first screen
    const px = still ? 0 : pointerState.x;
    const py = still ? 0 : pointerState.y;

    if (left.current) {
      left.current.scale.setScalar(1.6 * fit);
      left.current.position.x = damp(left.current.position.x, -half + 1.0 * fit - px * 0.35 - leave * 1.5, 4, d);
      left.current.position.y = damp(left.current.position.y, -1.95 - py * 0.15 - leave * 2.5, 4, d);
      if (!still) left.current.rotation.y = 0.5 + Math.sin(t * 0.4) * 0.12;
    }
    if (right.current) {
      right.current.scale.setScalar(1.25 * fit);
      right.current.position.x = damp(right.current.position.x, half - 1.1 * fit - px * 0.5 + leave * 1.5, 4, d);
      right.current.position.y = damp(right.current.position.y, -2.2 - py * 0.2 - leave * 2.5, 4, d);
      if (!still) right.current.rotation.y = -0.4 + Math.sin(t * 0.33 + 1) * 0.1;
    }
    if (plate.current) {
      plate.current.scale.setScalar(fit);
      plate.current.position.x = damp(plate.current.position.x, half - 2.6 * fit - px * 0.25 + leave * 1.2, 4, d);
      plate.current.position.y = damp(plate.current.position.y, -1.55 - py * 0.1 - leave * 2.2, 4, d);
      if (!still) plate.current.rotation.z = 0.25 + Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      {/* ember rim from behind and a cool fill from the front keep the iron readable */}
      <directionalLight position={[0, 4, -6]} intensity={4} color="#ff6a3d" />
      <directionalLight position={[2, 3, 6]} intensity={0.8} color="#ffe7dc" />
      <pointLight position={[0, -1, 2]} intensity={4} distance={8} color="#ff5b2e" />

      <group ref={left} position={[-4.6, -1.75, 0]} rotation={[0.1, 0.5, 0]} scale={1.6}>
        <Kettlebell materials={materials} accent />
      </group>
      <group ref={right} position={[4.3, -2.0, 0.6]} rotation={[0.05, -0.4, 0]} scale={1.25}>
        <Kettlebell materials={materials} />
      </group>
      <group ref={plate} position={[2.6, -1.5, -1]} rotation={[0, 0.9, 0.25]}>
        <Plate materials={materials} radius={0.9} width={0.16} />
      </group>

      {!still && <ChalkDust count={140} spread={[12, 6, 3]} center={[0, -3, 1]} size={9} />}
    </>
  );
}

export default function HeroForeground() {
  const still = prefersReducedMotion();
  const lite = isCoarsePointer();
  useEffect(() => attachScrollStore(), []);
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      <Canvas
        dpr={lite ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ alpha: true, antialias: !lite }}
        frameloop={still ? "demand" : "always"}
      >
        <Props still={still} />
      </Canvas>
    </div>
  );
}
