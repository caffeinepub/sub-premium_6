import { useEffect, useRef } from "react";

interface IntroScreenProps {
  onComplete: () => void;
}

// Synthesize sounds via Web Audio API — no external files needed
function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

// Layer 1: Stereo whoosh panning left → right with bandpass sweep
function playWhoosh(ctx: AudioContext, dest: AudioNode, startTime: number) {
  const bufferSize = Math.floor(ctx.sampleRate * 0.5);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1200, startTime);
  filter.frequency.exponentialRampToValueAtTime(300, startTime + 0.5);
  filter.Q.value = 1.2;

  const panner = ctx.createStereoPanner();
  panner.pan.setValueAtTime(-1, startTime);
  panner.pan.linearRampToValueAtTime(1, startTime + 0.5);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.9, startTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

  source.connect(filter);
  filter.connect(panner);
  panner.connect(gain);
  gain.connect(dest);
  source.start(startTime);
}

// Layer 2: Warm digital chime/ding with echo and reverb
function playChime(ctx: AudioContext, dest: AudioNode, startTime: number) {
  // Build convolver impulse response for reverb (2-channel stereo, 0.8s)
  const irLength = Math.floor(ctx.sampleRate * 0.8);
  const irBuffer = ctx.createBuffer(2, irLength, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = irBuffer.getChannelData(ch);
    for (let i = 0; i < irLength; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = irBuffer;
  convolver.connect(dest);

  // Echo: delay → feedback loop
  const delay = ctx.createDelay(1.0);
  delay.delayTime.value = 0.18;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.25;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(convolver);

  // Primary oscillator: warm sine chime 880 → 440 Hz
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, startTime);
  osc.frequency.exponentialRampToValueAtTime(440, startTime + 0.8);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0, startTime);
  oscGain.gain.linearRampToValueAtTime(1.2, startTime + 0.01);
  oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

  osc.connect(oscGain);
  oscGain.connect(delay);
  oscGain.connect(dest); // direct signal

  osc.start(startTime);
  osc.stop(startTime + 1.3);

  // Overtone oscillator at 1760 Hz for shimmer
  const overtone = ctx.createOscillator();
  overtone.type = "sine";
  overtone.frequency.value = 1760;

  const overtoneGain = ctx.createGain();
  overtoneGain.gain.setValueAtTime(0, startTime);
  overtoneGain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
  overtoneGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

  overtone.connect(overtoneGain);
  overtoneGain.connect(dest);

  overtone.start(startTime);
  overtone.stop(startTime + 0.7);
}

// Layer 3: Deep bass pulse — satisfying low thud on text merge
function playBassPulse(ctx: AudioContext, dest: AudioNode, startTime: number) {
  // Primary bass hit
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, startTime);
  osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.25);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(1.4, startTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

  osc.connect(gain);
  gain.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + 0.35);

  // Sub oscillator for added depth
  const sub = ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(60, startTime);
  sub.frequency.exponentialRampToValueAtTime(25, startTime + 0.25);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0, startTime);
  subGain.gain.linearRampToValueAtTime(0.6, startTime + 0.008);
  subGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

  sub.connect(subGain);
  subGain.connect(dest);
  sub.start(startTime);
  sub.stop(startTime + 0.35);
}

