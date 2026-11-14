/* ========================================================
   🎄 Happy Christmas 2026 - Mobile-First 3D ASCII Tree
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
  // Cap DPR at 2 on mobile to preserve battery & high FPS
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    interfaceTreePoints();
  }
  window.addEventListener('resize', resizeCanvas);

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
    badge.innerText = `✨ ขอให้มีความสุข สุขภาพแข็งแรง และสมหวังทุกประการ 🎁 (อีก ${days} วันสู่คริสต์มาส)`;
  }
  updateCountdown();
  setInterval(updateCountdown, 60000);

  // ----------------------------------------------------
  // 3. 3D ASCII Tree Mathematical Model
  // ----------------------------------------------------
  const TREE_TIERS = 5;
  const NEEDLE_CHARS = ['%', '&', '*', 'x', 's', '#', '@', '+', '^', '.'];

  let rotationAngle = 0;
  const rotationSpeed = 0.015;
  let dragVelocity = 0;
  let isDragging = false;
  let lastTouchX = 0;
  let currentTreeName = 'AIRIN';

  // Pre-generate points for tree foliage, garland, and ornaments
  let treePoints = [];
  let garlandPoints = [];
  let ornamentPoints = [];
  let trunkPoints = [];
  let giftBoxes = [];

  function interfaceTreePoints() {
    treePoints = [];
    garlandPoints = [];
    ornamentPoints = [];
    trunkPoints = [];
    giftBoxes = [];

    const isMobile = width < 768;
    // Scale tree proportionally for small mobile screens
    const scaleFactor = isMobile ? Math.min(1, Math.max(0.72, width / 420)) : 1;
    const totalHeight = 350 * scaleFactor;
    const baseRadius = 140 * scaleFactor;

    // Branches & Needles
    const stepY = isMobile ? 5.2 : 4.5;
    for (let y = 0; y < totalHeight; y += stepY) {
      const progress = y / totalHeight;
      const tierFraction = (progress * TREE_TIERS) % 1;
      const flare = 0.75 + 0.35 * Math.pow(tierFraction, 1.4);
      const radius = progress * baseRadius * flare;

      const density = Math.floor((isMobile ? 8 : 12) + progress * (isMobile ? 24 : 32));
      for (let i = 0; i < density; i++) {
        const angle = (i / density) * Math.PI * 2 + (y * 0.15) + (Math.random() - 0.5) * 0.2;
        const r = radius * (0.2 + 0.8 * Math.sqrt(Math.random()));
        const px = r * Math.cos(angle);
        const pz = r * Math.sin(angle);
        const py = y - totalHeight * 0.65;

        treePoints.push({
          x: px,
          y: py,
          z: pz,
          char: NEEDLE_CHARS[Math.floor(Math.random() * NEEDLE_CHARS.length)],
          hue: 130 + Math.random() * 35,
          lightness: 35 + Math.random() * 30,
          scaleFactor: scaleFactor
        });
      }
    }

    // Spiral Garland
    const garlandStep = isMobile ? 0.004 : 0.003;
    for (let t = 0; t < 1; t += garlandStep) {
      const y = t * totalHeight;
      const radius = t * baseRadius * 1.02 + 5 * scaleFactor;
      const angle = t * Math.PI * 2 * 6.5;

      const px = radius * Math.cos(angle);
      const pz = radius * Math.sin(angle);
      const py = y - totalHeight * 0.65;

      garlandPoints.push({
        x: px,
        y: py,
        z: pz,
        t: t,
        char: t % 0.015 < 0.007 ? 'o' : '*',
        scaleFactor: scaleFactor
      });
    }

    // Shiny Baubles (Ruby, Gold, Cyan, Magenta, Silver)
    const ornamentColors = [
      { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.85)', name: 'ruby' },
      { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.85)', name: 'gold' },
      { color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.85)', name: 'cyan' },
      { color: '#e879f9', glow: 'rgba(232, 121, 249, 0.85)', name: 'magenta' },
      { color: '#f8fafc', glow: 'rgba(255, 255, 255, 0.95)', name: 'silver' }
    ];

    const ornamentCount = isMobile ? 36 : 48;
    for (let i = 0; i < ornamentCount; i++) {
      const progress = 0.15 + (i / ornamentCount) * 0.82;
      const tierFraction = (progress * TREE_TIERS) % 1;
      const flare = 0.75 + 0.35 * Math.pow(tierFraction, 1.4);
      const radius = progress * baseRadius * flare * 0.96;
      const angle = (i * 137.5 * Math.PI) / 180;

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
        speed: 1.5 + Math.random() * 2,
        scaleFactor: scaleFactor
      });
    }

    // Wooden Trunk
    for (let y = totalHeight * 0.35; y < totalHeight * 0.48; y += 6 * scaleFactor) {
      for (let angle = 0; angle < Math.PI * 2; angle += 0.55) {
        const r = 18 * scaleFactor * (0.8 + 0.2 * Math.random());
        trunkPoints.push({
          x: r * Math.cos(angle),
          y: y,
          z: r * Math.sin(angle),
          char: ['#', '|', 'H', 'M'][Math.floor(Math.random() * 4)],
          scaleFactor: scaleFactor
        });
      }
    }

    // Wrapped Gift Boxes
    const giftStyles = [
      { text: '[🎁]', color: '#f43f5e' },
      { text: '[🎀]', color: '#eab308' },
      { text: '[✦]', color: '#3b82f6' },
      { text: '[★]', color: '#10b981' }
    ];
    for (let g = 0; g < 6; g++) {
      const dist = (45 + Math.random() * 55) * scaleFactor;
      const ang = (g / 6) * Math.PI * 2 + 0.3;
      giftBoxes.push({
        x: dist * Math.cos(ang),
        y: totalHeight * 0.46,
        z: dist * Math.sin(ang),
        style: giftStyles[g % giftStyles.length],
        scaleFactor: scaleFactor
      });
    }
  }
  interfaceTreePoints();

  // ----------------------------------------------------
  // 4. Touch & Mouse Swipe Gestures (Interactive 3D Spin)
  // ----------------------------------------------------
  const touchHint = document.getElementById('touch-hint');
  function hideTouchHint() {
    if (touchHint && !touchHint.classList.contains('hidden')) {
      touchHint.classList.add('hidden');
    }
  }

  function handleStart(clientX, target) {
    if (target.closest('.bottom-action-dock') || 
        target.closest('.modal-backdrop') || 
        target.closest('.code-box-container') || 
        target.closest('.top-bar')) {
      return;
    }
    isDragging = true;
    lastTouchX = clientX;
    dragVelocity = 0;
    hideTouchHint();
  }

  function handleMove(clientX) {
    if (!isDragging) return;
    const deltaX = clientX - lastTouchX;
    const sensitivity = 0.0075;
    rotationAngle += deltaX * sensitivity;
    dragVelocity = deltaX * sensitivity;
    lastTouchX = clientX;
  }

  function handleEnd() {
    isDragging = false;
  }

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) handleStart(e.touches[0].clientX, e.target);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', handleEnd, { passive: true });
  window.addEventListener('touchcancel', handleEnd, { passive: true });

  window.addEventListener('mousedown', (e) => {
    handleStart(e.clientX, e.target);
  });
  window.addEventListener('mousemove', (e) => {
    handleMove(e.clientX);
  });
  window.addEventListener('mouseup', handleEnd);

  // Auto-hide touch hint after 6 seconds
  setTimeout(hideTouchHint, 6000);

  // ----------------------------------------------------
  // 5. Snow Particle System
  // ----------------------------------------------------
  const snowParticles = [];
  const SNOW_COUNT = width < 768 ? 90 : 160;

  for (let i = 0; i < SNOW_COUNT; i++) {
    snowParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      char: ['*', '·', '.', '❄'][Math.floor(Math.random() * 4)],
      speedY: 0.7 + Math.random() * 1.5,
      speedX: -0.25 + Math.random() * 0.5,
      sway: Math.random() * Math.PI * 2,
      opacity: 0.3 + Math.random() * 0.7
    });
  }

  function updateAndDrawSnow() {
    ctx.font = '13px "Fira Code", monospace';
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
  function drawGoldenStar(cx, cy, time, scaleRatio) {
    const pulse = 1 + 0.15 * Math.sin(time * 3);
    ctx.save();
    ctx.translate(cx, cy);

    ctx.shadowBlur = 20 * pulse;
    ctx.shadowColor = 'rgba(251, 191, 36, 1)';
    ctx.fillStyle = '#fffbeb';
    const starSize = Math.floor((width < 768 ? 24 : 28) * scaleRatio * pulse);
    ctx.font = `bold ${starSize}px "Fira Code", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', 0, 0);

    // Sparkle halo
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#fde047';
    ctx.font = `${Math.floor(11 * scaleRatio)}px "Fira Code", monospace`;
    const numSparks = 8;
    for (let i = 0; i < numSparks; i++) {
      const ang = (i / numSparks) * Math.PI * 2 + time * 1.2;
      const r = (18 + 7 * Math.sin(time * 5 + i)) * scaleRatio * pulse;
      ctx.fillText('✦', Math.cos(ang) * r, Math.sin(ang) * r);
    }

    ctx.restore();
  }

  // ----------------------------------------------------
  // 6. Main 3D Render Loop
  // ----------------------------------------------------
  function render(timeMs) {
    const time = timeMs * 0.001;
    ctx.clearRect(0, 0, width, height);

    const isMobile = width < 768;
    const scaleRatio = isMobile ? Math.min(1, Math.max(0.72, width / 420)) : 1;
    const centerX = width * 0.5;
    // On mobile, center higher to leave comfortable room for bottom dock
    const centerY = isMobile ? height * 0.44 : height * 0.48;
    const cameraDistance = 450;

    // Apply rotation and inertia drag
    if (!isDragging) {
      rotationAngle += rotationSpeed + dragVelocity;
      dragVelocity *= 0.94; // friction
    }

    const cosA = Math.cos(rotationAngle);
    const sinA = Math.sin(rotationAngle);

    // Background snow
    updateAndDrawSnow();

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
        scale: scale * scaleRatio,
        char: p.char
      });
    }

    // 2. Needles (Branches)
    for (let p of treePoints) {
      const xRot = p.x * cosA + p.z * sinA;
      const zRot = -p.x * sinA + p.z * cosA + cameraDistance;
      const scale = cameraDistance / zRot;

      const depthFactor = (cameraDistance + 120 - zRot) / 240;
      const lightness = Math.max(20, Math.min(75, p.lightness + depthFactor * 25));

      renderQueue.push({
        type: 'needle',
        x: centerX + xRot * scale,
        y: centerY + p.y * scale,
        z: zRot,
        scale: scale * scaleRatio,
        char: p.char,
        color: `hsl(${p.hue}, 85%, ${lightness}%)`
      });
    }

    // 3. Garland
    for (let g of garlandPoints) {
      const xRot = g.x * cosA + g.z * sinA;
      const zRot = -g.x * sinA + g.z * cosA + cameraDistance;
      const scale = cameraDistance / zRot;

      const twinkle = Math.sin(time * 5 + g.t * 30);
      const isBright = twinkle > 0.2;

      renderQueue.push({
        type: 'garland',
        x: centerX + xRot * scale,
        y: centerY + g.y * scale,
        z: zRot,
        scale: scale * scaleRatio,
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
        scale: scale * scaleRatio,
        style: o.style,
        phase: o.phase,
        speed: o.speed
      });
    }

    // 5. Gifts
    for (let box of giftBoxes) {
      const xRot = box.x * cosA + box.z * sinA;
      const zRot = -box.x * sinA + box.z * cosA + cameraDistance;
      const scale = cameraDistance / zRot;
      renderQueue.push({
        type: 'gift',
        x: centerX + xRot * scale,
        y: centerY + box.y * scale,
        z: zRot,
        scale: scale * scaleRatio,
        text: box.style.text,
        color: box.style.color
      });
    }

    // 6. Name Ribbon Plaque on the Tree
    if (currentTreeName) {
      const tagY = -totalHeight * 0.12;
      const tagRadius = 82 * scaleFactor;
      const tagX = tagRadius * Math.sin(0);
      const tagZ = tagRadius * Math.cos(0);

      const xRot = tagX * cosA + tagZ * sinA;
      const zRot = -tagX * sinA + tagZ * cosA + cameraDistance;
      const scale = cameraDistance / zRot;

      renderQueue.push({
        type: 'nametag',
        x: centerX + xRot * scale,
        y: centerY + tagY * scale,
        z: zRot,
        scale: scale * scaleRatio,
        name: currentTreeName
      });
    }

    // Z-Sort (Back to front)
    renderQueue.sort((a, b) => b.z - a.z);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let item of renderQueue) {
      const fontSize = Math.max(8, Math.floor((isMobile ? 11 : 13) * item.scale));

      if (item.type === 'trunk') {
        ctx.font = `${fontSize}px "Fira Code", monospace`;
        ctx.fillStyle = '#78350f';
        ctx.shadowBlur = 0;
        ctx.fillText(item.char, item.x, item.y);
      } else if (item.type === 'needle') {
        ctx.font = `${fontSize}px "Fira Code", monospace`;
        ctx.fillStyle = item.color;
        ctx.shadowBlur = 3;
        ctx.shadowColor = item.color;
        ctx.fillText(item.char, item.x, item.y);
      } else if (item.type === 'garland') {
        ctx.font = `bold ${fontSize + 2}px "Fira Code", monospace`;
        if (item.isBright) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#fbbf24';
        } else {
          ctx.fillStyle = '#fbbf24';
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#f59e0b';
        }
        ctx.fillText(item.char, item.x, item.y);
      } else if (item.type === 'ornament') {
        const pulse = 1 + 0.25 * Math.sin(time * item.speed + item.phase);
        const baubleSize = Math.max(10, Math.floor((isMobile ? 14 : 16) * item.scale * pulse));

        ctx.font = `bold ${baubleSize}px "Fira Code", monospace`;
        ctx.fillStyle = item.style.color;
        ctx.shadowBlur = 14 * pulse;
        ctx.shadowColor = item.style.glow;
        ctx.fillText('●', item.x, item.y);
      } else if (item.type === 'gift') {
        ctx.font = `bold ${fontSize + 3}px "Fira Code", monospace`;
        ctx.fillStyle = item.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = item.color;
        ctx.fillText(item.text, item.x, item.y);
      } else if (item.type === 'nametag') {
        const tagText = `★ ${item.name} ★`;
        const tagFontSize = Math.max(10, Math.floor((isMobile ? 12 : 14) * item.scale));
        ctx.font = `bold ${tagFontSize}px "Fira Code", monospace`;
        const textMetrics = ctx.measureText(tagText);
        const tagW = textMetrics.width + 16 * item.scale;
        const tagH = tagFontSize * 1.6;
        const radius = 6 * item.scale;

        ctx.save();
        ctx.translate(item.x, item.y);

        // Hanging ribbon strings to upper branch
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-tagW * 0.35, -tagH * 0.5);
        ctx.lineTo(-tagW * 0.35, -tagH * 1.15);
        ctx.moveTo(tagW * 0.35, -tagH * 0.5);
        ctx.lineTo(tagW * 0.35, -tagH * 1.15);
        ctx.stroke();

        // Glowing Wooden Ribbon Plaque Background
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.75)';
        const grad = ctx.createLinearGradient(-tagW/2, -tagH/2, tagW/2, tagH/2);
        grad.addColorStop(0, 'rgba(180, 83, 9, 0.95)');
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.95)');
        grad.addColorStop(1, 'rgba(146, 64, 14, 0.95)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(-tagW / 2, -tagH / 2, tagW, tagH, radius);
        } else {
          ctx.rect(-tagW / 2, -tagH / 2, tagW, tagH);
        }
        ctx.fill();

        // Golden rim
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Sparkling Name Text
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tagText, 0, 1);

        ctx.restore();
      }
    }

    // Draw Top Golden Star
    const starApexY = centerY - 350 * scaleRatio * 0.65 - (14 * scaleRatio);
    drawGoldenStar(centerX, starApexY, time, scaleRatio);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // ----------------------------------------------------
  // 7. Wham! "Last Christmas" Web Audio Synthesizer
  // ----------------------------------------------------
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicTimer = null;

  const NOTES = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37,
    'D5': 587.33, 'E5': 659.25, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00,
    'REST': 0
  };

  const LAST_XMAS_SCORE = [
    { n: 'D5', d: 0.6 }, { n: 'D5', d: 0.6 }, { n: 'B4', d: 0.8 },
    { n: 'D5', d: 0.5 }, { n: 'C#5', d: 0.5 }, { n: 'B4', d: 0.5 }, { n: 'A4', d: 0.9 },
    { n: 'F#4', d: 0.45 }, { n: 'G4', d: 0.45 }, { n: 'A4', d: 0.45 }, { n: 'B4', d: 0.45 }, { n: 'A4', d: 0.8 },
    { n: 'G4', d: 0.5 }, { n: 'F#4', d: 0.5 }, { n: 'E4', d: 0.9 },
    { n: 'D5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'B4', d: 0.8 },
    { n: 'D5', d: 0.4 }, { n: 'C#5', d: 0.4 }, { n: 'B4', d: 0.4 }, { n: 'A4', d: 0.9 },
    { n: 'F#4', d: 0.4 }, { n: 'G4', d: 0.4 }, { n: 'A4', d: 0.4 }, { n: 'B4', d: 0.5 }, { n: 'C#5', d: 0.5 }, { n: 'D5', d: 1.2 },
    { n: 'REST', d: 0.6 }
  ];

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration) {
    if (!audioCtx || freq <= 0) return;
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

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
    initAudio();
    if (isPlayingMusic) {
      isPlayingMusic = false;
      clearTimeout(musicTimer);
      musicIcon.innerText = '🔇';
      musicText.innerText = 'เพลง';
      btnMusic.classList.remove('dock-btn-attack');
    } else {
      isPlayingMusic = true;
      startMusicLoop();
      musicIcon.innerText = '🎵';
      musicText.innerText = 'เล่นอยู่';
      btnMusic.classList.add('dock-btn-attack');
    }
  });

  // ----------------------------------------------------
  // 8. "จู่โจมขี่เลื่อน" (Santa Sleigh Flight Attack)
  // ----------------------------------------------------
  const sleighActor = document.getElementById('sleigh-actor');
  const sleighChars = document.getElementById('sleigh-chars');
  const giftContainer = document.getElementById('gift-container');
  const btnSleighAttack = document.getElementById('btn-sleigh-attack');

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
    initAudio();

    if (audioCtx) {
      playTone(880, 0.1);
      setTimeout(() => playTone(1046, 0.12), 120);
      setTimeout(() => playTone(1318, 0.18), 240);
    }

    const startX = -450;
    const targetX = window.innerWidth + 350;
    const duration = 5200;
    const startTime = performance.now();
    const altitude = window.innerHeight * 0.14;

    const dropGiftInterval = setInterval(() => {
      const currentRect = sleighActor.getBoundingClientRect();
      if (currentRect.left > 30 && currentRect.left < window.innerWidth - 60) {
        spawnFallingGift(currentRect.left + 60, currentRect.top + 30);
      }
    }, 450);

    function animateFlight(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      const currentX = startX + (targetX - startX) * progress;
      const currentY = altitude + Math.sin(progress * Math.PI * 4) * 25;

      sleighActor.style.transform = `translate(${currentX}px, ${currentY}px)`;

      if (progress < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        clearInterval(dropGiftInterval);
        isSleighFlying = false;
        sleighActor.style.transform = 'translate(-450px, 0px)';
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

  // Auto trigger sleigh occasionally
  setInterval(() => {
    if (!isSleighFlying) triggerSleighFlight();
  }, 40000);

  // ----------------------------------------------------
  // 9. Live Code Drawer ("พิมพ์โค้ด")
  // ----------------------------------------------------
  const codeContent = document.getElementById('code-content');
  const codeBox = document.getElementById('code-box');
  const btnToggleCode = document.getElementById('btn-toggle-code');
  const btnCloseCode = document.getElementById('btn-close-code');

  const CODE_SNIPPETS = [
    `// 🎄 3D ASCII Christmas Tree Generator\n`,
    `// Mobile-First Responsive Creative Coding\n`,
    `const totalHeight = 350, baseRadius = 140;\n`,
    `let rotationAngle = 0;\n\n`,
    `// Math parametric branch spiral\n`,
    `for (let y = 0; y < totalHeight; y += 4.5) {\n`,
    `  const progress = y / totalHeight;\n`,
    `  const flare = 0.75 + 0.35 * Math.pow(progress * 5 % 1, 1.4);\n`,
    `  const r = progress * baseRadius * flare;\n`,
    `  const angle = (y * 0.15) + Math.cos(rotationAngle);\n`,
    `  const x = r * Math.cos(angle);\n`,
    `  const z = r * Math.sin(angle);\n`,
    `  drawNeedle(x, y, z, '%', '#10b981');\n`,
    `}\n\n`,
    `// Ornaments: shiny bauble balls\n`,
    `const ornaments = [\n`,
    `  { color: '#ef4444', glow: 'ruby' },\n`,
    `  { color: '#fbbf24', glow: 'gold' },\n`,
    `  { color: '#06b6d4', glow: 'cyan' }\n`,
    `];\n`,
    `renderOrnaments(ornaments, Math.sin(Date.now() * 0.003));\n\n`,
    `// จู่โจมขี่เลื่อน: Santa sleigh attack flight\n`,
    `launchSleighAttack(Rudolph, 'Merry Christmas!');\n`
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
  // 10. Put Name Directly on Christmas Tree Modal
  // ----------------------------------------------------
  const nameModal = document.getElementById('name-modal');
  const btnNameModal = document.getElementById('btn-name-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const userNameInput = document.getElementById('user-name-input');
  const btnSaveName = document.getElementById('btn-save-name');
  const previewNameText = document.getElementById('preview-name-text');

  btnNameModal.addEventListener('click', () => {
    nameModal.classList.add('active');
    userNameInput.value = currentTreeName;
    if (previewNameText) previewNameText.innerText = currentTreeName;
    rotationAngle = 0; // rotate tree so the plaque faces front!
    setTimeout(() => userNameInput.focus(), 150);
  });

  modalCloseBtn.addEventListener('click', () => {
    nameModal.classList.remove('active');
  });

  nameModal.addEventListener('click', (e) => {
    if (e.target === nameModal) nameModal.classList.remove('active');
  });

  // Real-time live update as the user types
  userNameInput.addEventListener('input', () => {
    const val = userNameInput.value.trim().toUpperCase() || 'AIRIN';
    currentTreeName = val;
    if (previewNameText) previewNameText.innerText = val;
    rotationAngle = 0; // keep plaque facing forward while typing
  });

  // Quick Name Presets
  const presetChips = document.querySelectorAll('.preset-chip');
  presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const name = chip.getAttribute('data-name');
      userNameInput.value = name;
      currentTreeName = name;
      if (previewNameText) previewNameText.innerText = name;
      rotationAngle = 0;
    });
  });

  btnSaveName.addEventListener('click', () => {
    const val = userNameInput.value.trim();
    if (val) {
      currentTreeName = val.toUpperCase();
    }
    if (previewNameText) previewNameText.innerText = currentTreeName;
    rotationAngle = 0;
    triggerSleighFlight();
    nameModal.classList.remove('active');
  });

  userNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnSaveName.click();
    }
  });

  // ----------------------------------------------------
  // 11. QR Code Modal & Link Copy
  // ----------------------------------------------------
  const qrModal = document.getElementById('qr-modal');
  const btnQrModal = document.getElementById('btn-qr-modal');
  const qrModalClose = document.getElementById('qr-modal-close');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const shareLinkInput = document.getElementById('share-link-input');
  const copySuccessMsg = document.getElementById('copy-success-msg');

  if (btnQrModal && qrModal) {
    btnQrModal.addEventListener('click', () => {
      qrModal.classList.add('active');
    });

    qrModalClose.addEventListener('click', () => {
      qrModal.classList.remove('active');
    });

    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) qrModal.classList.remove('active');
    });

    btnCopyLink.addEventListener('click', () => {
      shareLinkInput.select();
      shareLinkInput.setSelectionRange(0, 99999);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareLinkInput.value).then(() => {
          showCopySuccess();
        });
      } else {
        document.execCommand('copy');
        showCopySuccess();
      }
    });

    function showCopySuccess() {
      copySuccessMsg.classList.add('show');
      setTimeout(() => {
        copySuccessMsg.classList.remove('show');
      }, 3000);
    }
  }

  // Keyboard Shortcuts for Desktop: 's' for sleigh, 'm' for music, 'c' for code
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
