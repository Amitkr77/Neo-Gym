import { forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
   Gym equipment, built from primitives at runtime (no model files to load).
   Everything shares a handful of materials so the scene stays cheap.
   ------------------------------------------------------------------------- */

export const COLORS = {
  ink: "#0B0B0C",
  steel: "#2a2b2f",
  iron: "#141416",
  rubber: "#101012",
  ember: "#FF5B2E",
  emberDeep: "#B83510",
  bone: "#F4F1EC",
};

export function useMaterials() {
  return useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({ color: COLORS.steel, metalness: 0.85, roughness: 0.35 }),
      chrome: new THREE.MeshStandardMaterial({ color: "#8d8f96", metalness: 1, roughness: 0.22 }),
      iron: new THREE.MeshStandardMaterial({ color: COLORS.iron, metalness: 0.6, roughness: 0.55 }),
      rubber: new THREE.MeshStandardMaterial({ color: COLORS.rubber, metalness: 0.1, roughness: 0.9 }),
      ember: new THREE.MeshStandardMaterial({ color: COLORS.ember, emissive: COLORS.ember, emissiveIntensity: 1.4, roughness: 0.4 }),
      lamp: new THREE.MeshBasicMaterial({ color: "#ffd9c7", toneMapped: false }),
    }),
    []
  );
}

/* A bumper plate: rubber disc, steel hub, thin ember ring on the face. */
export function Plate({ radius = 0.45, width = 0.09, materials, ...props }) {
  return (
    <group {...props}>
      <mesh rotation={[0, 0, Math.PI / 2]} material={materials.rubber}>
        <cylinderGeometry args={[radius, radius, width, 48]} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
        <cylinderGeometry args={[radius * 0.2, radius * 0.2, width * 1.15, 24]} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[(s * width) / 2 + s * 0.001, 0, 0]} rotation={[0, (s * Math.PI) / 2, 0]} material={materials.ember}>
          <ringGeometry args={[radius * 0.78, radius * 0.8, 64]} />
        </mesh>
      ))}
    </group>
  );
}

/* Olympic barbell, loaded symmetrically. */
export const Barbell = forwardRef(function Barbell({ materials, plates = [0.45, 0.4, 0.32], ...props }, ref) {
  return (
    <group ref={ref} {...props}>
      <mesh rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
        <cylinderGeometry args={[0.025, 0.025, 4.4, 16]} />
      </mesh>
      {[1, -1].map((side) => (
        <group key={side}>
          <mesh position={[side * 1.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 24]} />
          </mesh>
          {plates.map((r, i) => (
            <Plate key={i} radius={r} materials={materials} position={[side * (1.55 + i * 0.1), 0, 0]} />
          ))}
        </group>
      ))}
    </group>
  );
});

/* Power rack: four uprights, top frame and safety arms. */
export function PowerRack({ materials, ...props }) {
  const w = 1.25, d = 0.75, h = 3.2, t = 0.08;
  const posts = [[-w, -d], [w, -d], [-w, d], [w, d]];
  return (
    <group {...props}>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, h / 2, z]} material={materials.steel}>
          <boxGeometry args={[t, h, t]} />
        </mesh>
      ))}
      {[-d, d].map((z) => (
        <mesh key={z} position={[0, h, z]} material={materials.steel}>
          <boxGeometry args={[w * 2 + t, t, t]} />
        </mesh>
      ))}
      {[-w, w].map((x) => (
        <group key={x}>
          <mesh position={[x, h, 0]} material={materials.steel}>
            <boxGeometry args={[t, t, d * 2 + t]} />
          </mesh>
          {/* safety arm */}
          <mesh position={[x, 0.85, 0]} material={materials.iron}>
            <boxGeometry args={[t * 0.8, t * 0.8, d * 2.4]} />
          </mesh>
          {/* J-hook */}
          <mesh position={[x, 1.48, d + 0.06]} material={materials.ember}>
            <boxGeometry args={[t, 0.05, 0.14]} />
          </mesh>
        </group>
      ))}
      {/* pull-up bar */}
      <mesh position={[0, h + 0.02, d + 0.12]} rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
        <cylinderGeometry args={[0.03, 0.03, w * 2.3, 12]} />
      </mesh>
    </group>
  );
}

