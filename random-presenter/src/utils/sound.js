export const playTadaSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // 1. "펑~" (Pop) sound
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(600, ctx.currentTime);
    popOsc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
    popGain.gain.setValueAtTime(1, ctx.currentTime);
    popGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(ctx.currentTime);
    popOsc.stop(ctx.currentTime + 0.15);

    // 2. "짜잔!" (Tada) chord
    const playNote = (freq, startTime, duration, vol = 0.3) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Play a cheerful chord slightly after the pop
    playNote(523.25, 0.15, 0.5); // C5
    playNote(659.25, 0.15, 0.5); // E5
    playNote(783.99, 0.15, 0.5); // G5
  } catch (err) {
    console.error("Audio playback failed", err);
  }
};
