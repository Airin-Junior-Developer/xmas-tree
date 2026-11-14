#!/usr/bin/env node

/**
 * 🎄 Happy Christmas & Holiday Season - 3D ASCII Tree in Terminal
 * Pure Node.js (No external dependencies required)
 * Run: node tree.js
 */

const readline = require('readline');

// Terminal Dimensions
const cols = process.stdout.columns || 80;
const rows = process.stdout.rows || 36;

const WIDTH = Math.min(100, cols);
const HEIGHT = Math.min(42, rows - 2);

// ANSI Colors
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const HIDE_CURSOR = '\x1b[?25l';
const SHOW_CURSOR = '\x1b[?25h';
const CLEAR_SCREEN = '\x1b[2J\x1b[H';

function rgb(r, g, b, str) {
  return `\x1b[38;2;${r};${g};${b}m${str}${RESET}`;
}

// ----------------------------------------------------
// Mathematical 3D Model
// ----------------------------------------------------
const NEEDLE_CHARS = ['%', '&', '*', 'x', 's', '#', '@', '^', '.'];
const totalHeight = 24;
const baseRadius = 14;
const cameraDistance = 35;

let rotationAngle = 0;
let userName = 'AIRIN';
let sleighX = -50;
let isSleighActive = false;

// Generate Points
const treePoints = [];
const garlandPoints = [];
const ornamentPoints = [];
const trunkPoints = [];

// Needles
for (let y = 0; y < totalHeight; y += 0.8) {
  const progress = y / totalHeight;
  const tierIndex = Math.floor(progress * 4);
  const tierFraction = (progress * 4) % 1;
  const flare = 0.7 + 0.4 * Math.pow(tierFraction, 1.3);
  const radius = progress * baseRadius * flare;

  const count = Math.floor(8 + progress * 24);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + y * 0.2 + (Math.random() - 0.5) * 0.25;
    const r = radius * (0.3 + 0.7 * Math.sqrt(Math.random()));
    treePoints.push({
      x: r * Math.cos(angle),
      y: y - totalHeight * 0.55,
      z: r * Math.sin(angle),
      char: NEEDLE_CHARS[Math.floor(Math.random() * NEEDLE_CHARS.length)],
      greenShade: Math.floor(130 + Math.random() * 90)
    });
  }
}

// Garland Spiral
for (let t = 0; t < 1; t += 0.008) {
  const y = t * totalHeight;
  const radius = t * baseRadius * 1.05 + 0.8;
  const angle = t * Math.PI * 2 * 5.5;
  garlandPoints.push({
    x: radius * Math.cos(angle),
    y: y - totalHeight * 0.55,
    z: radius * Math.sin(angle),
    t: t
  });
}

// Ornaments
const ORNAMENT_COLORS = [
  [239, 68, 68],   // Red
  [251, 191, 36],  // Gold
  [6, 182, 212],   // Cyan
  [236, 72, 153],  // Pink
  [248, 250, 252]  // White
];

for (let i = 0; i < 24; i++) {
  const progress = 0.2 + (i / 24) * 0.75;
  const flare = 0.7 + 0.4 * Math.pow((progress * 4) % 1, 1.3);
  const radius = progress * baseRadius * flare * 0.98;
  const angle = (i * 137.5 * Math.PI) / 180;

  ornamentPoints.push({
    x: radius * Math.cos(angle),
    y: progress * totalHeight - totalHeight * 0.55,
    z: radius * Math.sin(angle),
    color: ORNAMENT_COLORS[i % ORNAMENT_COLORS.length],
    phase: Math.random() * Math.PI * 2
  });
}

// Trunk
for (let y = totalHeight * 0.45; y < totalHeight * 0.62; y += 1) {
  for (let angle = 0; angle < Math.PI * 2; angle += 0.8) {
    const r = 2.2;
    trunkPoints.push({
      x: r * Math.cos(angle),
      y: y,
      z: r * Math.sin(angle),
      char: '#'
    });
  }
}

// Snow Particles
const snow = [];
for (let i = 0; i < 40; i++) {
  snow.push({
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
    char: ['.', '*', '·', '❄'][Math.floor(Math.random() * 4)],
    speed: 0.3 + Math.random() * 0.5
  });
}

