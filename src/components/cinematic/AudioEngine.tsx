'use client'
// ═══════════════════════════════════════════════════════════
// AUDIO ENGINE — Pure Web Audio API
// 7 generated sound themes, zero audio files
// ═══════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react'
import { useCinematicStore } from '@/store/cinematicStore'
import type { SoundTheme } from '@/data/scooterDNA'

type Stop = () => void

interface Engine {
  ctx: AudioContext
  master: GainNode
  current: Stop | null
}

let engine: Engine | null = null

function getEngine(): Engine | null {
  if (typeof window === 'undefined') return null
  if (engine) return engine
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    engine = { ctx, master, current: null }
    return engine
  } catch {
    return null
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOISE BUFFER HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function whiteNoise(ctx: AudioContext, seconds = 2): AudioBuffer {
  const length = ctx.sampleRate * seconds
  const buf = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function pinkNoise(ctx: AudioContext, seconds = 2): AudioBuffer {
  const length = ctx.sampleRate * seconds
  const buf = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buf.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.969 * b2 + white * 0.153852
    b3 = 0.8665 * b3 + white * 0.3104856
    b4 = 0.55 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.016898
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08
    b6 = white * 0.115926
  }
  return buf
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOUND THEMES
// Each returns a stop() function
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function thunder(e: Engine): Stop {
  const { ctx, master } = e
  const osc = ctx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(40, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3)

  const oscGain = ctx.createGain()
  oscGain.gain.value = 0.3

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 200

  osc.connect(oscGain).connect(filter).connect(master)
  osc.start()

  // Random thunder cracks
  const crackInterval = window.setInterval(() => {
    const noise = ctx.createBufferSource()
    noise.buffer = whiteNoise(ctx, 0.4)
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 2000
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.4, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    noise.connect(hp).connect(g).connect(master)
    noise.start()
    noise.stop(ctx.currentTime + 0.5)
  }, 3500 + Math.random() * 2000)

  return () => {
    try { osc.stop() } catch {}
    window.clearInterval(crackInterval)
  }
}

function forest(e: Engine): Stop {
  const { ctx, master } = e
  const noise = ctx.createBufferSource()
  noise.buffer = pinkNoise(ctx, 4)
  noise.loop = true

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 800

  const g = ctx.createGain()
  g.gain.value = 0.35

  // Slow LFO on gain (breathing)
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.5
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.1
  lfo.connect(lfoGain).connect(g.gain)
  lfo.start()

  noise.connect(lp).connect(g).connect(master)
  noise.start()

  // Shimmer
  const shimmer = ctx.createOscillator()
  shimmer.frequency.value = 8000
  const shimmerGain = ctx.createGain()
  shimmerGain.gain.value = 0.01
  shimmer.connect(shimmerGain).connect(master)
  shimmer.start()

  return () => {
    try { noise.stop(); lfo.stop(); shimmer.stop() } catch {}
  }
}

function cityHum(e: Engine): Stop {
  const { ctx, master } = e
  const hum = ctx.createOscillator()
  hum.type = 'sine'
  hum.frequency.value = 60
  const humGain = ctx.createGain()
  humGain.gain.value = 0.15
  hum.connect(humGain).connect(master)
  hum.start()

  const noise = ctx.createBufferSource()
  noise.buffer = pinkNoise(ctx, 6)
  noise.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 500
  const g = ctx.createGain()
  g.gain.value = 0.1
  noise.connect(bp).connect(g).connect(master)
  noise.start()

  return () => {
    try { hum.stop(); noise.stop() } catch {}
  }
}

function engineRoar(e: Engine): Stop {
  const { ctx, master } = e
  const saw = ctx.createOscillator()
  saw.type = 'sawtooth'
  saw.frequency.value = 120

  const rumble = ctx.createOscillator()
  rumble.type = 'sine'
  rumble.frequency.value = 60

  // Vibrato LFO
  const vibrato = ctx.createOscillator()
  vibrato.frequency.value = 6
  const vibratoGain = ctx.createGain()
  vibratoGain.gain.value = 3
  vibrato.connect(vibratoGain).connect(saw.frequency)
  vibrato.start()

  // Soft-clip distortion
  const shaper = ctx.createWaveShaper()
  const curve = new Float32Array(256)
  for (let i = 0; i < 256; i++) {
    const x = (i - 128) / 128
    curve[i] = Math.tanh(x * 3)
  }
  shaper.curve = curve

  const g = ctx.createGain()
  g.gain.value = 0.3

  saw.connect(shaper).connect(g).connect(master)
  rumble.connect(g)
  saw.start()
  rumble.start()

  return () => {
    try { saw.stop(); rumble.stop(); vibrato.stop() } catch {}
  }
}

function spaceDrone(e: Engine): Stop {
  const { ctx, master } = e
  const o1 = ctx.createOscillator()
  o1.type = 'sine'
  o1.frequency.value = 200
  const o2 = ctx.createOscillator()
  o2.type = 'sine'
  o2.frequency.value = 203

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 600

  // Slow LFO on filter cutoff
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.1
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 300
  lfo.connect(lfoGain).connect(lp.frequency)
  lfo.start()

  const g = ctx.createGain()
  g.gain.value = 0.25

  o1.connect(lp)
  o2.connect(lp)
  lp.connect(g).connect(master)
  o1.start()
  o2.start()

  return () => {
    try { o1.stop(); o2.stop(); lfo.stop() } catch {}
  }
}

function crystal(e: Engine): Stop {
  const { ctx, master } = e
  const g = ctx.createGain()
  g.gain.value = 0.15
  g.connect(master)

  // Periodic crystal chimes
  const interval = window.setInterval(() => {
    const freq = 660 + Math.random() * 440
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, ctx.currentTime)
    env.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02)
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    osc.connect(env).connect(g)
    osc.start()
    osc.stop(ctx.currentTime + 1.6)
  }, 2200)

  return () => {
    window.clearInterval(interval)
  }
}

