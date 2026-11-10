/**
 * Web Audio API synthesized sound generator for Kusina Express.
 * Provides a crisp, pleasant brass bell / carinderia kitchen bell chime
 * that works without external MP3 files and never fails to load.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a double brass bell ring ("Ding-Ding!") for new orders in the KDS
 */
export function playNewOrderChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First strike (High chime ~880Hz A5)
    createBellStrike(ctx, now, 880, 0.45);
    // Second strike (Higher overtone ~1174Hz D6)
    createBellStrike(ctx, now + 0.15, 1174, 0.55);
  } catch (err) {
    console.warn('Audio chime notice:', err);
  }
}

/**
 * Play a success register sound when an order is completed or verified
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    createBellStrike(ctx, now, 659.25, 0.3); // E5
    createBellStrike(ctx, now + 0.1, 783.99, 0.3); // G5
    createBellStrike(ctx, now + 0.2, 1046.5, 0.4); // C6
  } catch (err) {
    console.warn('Audio chime notice:', err);
  }
}

function createBellStrike(ctx: AudioContext, startTime: number, freq: number, gainValue: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Sine wave blended with subtle harmonics for a metallic bell tone
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.98, startTime + 0.8);

  // Quick attack, gentle bell resonance decay
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + 0.8);
}