/* Hex dumbbell. */
export function Dumbbell({ materials, size = 1, ...props }) {
  return (
    <group scale={size} {...props}>
      <mesh rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
        <cylinderGeometry args={[0.03, 0.03, 0.42, 12]} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.rubber}>
          <cylinderGeometry args={[0.11, 0.11, 0.12, 6]} />
        </mesh>
      ))}
    </group>
  );
}

/* Two-tier dumbbell rack with a row of bells, lightest to heaviest. */
export function DumbbellRack({ materials, count = 7, ...props }) {
  const len = count * 0.62;
  return (
    <group {...props}>
      {[0.55, 0.95].map((y, tier) => (
        <group key={y}>
          <mesh position={[0, y, tier * -0.32]} rotation={[-0.25, 0, 0]} material={materials.steel}>
            <boxGeometry args={[len, 0.04, 0.32]} />
          </mesh>
          {Array.from({ length: count }, (_, i) => (
            <Dumbbell
              key={i}
              materials={materials}
              size={0.8 + (i / count) * 0.6 - tier * 0.15}
              position={[-len / 2 + 0.31 + i * 0.62, y + 0.12, tier * -0.32]}
              rotation={[0, Math.PI / 2, 0]}
            />
          ))}
        </group>
      ))}
      {[-len / 2, len / 2].map((x) => (
        <mesh key={x} position={[x, 0.5, -0.15]} material={materials.steel}>
          <boxGeometry args={[0.06, 1, 0.6]} />
        </mesh>
      ))}
    </group>
  );
}

/* Kettlebell: flattened bell plus a half-torus handle. */
export function Kettlebell({ materials, accent = false, ...props }) {
  return (
    <group {...props}>
      <mesh scale={[1, 0.92, 1]} position={[0, 0.5, 0]} material={materials.iron}>
        <sphereGeometry args={[0.5, 40, 32]} />
      </mesh>
      <mesh position={[0, 0.98, 0]} material={materials.iron}>
        <torusGeometry args={[0.3, 0.075, 16, 40, Math.PI]} />
      </mesh>
      {accent && (
        <mesh position={[0, 0.5, 0.501]} material={materials.ember}>
          <circleGeometry args={[0.09, 32]} />
        </mesh>
      )}
    </group>
  );
}

/* Overhead strip light: an emissive bar plus a soft cone of light under it. */
export function StripLight({ materials, length = 3, ...props }) {
  return (
    <group {...props}>
      <mesh material={materials.lamp}>
        <boxGeometry args={[length, 0.04, 0.12]} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   The ember sun: a shader disc with a soft halo and horizontal heat bands.
   Additive, unfogged, so it always reads through the haze.
   ------------------------------------------------------------------------- */
const sunVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const sunFragment = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uCore;
  uniform vec3 uEdge;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float disc = smoothstep(0.5, 0.485, r);
    // heat bands across the lower half of the disc, drifting slowly
    float band = step(0.5, fract((p.y + uTime * 0.02) * 9.0));
    float cut = mix(1.0, band, smoothstep(0.05, -0.35, p.y));
    vec3 col = mix(uCore, uEdge, smoothstep(0.0, 0.5, r + p.y * 0.25));
    float halo = exp(-max(r - 0.48, 0.0) * 7.0) * 0.55;
    float alpha = disc * cut + halo * (1.0 - disc);
    gl_FragColor = vec4(col * uIntensity, alpha * uIntensity);
  }
`;

export const EmberSun = forwardRef(function EmberSun({ radius = 5, ...props }, ref) {
  const mat = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1 },
      uCore: { value: new THREE.Color("#ff8a5c") },
      uEdge: { value: new THREE.Color("#e6461b") },
    }),
    []
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh ref={ref} {...props} renderOrder={-1}>
      <planeGeometry args={[radius * 2, radius * 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={sunVertex}
        fragmentShader={sunFragment}
        transparent
        depthWrite={false}
        fog={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
});

/* ---------------------------------------------------------------------------
   Chalk dust: soft round points drifting upward and swaying.
   ------------------------------------------------------------------------- */
const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float h = 10.0;
    p.y = mod(p.y + uTime * (0.08 + aSeed * 0.12), h);
    p.x += sin(uTime * 0.3 + aSeed * 40.0) * 0.25;
    p.z += cos(uTime * 0.25 + aSeed * 30.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aSeed) * (8.0 / -mv.z);
    vAlpha = smoothstep(0.0, 1.5, p.y) * smoothstep(h, h - 2.0, p.y) * (0.35 + aSeed * 0.65);
  }
`;
const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(uColor, a);
  }
