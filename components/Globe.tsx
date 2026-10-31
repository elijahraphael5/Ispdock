'use client';

import { useEffect, useRef } from 'react';
import { LAND, LAND_LAT0, LAND_STEP } from '@/lib/land';
import { prefersStill } from '@/lib/site';

type V = [number, number, number];
const RAD = Math.PI / 180;
const vec = (lat: number, lon: number): V => { const a = lat * RAD, b = lon * RAD; return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)]; };

// Land dots as unit vectors (built once per page)
let DOTS: V[] | null = null;
const landDots = () => {
  if (DOTS) return DOTS;
  DOTS = [];
  LAND.split('|').forEach((row, r) => {
    if (!row) return;
    const lat = LAND_LAT0 + r * LAND_STEP, n = Math.max(1, Math.round(360 * Math.cos(lat * RAD) / LAND_STEP)), v = row.split(',').map((x) => parseInt(x, 36));
    for (let k = 0; k < v.length; k += 2) for (let i = v[k]; i < v[k] + v[k + 1]; i++) DOTS!.push(vec(lat, -180 + (i + 0.5) * 360 / n));
  });
  return DOTS;
};

// Hubs: Lagos is the POP; the rest are where the internet comes in from, so some line is always on the visible side
const P: Record<string, [number, number]> = {
  lagos: [6.45, 3.39], abuja: [9.06, 7.49], ph: [4.82, 7.03], kano: [12.0, 8.52], accra: [5.6, -0.19],
  london: [51.5, -0.13], lisbon: [38.72, -9.14], marseille: [43.3, 5.37], ny: [40.71, -74.0], miami: [25.76, -80.19],
  saopaulo: [-23.55, -46.63], capetown: [-33.92, 18.42], joburg: [-26.2, 28.04], nairobi: [-1.29, 36.82], cairo: [30.04, 31.24],
  dubai: [25.2, 55.27], mumbai: [19.08, 72.88], singapore: [1.35, 103.82], tokyo: [35.68, 139.69], sydney: [-33.87, 151.21], la: [34.05, -118.24],
};
const LINKS: [string, string][] = [['lagos', 'abuja'], ['lagos', 'ph'], ['lagos', 'kano'], ['lagos', 'accra'], ['lagos', 'lisbon'], ['lagos', 'london'],
  ['lagos', 'marseille'], ['lagos', 'capetown'], ['lagos', 'saopaulo'], ['lagos', 'nairobi'], ['lagos', 'cairo'], ['lagos', 'ny'],
  ['london', 'ny'], ['lisbon', 'miami'], ['marseille', 'dubai'], ['dubai', 'mumbai'], ['mumbai', 'singapore'], ['singapore', 'tokyo'],
  ['tokyo', 'la'], ['singapore', 'sydney'], ['la', 'ny'], ['miami', 'saopaulo'], ['capetown', 'joburg'], ['joburg', 'mumbai'], ['nairobi', 'dubai']];

// Each line: points along the great circle, lifted off the surface in the middle
const LINES = LINKS.map(([from, to], i) => {
  const a = vec(...P[from]), b = vec(...P[to]), dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const w = Math.acos(Math.max(-1, Math.min(1, dot))), s = Math.sin(w), pts: V[] = [], N = 56, lift = Math.min(0.3, 0.05 + w * 0.2);
  for (let k = 0; k <= N; k++) {
    const t = k / N, f1 = Math.sin((1 - t) * w) / s, f2 = Math.sin(t * w) / s, h = 1 + lift * Math.sin(Math.PI * t);
    pts.push([(a[0] * f1 + b[0] * f2) * h, (a[1] * f1 + b[1] * f2) * h, (a[2] * f1 + b[2] * f2) * h]);
  }
  return { pts, home: from === 'lagos', phase: (i * 0.173) % 1, speed: 0.18 + 0.35 / (0.6 + w * 2.5) };
});
const HUBS = Object.keys(P).map((k) => ({ v: vec(...P[k]), pop: k === 'lagos', ng: ['abuja', 'ph', 'kano'].includes(k) }));