function rain(e: Engine): Stop {
  const { ctx, master } = e
  const noise = ctx.createBufferSource()
  noise.buffer = whiteNoise(ctx, 5)
  noise.loop = true

  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 800
  bp.Q.value = 0.7

  const g = ctx.createGain()
  g.gain.value = 0.25

  // 4Hz amplitude mod (rainfall rhythm)
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 4
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.05
  lfo.connect(lfoGain).connect(g.gain)
  lfo.start()

  noise.connect(bp).connect(g).connect(master)
  noise.start()

  return () => {
    try { noise.stop(); lfo.stop() } catch {}
  }
}

const THEMES: Record<SoundTheme, (e: Engine) => Stop> = {
  thunder,
  forest,
  'city-hum': cityHum,
  'engine-roar': engineRoar,
  'space-drone': spaceDrone,
  rain,
  crystal,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REACT COMPONENT — Drives theme changes from store
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function AudioEngine() {
  const audioEnabled = useCinematicStore((s) => s.audioEnabled)
  const activeDNA = useCinematicStore((s) => s.activeDNA)
  const currentTheme = useRef<SoundTheme | null>(null)

  useEffect(() => {
    const e = getEngine()
    if (!e) return

    if (!audioEnabled) {
      // Fade out
      const t = e.ctx.currentTime
      e.master.gain.cancelScheduledValues(t)
      e.master.gain.setValueAtTime(e.master.gain.value, t)
      e.master.gain.linearRampToValueAtTime(0, t + 0.5)
      window.setTimeout(() => {
        if (e.current) {
          e.current()
          e.current = null
        }
        currentTheme.current = null
      }, 550)
      return
    }

    // Resume context if suspended
    if (e.ctx.state === 'suspended') {
      e.ctx.resume().catch(() => {})
    }

    // Switch themes if needed
    if (currentTheme.current !== activeDNA.soundTheme) {
      if (e.current) {
        e.current()
        e.current = null
      }
      const themeFn = THEMES[activeDNA.soundTheme]
      if (themeFn) {
        e.current = themeFn(e)
        currentTheme.current = activeDNA.soundTheme
      }
    }

    // Fade in to intensity
    const gain =
      activeDNA.soundIntensity === 'aggressive'
        ? 0.18
        : activeDNA.soundIntensity === 'ambient'
        ? 0.12
        : 0.07
    const t = e.ctx.currentTime
    e.master.gain.cancelScheduledValues(t)
    e.master.gain.setValueAtTime(e.master.gain.value, t)
    e.master.gain.linearRampToValueAtTime(Math.min(gain, 0.2), t + 0.3)
  }, [audioEnabled, activeDNA.soundTheme, activeDNA.soundIntensity])

  return null
}
