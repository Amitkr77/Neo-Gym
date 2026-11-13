import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import {
  Barbell, ChalkDust, COLORS, DumbbellRack, EmberSun, FloorGlow, Kettlebell, LightBeam, MistLayer, Plate, PowerRack, StripLight, useMaterials,
} from "./parts";
import { attachScrollStore, damp, isCoarsePointer, pointerState, prefersReducedMotion, scrollState, smoothstep } from "./scrollStore";

/* ---------------------------------------------------------------------------
   NeoGym — the training floor after hours.
   A single fixed canvas sits behind the whole home page. The camera walks a
   path of keyframes as the page scrolls: wide establishing shot in the hero,
   a slow orbit round the rack, low along the dumbbell rows, then up and out
   toward the ember sun for the closing call to action.
   ------------------------------------------------------------------------- */

const KEYFRAMES = [
  { at: 0.0, pos: [0, 1.7, 9.5], look: [0, 2.4, -2], sun: 1.0 },
  { at: 0.2, pos: [-4.6, 2.6, 5.4], look: [0.4, 1.6, -1], sun: 0.75 },
  { at: 0.42, pos: [4.2, 1.1, 3.6], look: [-1, 1.2, -2.5], sun: 0.6 },
  { at: 0.66, pos: [0.5, 4.4, 6.8], look: [0, 0.8, -3], sun: 0.7 },
  { at: 0.86, pos: [0, 1.6, 4.2], look: [0, 3.4, -12], sun: 1.15 },
  { at: 1.0, pos: [0, 1.5, 3.4], look: [0, 3.6, -14], sun: 1.25 },
];

/* The camera rides one continuous Catmull-Rom spline through the keyframes rather than
   easing in and out of each one, so it never "parks" between sections. Scroll progress maps
   piecewise-linearly onto the spline parameter, which keeps each keyframe at its section.
   Everything is preallocated: no garbage is created per frame. */
const POS_CURVE = new THREE.CatmullRomCurve3(KEYFRAMES.map((k) => new THREE.Vector3(...k.pos)), false, "centripetal");
const LOOK_CURVE = new THREE.CatmullRomCurve3(KEYFRAMES.map((k) => new THREE.Vector3(...k.look)), false, "centripetal");
const sample = { pos: new THREE.Vector3(), look: new THREE.Vector3(), sun: 1 };

function sampleKeyframes(p) {
  let i = 0;
  while (i < KEYFRAMES.length - 2 && p > KEYFRAMES[i + 1].at) i++;
  const a = KEYFRAMES[i];
  const b = KEYFRAMES[i + 1];
  const local = Math.min(1, Math.max(0, (p - a.at) / (b.at - a.at)));
  const u = (i + local) / (KEYFRAMES.length - 1);
  POS_CURVE.getPoint(u, sample.pos);
  LOOK_CURVE.getPoint(u, sample.look);
  sample.sun = a.sun + (b.sun - a.sun) * smoothstep(0, 1, local);
  return sample;
}

function CameraRig({ still, sunRef }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(...KEYFRAMES[0].look));
  const sway = still ? 0 : 1;

  const base = useRef(new THREE.Vector3(...KEYFRAMES[0].pos));
  const lean = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.1);
    const k = sampleKeyframes(scrollState.progress);
    const t = state.clock.elapsedTime;
    // Scroll already arrives eased (Lenis), so the path follows it tightly; the pointer lean
    // is smoothed separately and much more loosely, so the two never fight.
    base.current.x = damp(base.current.x, k.pos.x, 6, d);
    base.current.y = damp(base.current.y, k.pos.y, 6, d);
    base.current.z = damp(base.current.z, k.pos.z, 6, d);
    lean.current.x = damp(lean.current.x, (pointerState.x * 0.6 + Math.sin(t * 0.15) * 0.15) * sway, 1.6, d);
    lean.current.y = damp(lean.current.y, (pointerState.y * 0.3 + Math.sin(t * 0.21) * 0.08) * sway, 1.6, d);
    camera.position.set(base.current.x + lean.current.x, base.current.y + lean.current.y, base.current.z);
    look.current.x = damp(look.current.x, k.look.x, 6, d);
    look.current.y = damp(look.current.y, k.look.y, 6, d);
    look.current.z = damp(look.current.z, k.look.z, 6, d);
    camera.lookAt(look.current);

    const sun = sunRef.current;
    if (sun) {
      const u = sun.material.uniforms.uIntensity;
      u.value = damp(u.value, k.sun, 2, d);
    }
  });
  return null;
}

/* Barbell resting on the J-hooks; breathes very slightly so the frame never freezes. */
function RackedBar({ materials, still }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current || still) return;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.04;
  });
  return <Barbell ref={ref} materials={materials} position={[0, 1.55, 0.81]} />;
}

function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={COLORS.rubber} roughness={0.85} metalness={0.15} />
      </mesh>
      <Grid
        position={[0, 0.002, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#2a2120"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#5a2617"
        fadeDistance={34}
        fadeStrength={1.4}
        infiniteGrid
      />
    </group>
  );
}

