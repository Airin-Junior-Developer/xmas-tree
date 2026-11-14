/* ========================================================
   🎄 Happy Christmas & Holiday Season - 3D ASCII Tree
   Author: Creative Coding / Inspired by JooJhome
   ======================================================== */

(function () {
  'use strict';

  // ----------------------------------------------------
  // 1. Canvas Setup & High-DPI Monospace Renderer
  // ----------------------------------------------------
  const canvas = document.getElementById('tree-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ----------------------------------------------------
  // 2. Holiday Blessing & Countdown
  // ----------------------------------------------------
  function updateCountdown() {
    const badge = document.getElementById('countdown-badge');
    if (!badge) return;
    const now = new Date();
    const currentYear = now.getFullYear();
    let xmas = new Date(currentYear, 11, 25);
    if (now > xmas) {
      xmas = new Date(currentYear + 1, 11, 25);
    }
    const diffMs = xmas - now;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    badge.innerText = `✨ ขอให้มีความสุข สุขภาพแข็งแรง และสมหวังทุกประการตลอดเทศกาลแห่งความสุขนี้ 🎁 (อีก ${days} วันสู่คริสต์มาส)`;
  }
  updateCountdown();
  setInterval(updateCountdown, 60000);

  // ----------------------------------------------------
  // 3. 3D ASCII Tree Mathematical Model
  // ----------------------------------------------------
  const TREE_TIERS = 5;
  const NEEDLE_CHARS = ['%', '&', '*', 'x', 's', '#', '@', '+', '^', '.'];
  const STAR_CHARS = ['★', '*', '✦', '·', '+', 'X'];

  let rotationAngle = 0;
  const rotationSpeed = 0.015;

  // Pre-generate points for tree foliage, garland, and ornaments
  let treePoints = [];
  let garlandPoints = [];
  let ornamentPoints = [];
  let trunkPoints = [];
  let giftBoxes = [];
  interfaceTreePoints();

  function interfaceTreePoints() {
    treePoints = [];
    garlandPoints = [];
    ornamentPoints = [];
    trunkPoints = [];
    giftBoxes = [];

    const totalHeight = 360;
    const baseRadius = 145;

    // Branches & Needles
    for (let y = 0; y < totalHeight; y += 4.5) {
      const progress = y / totalHeight; // 0 (top) to 1 (bottom)
      // Tiered cone profile with gentle flares
      const tierIndex = Math.floor(progress * TREE_TIERS);
      const tierFraction = (progress * TREE_TIERS) % 1;
      const flare = 0.75 + 0.35 * Math.pow(tierFraction, 1.4);
      const radius = progress * baseRadius * flare;

      const density = Math.floor(12 + progress * 32);
      for (let i = 0; i < density; i++) {
        // Spiral and slight random jitter
        const angle = (i / density) * Math.PI * 2 + (y * 0.15) + (Math.random() - 0.5) * 0.2;
        const r = radius * (0.2 + 0.8 * Math.sqrt(Math.random())); // volume fill
        const px = r * Math.cos(angle);
        const pz = r * Math.sin(angle);
        const py = y - totalHeight * 0.65; // center vertically

        treePoints.push({
          x: px,
          y: py,
          z: pz,
          char: NEEDLE_CHARS[Math.floor(Math.random() * NEEDLE_CHARS.length)],
          hue: 130 + Math.random() * 35, // greens
          lightness: 35 + Math.random() * 30,
          depthScale: 0.8 + Math.random() * 0.4
        });
      }
    }

    // Spiral Garland (Golden Light Ribbon wrapping around tree)
    for (let t = 0; t < 1; t += 0.003) {
      const y = t * totalHeight;
      const progress = t;
      const radius = progress * baseRadius * 1.02 + 6;
      const angle = t * Math.PI * 2 * 6.5; // 6.5 spiral turns

      const px = radius * Math.cos(angle);
      const pz = radius * Math.sin(angle);
      const py = y - totalHeight * 0.65;

      garlandPoints.push({
        x: px,
        y: py,
        z: pz,
        t: t,
        char: t % 0.015 < 0.007 ? 'o' : '*'
      });
    }

    // Shiny Bauble Ornaments (Red, Gold, Cyan, Silver)
    const ornamentColors = [
      { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)', name: 'ruby' },
      { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.85)', name: 'gold' },
      { color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.8)', name: 'cyan' },
      { color: '#e879f9', glow: 'rgba(232, 121, 249, 0.8)', name: 'magenta' },
      { color: '#f8fafc', glow: 'rgba(255, 255, 255, 0.9)', name: 'silver' }
    ];

    for (let i = 0; i < 48; i++) {
      const progress = 0.15 + (i / 48) * 0.82;
      const tierFraction = (progress * TREE_TIERS) % 1;
      const flare = 0.75 + 0.35 * Math.pow(tierFraction, 1.4);
      const radius = progress * baseRadius * flare * 0.96;
      const angle = (i * 137.5 * Math.PI) / 180; // Golden ratio angle

      const px = radius * Math.cos(angle);
      const pz = radius * Math.sin(angle);
      const py = progress * totalHeight - totalHeight * 0.65;

      const style = ornamentColors[i % ornamentColors.length];
      ornamentPoints.push({
        x: px,
        y: py,
        z: pz,
        style: style,
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2
      });
    }

    // Wooden Trunk
    for (let y = totalHeight * 0.35; y < totalHeight * 0.48; y += 6) {
      for (let angle = 0; angle < Math.PI * 2; angle += 0.5) {
        const r = 20 * (0.8 + 0.2 * Math.random());
        trunkPoints.push({
          x: r * Math.cos(angle),
          y: y,
          z: r * Math.sin(angle),
          char: ['#', '|', 'H', 'M'][Math.floor(Math.random() * 4)]
        });
      }
    }

    // Wrapped Gift Boxes under the tree
    const giftStyles = [
      { text: '[🎁]', color: '#f43f5e' },
      { text: '[🎀]', color: '#eab308' },
      { text: '[✦]', color: '#3b82f6' },
      { text: '[★]', color: '#10b981' }
    ];
    for (let g = 0; g < 7; g++) {
      const dist = 55 + Math.random() * 65;
      const ang = (g / 7) * Math.PI * 2 + 0.3;
      giftBoxes.push({
        x: dist * Math.cos(ang),
        y: totalHeight * 0.46,
        z: dist * Math.sin(ang),
        style: giftStyles[g % giftStyles.length]
      });
    }
  }

  // ----------------------------------------------------
  // 4. Star Particles & Snow Particle System
  // ----------------------------------------------------
  const snowParticles = [];
  const SNOW_COUNT = 180;

  for (let i = 0; i < SNOW_COUNT; i++) {
    snowParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.5 + Math.random() * 1.5,
      radius: 1 + Math.random() * 2.5,
      char: ['*', '·', '.', '❄'][Math.floor(Math.random() * 4)],
      speedY: 0.8 + Math.random() * 1.8,
      speedX: -0.3 + Math.random() * 0.6,
      sway: Math.random() * Math.PI * 2,
      opacity: 0.3 + Math.random() * 0.7
    });
  }

  function updateAndDrawSnow() {
    ctx.font = '14px "Fira Code", monospace';
    for (let s of snowParticles) {
      s.y += s.speedY;
      s.sway += 0.02;
      s.x += s.speedX + Math.sin(s.sway) * 0.5;

      if (s.y > height + 20) {
        s.y = -20;
        s.x = Math.random() * width;
      }
      if (s.x > width + 20) s.x = -20;
      if (s.x < -20) s.x = width + 20;

      ctx.fillStyle = `rgba(240, 246, 255, ${s.opacity})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(s.char, s.x, s.y);
    }
  }

  // Top Radiant Golden Star
  function drawGoldenStar(cx, cy, time) {
    const pulse = 1 + 0.15 * Math.sin(time * 3);
    ctx.save();
    ctx.translate(cx, cy);

    // Glowing rays
    ctx.shadowBlur = 24 * pulse;
    ctx.shadowColor = 'rgba(251, 191, 36, 1)';
    ctx.fillStyle = '#fffbeb';
    ctx.font = `bold ${Math.floor(28 * pulse)}px "Fira Code", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', 0, 0);

    // Surrounding sparkling ASCII halo
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#fde047';
    ctx.font = '13px "Fira Code", monospace';
    const numSparks = 8;
    for (let i = 0; i < numSparks; i++) {
      const ang = (i / numSparks) * Math.PI * 2 + time * 1.2;
      const r = (20 + 8 * Math.sin(time * 5 + i)) * pulse;
      ctx.fillText('✦', Math.cos(ang) * r, Math.sin(ang) * r);
    }

    ctx.restore();
  }

  // ----------------------------------------------------
  // 5. Main 3D Render Loop
  // ----------------------------------------------------
  let lastTime = 0;

  function render(timeMs) {
    const time = timeMs * 0.001;
    ctx.clearRect(0, 0, width, height);

    // Center of tree projection
    const centerX = width * 0.5;
    const centerY = height * 0.48;
    const cameraDistance = 450;

    rotationAngle += rotationSpeed;
    const cosA = Math.cos(rotationAngle);
    const sinA = Math.sin(rotationAngle);

    // Snow in background
    updateAndDrawSnow();

    // Collect all renderable 3D entities for Z-sorting (painter's algorithm)
    const renderQueue = [];

    // 1. Trunk
    for (let p of trunkPoints) {
      const xRot = p.x * cosA + p.z * sinA;
      const zRot = -p.x * sinA + p.z * cosA + cameraDistance;
      const scale = cameraDistance / zRot;
      renderQueue.push({
        type: 'trunk',
        x: centerX + xRot * scale,
        y: centerY + p.y * scale,
        z: zRot,
        scale: scale,
        char: p.char
      });
    }

    // 2. Needles (Branches)
    for (let p of treePoints) {
      const xRot = p.x * cosA + p.z * sinA;
      const zRot = -p.x * sinA + p.z * cosA + cameraDistance;
      const scale = cameraDistance / zRot;

      // Depth lighting: front points are brighter
      const depthFactor = (cameraDistance + 120 - zRot) / 240;
      const lightness = Math.max(20, Math.min(75, p.lightness + depthFactor * 25));

      renderQueue.push({
        type: 'needle',
        x: centerX + xRot * scale,
        y: centerY + p.y * scale,
        z: zRot,
        scale: scale,
        char: p.char,
        color: `hsl(${p.hue}, 85%, ${lightness}%)`
      });
    }

    // 3. Garland
    for (let g of garlandPoints) {
      const xRot = g.x * cosA + g.z * sinA;
      const zRot = -g.x * sinA + g.z * cosA + cameraDistance;
      const scale = cameraDistance / zRot;

      // Twinkling golden glow
      const twinkle = Math.sin(time * 5 + g.t * 30);
      const isBright = twinkle > 0.2;

      renderQueue.push({
        type: 'garland',
        x: centerX + xRot * scale,
        y: centerY + g.y * scale,
        z: zRot,
        scale: scale,
        char: g.char,
        isBright: isBright
      });
    }

    // 4. Ornaments
    for (let o of ornamentPoints) {
      const xRot = o.x * cosA + o.z * sinA;
      const zRot = -o.x * sinA + o.z * cosA + cameraDistance;
      const scale = cameraDistance / zRot;

      renderQueue.push({
        type: 'ornament',
        x: centerX + xRot * scale,
        y: centerY + o.y * scale,
        z: zRot,
        scale: scale,
        style: o.style,
        phase: o.phase,
        speed: o.speed
      });
    }

    // 5. Gift boxes
    for (let box of giftBoxes) {
      const xRot = box.x * cosA + box.z * sinA;
      const zRot = -box.x * sinA + box.z * cosA + cameraDistance;
      const scale = cameraDistance / zRot;
      renderQueue.push({
        type: 'gift',
        x: centerX + xRot * scale,
        y: centerY + box.y * scale,
        z: zRot,
        scale: scale,
        text: box.style.text,
        color: box.style.color
      });
    }

    // Sort far to near (back to front)
    renderQueue.sort((a, b) => b.z - a.z);

    // Draw all sorted items
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let item of renderQueue) {
      const fontSize = Math.max(9, Math.floor(13 * item.scale));

      if (item.type === 'trunk') {
        ctx.font = `${fontSize}px "Fira Code", monospace`;
        ctx.fillStyle = '#78350f';
        ctx.shadowBlur = 0;
        ctx.fillText(item.char, item.x, item.y);
      } else if (item.type === 'needle') {
        ctx.font = `${fontSize}px "Fira Code", monospace`;
        ctx.fillStyle = item.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = item.color;
        ctx.fillText(item.char, item.x, item.y);
      } else if (item.type === 'garland') {
        ctx.font = `bold ${fontSize + 2}px "Fira Code", monospace`;
        if (item.isBright) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#fbbf24';
        } else {
          ctx.fillStyle = '#fbbf24';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#f59e0b';
        }
        ctx.fillText(item.char, item.x, item.y);
      } else if (item.type === 'ornament') {
        const pulse = 1 + 0.25 * Math.sin(time * item.speed + item.phase);
        const baubleSize = Math.max(12, Math.floor(16 * item.scale * pulse));

        ctx.font = `bold ${baubleSize}px "Fira Code", monospace`;
        ctx.fillStyle = item.style.color;
        ctx.shadowBlur = 16 * pulse;
        ctx.shadowColor = item.style.glow;
        ctx.fillText('●', item.x, item.y);
      } else if (item.type === 'gift') {
        ctx.font = `bold ${fontSize + 3}px "Fira Code", monospace`;
        ctx.fillStyle = item.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = item.color;
        ctx.fillText(item.text, item.x, item.y);
      }
    }

    // Draw Golden Star at tree apex
    const starApexY = centerY - 360 * 0.65 - 15;
    drawGoldenStar(centerX, starApexY, time);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // ----------------------------------------------------
  // 6. Wham! "Last Christmas" Web Audio Synthesizer
  // ----------------------------------------------------
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicTimer = null;

  // Melody notes & durations (Last Christmas Chorus)
  // Frequencies (Hz):
  const NOTES = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37,
    'D5': 587.33, 'E5': 659.25, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00,
    'REST': 0
  };

  // "Last Christmas I gave you my heart, but the very next day you gave it away..."
  const LAST_XMAS_SCORE = [
    // Last Christmas
    { n: 'D5', d: 0.6 }, { n: 'D5', d: 0.6 }, { n: 'B4', d: 0.8 },
    // I gave you my heart
    { n: 'D5', d: 0.5 }, { n: 'C#5', d: 0.5 }, { n: 'B4', d: 0.5 }, { n: 'A4', d: 0.9 },
    // But the very next day
    { n: 'F#4', d: 0.45 }, { n: 'G4', d: 0.45 }, { n: 'A4', d: 0.45 }, { n: 'B4', d: 0.45 }, { n: 'A4', d: 0.8 },
    // You gave it away
    { n: 'G4', d: 0.5 }, { n: 'F#4', d: 0.5 }, { n: 'E4', d: 0.9 },
    // This year, to save me from tears
    { n: 'D5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'B4', d: 0.8 },
    { n: 'D5', d: 0.4 }, { n: 'C#5', d: 0.4 }, { n: 'B4', d: 0.4 }, { n: 'A4', d: 0.9 },
    // I'll give it to someone special
    { n: 'F#4', d: 0.4 }, { n: 'G4', d: 0.4 }, { n: 'A4', d: 0.4 }, { n: 'B4', d: 0.5 }, { n: 'C#5', d: 0.5 }, { n: 'D5', d: 1.2 },
    { n: 'REST', d: 0.6 }
  ];

  function playTone(freq, duration) {
    if (!audioCtx || freq <= 0) return;
    const now = audioCtx.currentTime;

    // Chime / Bell-like synth lead
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Subtle chorus / shimmer oscillator
    const shimmer = audioCtx.createOscillator();
    const shimmerGain = audioCtx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(freq * 2, now);
    shimmerGain.gain.setValueAtTime(0.04, now);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.7);

    osc.connect(gain);
    shimmer.connect(shimmerGain);
    gain.connect(audioCtx.destination);
    shimmerGain.connect(audioCtx.destination);

    osc.start(now);
    shimmer.start(now);
    osc.stop(now + duration);
    shimmer.stop(now + duration);
  }

  function startMusicLoop() {
    let noteIndex = 0;
    function nextNote() {
      if (!isPlayingMusic) return;
      const item = LAST_XMAS_SCORE[noteIndex];
      const freq = NOTES[item.n];
      playTone(freq, item.d);

      noteIndex = (noteIndex + 1) % LAST_XMAS_SCORE.length;
      musicTimer = setTimeout(nextNote, item.d * 1000 * 0.95);
    }
    nextNote();
  }

  const btnMusic = document.getElementById('btn-music');
  const musicIcon = document.getElementById('music-icon');
  const musicText = document.getElementById('music-text');

  btnMusic.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isPlayingMusic) {
      isPlayingMusic = false;
      clearTimeout(musicTimer);
      musicIcon.innerText = '🔇';
      musicText.innerText = 'เพลง Last Christmas';
      btnMusic.classList.remove('btn-attack');
      btnMusic.classList.add('btn-secondary');
    } else {
      isPlayingMusic = true;
      startMusicLoop();
      musicIcon.innerText = '🎵';
      musicText.innerText = 'กำลังเล่น Last Christmas';
      btnMusic.classList.remove('btn-secondary');
      btnMusic.classList.add('btn-attack');
    }
  });

  // ----------------------------------------------------
  // 7. "จู่โจมขี่เลื่อน" (Santa Sleigh Attack Flight)
  // ----------------------------------------------------
  const sleighActor = document.getElementById('sleigh-actor');
  const sleighChars = document.getElementById('sleigh-chars');
  const giftContainer = document.getElementById('gift-container');
  const btnSleighAttack = document.getElementById('btn-sleigh-attack');

  // Multi-line ASCII Reindeer + Sleigh
  const SLEIGH_ASCII = 
