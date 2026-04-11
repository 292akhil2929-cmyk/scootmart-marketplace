// ═══════════════════════════════════════════════════════════
// SCOOTER DNA — The source of truth for every scooter's universe
// Visual · Typography · Texture · Particles · Sound · Entrance
// ═══════════════════════════════════════════════════════════

export type Category = 'SPEED' | 'ECO' | 'LUXURY' | 'BEAST' | 'COMMUTER' | 'PERFORMANCE'
export type BgTextureKind =
  | 'lightning-storm'
  | 'circuit-grid'
  | 'carbon-fiber'
  | 'marble'
  | 'sand-dunes'
  | 'deep-space'
  | 'rain-slick'

export type ParticleKind =
  | 'lightning-bolts'
  | 'floating-leaves'
  | 'stars'
  | 'embers'
  | 'rain'
  | 'circuit-nodes'
  | 'diamonds'

export type SoundTheme =
  | 'thunder'
  | 'forest'
  | 'city-hum'
  | 'engine-roar'
  | 'space-drone'
  | 'rain'
  | 'crystal'

export type EntranceKind =
  | 'lightning-strike'
  | 'earth-crack'
  | 'nebula-form'
  | 'rain-curtain'
  | 'gold-unfurl'
  | 'circuit-assemble'

export interface ScooterDNA {
  id: number
  category: Category
  // VISUAL IDENTITY
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  particleColor: string
  glowColor: string
  // TYPOGRAPHY
  fontWeight: 900 | 800 | 700 | 600
  headlineCase: 'uppercase' | 'mixed'
  headlineStyle: 'impact' | 'editorial' | 'technical' | 'luxury'
  // TEXTURE
  bgTexture: BgTextureKind
  bgAnimated: boolean
  // PARTICLES
  particleStyle: ParticleKind
  particleCount: number
  particleSpeed: 'storm' | 'drift' | 'pulse'
  // SOUND
  soundTheme: SoundTheme
  soundIntensity: 'aggressive' | 'ambient' | 'subtle'
  // ENTRANCE
  heroEntrance: EntranceKind
  entranceTagline: string
  entranceSubline: string
  // SPEC COLORS
  specColors: {
    speed: string
    range: string
    motor: string
    weight: string
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THE 6 DNA PROFILES
// Keyed by scooter id (matches data/scooters.ts)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SCOOTER_DNA: Record<number, ScooterDNA> = {
  // ══════ DUALTRON THUNDER 2 — SPEED / THE GOD OF THUNDER ══════
  6: {
    id: 6,
    category: 'SPEED',
    primaryColor: '#ff2200',
    secondaryColor: '#ffcc00',
    backgroundColor: '#0a0005',
    particleColor: '#ffcc00',
    glowColor: '#ff4400',
    fontWeight: 900,
    headlineCase: 'uppercase',
    headlineStyle: 'impact',
    bgTexture: 'lightning-storm',
    bgAnimated: true,
    particleStyle: 'lightning-bolts',
    particleCount: 40,
    particleSpeed: 'storm',
    soundTheme: 'thunder',
    soundIntensity: 'aggressive',
    heroEntrance: 'lightning-strike',
    entranceTagline: '8,640 WATTS OF CONTROLLED VIOLENCE.',
    entranceSubline: 'The fastest production scooter in the UAE. AED 16,900.',
    specColors: {
      speed: '#ff2200',
      range: '#ffcc00',
      motor: '#ff6600',
      weight: '#888888',
    },
  },

  // ══════ KAABO WOLF KING GT — BEAST / THE PREDATOR ══════
  3: {
    id: 3,
    category: 'BEAST',
    primaryColor: '#c0392b',
    secondaryColor: '#1a1a1a',
    backgroundColor: '#050505',
    particleColor: '#c0392b',
    glowColor: '#ff0000',
    fontWeight: 900,
    headlineCase: 'uppercase',
    headlineStyle: 'impact',
    bgTexture: 'carbon-fiber',
    bgAnimated: true,
    particleStyle: 'embers',
    particleCount: 80,
    particleSpeed: 'pulse',
    soundTheme: 'engine-roar',
    soundIntensity: 'aggressive',
    heroEntrance: 'earth-crack',
    entranceTagline: "120KM. 100KM/H. IT DOESN'T ASK PERMISSION.",
    entranceSubline: 'Kaabo Wolf King GT. AED 12,500.',
    specColors: {
      speed: '#ff0000',
      range: '#ff4400',
      motor: '#ff2200',
      weight: '#444444',
    },
  },

  // ══════ SEGWAY MAX G2 — LUXURY / THE DIPLOMAT ══════
  2: {
    id: 2,
    category: 'LUXURY',
    primaryColor: '#c9981a',
    secondaryColor: '#2f5cff',
    backgroundColor: '#0a0a12',
    particleColor: '#c9981a',
    glowColor: '#ffd700',
    fontWeight: 800,
    headlineCase: 'uppercase',
    headlineStyle: 'luxury',
    bgTexture: 'marble',
    bgAnimated: true,
    particleStyle: 'diamonds',
    particleCount: 60,
    particleSpeed: 'drift',
    soundTheme: 'crystal',
    soundIntensity: 'ambient',
    heroEntrance: 'gold-unfurl',
    entranceTagline: 'THE SCOOTER DUBAI PROFESSIONALS CHOOSE.',
    entranceSubline: 'IP55. 70KM Range. 2 Year Warranty. AED 2,849.',
    specColors: {
      speed: '#c9981a',
      range: '#2f5cff',
      motor: '#c9981a',
      weight: '#c9981a',
    },
  },

  // ══════ XIAOMI MI PRO 4 — ECO / THE SMART CHOICE ══════
  1: {
    id: 1,
    category: 'ECO',
    primaryColor: '#00c853',
    secondaryColor: '#00e5ff',
    backgroundColor: '#020f08',
    particleColor: '#00c853',
    glowColor: '#00ff88',
    fontWeight: 700,
    headlineCase: 'mixed',
    headlineStyle: 'technical',
    bgTexture: 'circuit-grid',
    bgAnimated: true,
    particleStyle: 'circuit-nodes',
    particleCount: 100,
    particleSpeed: 'pulse',
    soundTheme: 'forest',
    soundIntensity: 'subtle',
    heroEntrance: 'circuit-assemble',
    entranceTagline: '55KM ON A SINGLE CHARGE. ZERO GUILT.',
    entranceSubline: 'Xiaomi Mi Pro 4. Starting AED 1,999.',
    specColors: {
      speed: '#00c853',
      range: '#00ff88',
      motor: '#00e5ff',
      weight: '#00c853',
    },
  },

  // ══════ APOLLO CITY PRO — PERFORMANCE / THE ATHLETE ══════
  5: {
    id: 5,
    category: 'PERFORMANCE',
    primaryColor: '#2f5cff',
    secondaryColor: '#ffffff',
    backgroundColor: '#020510',
    particleColor: '#2f5cff',
    glowColor: '#6d8cff',
    fontWeight: 800,
    headlineCase: 'uppercase',
    headlineStyle: 'editorial',
    bgTexture: 'deep-space',
    bgAnimated: true,
    particleStyle: 'stars',
    particleCount: 200,
    particleSpeed: 'storm',
    soundTheme: 'space-drone',
    soundIntensity: 'ambient',
    heroEntrance: 'nebula-form',
    entranceTagline: 'BUILT FOR THOSE WHO ARE ALWAYS LATE.',
    entranceSubline: 'Apollo City Pro. 45km/h. AED 4,200.',
    specColors: {
      speed: '#2f5cff',
      range: '#6d8cff',
      motor: '#2f5cff',
      weight: '#a7b8ff',
    },
  },

  // ══════ NINEBOT AIR T15E — COMMUTER / THE DAILY ══════
  4: {
    id: 4,
    category: 'COMMUTER',
    primaryColor: '#f46a2f',
    secondaryColor: '#ffd166',
    backgroundColor: '#0f0800',
    particleColor: '#f46a2f',
    glowColor: '#ff9900',
    fontWeight: 700,
    headlineCase: 'mixed',
    headlineStyle: 'editorial',
    bgTexture: 'sand-dunes',
    bgAnimated: true,
    particleStyle: 'floating-leaves',
    particleCount: 50,
    particleSpeed: 'drift',
    soundTheme: 'city-hum',
    soundIntensity: 'subtle',
    heroEntrance: 'rain-curtain',
    entranceTagline: 'YOUR MORNING. REIMAGINED.',
    entranceSubline: 'Ninebot Air T15E. 12.5kg. AED 2,199.',
    specColors: {
      speed: '#f46a2f',
      range: '#ffd166',
      motor: '#f46a2f',
      weight: '#00c853',
    },
  },
}

// Neutral DNA for Zone 1 (main cinematic — ScootSphere brand)
export const NEUTRAL_DNA: ScooterDNA = {
  id: 0,
  category: 'PERFORMANCE',
  primaryColor: '#2f5cff',
  secondaryColor: '#00f0ff',
  backgroundColor: '#0a0a0f',
  particleColor: '#2f5cff',
  glowColor: '#6d8cff',
  fontWeight: 900,
  headlineCase: 'uppercase',
  headlineStyle: 'editorial',
  bgTexture: 'deep-space',
  bgAnimated: true,
  particleStyle: 'stars',
  particleCount: 200,
  particleSpeed: 'drift',
  soundTheme: 'space-drone',
  soundIntensity: 'ambient',
  heroEntrance: 'nebula-form',
  entranceTagline: 'FIND YOUR PERFECT ELECTRIC SCOOTER.',
  entranceSubline: 'Compare 500+ models from verified UAE vendors.',
  specColors: {
    speed: '#2f5cff',
    range: '#00f0ff',
    motor: '#6d8cff',
    weight: '#a7b8ff',
  },
}

export function getDNA(id: number): ScooterDNA {
  return SCOOTER_DNA[id] ?? NEUTRAL_DNA
}