`;

export function ChalkDust({ count = 900, spread = [24, 10, 24], center = [0, 0, -4], size = 6, color = "#ffd2bf" }) {
  const mat = useRef();
  const [positions, seeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = center[0] + (Math.random() - 0.5) * spread[0];
      pos[i * 3 + 1] = Math.random() * spread[1];
      pos[i * 3 + 2] = center[2] + (Math.random() - 0.5) * spread[2];
      seed[i] = Math.random();
    }
    return [pos, seed];
  }, [count, spread, center]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSize: { value: size }, uColor: { value: new THREE.Color(color) } }),
    [size, color]
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" count={count} array={seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------------------------------------------------------------------------
   Atmospherics
   ------------------------------------------------------------------------- */

/* Volumetric-looking beam under a strip light: an open cone, brightest at the lamp,
   fading to nothing at the floor. Additive, so overlapping beams build up. */
const beamVertex = /* glsl */ `
  varying float vY;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    vY = uv.y;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vY;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    float edge = pow(abs(dot(vN, vView)), 1.6);     // soft at the silhouette
    float fall = pow(vY, 2.2);                       // bright at the lamp end
    gl_FragColor = vec4(uColor, edge * fall * uOpacity);
  }
`;

export function LightBeam({ height = 6, top = 0.25, bottom = 2.2, color = "#ffd9c7", opacity = 0.09, ...props }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } }),
    [color, opacity]
  );
  return (
    <mesh {...props} position-y={(props.position?.[1] ?? 6) - height / 2}>
      <cylinderGeometry args={[top, bottom, height, 32, 1, true]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={beamVertex}
        fragmentShader={beamFragment}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* Drifting mist: a large plane carrying a two-octave value-noise field, stretched
   sideways so it reads as banks of haze rather than smoke puffs. */
const mistFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform float uSeed;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  void main() {
    vec2 p = vUv * vec2(3.0, 1.2) + vec2(uTime * 0.015 + uSeed, uSeed * 0.3);
    float n = fbm(p + fbm(p + uTime * 0.01));
    float band = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.45, vUv.y);
    float sides = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
    float a = smoothstep(0.35, 0.85, n) * band * sides * uOpacity;
    gl_FragColor = vec4(uColor, a);
  }
`;

export function MistLayer({ width = 40, height = 6, color = "#5a2a20", opacity = 0.5, seed = 0, ...props }) {
  const mat = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColor: { value: new THREE.Color(color) },
      uSeed: { value: seed },
    }),
    [color, opacity, seed]
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh {...props}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={sunVertex}
        fragmentShader={mistFragment}
        transparent
        depthWrite={false}
        fog={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* The sun's reflection on the rubber floor: a long soft streak running toward the camera. */
const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float a = exp(-p.x * p.x * 9.0) * smoothstep(-1.0, 0.6, p.y) * smoothstep(1.0, 0.7, p.y);
    gl_FragColor = vec4(uColor, a * uOpacity);
  }
`;

export function FloorGlow({ width = 7, length = 30, color = "#ff5b2e", opacity = 0.35, ...props }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } }),
    [color, opacity]
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <planeGeometry args={[width, length]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={sunVertex}
        fragmentShader={glowFragment}
        transparent
        depthWrite={false}
        fog={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
