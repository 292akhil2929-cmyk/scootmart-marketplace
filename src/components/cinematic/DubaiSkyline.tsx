// CSS/SVG Dubai skyline — all procedurally drawn, no images

export function DubaiSkyline() {
  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax meet"
      className="absolute bottom-0 left-0 w-full h-48 md:h-64"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyAmber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201,123,58,0)" />
          <stop offset="60%" stopColor="rgba(201,123,58,0.45)" />
          <stop offset="100%" stopColor="rgba(160,80,20,0.7)" />
        </linearGradient>
        <linearGradient id="buildingG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(180,100,30,0.55)" />
          <stop offset="100%" stopColor="rgba(100,50,10,0.85)" />
        </linearGradient>
        <filter id="skyGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background amber glow */}
      <rect x="0" y="0" width="1200" height="300" fill="url(#skyAmber)" />

      {/* ── Burj Khalifa (center-left, tallest) ─────────── */}
      {/* Base wide section */}
      <polygon points="530,300 536,150 544,100 548,40 550,5 552,40 556,100 560,150 566,300" fill="url(#buildingG)" />
      {/* Tapered middle */}
      <rect x="538" y="130" width="20" height="100" fill="rgba(160,75,20,0.7)" />
      {/* Spire */}
      <line x1="550" y1="5" x2="550" y2="80" stroke="rgba(220,130,50,0.8)" strokeWidth="2" />
      {/* Windows */}
      <rect x="542" y="180" width="3" height="5" fill="rgba(255,200,100,0.5)" rx="0.5" />
      <rect x="548" y="180" width="3" height="5" fill="rgba(255,200,100,0.5)" rx="0.5" />
      <rect x="554" y="180" width="3" height="5" fill="rgba(255,200,100,0.5)" rx="0.5" />
      <rect x="542" y="200" width="3" height="5" fill="rgba(255,200,100,0.35)" rx="0.5" />
      <rect x="554" y="200" width="3" height="5" fill="rgba(255,200,100,0.35)" rx="0.5" />
      {/* Antenna tip light */}
      <circle cx="550" cy="5" r="2.5" fill="rgba(255,80,80,0.9)" filter="url(#skyGlow)" />

      {/* ── Emirates Towers (left of Burj Khalifa) ─────── */}
      {/* Tower 1 */}
      <polygon points="380,300 385,220 388,180 390,130 392,180 395,220 400,300" fill="url(#buildingG)" />
      <line x1="390" y1="130" x2="390" y2="155" stroke="rgba(200,110,40,0.7)" strokeWidth="1.5" />
      {/* Tower 2 (slightly shorter) */}
      <polygon points="405,300 410,230 412,190 414,145 416,190 418,230 422,300" fill="url(#buildingG)" />
      <line x1="414" y1="145" x2="414" y2="165" stroke="rgba(200,110,40,0.7)" strokeWidth="1.5" />

      {/* ── DIFC Gate Tower (gate arch shape) ─────────── */}
      {/* Left tower */}
      <rect x="450" y="180" width="18" height="120" fill="url(#buildingG)" />
      {/* Right tower */}
      <rect x="490" y="180" width="18" height="120" fill="url(#buildingG)" />
      {/* Arch bridge at top */}
      <path d="M 450 185 Q 479 155 508 185" fill="none" stroke="rgba(180,90,25,0.75)" strokeWidth="4" />
      {/* Windows */}
      <rect x="455" y="195" width="4" height="6" fill="rgba(255,200,100,0.4)" rx="0.5" />
      <rect x="462" y="195" width="4" height="6" fill="rgba(255,200,100,0.4)" rx="0.5" />
      <rect x="495" y="195" width="4" height="6" fill="rgba(255,200,100,0.4)" rx="0.5" />

      {/* ── Burj Al Arab (right, sail shape) ────────────── */}
      {/* Mast */}
      <line x1="840" y1="300" x2="840" y2="100" stroke="rgba(160,75,20,0.8)" strokeWidth="4" />
      {/* Sail - curved billowing shape */}
      <path d="M 840 105 Q 870 130 900 170 Q 920 200 915 250 L 900 300 L 840 300 Z"
        fill="url(#buildingG)" />
      {/* Sail highlight */}
      <path d="M 840 105 Q 848 135 852 175 Q 853 210 850 250 L 842 300"
        fill="none" stroke="rgba(220,130,50,0.35)" strokeWidth="1.5" />
      {/* Helipad extension */}
      <line x1="900" y1="130" x2="940" y2="125" stroke="rgba(170,85,25,0.6)" strokeWidth="3" />
      <ellipse cx="942" cy="124" rx="12" ry="6" fill="rgba(150,75,20,0.5)" />

      {/* ── Address Downtown / generic towers ─────────── */}
      <rect x="600" y="200" width="22" height="100" fill="url(#buildingG)" />
      <rect x="630" y="215" width="18" height="85" fill="url(#buildingG)" />
      <rect x="660" y="190" width="20" height="110" fill="url(#buildingG)" />
      <rect x="688" y="210" width="15" height="90" fill="url(#buildingG)" />
      <rect x="712" y="220" width="25" height="80" fill="url(#buildingG)" />

      {/* ── Left generic skyline fill ────────────────── */}
      <rect x="50" y="240" width="30" height="60" fill="url(#buildingG)" />
      <rect x="90" y="225" width="22" height="75" fill="url(#buildingG)" />
      <rect x="120" y="235" width="28" height="65" fill="url(#buildingG)" />
      <rect x="160" y="210" width="20" height="90" fill="url(#buildingG)" />
      <rect x="190" y="220" width="35" height="80" fill="url(#buildingG)" />
      <rect x="240" y="230" width="18" height="70" fill="url(#buildingG)" />
      <rect x="270" y="215" width="25" height="85" fill="url(#buildingG)" />
      <rect x="310" y="225" width="20" height="75" fill="url(#buildingG)" />
      <rect x="340" y="200" width="28" height="100" fill="url(#buildingG)" />

      {/* ── Right generic skyline fill ───────────────── */}
      <rect x="960" y="230" width="28" height="70" fill="url(#buildingG)" />
      <rect x="998" y="215" width="22" height="85" fill="url(#buildingG)" />
      <rect x="1030" y="225" width="30" height="75" fill="url(#buildingG)" />
      <rect x="1070" y="235" width="20" height="65" fill="url(#buildingG)" />
      <rect x="1100" y="220" width="35" height="80" fill="url(#buildingG)" />
      <rect x="1145" y="240" width="25" height="60" fill="url(#buildingG)" />

      {/* ── Ground line ─────────────────────────────── */}
      <rect x="0" y="298" width="1200" height="4" fill="rgba(120,55,10,0.6)" />

      {/* ── Sun / horizon glow ───────────────────────── */}
      <ellipse cx="600" cy="200" rx="180" ry="60" fill="rgba(255,160,60,0.12)" />
      <ellipse cx="600" cy="200" rx="80" ry="30" fill="rgba(255,200,80,0.12)" />
    </svg>
  )
}