// Soft airy fade-out noise tail
function playFadeOut(ctx: AudioContext, dest: AudioNode, startTime: number) {
  const bufferSize = Math.floor(ctx.sampleRate * 0.3);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 300;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  source.start(startTime);
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Total: ~2.5s then fade-out 0.6s = complete at ~3.1s
    const timer = setTimeout(onComplete, 3100);

    // Schedule sounds
    const scheduleSound = async () => {
      const ctx = createAudioContext();
      if (!ctx) return;
      audioRef.current = ctx;

      // Unlock audio context (some browsers require user gesture — best effort)
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {});
      }

      // Master gain node at 0.5 — all sounds routed through this
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.5, ctx.currentTime);

      // DynamicsCompressor to prevent clipping
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -6;
      compressor.knee.value = 3;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.1;

      master.connect(compressor);
      compressor.connect(ctx.destination);

      const now = ctx.currentTime;
      playWhoosh(ctx, master, now); // 0.0s
      setTimeout(() => playChime(ctx, master, ctx.currentTime), 300); // 0.3s
      setTimeout(() => playBassPulse(ctx, master, ctx.currentTime), 1000); // 1.0s
      setTimeout(() => {
        master.gain.setValueAtTime(0.5, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        playFadeOut(ctx, master, ctx.currentTime);
      }, 1800); // 1.8s fade-out
    };

    scheduleSound();

    return () => {
      clearTimeout(timer);
      audioRef.current?.close().catch(() => {});
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes logoReveal {
          0%   { opacity: 0; transform: scale(0.8); filter: drop-shadow(0 0 0px #FF6B00); }
          60%  { opacity: 1; transform: scale(1.08); filter: drop-shadow(0 0 22px #FF6B00) drop-shadow(0 0 48px rgba(255,107,0,0.5)); }
          100% { opacity: 1; transform: scale(1);    filter: drop-shadow(0 0 12px #FF6B00) drop-shadow(0 0 28px rgba(255,107,0,0.35)); }
        }

        @keyframes slideFromLeft {
          0%   { opacity: 0; transform: translateX(-80px) skewX(-4deg); }
          60%  { opacity: 1; transform: translateX(4px)  skewX(1deg); }
          100% { opacity: 1; transform: translateX(0)    skewX(0deg); }
        }

        @keyframes slideFromRight {
          0%   { opacity: 0; transform: translateX(80px)  skewX(4deg); }
          60%  { opacity: 1; transform: translateX(-4px)  skewX(-1deg); }
          100% { opacity: 1; transform: translateX(0)     skewX(0deg); }
        }

        @keyframes glitchSub {
          0%,100% { clip-path: none; transform: translateX(0); }
          20%     { clip-path: inset(20% 0 60% 0); transform: translateX(-3px); }
          40%     { clip-path: inset(60% 0 10% 0); transform: translateX(3px); }
          60%     { clip-path: none; transform: translateX(-1px); }
        }

        @keyframes glitchPremium {
          0%,100% { clip-path: none; transform: translateX(0); }
          25%     { clip-path: inset(30% 0 50% 0); transform: translateX(3px); }
          50%     { clip-path: inset(55% 0 20% 0); transform: translateX(-3px); }
          75%     { clip-path: none; transform: translateX(1px); }
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes mergeGlow {
          0%   { text-shadow: none; }
          50%  { text-shadow: 0 0 18px rgba(255,150,50,0.8), 0 0 40px rgba(255,107,0,0.4); }
          100% { text-shadow: 0 0 8px rgba(255,130,40,0.5); }
        }

        @keyframes introFadeOut {
          0%   { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }

        .intro-wrapper {
          animation: introFadeOut 0.6s ease-in-out 2.5s forwards;
        }

        .intro-logo {
          animation: logoReveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s both;
        }

        .intro-text-left {
          opacity: 0;
          animation:
            slideFromLeft 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards,
            glitchSub 0.25s steps(1) 0.5s 2;
        }

        .intro-text-right {
          opacity: 0;
          animation:
            slideFromRight 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards,
            glitchPremium 0.25s steps(1) 0.5s 2;
        }

        .intro-text-combined {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 30%,
            rgba(255,200,100,0.95) 50%,
            #ffffff 70%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation:
            slideFromLeft 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards,
            shimmer 0.9s linear 1.2s forwards;
        }

        .intro-text-combined-right {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 30%,
            rgba(255,200,100,0.95) 50%,
            #ffffff 70%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation:
            slideFromRight 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards,
            shimmer 0.9s linear 1.2s forwards;
        }

        .intro-merge-glow {
          animation: mergeGlow 0.4s ease-out 1.15s both;
        }

        .intro-gap-line {
          opacity: 0;
          animation: introFadeOut 0.1s linear 1.1s reverse forwards;
        }
      `}</style>

      <div
        className="intro-wrapper"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
        data-ocid="intro.panel"
      >
        {/* Logo Icon */}
        <div
          className="intro-logo"
          style={{
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 72 72"
            width="80"
            height="80"
            role="img"
            aria-label="SUB PREMIUM logo"
            style={{ overflow: "visible" }}
          >
            <title>SUB PREMIUM logo</title>
            <polygon points="18,10 62,36 18,62" fill="#FF6B00" />
          </svg>
        </div>

        {/* Text: SUB + PREMIUM split-merge with glitch */}
        <div
          className="intro-merge-glow"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            overflow: "hidden",
          }}
        >
          <span
            className="intro-text-combined"
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              display: "inline-block",
            }}
          >
            SUB
          </span>
          {/* Thin divider that snaps away on merge */}
          <span
            className="intro-gap-line"
            style={{
              width: 2,
              height: 22,
              backgroundColor: "rgba(255,107,0,0.6)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            className="intro-text-combined-right"
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              display: "inline-block",
            }}
          >
            PREMIUM
          </span>
        </div>
      </div>
    </>
  );
}
