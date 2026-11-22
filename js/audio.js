// audio.js - Procedural Web Audio API sound and music synthesizer for Jardinains & Bricks of Egypt!
// 100% offline, zero external files required.

class SoundManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.musicGain = null;
        this.isMuted = false;
        this.musicEnabled = true;
        this.musicVolume = 0.25;
        this.sfxVolume = 0.45;
        this.musicInterval = null;
        this.musicStep = 0;
        this.musicTheme = 'egypt'; // 'egypt' or 'garden'
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
            this.sfxGain.connect(this.masterGain);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
            this.musicGain.connect(this.masterGain);

            this.isInitialized = true;
            this.startMusic();
        } catch (e) {
            console.warn("Web Audio API not supported or blocked:", e);
        }
    }

    resume() {
        if (!this.isInitialized) {
            this.init();
        } else if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime, 0.05);
        }
        return this.isMuted;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicGain && this.ctx) {
            this.musicGain.gain.setTargetAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime, 0.05);
        }
        return this.musicEnabled;
    }

    setMusicTheme(theme) {
        if (this.musicTheme === theme) return;
        this.musicTheme = theme;
        this.musicStep = 0;
    }

    // --- Sound Effects ---

    playPaddleHit(hitOffset = 0, isEgypt = false) {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const baseFreq = isEgypt ? (380 + Math.abs(hitOffset) * 140) : (420 + Math.abs(hitOffset) * 160);
        osc.type = isEgypt ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * (isEgypt ? 1.8 : 1.5), t + 0.09);

        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.15);

        if (isEgypt) {
            const chime = this.ctx.createOscillator();
            const chimeGain = this.ctx.createGain();
            chime.type = 'triangle';
            chime.frequency.setValueAtTime(baseFreq * 2.5, t);
            chimeGain.gain.setValueAtTime(0.25, t);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
            chime.connect(chimeGain);
            chimeGain.connect(this.sfxGain);
            chime.start(t);
            chime.stop(t + 0.19);
        }
    }

    playBrickHit(durability = 1, combo = 0, isEgypt = false) {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const pitchMult = Math.min(2.5, 1 + combo * 0.08);
        const freq = (300 + durability * 75) * pitchMult;
        
        osc.type = isEgypt ? 'triangle' : (durability > 1 ? 'sawtooth' : 'sine');
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.08);

        gain.gain.setValueAtTime(0.65, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.10);
    }

    playIndestructibleHit(isEgypt = false) {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        
        const freqs = isEgypt ? [587.33, 880, 1174.66] : [880, 1320];
        freqs.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.4, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t);
            osc.stop(t + 0.22);
        });
    }

    playExplosion() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;

        const bufferSize = this.ctx.sampleRate * 0.45;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(550, t);
        filter.frequency.exponentialRampToValueAtTime(35, t + 0.42);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.0, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.42);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130, t);
        osc.frequency.exponentialRampToValueAtTime(25, t + 0.38);
        oscGain.gain.setValueAtTime(0.9, t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.38);
        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);

        noise.start(t);
        osc.start(t);
        noise.stop(t + 0.48);
        osc.stop(t + 0.48);
    }

    // --- Bricks of Egypt Specific Audio ---
    playTreasureCollect(points = 1000) {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;

        // Bright sparkling Egyptian coin/gem chime
        const freqs = [783.99, 1046.50, 1318.51, 1567.98];
        freqs.forEach((f, i) => {
            const start = t + i * 0.04;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, start);
            gain.gain.setValueAtTime(0.35, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(start);
            osc.stop(start + 0.16);
        });
    }

    playSteamHiss() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;

        // White noise hiss when water extinguishes fire bricks
        const bufferSize = this.ctx.sampleRate * 0.35;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3200, t);
        filter.frequency.exponentialRampToValueAtTime(800, t + 0.3);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(t);
        noise.stop(t + 0.36);
    }

    playWaterDrop() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + 0.1);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.16);
    }

    playGnomeScream() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        vibrato.frequency.setValueAtTime(12, t);
        vibratoGain.gain.setValueAtTime(60, t);

        vibrato.connect(osc.frequency);
        osc.frequency.setValueAtTime(950, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.7);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.75);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        vibrato.start(t);
        osc.start(t);
        vibrato.stop(t + 0.75);
        osc.stop(t + 0.75);
    }

    playGnomeBounce(juggleCount = 1) {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const base = 250 + Math.min(juggleCount * 90, 700);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(base, t);
        osc.frequency.exponentialRampToValueAtTime(base * 2.4, t + 0.15);
        osc.frequency.exponentialRampToValueAtTime(base * 1.8, t + 0.28);

        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.32);
    }

    playGnomeLaugh() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const notes = [650, 780, 650, 900];
        notes.forEach((freq, idx) => {
            const start = this.ctx.currentTime + idx * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.35, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.06);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(start);
            osc.stop(start + 0.07);
        });
    }

    playGnomeThrow() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.08);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.11);
    }

    playGnomeSplat() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.18);

        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.22);
    }

    playPotBreak() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.16;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2400, t);
        filter.Q.setValueAtTime(2.2, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.75, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(t);
        noise.stop(t + 0.17);
    }

    playPaddleStun() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.linearRampToValueAtTime(110, t + 0.25);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.3);
    }

    playLaserShot() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(980, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.13);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.14);
    }

    playEyeOfHorusZap() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.18);

        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.22);
    }

    playPowerupCollect(isGood = true) {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        if (isGood) {
            [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
                const start = t + idx * 0.05;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.4, start);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.12);
                osc.connect(gain);
                gain.connect(this.sfxGain);
                osc.start(start);
                osc.stop(start + 0.13);
            });
        } else {
            [370, 311, 260].forEach((freq, idx) => {
                const start = t + idx * 0.08;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.5, start);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.1);
                osc.connect(gain);
                gain.connect(this.sfxGain);
                osc.start(start);
                osc.stop(start + 0.11);
            });
        }
    }

    playLifeLost() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const notes = [440, 415, 392, 349];
        notes.forEach((freq, idx) => {
            const start = t + idx * 0.12;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.5, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(start);
            osc.stop(start + 0.16);
        });
    }

    playLevelWin() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const fanfare = [
            { f: 523.25, d: 0.1 },
            { f: 659.25, d: 0.1 },
            { f: 783.99, d: 0.1 },
            { f: 1046.50, d: 0.3 }
        ];
        let offset = 0;
        fanfare.forEach(item => {
            const start = t + offset;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, start);
            gain.gain.setValueAtTime(0.5, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + item.d);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(start);
            osc.stop(start + item.d + 0.05);
            offset += item.d;
        });
    }

    // --- Background Music ---
    startMusic() {
        if (this.musicInterval) return;

        const gardenMelody = [
            523.25, 0, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25,
            587.33, 0, 659.25, 587.33, 523.25, 0, 392.00, 0,
            523.25, 659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, 523.25,
            659.25, 587.33, 523.25, 587.33, 523.25, 0, 0, 0
        ];

        const gardenBass = [
            130.81, 0, 130.81, 0, 174.61, 0, 174.61, 0,
            146.83, 0, 146.83, 0, 196.00, 0, 196.00, 0,
            130.81, 0, 130.81, 0, 174.61, 0, 174.61, 0,
            196.00, 0, 196.00, 0, 130.81, 0, 130.81, 0
        ];

        const egyptMelody = [
            293.66, 311.13, 369.99, 392.00, 440.00, 369.99, 392.00, 311.13,
            293.66, 0,      369.99, 311.13, 293.66, 0,      220.00, 0,
            293.66, 369.99, 440.00, 587.33, 466.16, 440.00, 369.99, 311.13,
            369.99, 311.13, 293.66, 311.13, 293.66, 0,      0,      0
        ];

        const egyptBass = [
            146.83, 0, 146.83, 0, 155.56, 0, 155.56, 0,
            184.99, 0, 184.99, 0, 146.83, 0, 146.83, 0,
            146.83, 0, 146.83, 0, 220.00, 0, 220.00, 0,
            184.99, 0, 155.56, 0, 146.83, 0, 146.83, 0
        ];

        this.musicStep = 0;
        this.musicInterval = setInterval(() => {
            if (!this.ctx || this.isMuted || !this.musicEnabled) {
                this.musicStep = (this.musicStep + 1) % 32;
                return;
            }
            if (this.ctx.state === 'suspended') return;

            const isEgypt = this.musicTheme === 'egypt';
            const melody = isEgypt ? egyptMelody : gardenMelody;
            const bass = isEgypt ? egyptBass : gardenBass;

            const t = this.ctx.currentTime;
            const mNote = melody[this.musicStep];
            const bNote = bass[this.musicStep];

            if (mNote > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = isEgypt ? 'sawtooth' : 'triangle';
                osc.frequency.setValueAtTime(mNote, t);

                if (isEgypt) {
                    osc.frequency.linearRampToValueAtTime(mNote * 1.02, t + 0.08);
                    osc.frequency.linearRampToValueAtTime(mNote, t + 0.14);
                }

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(isEgypt ? 900 : 2500, t);

                gain.gain.setValueAtTime(isEgypt ? 0.14 : 0.2, t);
                gain.gain.exponentialRampToValueAtTime(0.005, t + (isEgypt ? 0.22 : 0.15));

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.musicGain);

                osc.start(t);
                osc.stop(t + (isEgypt ? 0.23 : 0.16));
            }

            if (bNote > 0) {
                const bOsc = this.ctx.createOscillator();
                const bGain = this.ctx.createGain();
                bOsc.type = 'sine';
                bOsc.frequency.setValueAtTime(bNote, t);
                bGain.gain.setValueAtTime(0.3, t);
                bGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
                bOsc.connect(bGain);
                bGain.connect(this.musicGain);
                bOsc.start(t);
                bOsc.stop(t + 0.21);
            }

            if (this.musicStep % 2 === 0 || (isEgypt && this.musicStep % 4 === 3)) {
                const tickBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.025, this.ctx.sampleRate);
                const data = tickBuffer.getChannelData(0);
                for (let i = 0; i < data.length; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
                }
                const tick = this.ctx.createBufferSource();
                tick.buffer = tickBuffer;
                const tGain = this.ctx.createGain();
                tGain.gain.setValueAtTime(isEgypt ? 0.06 : 0.08, t);
                tick.connect(tGain);
                tGain.connect(this.musicGain);
                tick.start(t);
                tick.stop(t + 0.03);
            }

            this.musicStep = (this.musicStep + 1) % melody.length;
        }, 175);
    }
}

window.soundManager = new SoundManager();