// Network globe: the top half of a dotted earth on the section's bottom edge, turning all the time, with arrows
// running along the connections in a loop. Plain canvas. Pauses off screen and in background tabs; holds still for reduced motion.
export function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dots = landDots();
    const still = prefersStill();
    let lon0 = -10;
    const lat0 = -22, SPIN = 6; // centre of the view in degrees; degrees per second
    let W = 0, H = 0, dpr = 1, R = 0, cx = 0, cy = 0;
    const css = getComputedStyle(document.documentElement);
    const tok = (n: string, f: string) => css.getPropertyValue(n).trim() || f;
    const POP = tok('--c-yellow', '#FBBC04'), SITE = tok('--c-blue', '#4C8DF6'), LINE = '142,166,255';
    const MONO = tok('--ff-mono', 'ui-monospace') + ', ui-monospace, monospace';

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      R = Math.min(H / 1.12, W * 0.62); cx = W / 2; cy = H; // centre on the bottom edge: only the top half shows
    };
    let sl = 0, cl = 1;
    const st = Math.sin(lat0 * RAD), ct = Math.cos(lat0 * RAD);
    const view = (v: V, out: V) => {
      const x = v[0] * cl + v[2] * sl, z = -v[0] * sl + v[2] * cl, y = v[1];
      out[0] = x; out[1] = y * ct - z * st; out[2] = y * st + z * ct; return out;
    };
    const tmp: V = [0, 0, 0], tmp2: V = [0, 0, 0];
    const shown = (q: V) => q[1] > -0.02 && (q[2] > 0 || q[0] * q[0] + q[1] * q[1] > 1.0001);
    const X = (q: V) => cx + q[0] * R, Y = (q: V) => cy - q[1] * R;

    const draw = (t: number) => {
      sl = Math.sin(-lon0 * RAD); cl = Math.cos(-lon0 * RAD);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const gr = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.55, R * 0.1, cx, cy, R);
      gr.addColorStop(0, 'rgba(30,40,70,0.6)'); gr.addColorStop(1, 'rgba(8,11,22,0.95)');
      ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI, 0); ctx.fillStyle = gr; ctx.fill();
      ctx.strokeStyle = 'rgba(' + LINE + ',0.3)'; ctx.lineWidth = 1; ctx.stroke();
      // land dots, brighter toward the middle and the lit side, batched by brightness
      const buckets: number[][] = [[], [], [], [], [], []], ds = Math.max(1.2, R / 210);
      for (let i = 0; i < dots.length; i++) {
        const q = view(dots[i], tmp);
        if (q[2] <= 0.02 || q[1] < -0.01) continue;
        const light = q[2] * 0.75 + (q[1] * 0.3 - q[0] * 0.2) * 0.5;
        buckets[Math.max(0, Math.min(5, Math.floor(light * 6)))].push(X(q), Y(q), 0.6 + q[2] * 0.4);
      }
      buckets.forEach((list, b) => {
        if (!list.length) return;
        ctx.fillStyle = 'rgba(235,240,255,' + (0.14 + b * 0.15) + ')';
        ctx.beginPath();
        for (let k = 0; k < list.length; k += 3) { const w = ds * list[k + 2]; ctx.rect(list[k] - w / 2, list[k + 1] - w / 2, w, w); }
        ctx.fill();
      });
      // the connections, each with an arrow running along it and starting again at the far end
      LINES.forEach((L) => {
        ctx.beginPath();
        let on = false;
        for (let k = 0; k < L.pts.length; k++) {
          const q = view(L.pts[k], tmp);
          if (shown(q)) { if (!on) { ctx.moveTo(X(q), Y(q)); on = true; } else ctx.lineTo(X(q), Y(q)); } else on = false;
        }
        ctx.strokeStyle = 'rgba(' + LINE + ',' + (L.home ? 0.7 : 0.38) + ')'; ctx.lineWidth = L.home ? 1.4 : 1; ctx.stroke();
        const f = still ? 0.55 : (t * L.speed + L.phase) % 1, last = L.pts.length - 1, head = Math.max(2, Math.round(f * last)), TAIL = 9;
        const col = L.home ? '255,214,102' : '255,255,255';
        ctx.lineCap = 'round';
        for (let j = Math.max(1, head - TAIL); j <= head; j++) {
          const qa = view(L.pts[j - 1], tmp), qb = view(L.pts[j], tmp2);
          if (!shown(qa) || !shown(qb)) continue;
          const k2 = 1 - (head - j) / TAIL;
          ctx.strokeStyle = 'rgba(' + col + ',' + (k2 * 0.9) + ')'; ctx.lineWidth = 1 + k2 * 1.8;
          ctx.beginPath(); ctx.moveTo(X(qa), Y(qa)); ctx.lineTo(X(qb), Y(qb)); ctx.stroke();
        }
        ctx.lineCap = 'butt';
        const h0 = view(L.pts[head - 1], tmp), h1 = view(L.pts[head], tmp2);
        if (!shown(h0) || !shown(h1)) return;
        const ang = Math.atan2(Y(h1) - Y(h0), X(h1) - X(h0)), s = L.home ? 7 : 6;
        ctx.save(); ctx.translate(X(h1), Y(h1)); ctx.rotate(ang);
        ctx.fillStyle = 'rgb(' + col + ')'; ctx.shadowColor = 'rgb(' + col + ')'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s * 0.7, -s * 0.6); ctx.lineTo(-s * 0.35, 0); ctx.lineTo(-s * 0.7, s * 0.6); ctx.closePath(); ctx.fill();
        ctx.restore();
      });
      HUBS.forEach((h) => {
        const q = view(h.v, tmp);
        if (q[2] <= 0 || q[1] < 0) return;
        const x = X(q), y = Y(q), s = h.pop ? 5 : h.ng ? 3.5 : 2.5, col = h.pop ? POP : h.ng ? SITE : '#FFFFFF';
        ctx.globalAlpha = 0.4 + q[2] * 0.6;
        ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = h.pop ? 18 : 8;
        ctx.fillRect(x - s, y - s, s * 2, s * 2); ctx.shadowBlur = 0;
        if (h.pop && !still) { const p = (t * 0.5) % 1, d = s + p * 22; ctx.globalAlpha = (1 - p) * q[2]; ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.strokeRect(x - d, y - d, d * 2, d * 2); }
        if (h.pop && q[2] > 0.2) {
          ctx.globalAlpha = Math.min(1, (q[2] - 0.2) * 3);
          ctx.font = '500 ' + Math.max(10, R / 40) + 'px ' + MONO;
          ctx.fillStyle = '#F5F5F7'; ctx.fillText('LAGOS · POP', x + 14, y - 10);
        }
        ctx.globalAlpha = 1;
      });
    };

    let running = false, visible = false, prev = 0, clock = 0, raf = 0;
    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - prev) / 1000); prev = now; clock += dt; lon0 += SPIN * dt;
      draw(clock);
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (running || still || document.hidden || !visible) return; running = true; prev = performance.now(); raf = requestAnimationFrame(frame); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onResize = () => { resize(); draw(clock); };
    const onVis = () => { if (document.hidden) stop(); else start(); };
    resize(); draw(0);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) start(); else stop(); });
    io.observe(canvas);
    return () => { stop(); io.disconnect(); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  return <div className="globe" aria-hidden="true"><canvas className="globe-canvas" ref={ref}></canvas></div>;
}
