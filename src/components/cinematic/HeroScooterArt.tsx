'use client'
// ═══════════════════════════════════════════════════════════
// HERO SCOOTER ART — Premium code-drawn illustration
// Purpose-built for the Zone 0 flagship hero.
// NOT the 72-frame procedural set. Single high-fidelity view.
//
// Layered SVG construction:
//   - Realistic fat off-road tires with tread blocks
//   - Alloy rims with 10 spokes, hub nut, brake disc with rotor holes
//   - Dual-crown suspension forks with stanchion highlights
//   - Carbon-fiber deck with weave pattern + kicktail
//   - LED matrix headlight with lens flare
//   - Detailed handlebar with throttle grip, brake levers, display
//   - DNA-color underglow, rim light, floor reflection
//   - All driven by two colors so it retheme per scooter
// ═══════════════════════════════════════════════════════════

interface Props {
  primary: string       // DNA primary (accent)
  secondary: string     // DNA secondary (highlight)
  glow: string          // DNA glow color
  className?: string
}

export function HeroScooterArt({ primary, secondary, glow, className }: Props) {
  // viewBox: 1200 x 680, 3/4 side profile from front-left
  return (
    <div
      className={className}
      style={{
        width: 'min(960px, 92vw)',
        filter: `drop-shadow(0 0 90px ${glow}55) drop-shadow(0 60px 80px rgba(0,0,0,0.7))`,
      }}
    >
      <svg
        viewBox="0 0 1200 680"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          {/* ── CARBON FIBRE PATTERN ─────────────────────────── */}
          <pattern id="carbonWeave" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#0a0d14" />
            <path d="M 0 0 L 8 8 M 0 8 L 8 0" stroke="#1a1f2e" strokeWidth="1.2" />
            <rect x="0" y="0" width="4" height="4" fill="#151a26" />
            <rect x="4" y="4" width="4" height="4" fill="#151a26" />
          </pattern>

          {/* ── TIRE TREAD PATTERN ───────────────────────────── */}
          <pattern id="tireTread" width="18" height="12" patternUnits="userSpaceOnUse">
            <rect width="18" height="12" fill="#0b0b0f" />
            <rect x="2" y="2" width="6" height="8" rx="1" fill="#1a1a22" />
            <rect x="10" y="2" width="6" height="8" rx="1" fill="#15151c" />
          </pattern>

          {/* ── DECK BODY GRADIENT ───────────────────────────── */}
          <linearGradient id="deckG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b2130" />
            <stop offset="40%" stopColor="#0e121b" />
            <stop offset="60%" stopColor="#0a0d14" />
            <stop offset="100%" stopColor="#05070c" />
          </linearGradient>

          {/* ── ACCENT STRIPE (DNA PRIMARY) ──────────────────── */}
          <linearGradient id="accentStripe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={primary} stopOpacity="0" />
            <stop offset="20%" stopColor={primary} stopOpacity="1" />
            <stop offset="80%" stopColor={secondary} stopOpacity="1" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0" />
          </linearGradient>

          {/* ── CHROME FORK GRADIENT ─────────────────────────── */}
          <linearGradient id="chromeG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2a2f3a" />
            <stop offset="35%" stopColor="#c8cfdb" />
            <stop offset="55%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#8a92a3" />
            <stop offset="100%" stopColor="#1e232e" />
          </linearGradient>

          {/* ── RIM GRADIENT (anodized dark) ─────────────────── */}
          <radialGradient id="rimG" cx="0.35" cy="0.35" r="0.8">
            <stop offset="0%" stopColor="#3a4152" />
            <stop offset="45%" stopColor="#1c2130" />
            <stop offset="100%" stopColor="#06080f" />
          </radialGradient>

          {/* ── BRAKE DISC GRADIENT ──────────────────────────── */}
          <radialGradient id="discG" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stopColor="#d8dde8" />
            <stop offset="60%" stopColor="#6b7384" />
            <stop offset="100%" stopColor="#20242e" />
          </radialGradient>

          {/* ── HEADLIGHT LENS ───────────────────────────────── */}
          <radialGradient id="headlightG" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor={secondary} stopOpacity="0.95" />
            <stop offset="70%" stopColor={primary} stopOpacity="0.6" />
            <stop offset="100%" stopColor={primary} stopOpacity="0" />
          </radialGradient>

          {/* ── UNDERGLOW GRADIENT ───────────────────────────── */}
          <linearGradient id="underG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={primary} stopOpacity="0" />
            <stop offset="20%" stopColor={primary} stopOpacity="0.9" />
            <stop offset="50%" stopColor={secondary} stopOpacity="1" />
            <stop offset="80%" stopColor={primary} stopOpacity="0.9" />
            <stop offset="100%" stopColor={primary} stopOpacity="0" />
          </linearGradient>

          {/* ── GRIP RUBBER ──────────────────────────────────── */}
          <linearGradient id="gripG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1d26" />
            <stop offset="50%" stopColor="#080a10" />
            <stop offset="100%" stopColor="#15181f" />
          </linearGradient>

          {/* ── MOTOR HUB GRADIENT ───────────────────────────── */}
          <radialGradient id="motorG" cx="0.4" cy="0.4" r="0.6">
            <stop offset="0%" stopColor={primary} stopOpacity="0.7" />
            <stop offset="30%" stopColor="#1a1f2e" />
            <stop offset="100%" stopColor="#05070c" />
          </radialGradient>

          {/* ── FILTERS ──────────────────────────────────────── */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bigGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="shadowF" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>

          {/* ── REFLECTION CLIP ──────────────────────────────── */}
          <linearGradient id="refFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ═════════ GROUND SHADOW ═════════ */}
        <ellipse
          cx="600"
          cy="600"
          rx="480"
          ry="22"
          fill="rgba(0,0,0,0.75)"
          filter="url(#shadowF)"
        />
        <ellipse
          cx="600"
          cy="605"
          rx="380"
          ry="10"
          fill={primary}
          fillOpacity="0.35"
          filter="url(#shadowF)"
        />

        {/* ═════════ UNDERGLOW HALO ═════════ */}
        <ellipse
          cx="600"
          cy="440"
          rx="500"
          ry="60"
          fill={primary}
          fillOpacity="0.35"
          filter="url(#bigGlow)"
        />

        {/* ══════════════════════════════════════════════════════
            REAR WHEEL (left side — partially behind)
            ══════════════════════════════════════════════════════ */}
        <g transform="translate(290, 470)">
          {/* Tire — outer sidewall */}
          <circle cx="0" cy="0" r="158" fill="#05060a" />
          <circle cx="0" cy="0" r="152" fill="url(#tireTread)" />
          {/* Sidewall lettering mark */}
          <text
            x="0"
            y="-135"
            textAnchor="middle"
            fontFamily="'Barlow Condensed',sans-serif"
            fontWeight="700"
            fontSize="9"
            fill="rgba(255,255,255,0.18)"
            letterSpacing="1.5"
          >
            11×4.0 OFFROAD DH
          </text>
          {/* Inner bead */}
          <circle cx="0" cy="0" r="118" fill="#0a0c12" />
          {/* Alloy rim */}
          <circle cx="0" cy="0" r="112" fill="url(#rimG)" stroke="#3a4152" strokeWidth="2" />
          {/* Spokes — 10, with double thickness */}
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2
            const x1 = Math.cos(a) * 30
            const y1 = Math.sin(a) * 30
            const x2 = Math.cos(a) * 108
            const y2 = Math.sin(a) * 108
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#252a38" strokeWidth="9" strokeLinecap="round" />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a5164" strokeWidth="2.5" strokeLinecap="round" />
                <line x1={x1 * 0.9} y1={y1 * 0.9} x2={x2 * 0.98} y2={y2 * 0.98} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              </g>
            )
          })}
          {/* Motor hub (electric drive) */}
          <circle cx="0" cy="0" r="60" fill="url(#motorG)" stroke={primary} strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="52" fill="#0a0d14" stroke="#2a2f3e" strokeWidth="1" />
          {/* Motor vents */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2
            return (
              <rect
                key={i}
                x="-2"
                y="-48"
                width="4"
                height="14"
                rx="2"
                fill="#020307"
                transform={`rotate(${(a * 180) / Math.PI})`}
              />
            )
          })}
          {/* Center hub nut */}
          <circle cx="0" cy="0" r="14" fill="#1c2130" stroke="#4a5164" strokeWidth="1.5" />
          <polygon
            points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5"
            fill="#2a2f3e"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.8"
          />
          {/* DNA accent glow ring */}
          <circle cx="0" cy="0" r="115" fill="none" stroke={primary} strokeWidth="1.2" opacity="0.6" />
          {/* Top chrome highlight */}
          <path
            d="M -105 -60 A 120 120 0 0 1 80 -100"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* ══════════════════════════════════════════════════════
            REAR FENDER + MUDGUARD
            ══════════════════════════════════════════════════════ */}
        <path
          d="M 145 420 Q 200 330 320 315 L 380 320 Q 420 330 430 365 L 420 395 Q 340 380 270 410 Q 200 440 150 450 Z"
          fill="url(#deckG)"
          stroke="#1a1f2e"
          strokeWidth="1.5"
        />
        <path
          d="M 160 422 Q 215 340 325 328 L 370 332"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />
        {/* Rear brake light */}
        <rect
          x="170"
          y="395"
          width="55"
          height="6"
          rx="3"
          fill={primary}
          filter="url(#softGlow)"
        />
        <rect x="170" y="395" width="55" height="2" rx="1" fill="#ffffff" opacity="0.8" />

        {/* ══════════════════════════════════════════════════════
            DECK BODY
            ══════════════════════════════════════════════════════ */}
        {/* Main deck — slightly raised tail */}
        <path
          d="M 385 395 L 820 395 L 840 430 L 820 448 L 385 448 L 365 430 Z"
          fill="url(#deckG)"
          stroke="#1a1f2e"
          strokeWidth="2"
        />
        {/* Carbon weave inlay */}
        <path
          d="M 400 402 L 810 402 L 820 430 L 810 442 L 400 442 L 390 430 Z"
          fill="url(#carbonWeave)"
          opacity="0.85"
        />
        {/* Accent stripe */}
        <rect x="390" y="415" width="440" height="3" fill="url(#accentStripe)" />
        <rect x="390" y="415" width="440" height="3" fill="url(#accentStripe)" filter="url(#softGlow)" opacity="0.6" />
        {/* Top specular highlight */}
        <path
          d="M 395 396 L 815 396 L 820 402 L 395 402 Z"
          fill="rgba(255,255,255,0.18)"
        />
        {/* Footrest grip pad — diamond rubber */}
        <g transform="translate(500, 398)">
          <rect width="220" height="22" rx="2" fill="#080a0f" />
          {Array.from({ length: 22 }).map((_, row) =>
            Array.from({ length: 2 }).map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={row * 10 + (col % 2 ? 5 : 0)}
                y={col * 11}
                width="4"
                height="4"
                fill="#1a1f2e"
              />
            ))
          )}
        </g>
        {/* Deck side edge highlight */}
        <line x1="388" y1="448" x2="820" y2="448" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* ══════════════════════════════════════════════════════
            BATTERY PACK (visible side cell)
            ══════════════════════════════════════════════════════ */}
        <rect x="420" y="430" width="380" height="18" fill="#02030a" stroke="#1a1f2e" strokeWidth="1" />
        {/* Cooling fins */}
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={430 + i * 26} y="434" width="14" height="10" fill="#0a0d14" stroke="#1c2130" strokeWidth="0.5" />
        ))}
        {/* Small LED indicator */}
        <circle cx="800" cy="439" r="2.5" fill={secondary}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* ══════════════════════════════════════════════════════
            LED UNDERGLOW
            ══════════════════════════════════════════════════════ */}
        <rect x="370" y="452" width="480" height="4" rx="2" fill="url(#underG)" filter="url(#softGlow)" />
        <rect x="370" y="452" width="480" height="2" rx="1" fill="#ffffff" opacity="0.7" />

        {/* ══════════════════════════════════════════════════════
            FRONT FORKS (dual-crown MTB suspension)
            ══════════════════════════════════════════════════════ */}
        {/* Lower fork legs (stanchions) */}
        <rect x="860" y="350" width="14" height="140" rx="3" fill="url(#chromeG)" />
        <rect x="892" y="350" width="14" height="140" rx="3" fill="url(#chromeG)" />
        {/* Fork seals */}
        <rect x="858" y="348" width="18" height="4" rx="1" fill="#1a1f2e" />
        <rect x="890" y="348" width="18" height="4" rx="1" fill="#1a1f2e" />
        {/* Upper fork crown */}
        <path
          d="M 848 295 L 916 295 L 920 345 L 844 345 Z"
          fill="#0e121b"
          stroke="#2a2f3e"
          strokeWidth="1.5"
        />
        <path
          d="M 852 298 L 912 298 L 915 307 L 849 307 Z"
          fill={primary}
          fillOpacity="0.25"
        />
        {/* Axle caps */}
        <circle cx="867" cy="490" r="7" fill="#2a2f3e" stroke="#4a5164" strokeWidth="1" />
        <circle cx="899" cy="490" r="7" fill="#2a2f3e" stroke="#4a5164" strokeWidth="1" />

        {/* ══════════════════════════════════════════════════════
            STEERING COLUMN + CABLE ROUTING
            ══════════════════════════════════════════════════════ */}
        <path
          d="M 870 295 L 820 120 L 850 120 L 904 295 Z"
          fill="url(#deckG)"
          stroke="#1a1f2e"
          strokeWidth="1.5"
        />
        {/* Specular edge */}
        <path
          d="M 822 125 L 870 295"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Accent inlay */}
        <path
          d="M 828 135 L 876 290"
          stroke={primary}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Cable (brake + throttle wire) */}
        <path
          d="M 840 135 Q 870 200 856 295"
          fill="none"
          stroke="#0a0c12"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 842 135 Q 872 200 858 295"
          fill="none"
          stroke="#1a1f2e"
          strokeWidth="1"
        />

        {/* ══════════════════════════════════════════════════════
            HANDLEBAR ASSEMBLY
            ══════════════════════════════════════════════════════ */}
        {/* Chrome clamp / stem top */}
        <rect x="808" y="108" width="48" height="20" rx="3" fill="url(#chromeG)" />
        <rect x="812" y="112" width="40" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
        <circle cx="820" cy="118" r="2" fill="#1a1f2e" />
        <circle cx="844" cy="118" r="2" fill="#1a1f2e" />

        {/* Handlebar tube */}
        <rect x="680" y="102" width="310" height="10" rx="5" fill="url(#chromeG)" />
        <rect x="682" y="104" width="306" height="2" rx="1" fill="rgba(255,255,255,0.55)" />

        {/* Left grip (rubber) */}
        <rect x="672" y="96" width="58" height="22" rx="11" fill="url(#gripG)" stroke="#05060a" strokeWidth="1" />
        {/* Grip ribs */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={678 + i * 8} y="98" width="1.5" height="18" fill="rgba(255,255,255,0.1)" />
        ))}
        {/* Left brake lever */}
        <path
          d="M 728 108 Q 748 95 775 92 L 778 98 Q 752 104 732 118 Z"
          fill="url(#chromeG)"
          stroke="#1a1f2e"
          strokeWidth="0.8"
        />

        {/* Right grip (rubber) */}
        <rect x="940" y="96" width="58" height="22" rx="11" fill="url(#gripG)" stroke="#05060a" strokeWidth="1" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={946 + i * 8} y="98" width="1.5" height="18" fill="rgba(255,255,255,0.1)" />
        ))}
        {/* Right brake lever */}
        <path
          d="M 940 108 Q 918 95 892 92 L 889 98 Q 915 104 935 118 Z"
          fill="url(#chromeG)"
          stroke="#1a1f2e"
          strokeWidth="0.8"
        />
        {/* Throttle paddle */}
        <rect x="925" y="100" width="18" height="14" rx="3" fill={primary} />
        <rect x="927" y="102" width="14" height="3" rx="1" fill="#ffffff" opacity="0.7" />

        {/* OLED display in center */}
        <rect x="780" y="82" width="104" height="38" rx="5" fill="#05070c" stroke="#2a2f3e" strokeWidth="1.5" />
        <rect x="784" y="86" width="96" height="30" rx="3" fill="#0a0d14" />
        {/* Display content */}
        <text
          x="832"
          y="100"
          textAnchor="middle"
          fontFamily="'Courier New',monospace"
          fontSize="7"
          fill={primary}
          opacity="0.85"
        >
          BATT · 98%
        </text>
        <text
          x="832"
          y="112"
          textAnchor="middle"
          fontFamily="'Courier New',monospace"
          fontSize="11"
          fontWeight="700"
          fill={secondary}
        >
          READY
        </text>
        {/* Display bezel highlight */}
        <rect x="780" y="82" width="104" height="4" rx="3" fill="rgba(255,255,255,0.2)" />

        {/* ══════════════════════════════════════════════════════
            HEADLIGHT HOUSING (LED matrix)
            ══════════════════════════════════════════════════════ */}
        <g transform="translate(882, 325)">
          {/* Housing */}
          <path
            d="M -42 -26 Q -48 -28 -44 -8 L -40 18 Q -36 30 -10 32 L 30 32 Q 48 28 50 8 L 48 -18 Q 44 -30 20 -30 Z"
            fill="#0a0d14"
            stroke="#1a1f2e"
            strokeWidth="1.5"
          />
          {/* Inner lens */}
          <ellipse cx="0" cy="2" rx="42" ry="24" fill="url(#headlightG)" />
          {/* LED matrix (5 LEDs) */}
          {[-28, -14, 0, 14, 28].map((x) => (
            <g key={x}>
              <circle cx={x} cy="2" r="6" fill={secondary} opacity="0.9" />
              <circle cx={x} cy="2" r="3" fill="#ffffff" />
              <circle cx={x - 1} cy="0" r="1" fill="#ffffff" opacity="0.9" />
            </g>
          ))}
          {/* Lens flare */}
          <ellipse cx="0" cy="2" rx="55" ry="5" fill="#ffffff" opacity="0.6" filter="url(#softGlow)" />
          <line x1="-90" y1="2" x2="90" y2="2" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
          <line x1="0" y1="-40" x2="0" y2="44" stroke="#ffffff" strokeWidth="0.8" opacity="0.35" />
        </g>

        {/* ══════════════════════════════════════════════════════
            FRONT WHEEL
            ══════════════════════════════════════════════════════ */}
        <g transform="translate(883, 490)">
          {/* Tire outer */}
          <circle cx="0" cy="0" r="148" fill="#05060a" />
          <circle cx="0" cy="0" r="142" fill="url(#tireTread)" />
          <text
            x="0"
            y="-125"
            textAnchor="middle"
            fontFamily="'Barlow Condensed',sans-serif"
            fontWeight="700"
            fontSize="9"
            fill="rgba(255,255,255,0.18)"
            letterSpacing="1.5"
          >
            11×4.0 OFFROAD DH
          </text>
          {/* Bead */}
          <circle cx="0" cy="0" r="110" fill="#0a0c12" />
          {/* Alloy rim */}
          <circle cx="0" cy="0" r="104" fill="url(#rimG)" stroke="#3a4152" strokeWidth="2" />
          {/* Spokes */}
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2 + 0.15
            const x1 = Math.cos(a) * 28
            const y1 = Math.sin(a) * 28
            const x2 = Math.cos(a) * 100
            const y2 = Math.sin(a) * 100
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#252a38" strokeWidth="8.5" strokeLinecap="round" />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a5164" strokeWidth="2.5" strokeLinecap="round" />
                <line x1={x1 * 0.9} y1={y1 * 0.9} x2={x2 * 0.98} y2={y2 * 0.98} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              </g>
            )
          })}
          {/* Brake disc — visible in front */}
          <circle cx="0" cy="0" r="58" fill="url(#discG)" opacity="0.92" />
          <circle cx="0" cy="0" r="52" fill="#0a0c12" stroke="#6b7384" strokeWidth="1" />
          <circle cx="0" cy="0" r="48" fill="url(#discG)" />
          {/* Rotor drill holes — 2 rings */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2
            return <circle key={`o${i}`} cx={Math.cos(a) * 42} cy={Math.sin(a) * 42} r="3" fill="#05060a" />
          })}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 + 0.1
            return <circle key={`i${i}`} cx={Math.cos(a) * 30} cy={Math.sin(a) * 30} r="2.5" fill="#05060a" />
          })}
          {/* Disc heat tint (DNA accent) */}
          <circle cx="0" cy="0" r="48" fill="none" stroke={primary} strokeWidth="0.8" opacity="0.5" />
          {/* Brake caliper */}
          <rect x="-12" y="-70" width="24" height="22" rx="3" fill={primary} stroke="#0a0d14" strokeWidth="1" />
          <rect x="-9" y="-66" width="18" height="3" rx="1" fill="#ffffff" opacity="0.7" />
          {/* Center hub */}
          <circle cx="0" cy="0" r="14" fill="#1c2130" stroke="#4a5164" strokeWidth="1.5" />
          <polygon
            points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5"
            fill="#2a2f3e"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.8"
          />
          {/* DNA accent ring */}
          <circle cx="0" cy="0" r="107" fill="none" stroke={primary} strokeWidth="1.2" opacity="0.7" />
          {/* Top chrome highlight */}
          <path
            d="M -95 -65 A 115 115 0 0 1 85 -95"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* ═════════ REFLECTION / WET FLOOR ═════════ */}
        <g transform="translate(0, 620) scale(1,-0.35)" opacity="0.18">
          <rect x="370" y="-220" width="480" height="4" rx="2" fill={primary} filter="url(#softGlow)" />
          <ellipse cx="290" cy="-130" rx="158" ry="40" fill="#1a1f2e" />
          <ellipse cx="883" cy="-130" rx="148" ry="40" fill="#1a1f2e" />
        </g>
      </svg>
    </div>
  )
}