// ----------------------------------------------------
// Terminal Render Loop
// ----------------------------------------------------
let tick = 0;

function renderFrame() {
  tick++;
  rotationAngle += 0.05;
  const cosA = Math.cos(rotationAngle);
  const sinA = Math.sin(rotationAngle);

  // Initialize frame buffer & z-buffer
  const buffer = [];
  const zBuffer = [];
  for (let y = 0; y < HEIGHT; y++) {
    buffer[y] = new Array(WIDTH).fill(' ');
    zBuffer[y] = new Array(WIDTH).fill(9999);
  }

  // Update & Draw Snow in background
  for (let s of snow) {
    s.y += s.speed;
    if (s.y >= HEIGHT) {
      s.y = 0;
      s.x = Math.floor(Math.random() * WIDTH);
    }
    const py = Math.floor(s.y);
    const px = Math.floor(s.x);
    if (py >= 0 && py < HEIGHT && px >= 0 && px < WIDTH) {
      buffer[py][px] = rgb(180, 210, 255, s.char);
    }
  }

  const cx = Math.floor(WIDTH / 2);
  const cy = Math.floor(HEIGHT / 2) + 1;

  // Project Trunk
  for (let p of trunkPoints) {
    const xRot = p.x * cosA + p.z * sinA;
    const zRot = -p.x * sinA + p.z * cosA + cameraDistance;
    const scale = cameraDistance / zRot;

    const px = Math.floor(cx + xRot * scale * 2);
    const py = Math.floor(cy + p.y * scale);

    if (px >= 0 && px < WIDTH && py >= 0 && py < HEIGHT) {
      if (zRot < zBuffer[py][px]) {
        zBuffer[py][px] = zRot;
        buffer[py][px] = rgb(120, 53, 15, p.char);
      }
    }
  }

  // Project Tree Foliage
  for (let p of treePoints) {
    const xRot = p.x * cosA + p.z * sinA;
    const zRot = -p.x * sinA + p.z * cosA + cameraDistance;
    const scale = cameraDistance / zRot;

    const px = Math.floor(cx + xRot * scale * 2.1);
    const py = Math.floor(cy + p.y * scale);

    if (px >= 0 && px < WIDTH && py >= 0 && py < HEIGHT) {
      if (zRot < zBuffer[py][px]) {
        zBuffer[py][px] = zRot;
        const depthBright = Math.max(0.6, (cameraDistance + 10 - zRot) / 20);
        const g = Math.min(255, Math.floor(p.greenShade * depthBright));
        const r = Math.floor(g * 0.15);
        const b = Math.floor(g * 0.35);
        buffer[py][px] = rgb(r, g, b, p.char);
      }
    }
  }

  // Project Garland
  for (let g of garlandPoints) {
    const xRot = g.x * cosA + g.z * sinA;
    const zRot = -g.x * sinA + g.z * cosA + cameraDistance;
    const scale = cameraDistance / zRot;

    const px = Math.floor(cx + xRot * scale * 2.1);
    const py = Math.floor(cy + g.y * scale);

    if (px >= 0 && px < WIDTH && py >= 0 && py < HEIGHT) {
      if (zRot < zBuffer[py][px]) {
        zBuffer[py][px] = zRot;
        const twinkle = Math.sin(tick * 0.3 + g.t * 20) > 0;
        buffer[py][px] = twinkle ? rgb(255, 255, 255, BOLD + 'o') : rgb(251, 191, 36, '•');
      }
    }
  }

  // Project Ornaments
  for (let o of ornamentPoints) {
    const xRot = o.x * cosA + o.z * sinA;
    const zRot = -o.x * sinA + o.z * cosA + cameraDistance;
    const scale = cameraDistance / zRot;

    const px = Math.floor(cx + xRot * scale * 2.1);
    const py = Math.floor(cy + o.y * scale);

    if (px >= 0 && px < WIDTH && py >= 0 && py < HEIGHT) {
      if (zRot < zBuffer[py][px]) {
        zBuffer[py][px] = zRot;
        const [cr, cg, cb] = o.color;
        buffer[py][px] = rgb(cr, cg, cb, BOLD + '@');
      }
    }
  }

  // Star on Top
  const starApexY = Math.floor(cy - totalHeight * 0.55 * (cameraDistance / cameraDistance) - 1);
  if (starApexY >= 0 && starApexY < HEIGHT && cx >= 0 && cx < WIDTH) {
    buffer[starApexY][cx] = rgb(255, 255, 200, BOLD + '★');
    if (cx - 1 >= 0) buffer[starApexY][cx - 1] = rgb(251, 191, 36, '-');
    if (cx + 1 < WIDTH) buffer[starApexY][cx + 1] = rgb(251, 191, 36, '-');
  }

  // Santa Flight across sky
  if (isSleighActive) {
    sleighX += 2;
    const sleighY = 3;
    const sleighText = `..-~* [🔴 RUDOLPH] === (🎅 SANTA'S SLEIGH) 🎁 🎁 🎁`;
    for (let c = 0; c < sleighText.length; c++) {
      const pos = sleighX + c;
      if (pos >= 0 && pos < WIDTH && sleighY < HEIGHT) {
        buffer[sleighY][pos] = rgb(244, 63, 94, BOLD + sleighText[c]);
      }
    }
    if (sleighX > WIDTH + 10) {
      isSleighActive = false;
      sleighX = -50;
    }
  }

  // Header Banner
  const title = `🎄 HAPPY CHRISTMAS & HOLIDAYS 2026 🎄`;
  const sub = `✨ WISHING YOU JOY, PEACE & HAPPINESS TO: ${userName} ✨`;
  const controls = `[S: จู่โจมขี่เลื่อน (Santa Flight)]  [N: เปลี่ยนชื่อ (Change Name)]  [Q: ออก (Quit)]`;

  const titleStart = Math.max(0, Math.floor((WIDTH - title.length) / 2));
  for (let i = 0; i < title.length && titleStart + i < WIDTH; i++) {
    buffer[0][titleStart + i] = rgb(251, 191, 36, BOLD + title[i]);
  }

  const subStart = Math.max(0, Math.floor((WIDTH - sub.length) / 2));
  for (let i = 0; i < sub.length && subStart + i < WIDTH; i++) {
    buffer[1][subStart + i] = rgb(52, 211, 153, sub[i]);
  }

  const ctrlStart = Math.max(0, Math.floor((WIDTH - controls.length) / 2));
  for (let i = 0; i < controls.length && ctrlStart + i < WIDTH; i++) {
    buffer[HEIGHT - 1][ctrlStart + i] = rgb(148, 163, 184, controls[i]);
  }

  // Draw out buffer to stdout
  const output = buffer.map((row) => row.join('')).join('\n');
  process.stdout.write(`\x1b[H${output}`);
}

