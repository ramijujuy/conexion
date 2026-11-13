// Synthesized pleasant alarm chimes using Web Audio API (no external audio assets required)
export function playAlarmChime(type: 'nearby' | 'online' | 'message') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes =
      type === 'message'
        ? [587.33, 880] // D5 -> A5 crisp chime
        : type === 'online'
        ? [523.25, 659.25] // C5 -> E5 soft double tone
        : [440, 554.37, 659.25]; // A4 -> C#5 -> E5 warm radar chord

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);

      gain.gain.setValueAtTime(0.001, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.11 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.26);
    });

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 900);
  } catch {
    // Audio playback may be blocked prior to user gesture; fail gracefully
  }
}
