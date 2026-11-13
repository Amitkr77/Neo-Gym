import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   RippleArt — the program cards' "plates".
   A tiny raw-WebGL canvas (no three.js) painting a poster for each program: an
   ember sun cut by heat bands, with one motif drawn over it as signed-distance
   shapes. The surface hangs like cloth — a slow fold always moves through it —
   and the pointer drops ripples into it.
   It only renders while on screen; with reduced motion it draws one still frame.
   ------------------------------------------------------------------------- */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uHover;
uniform int uMotif;

float sdBox(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
float sdCircle(vec2 p, float r) { return length(p) - r; }
float stroke(float d, float w) { return smoothstep(w, w * 0.4, abs(d)); }
float fill(float d) { return smoothstep(0.004, -0.004, d); }

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;

  // cloth: two slow folds travelling across the plate
  float fold = sin(uv.x * 5.0 + uTime * 0.7) * 0.006 + sin(uv.y * 7.0 - uTime * 0.5) * 0.004;
  uv += vec2(fold, fold * 0.6);

  // pointer ripple
  vec2 m = uMouse;
  vec2 d = (uv - m) * vec2(aspect, 1.0);
  float r = length(d);
  float wave = sin(r * 38.0 - uTime * 7.0) * exp(-r * 5.0) * 0.018 * uHover;
  uv += normalize(d + 1e-4) * wave / vec2(aspect, 1.0);

  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // background: ink with a warm floor glow
  vec3 ink = vec3(0.043, 0.043, 0.047);
  vec3 ember = vec3(1.0, 0.357, 0.18);
  vec3 deep = vec3(0.72, 0.21, 0.06);
  vec3 col = ink + deep * 0.25 * smoothstep(0.2, -0.6, p.y);

  // sun
  vec2 sp = p - vec2(0.0, 0.12);
  float sun = fill(sdCircle(sp, 0.28));
  float bands = step(0.5, fract((sp.y + uTime * 0.02) * 14.0));
  float cut = mix(1.0, bands, smoothstep(0.02, -0.2, sp.y));
  vec3 sunCol = mix(vec3(1.0, 0.6, 0.42), ember, smoothstep(0.25, -0.25, sp.y));
  col = mix(col, sunCol, sun * cut);
  col += ember * 0.35 * exp(-max(length(sp) - 0.28, 0.0) * 9.0) * (1.0 - sun);

  // horizon line
  col = mix(col, ember * 0.6, stroke(p.y + 0.16, 0.003));

  // motif, drawn as an ink silhouette with an ember rim
  float s = 1e3;
  if (uMotif == 0) {
    // barbell
    s = sdBox(p - vec2(0.0, -0.05), vec2(0.42, 0.008));
    for (int i = 0; i < 2; i++) {
      float side = i == 0 ? -1.0 : 1.0;
      s = min(s, sdBox(p - vec2(side * 0.3, -0.05), vec2(0.018, 0.12)));
      s = min(s, sdBox(p - vec2(side * 0.34, -0.05), vec2(0.014, 0.095)));
      s = min(s, sdBox(p - vec2(side * 0.375, -0.05), vec2(0.01, 0.07)));
    }
  } else if (uMotif == 1) {
    // running track: nested ellipses in perspective
    vec2 q = (p - vec2(0.0, -0.3)) * vec2(1.0, 3.2);
    float t1 = abs(length(q) - 0.42) - 0.006;
    float t2 = abs(length(q) - 0.5) - 0.006;
    float t3 = abs(length(q) - 0.58) - 0.006;
    s = min(min(t1, t2), t3);
  } else if (uMotif == 2) {
    // yoga: calm water, the sun mirrored in it
    float ripple = sin(p.x * 40.0 + uTime) * 0.004;
    float water = p.y + 0.16 + ripple;
    col = mix(col, ink + deep * 0.15, smoothstep(0.0, -0.01, water));
    vec2 mp = vec2(p.x, -p.y - 0.44);
    float refl = fill(sdCircle(mp, 0.28)) * step(0.5, fract(p.y * 40.0 + uTime * 0.3));
    col += ember * 0.35 * refl * smoothstep(0.0, -0.01, water);
  } else {
    // cardio: heartbeat trace across the sun
    float x = p.x;
    float y = -0.02;
    float k = fract((x + 0.6) * 1.1 - uTime * 0.15);
    y += (k > 0.42 && k < 0.46) ? (k - 0.42) * 4.0 : 0.0;
    y += (k >= 0.46 && k < 0.5) ? 0.16 - (k - 0.46) * 9.0 : 0.0;
    y += (k >= 0.5 && k < 0.54) ? -0.2 + (k - 0.5) * 5.0 : 0.0;
    s = abs(p.y - y) - 0.004;
  }
  if (uMotif != 2) {
    col = mix(col, ink, fill(s));
    col += ember * 0.9 * stroke(s, 0.006);
  }

  // hover lifts the whole plate a touch
  col *= 0.85 + 0.25 * uHover;

  // grain + vignette
  float g = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.04;
  col *= smoothstep(1.2, 0.3, length((vUv - 0.5) * vec2(1.0, 1.3)));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || "shader error");
  return sh;
}

export default function RippleArt({ motif = 0, hoverRef, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // card falls back to its CSS gradient

    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
    } catch (e) {
      if (import.meta.env.DEV) console.warn("RippleArt disabled:", e);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      time: gl.getUniformLocation(prog, "uTime"),
      res: gl.getUniformLocation(prog, "uRes"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      hover: gl.getUniformLocation(prog, "uHover"),
      motif: gl.getUniformLocation(prog, "uMotif"),
    };
    gl.uniform1i(u.motif, motif);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let hover = 0;
    let visible = false;
    let raf = 0;
    let last = performance.now();
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(u.res, w, h);
    };

    const draw = () => {
      gl.uniform1f(u.time, time);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.hover, hover);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      const target = hoverRef?.current?.active ? 1 : 0;
      hover += (target - hover) * (1 - Math.exp(-6 * dt));
      if (hoverRef?.current) {
        mouse.tx = hoverRef.current.x;
        mouse.ty = hoverRef.current.y;
      }
      mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-10 * dt));
      mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-10 * dt));
      draw();
      if (visible) raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (still || !visible) draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !still;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else {
        draw();
      }
    });
    io.observe(canvas);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      // Free GPU objects but keep the context: React may remount on this same canvas
      // (StrictMode, fast refresh), and a lost context can't be revived.
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [motif, hoverRef]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />;
}