// ----------------------------------------------------
// Terminal Setup & Keyboard Events
// ----------------------------------------------------
process.stdout.write(CLEAR_SCREEN + HIDE_CURSOR);

const interval = setInterval(renderFrame, 65);

function cleanupAndExit() {
  clearInterval(interval);
  process.stdout.write(SHOW_CURSOR + '\n' + RESET);
  process.exit(0);
}

process.on('SIGINT', cleanupAndExit);
process.on('SIGTERM', cleanupAndExit);

if (process.stdin.isTTY) {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c' || key.name === 'q') {
      cleanupAndExit();
    } else if (key.name === 's') {
      if (!isSleighActive) {
        isSleighActive = true;
        sleighX = -45;
      }
    } else if (key.name === 'n') {
      clearInterval(interval);
      process.stdin.setRawMode(false);
      process.stdout.write(SHOW_CURSOR);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      process.stdout.write('\n\x1b[1;33mพิมพ์ชื่อใหม่ของคุณ: \x1b[0m');
      rl.question('', (ans) => {
        if (ans.trim()) userName = ans.trim().toUpperCase();
        rl.close();
        process.stdout.write(CLEAR_SCREEN + HIDE_CURSOR);
        process.stdin.setRawMode(true);
        setInterval(renderFrame, 65);
      });
    }
  });
}
