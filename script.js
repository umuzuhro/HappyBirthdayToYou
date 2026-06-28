(function () {
  // =========================================================
  // AMBIENT BACKGROUND: stars + balloons
  // =========================================================
  const starsContainer = document.getElementById('stars');
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    s.style.animationDelay = (Math.random() * 3) + 's';
    starsContainer.appendChild(s);
  }

  const balloonLayer = document.getElementById('balloon-layer');
  const balloonColors = ['#ff6b9d', '#4ecdc4', '#ffd166', '#a685e2', '#ffb3cd'];

  function spawnBalloon() {
    const b = document.createElement('div');
    b.className = 'balloon';
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    b.style.background = color;
    b.style.borderTopColor = color;
    b.style.left = Math.random() * 90 + 'vw';
    const duration = 10 + Math.random() * 6;
    b.style.animationDuration = duration + 's';
    balloonLayer.appendChild(b);
    setTimeout(() => b.remove(), duration * 1000 + 200);
  }
  for (let i = 0; i < 5; i++) setTimeout(spawnBalloon, i * 1500);
  setInterval(spawnBalloon, 2800);

  // =========================================================
  // CONFETTI
  // =========================================================
  const confettiLayer = document.getElementById('confetti-layer');
  const confettiColors = ['#ff6b9d', '#4ecdc4', '#ffd166', '#ff8c42', '#a685e2', '#fff8ee'];

  function burstConfetti(count = 70) {
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 6 + Math.random() * 6;
      piece.style.width = size + 'px';
      piece.style.height = size * (Math.random() > 0.5 ? 1 : 2.2) + 'px';
      piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      const duration = 2.2 + Math.random() * 1.6;
      piece.style.animationDuration = duration + 's';
      piece.style.animationDelay = (Math.random() * 0.4) + 's';
      confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), (duration + 0.4) * 1000 + 100);
    }
  }

  // =========================================================
  // TULIP PETAL BURST
  // =========================================================
  const petalLayer = document.getElementById('petal-layer');

  function makePetalSVG(color) {
    return `<svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M12 2 C6 2 4 9 4 14 C4 19 8 22 12 22 C16 22 20 19 20 14 C20 9 18 2 12 2 Z" fill="${color}"/>
      <path d="M12 6 C9 8 8 13 8 16 C8 18 10 19 12 19 C14 19 16 18 16 16 C16 13 15 8 12 6 Z" fill="${color}" opacity="0.55"/>
    </svg>`;
  }

  function burstTulipPetals(count = 55) {
    const petalColors = ['#ff8fb8', '#ff6b9d', '#ffb3cd', '#ffd9e6'];
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      petal.innerHTML = makePetalSVG(color);
      const size = 14 + Math.random() * 14;
      petal.style.width = size + 'px';
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
      const duration = 2.6 + Math.random() * 2;
      petal.style.animationDuration = duration + 's';
      petal.style.animationDelay = (Math.random() * 0.5) + 's';
      petalLayer.appendChild(petal);
      setTimeout(() => petal.remove(), (duration + 0.5) * 1000 + 100);
    }
  }

  // =========================================================
  // SCENE NAVIGATION
  // =========================================================
  const scenes = {
    welcome: document.getElementById('scene-welcome'),
    giftshake: document.getElementById('scene-giftshake'),
    burst: document.getElementById('scene-burst'),
    wish: document.getElementById('scene-wish'),
    cake: document.getElementById('scene-cake'),
    askgift: document.getElementById('scene-askgift'),
    sad: document.getElementById('scene-sad'),
    choosebox: document.getElementById('scene-choosebox'),
    letter: document.getElementById('scene-letter'),
    form: document.getElementById('scene-form'),
  };

  function goTo(name) {
    Object.values(scenes).forEach(s => s.classList.remove('active'));
    scenes[name].classList.add('active');
    playMusicForScene(name);
  }

  // =========================================================
  // MUSIC: 3 distinct moods using Tone.js synths (no copyrighted audio)
  // =========================================================
  let audioStarted = false;
  let muted = false;
  let currentLoop = null;
  let currentSynths = [];

  const muteBtn = document.getElementById('muteBtn');
  muteBtn.addEventListener('click', () => {
    muted = !muted;
    muteBtn.textContent = muted ? '🔇' : '🔊';
    Tone.Destination.mute = muted;
  });

  async function ensureAudioStarted() {
    if (!audioStarted) {
      try {
        await Tone.start();
        audioStarted = true;
      } catch (e) { /* ignore */ }
    }
  }

  function stopCurrentMusic() {
    if (currentLoop) {
      currentLoop.stop(0);
      currentLoop.dispose();
      currentLoop = null;
    }
    currentSynths.forEach(s => s.dispose());
    currentSynths = [];
  }

  // Mood A: playful welcome/gift theme - light plucky synth
  function startMoodWelcome() {
    stopCurrentMusic();
    const synth = new Tone.PluckSynth({ attackNoise: 0.6, dampening: 4000, resonance: 0.85 }).toDestination();
    synth.volume.value = -8;
    currentSynths.push(synth);
    const notes = ['C5', 'E5', 'G5', 'E5', 'D5', 'G5', 'C5', 'E5'];
    let i = 0;
    currentLoop = new Tone.Loop((time) => {
      synth.triggerAttack(notes[i % notes.length], time);
      i++;
    }, '4n');
    Tone.Transport.bpm.value = 108;
    currentLoop.start(0);
    Tone.Transport.start();
  }

  // Mood B: celebratory burst/wish theme - warm chords, slightly grander
  function startMoodCelebrate() {
    stopCurrentMusic();
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 }
    }).toDestination();
    synth.volume.value = -10;
    currentSynths.push(synth);
    const chords = [
      ['C4', 'E4', 'G4'],
      ['A3', 'C4', 'E4'],
      ['F3', 'A3', 'C4'],
      ['G3', 'B3', 'D4'],
    ];
    let i = 0;
    currentLoop = new Tone.Loop((time) => {
      synth.triggerAttackRelease(chords[i % chords.length], '2n', time);
      i++;
    }, '2n');
    Tone.Transport.bpm.value = 96;
    currentLoop.start(0);
    Tone.Transport.start();
  }

  // Mood C: cozy cake/candle theme - soft bell-like melody
  function startMoodCozy() {
    stopCurrentMusic();
    const synth = new Tone.FMSynth({
      harmonicity: 2,
      modulationIndex: 3,
      envelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 1 }
    }).toDestination();
    synth.volume.value = -12;
    currentSynths.push(synth);
    const melody = ['G4', 'A4', 'B4', 'D5', 'B4', 'A4', 'G4', 'E4'];
    let i = 0;
    currentLoop = new Tone.Loop((time) => {
      synth.triggerAttackRelease(melody[i % melody.length], '4n', time);
      i++;
    }, '4n');
    Tone.Transport.bpm.value = 84;
    currentLoop.start(0);
    Tone.Transport.start();
  }

  function playMusicForScene(name) {
    if (!audioStarted) return;
    if (['welcome', 'giftshake'].includes(name)) {
      startMoodWelcome();
    } else if (['burst', 'wish'].includes(name)) {
      startMoodCelebrate();
    } else if (['cake', 'askgift', 'sad', 'choosebox', 'letter', 'form'].includes(name)) {
      startMoodCozy();
    }
  }

  // =========================================================
  // SCENE 0: WELCOME -> tap gift -> shake scene
  // =========================================================
  const welcomeTrigger = document.getElementById('welcomeGiftTrigger');

  async function handleWelcomeTap() {
    await ensureAudioStarted();
    startMoodWelcome();
    goTo('giftshake');
  }
  welcomeTrigger.addEventListener('click', handleWelcomeTap);
  welcomeTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleWelcomeTap(); }
  });

  // =========================================================
  // SCENE 0.5: GIFT SHAKE -> tap again -> burst
  // =========================================================
  const giftShakeBox = document.getElementById('giftShakeBox');

  function handleGiftShakeTap() {
    burstConfetti(40);
    burstTulipPetals(60);
    startMoodCelebrate();
    goTo('burst');
  }
  giftShakeBox.addEventListener('click', handleGiftShakeTap);
  giftShakeBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGiftShakeTap(); }
  });

  // =========================================================
  // SCENE 1: BURST -> wish
  // =========================================================
  document.getElementById('toWishBtn').addEventListener('click', () => goTo('wish'));

  // =========================================================
  // SCENE 2: WISH -> cake
  // =========================================================
  let wishText = '';
  document.getElementById('toCakeBtn').addEventListener('click', () => {
    wishText = document.getElementById('wishInput').value.trim();
    goTo('cake');
  });

  // =========================================================
  // SCENE 3: CAKE -> blow candle -> askgift
  // =========================================================
  const flame = document.getElementById('flame');
  const smoke = document.getElementById('smoke');
  const blowBtn = document.getElementById('blowBtn');
  const micHint = document.getElementById('micHint');
  let candleOut = false;
  let clickCount = 0;
  let micStreamRef = null;
  let micCtxRef = null;

  function extinguishCandle() {
    if (candleOut) return;
    candleOut = true;
    flame.classList.add('out');
    smoke.classList.add('show');
    if (micStreamRef) micStreamRef.getTracks().forEach(t => t.stop());
    if (micCtxRef) micCtxRef.close();
    setTimeout(() => goTo('askgift'), 900);
  }

  blowBtn.addEventListener('click', () => {
    clickCount++;
    if (clickCount >= 2) {
      extinguishCandle();
    } else {
      micHint.textContent = 'Klik sekali lagi untuk niup, atau coba mic kamu 🎤';
    }
  });

  async function setupMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      micCtxRef = audioCtx;
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 512;
      const data = new Uint8Array(analyser.frequencyBinCount);
      micHint.textContent = 'Mic aktif! Tiup ke layar kapan saja 🎈';

      function checkVolume() {
        if (candleOut) return;
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        if (avg > 35) {
          extinguishCandle();
          return;
        }
        requestAnimationFrame(checkVolume);
      }
      checkVolume();
    } catch (e) {
      micHint.textContent = 'Mic nggak aktif, klik tombolnya 2x buat niup lilin ya 😊';
    }
  }
  setupMic();

  // =========================================================
  // SCENE 4: ASK GIFT yes/no
  // =========================================================
  document.getElementById('yesGiftBtn').addEventListener('click', () => {
    goTo('choosebox');
  });
  document.getElementById('noGiftBtn').addEventListener('click', () => {
    goTo('sad');
  });
  document.getElementById('tryAgainBtn').addEventListener('click', () => {
    goTo('askgift');
  });

  // =========================================================
  // SCENE 5: CHOOSE BOX
  // =========================================================
  const boxLetter = document.getElementById('boxLetter');
  const boxForm = document.getElementById('boxForm');

  function openLetterBox() {
    burstConfetti(50);
    const recap = document.getElementById('wishRecap');
    if (wishText) {
      recap.innerHTML = '<b>Harapanmu tadi:</b> "' + wishText.replace(/</g, '&lt;') + '"<br><span style="font-size:12px;opacity:0.75;">Semoga segera terkabul ✨</span>';
      recap.classList.add('show');
    } else {
      recap.classList.remove('show');
    }
    goTo('letter');
  }
  function openFormBox() {
    goTo('form');
  }

  boxLetter.addEventListener('click', openLetterBox);
  boxLetter.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetterBox(); } });
  boxForm.addEventListener('click', openFormBox);
  boxForm.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFormBox(); } });

  document.getElementById('backToChooseBtn1').addEventListener('click', () => goTo('choosebox'));
  document.getElementById('backToChooseBtn2').addEventListener('click', () => goTo('choosebox'));

  // =========================================================
  // SCENE 7: SIZE FORM submit
  // =========================================================
  document.getElementById('submitSizeBtn').addEventListener('click', () => {
    const shirt = document.getElementById('sizeShirt').value.trim();
    const shoe = document.getElementById('sizeShoe').value.trim();
    const confirmEl = document.getElementById('formConfirm');
    if (!shirt || !shoe) {
      confirmEl.style.color = '#ff6b9d';
      confirmEl.textContent = 'Ukuran baju dan sandal wajib diisi dulu ya 🙏';
      return;
    }
    confirmEl.style.color = 'var(--teal-bright)';
    confirmEl.textContent = 'Sip, terima kasih! Ukuran baju ' + shirt + ' & sandal ' + shoe + ' sudah dicatat 📝✨';
    burstConfetti(30);
  });
})();