`        __/\\__              __/\\__
   .---'  (oo)         .---'  (oo)      (🔴) RUDOLPH
  /       (..)        /       (..)     /
 / /|     |  |       / /|     |  |    /
*  ||-----|| |      *  ||-----|| |   /
   ^^     ^^           ^^     ^^
   =====================================>`;

  sleighChars.innerText = SLEIGH_ASCII;

  let isSleighFlying = false;

  function triggerSleighFlight() {
    if (isSleighFlying) return;
    isSleighFlying = true;

    // Jingle sound if audioCtx available
    if (audioCtx) {
      playTone(880, 0.1);
      setTimeout(() => playTone(1046, 0.12), 120);
      setTimeout(() => playTone(1318, 0.18), 240);
    }

    const startX = -600;
    const targetX = window.innerWidth + 400;
    const duration = 5500; // ms
    const startTime = performance.now();
    const altitude = window.innerHeight * (0.12 + Math.random() * 0.15);

    // Drop gifts periodically during flight
    const dropGiftInterval = setInterval(() => {
      const currentRect = sleighActor.getBoundingClientRect();
      if (currentRect.left > 50 && currentRect.left < window.innerWidth - 100) {
        spawnFallingGift(currentRect.left + 80, currentRect.top + 40);
      }
    }, 450);

    function animateFlight(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Ease-in-out + wavy flight curve
      const currentX = startX + (targetX - startX) * progress;
      const currentY = altitude + Math.sin(progress * Math.PI * 4) * 35;

      sleighActor.style.transform = `translate(${currentX}px, ${currentY}px)`;

      if (progress < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        clearInterval(dropGiftInterval);
        isSleighFlying = false;
        sleighActor.style.transform = 'translate(-600px, 0px)';
      }
    }

    requestAnimationFrame(animateFlight);
  }

  function spawnFallingGift(x, y) {
    const giftIcons = ['🎁', '🎀', '📦', '⭐', '🍭'];
    const el = document.createElement('div');
    el.className = 'falling-gift';
    el.innerText = giftIcons[Math.floor(Math.random() * giftIcons.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    giftContainer.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 2500);
  }

  btnSleighAttack.addEventListener('click', triggerSleighFlight);

  // Auto trigger sleigh occasionally (every 35 seconds)
  setInterval(() => {
    if (!isSleighFlying) triggerSleighFlight();
  }, 35000);

  // ----------------------------------------------------
  // 8. Live Code Typing Window Simulation ("พิมพ์โค้ด")
  // ----------------------------------------------------
  const codeContent = document.getElementById('code-content');
  const codeBox = document.getElementById('code-box');
  const btnToggleCode = document.getElementById('btn-toggle-code');
  const btnCloseCode = document.getElementById('btn-close-code');

  const CODE_SNIPPETS = [
    `// 🎄 3D ASCII Christmas Tree Generator\n`,
    `const totalHeight = 360, baseRadius = 145;\n`,
    `let rotationAngle = 0;\n\n`,
    `// Math parametric branch spiral\n`,
    `for (let y = 0; y < totalHeight; y += 4.5) {\n`,
    `  const progress = y / totalHeight;\n`,
    `  const flare = 0.75 + 0.35 * Math.pow(progress * 5 % 1, 1.4);\n`,
    `  const r = progress * baseRadius * flare;\n`,
    `  const angle = (y * 0.15) + Math.cos(rotationAngle);\n`,
    `  const x = r * Math.cos(angle);\n`,
    `  const z = r * Math.sin(angle);\n`,
    `  // Draw needle with emerald green bloom\n`,
    `  drawNeedle(x, y, z, '%', '#10b981');\n`,
    `}\n\n`,
    `// Ornaments: shiny bauble balls in ruby red, gold and cyan\n`,
    `const ornaments = [\n`,
    `  { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)' }, // Ruby\n`,
    `  { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.8)' }, // Gold\n`,
    `  { color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.8)' }  // Cyan\n`,
    `];\n`,
    `renderOrnaments(ornaments, Math.sin(Date.now() * 0.003));\n\n`,
    `// จู่โจมขี่เลื่อน: Santa sleigh flight attack\n`,
    `function launchSleighAttack() {\n`,
    `  const Rudolph = { nose: '#ff0033', glow: true };\n`,
    `  dropGiftsAcrossSky(Rudolph, 'Merry Christmas!');\n`,
    `}\n`
  ];

  let snippetIndex = 0;
  let charIndex = 0;
  let currentRawCode = '';

  function syntaxHighlight(code) {
    return code
      .replace(/(\/\/[^\n]*)/g, '<span class="syn-comment">$1</span>')
      .replace(/\b(const|let|var|function|return|for|if|else)\b/g, '<span class="syn-keyword">$1</span>')
      .replace(/\b(Math|console|document|window|Date)\b/g, '<span class="syn-func">$1</span>')
      .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="syn-num">$1</span>')
      .replace(/('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/g, '<span class="syn-str">$1</span>')
      + '<span class="syn-cursor"></span>';
  }

  function typeCode() {
    if (snippetIndex >= CODE_SNIPPETS.length) {
      // Loop over
      snippetIndex = 0;
      charIndex = 0;
      currentRawCode = '';
    }

    const currentLine = CODE_SNIPPETS[snippetIndex];
    if (charIndex < currentLine.length) {
      currentRawCode += currentLine[charIndex];
      charIndex++;
      codeContent.innerHTML = syntaxHighlight(currentRawCode);
      const codeBody = codeBox.querySelector('.code-box-body');
      codeBody.scrollTop = codeBody.scrollHeight;
      setTimeout(typeCode, 25 + Math.random() * 30);
    } else {
      snippetIndex++;
      charIndex = 0;
      setTimeout(typeCode, 350);
    }
  }
  typeCode();

  // Toggle / Window Controls
  btnToggleCode.addEventListener('click', () => {
    codeBox.classList.toggle('closed');
  });
  btnCloseCode.addEventListener('click', () => {
    codeBox.classList.add('closed');
  });

  const dotMin = codeBox.querySelector('.dot-min');
  dotMin.addEventListener('click', () => {
    codeBox.classList.toggle('minimized');
  });

  // ----------------------------------------------------
  // 9. Personalized Name & Greeting Card Modal
  // ----------------------------------------------------
  const nameModal = document.getElementById('name-modal');
  const btnNameModal = document.getElementById('btn-name-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const userNameInput = document.getElementById('user-name-input');
  const btnSaveName = document.getElementById('btn-save-name');
  const asciiBanner = document.getElementById('ascii-banner');
  const personalizedMessage = document.getElementById('personalized-message');
  const avatarFileInput = document.getElementById('avatar-file-input');
  const santaFaceImg = document.getElementById('santa-face-img');

  btnNameModal.addEventListener('click', () => {
    nameModal.classList.add('active');
    userNameInput.focus();
  });

  modalCloseBtn.addEventListener('click', () => {
    nameModal.classList.remove('active');
  });

  nameModal.addEventListener('click', (e) => {
    if (e.target === nameModal) nameModal.classList.remove('active');
  });

  function updateGreeting(name) {
    const cleanName = (name || 'Airin').trim().toUpperCase();

    // ASCII Art banner generator
    const banner = 
`  __  __                          ____ _          _     _                         
 |  \\/  | ___ _ __ _ __ _   _    / ___| |__  _ __(_)___| |_ _ __ ___   __ _ ___  
 | |\\/| |/ _ \\ '__| '__| | | |  | |   | '_ \\| '__| / __| __| '_ \` _ \\ / _\` / __| 
 | |  | |  __/ |  | |  | |_| |  | |___| | | | |  | \\__ \\ |_| | | | | | (_| \\__ \\ 
 |_|  |_|\\___|_|  |_|   \\__, |   \\____|_| |_|_|  |_|___/\\__|_| |_| |_|\\__,_|___/ 
                        |___/                                                     
                 ★ ★ ★ TO: ${cleanName} ★ ★ ★`;

    asciiBanner.innerText = banner;
    personalizedMessage.innerText = `✨ ขอให้คุณ ${cleanName} มีความสุข สมหวัง และอบอุ่นในเทศกาลคริสต์มาสนี้! 🎄🎁✨`;
  }

  btnSaveName.addEventListener('click', () => {
    const val = userNameInput.value;
    updateGreeting(val);
    triggerSleighFlight();
    setTimeout(() => {
      nameModal.classList.remove('active');
    }, 1500);
  });

  userNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnSaveName.click();
    }
  });

  // Default initial greeting
  updateGreeting('YOU');

  // Avatar Upload for Santa
  avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        santaFaceImg.src = event.target.result;
        nameModal.classList.remove('active');
        triggerSleighFlight();
      };
      reader.readAsDataURL(file);
    }
  });

  // Keyboard Shortcuts: 's' for sleigh, 'm' for music, 'c' for code
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key.toLowerCase() === 's') {
      triggerSleighFlight();
    } else if (e.key.toLowerCase() === 'm') {
      btnMusic.click();
    } else if (e.key.toLowerCase() === 'c') {
      codeBox.classList.toggle('closed');
    }
  });

})();