function Scene({ still, lite }) {
  const materials = useMaterials();
  const sunRef = useRef();

  const lights = useMemo(
    () => [-9, -5, -1, 3].map((z) => ({ z, len: 6 })),
    []
  );

  return (
    <>
      <color attach="background" args={[COLORS.ink]} />
      <fog attach="fog" args={[COLORS.ink, 7, 30]} />

      <ambientLight intensity={0.25} />
      <hemisphereLight args={["#ffb69c", "#050506", 0.35]} />
      {/* back light: the sun rim-lights every silhouette */}
      <directionalLight position={[0, 6, -14]} intensity={2.4} color="#ff6a3d" />
      {/* key light from the strip lamps */}
      <spotLight position={[0, 7, 2]} angle={0.6} penumbra={0.9} intensity={60} distance={18} color="#ffe2d4" />
      <pointLight position={[0, 1.2, 2.6]} intensity={6} distance={6} color={COLORS.ember} />

      <EmberSun ref={sunRef} position={[0, 5.2, -22]} radius={6.5} />
      <CameraRig still={still} sunRef={sunRef} />

      <Floor />

      <PowerRack materials={materials} />
      <RackedBar materials={materials} still={still} />

      <DumbbellRack materials={materials} position={[-5.8, 0, -3.5]} rotation={[0, 0.5, 0]} />
      <DumbbellRack materials={materials} position={[5.8, 0, -3.5]} rotation={[0, -0.5, 0]} />

      {/* plate tree / loose plates leaning by the rack */}
      <Plate materials={materials} radius={0.45} position={[2.2, 0.45, -0.6]} rotation={[0, 0.3, 0.12]} />
      <Plate materials={materials} radius={0.45} position={[2.32, 0.45, -0.5]} rotation={[0, 0.3, 0.14]} />
      <Plate materials={materials} radius={0.32} position={[-2.1, 0.32, -0.8]} rotation={[0, -0.4, -0.1]} />

      <Kettlebell materials={materials} accent position={[-1.9, 0, 1.8]} scale={0.55} rotation={[0, 0.6, 0]} />
      <Kettlebell materials={materials} position={[-2.5, 0, 1.5]} scale={0.45} rotation={[0, -0.3, 0]} />
      <Kettlebell materials={materials} position={[2.4, 0, 1.9]} scale={0.5} rotation={[0, 0.2, 0]} />

      {/* a second bay further back, fading into the fog */}
      <PowerRack materials={materials} position={[-4.5, 0, -10]} />
      <PowerRack materials={materials} position={[4.5, 0, -10]} />
      <Barbell materials={materials} position={[-4.5, 1.55, -9.2]} />

      {lights.map(({ z, len }) => (
        <group key={z}>
          <StripLight materials={materials} position={[0, 6.2, z]} length={len} />
          {!lite && <LightBeam position={[0, 6.15, z]} height={6.1} top={0.3} bottom={2.4} scale={[1.6, 1, 0.5]} />}
        </group>
      ))}

      {/* atmospherics: sun streak on the floor, banks of haze at three depths */}
      <FloorGlow position={[0, 0.01, -8]} width={6} length={28} opacity={0.3} />
      <MistLayer position={[0, 2.2, -16]} width={50} height={7} color="#7a2c1a" opacity={0.55} seed={1.3} />
      <MistLayer position={[0, 1.2, -9]} width={40} height={4} color="#4a2219" opacity={0.45} seed={4.1} />
      {!lite && <MistLayer position={[0, 0.6, -3]} width={30} height={2.4} color="#3a1d17" opacity={0.35} seed={7.7} />}

      <ChalkDust count={lite ? 350 : 1100} />
    </>
  );
}

/* Reduced motion renders on demand only: one fresh frame per scroll, nothing in between. */
function InvalidateOnScroll() {
  const invalidate = useThree((st) => st.invalidate);
  useEffect(() => {
    const on = () => invalidate();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [invalidate]);
  return null;
}

export default function GymScene() {
  const still = prefersReducedMotion();
  const coarse = isCoarsePointer();
  const maxDpr = coarse ? 1.5 : 1.75;
  // Adaptive quality: PerformanceMonitor watches the real frame rate and walks the pixel
  // ratio between 1 and max; if the device keeps struggling it drops to "lite" detail.
  const [dpr, setDpr] = useState(Math.min(maxDpr, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1));
  const [degraded, setDegraded] = useState(false);
  const [ready, setReady] = useState(false);
  const lite = coarse || degraded;

  useEffect(() => attachScrollStore(), []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-[1400ms] ease-premium ${ready ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr}
        camera={{ position: KEYFRAMES[0].pos, fov: 42, near: 0.1, far: 80 }}
        gl={{ antialias: !coarse, powerPreference: "high-performance", stencil: false }}
        frameloop={still ? "demand" : "always"}
        // fade the scene in once the first frame is actually on screen, instead of popping
        onCreated={() => requestAnimationFrame(() => setReady(true))}
      >
        <PerformanceMonitor
          bounds={() => [45, 58]}
          flipflops={3}
          onChange={({ factor }) => setDpr(Math.round((1 + (maxDpr - 1) * factor) * 4) / 4)}
          onFallback={() => {
            setDpr(1);
            setDegraded(true);
          }}
        />
        {still && <InvalidateOnScroll />}
        <Scene still={still} lite={lite} />
      </Canvas>
      {/* vignette + bottom haze so text always has a dark ground to sit on */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(11,11,12,0.75)_100%)]" />
    </div>
  );
}
