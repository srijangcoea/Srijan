/**
 * Web Audio API synthesized soft notification sound generator.
 * Zero external audio asset dependencies, zero network latency,
 * and soothing harmonic envelopes designed specifically for notification toasts.
 */

let audioCtx = null;
let soundMuted = false;

// Initialize or resume AudioContext safely
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (err) {
    // Ignore audio initialization restrictions
  }
  return audioCtx;
}

// Attach user-gesture listener to unlock AudioContext on initial interaction
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };

  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });

  // Read persisted sound preference if set
  try {
    const saved = localStorage.getItem('srijan_toast_sound');
    if (saved !== null) {
      soundMuted = saved === 'muted';
    }
  } catch (e) {}
}

/**
 * Play a synthesized gentle musical tone with an ADSR envelope.
 */
function playTone(ctx, destination, freq, startTime, duration, peakGain = 0.08) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Pure sine wave for a clean, soft, bell-like timbre
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  // Soft envelope: 15ms gentle attack (eliminates clicks/pops), exponential decay
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

/**
 * Play soft notification sound tailored to toast type:
 * - 'success': Uplifting, soft two-tone chime (D5 -> A5)
 * - 'info': Gentle crystal waterdrop chime (E5)
 * - 'warning': Soft amber double-chime (A4 -> C#5)
 * - 'error': Muted subtle double-tone (F4 -> D4, non-jarring)
 */
export function playNotificationSound(type = 'success') {
  if (soundMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    
    // Kept at a gentle, soothing volume level
    masterGain.gain.setValueAtTime(0.07, now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'success':
        // Soft ascending chime: D5 (587.33 Hz) -> A5 (880.00 Hz)
        playTone(ctx, masterGain, 587.33, now, 0.22, 0.08);
        playTone(ctx, masterGain, 880.00, now + 0.09, 0.32, 0.09);
        break;

      case 'warning':
        // Soft mellow warning chime: A4 (440.00 Hz) -> C#5 (554.37 Hz)
        playTone(ctx, masterGain, 440.00, now, 0.2, 0.07);
        playTone(ctx, masterGain, 554.37, now + 0.09, 0.26, 0.08);
        break;

      case 'error':
        // Soft, respectful downward double-tap: F4 (349.23 Hz) -> D4 (293.66 Hz)
        playTone(ctx, masterGain, 349.23, now, 0.18, 0.08);
        playTone(ctx, masterGain, 293.66, now + 0.09, 0.24, 0.07);
        break;

      case 'info':
      default:
        // Gentle crystal drop: E5 (659.25 Hz)
        playTone(ctx, masterGain, 659.25, now, 0.28, 0.08);
        break;
    }
  } catch (err) {
    // Gracefully ignore audio errors (e.g., autoplay blocked before user interaction)
  }
}

export function isSoundMuted() {
  return soundMuted;
}

export function setSoundMuted(muted) {
  soundMuted = !!muted;
  try {
    localStorage.setItem('srijan_toast_sound', soundMuted ? 'muted' : 'active');
  } catch (e) {}
}
