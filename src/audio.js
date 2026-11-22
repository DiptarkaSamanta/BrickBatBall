/**
 * CHRONO BREAKER: THE LOST DIMENSIONS
 * Zero-Dependency Procedural Web Audio API Sound Engine
 * Features 8 Procedural Synthesizer Music Tracks & Complete Retro-Modern SFX Suite
 */

import { storage } from './storage.js';

class AudioManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.currentTrack = null;
        this.musicTimer = null;
        this.isMuted = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.musicGain = this.ctx.createGain();
            this.sfxGain = this.ctx.createGain();

            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.masterGain.connect(this.ctx.destination);

            this.applyVolumes();
            this.initialized = true;
        } catch (e) {
            console.warn('[ChronoAudio] Web Audio API not supported or blocked:', e);
        }
    }

    resume() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    applyVolumes() {
        if (!this.ctx) return;
        const settings = storage.getSettings();
        const now = this.ctx.currentTime;
        const master = this.isMuted ? 0 : (settings.masterVolume ?? 0.8);
        const music = settings.musicVolume ?? 0.6;
        const sfx = settings.sfxVolume ?? 0.8;

        this.masterGain.gain.setValueAtTime(master, now);
        this.musicGain.gain.setValueAtTime(music, now);
        this.sfxGain.gain.setValueAtTime(sfx, now);
    }

    setMasterVolume(val) {
        storage.setSettings({ masterVolume: val });
        this.applyVolumes();
    }

    setMusicVolume(val) {
        storage.setSettings({ musicVolume: val });
        this.applyVolumes();
    }

    setSfxVolume(val) {
        storage.setSettings({ sfxVolume: val });
        this.applyVolumes();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.applyVolumes();
        return this.isMuted;
    }

    // ==========================================
    // PROCEDURAL SOUND EFFECTS (SFX)
    // ==========================================

    playPaddleHit(offsetNorm = 0) {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        // Pitch shifts higher toward paddle wings
        const baseFreq = 260 + Math.abs(offsetNorm) * 180;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.12);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    playBrickHit() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    playBrickDestroy(combo = 1) {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        // Base crunch tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        const pitchMultiplier = Math.min(2.5, 1 + (combo - 1) * 0.05);
        osc.type = 'square';
        osc.frequency.setValueAtTime(320 * pitchMultiplier, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);

        // Noise click
        this.createNoiseBurst(0.05, 0.18);
    }

    playIronClang() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1320, now + 0.02);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    playExplosion() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        // Low frequency thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.start(now);
        osc.stop(now + 0.35);

        // Sustained noise boom
        this.createNoiseBurst(0.28, 0.35);
    }

    playPowerupSpawn() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    playPowerupCollect() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.sfxGain);

            const t = now + idx * 0.05;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

            osc.start(t);
            osc.stop(t + 0.18);
        });
    }

    playLaserFire() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    playPortalWarp() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.25);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playCrystalCollect() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1318.5, now); // E6
        osc.frequency.exponentialRampToValueAtTime(1760.0, now + 0.08); // A6

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    playBarrierBounce() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.15);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    playTimeFreeze() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.4);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.start(now);
        osc.stop(now + 0.45);
    }

    playBossHit() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    playBossDefeat() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        let delay = 0;
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                this.playExplosion();
            }, delay);
            delay += 120;
        }
        setTimeout(() => {
            this.playLevelWin();
        }, delay + 200);
    }

    playLevelWin() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const notes = [440, 554.37, 659.25, 880]; // A major
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.12;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.start(now);
            osc.stop(now + 0.35);
        });
    }

    playGameOver() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const notes = [400, 370, 330, 260];
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.18;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.3);
        });
    }

    createNoiseBurst(duration = 0.1, gainVal = 0.2) {
        if (!this.ctx || this.isMuted) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start();
    }

    // ==========================================
    // PROCEDURAL MUSIC SYNTHESIZER
    // ==========================================

    playMusic(trackName) {
        if (this.currentTrack === trackName) return;
        this.stopMusic();
        this.currentTrack = trackName;
        if (!this.ctx || this.isMuted) return;
        this.resume();

        // Start appropriate sequencer loop
        this.startSequencer(trackName);
    }

    stopMusic() {
        if (this.musicTimer) {
            clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
        this.currentTrack = null;
    }

    startSequencer(track) {
        let step = 0;
        let scale = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00]; // Default Minor
        let tempoMs = 180;
        let bassNote = 110;

        if (track === 'egypt') {
            // D Phrygian Dominant: D, Eb, F#, G, A, Bb, C
            scale = [293.66, 311.13, 369.99, 392.00, 440.00, 466.16, 523.25];
            bassNote = 73.42; // D2
            tempoMs = 175;
        } else if (track === 'forest') {
            // E Minor Pentatonic: E, G, A, B, D
            scale = [329.63, 392.00, 440.00, 493.88, 587.33, 659.25];
            bassNote = 82.41; // E2
            tempoMs = 200;
        } else if (track === 'frozen') {
            // C Lydian / Crystal
            scale = [523.25, 587.33, 659.25, 739.99, 783.99, 880.00, 987.77];
            bassNote = 65.41; // C2
            tempoMs = 150;
        } else if (track === 'machine') {
            // Industrial syncopated
            scale = [174.61, 196.00, 220.00, 233.08, 261.63, 293.66];
            bassNote = 55.00; // A1
            tempoMs = 135;
        } else if (track === 'void') {
            // Cosmic slow mysterious
            scale = [220.00, 261.63, 311.13, 329.63, 392.00, 440.00];
            bassNote = 55.00;
            tempoMs = 240;
        } else if (track === 'final') {
            // Intense progressive
            scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
            bassNote = 65.41;
            tempoMs = 120;
        } else if (track === 'boss') {
            // High-octane battle synth
            scale = [220.00, 246.94, 261.63, 311.13, 329.63, 392.00, 440.00];
            bassNote = 55.00;
            tempoMs = 110;
        } else {
            // Menu theme
            scale = [261.63, 329.63, 392.00, 523.25, 659.25];
            bassNote = 65.41;
            tempoMs = 220;
        }

        this.musicTimer = setInterval(() => {
            if (!this.ctx || this.isMuted) return;
            const now = this.ctx.currentTime;

            // Bass pulse on quarter notes
            if (step % 4 === 0) {
                const bassOsc = this.ctx.createOscillator();
                const bassGain = this.ctx.createGain();
                bassOsc.connect(bassGain);
                bassGain.connect(this.musicGain);

                bassOsc.type = (track === 'machine' || track === 'boss') ? 'sawtooth' : 'triangle';
                bassOsc.frequency.setValueAtTime(bassNote, now);

                bassGain.gain.setValueAtTime(0.18, now);
                bassGain.gain.exponentialRampToValueAtTime(0.001, now + (tempoMs * 1.8) / 1000);

                bassOsc.start(now);
                bassOsc.stop(now + (tempoMs * 1.8) / 1000);
            }

            // Arpeggio melody note
            const noteIdx = (step * 3 + Math.floor(step / 7)) % scale.length;
            const noteFreq = scale[noteIdx];

            const leadOsc = this.ctx.createOscillator();
            const leadGain = this.ctx.createGain();
            leadOsc.connect(leadGain);
            leadGain.connect(this.musicGain);

            leadOsc.type = (track === 'frozen' || track === 'menu') ? 'sine' : 'triangle';
            leadOsc.frequency.setValueAtTime(noteFreq, now);

            leadGain.gain.setValueAtTime(0.12, now);
            leadGain.gain.exponentialRampToValueAtTime(0.001, now + (tempoMs * 0.9) / 1000);

            leadOsc.start(now);
            leadOsc.stop(now + (tempoMs * 0.9) / 1000);

            step = (step + 1) % 32;
        }, tempoMs);
    }
}

export const audio = new AudioManager();
