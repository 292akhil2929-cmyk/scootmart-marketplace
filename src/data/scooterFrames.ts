// ============================================================
// 72 PROCEDURALLY GENERATED SCOOTER SVG FRAMES
// Each frame = 5° rotation (0° → 355°)
// Luxury product illustration quality
// ============================================================

function px(n: number, d = 1): string {
  return n.toFixed(d)
}

function buildWheel(
  cx: number, cy: number, r: number, sv: number, frameAngle: number, uid: string
): string {
  const spokes = 8
  const innerR = r * 0.28
  const rimR = r - 4
  let spokeLines = ''
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2 + (frameAngle * Math.PI / 180) * 0.8
    const sx = cx + Math.cos(a) * (innerR + 2)
    const sy = cy + Math.sin(a) * (innerR + 2)
    const ex = cx + Math.cos(a) * (rimR - 2)
    const ey = cy + Math.sin(a) * (rimR - 2)
    spokeLines += `<line x1="${px(sx)}" y1="${px(sy)}" x2="${px(ex)}" y2="${px(ey)}" stroke="rgba(150,160,200,0.55)" stroke-width="1.5"/>`
  }
  // Chrome arc (top 120°)
  const arcX1 = cx + rimR * Math.sin(-60 * Math.PI / 180)
  const arcY1 = cy - rimR * Math.cos(-60 * Math.PI / 180)
  const arcX2 = cx + rimR * Math.sin(60 * Math.PI / 180)
  const arcY2 = cy - rimR * Math.cos(60 * Math.PI / 180)
  return `<g>
    <circle cx="${px(cx)}" cy="${px(cy)}" r="${px(r)}" fill="rgba(12,16,38,0.97)" stroke="rgba(90,100,135,0.9)" stroke-width="3.5"/>
    ${spokeLines}
    <circle cx="${px(cx)}" cy="${px(cy)}" r="${px(innerR)}" fill="rgba(30,38,70,0.9)" stroke="rgba(170,180,220,0.5)" stroke-width="1.5"/>
    <circle cx="${px(cx)}" cy="${px(cy)}" r="5.5" fill="rgba(210,220,255,0.9)"/>
    <circle cx="${px(cx)}" cy="${px(cy)}" r="2.5" fill="rgba(255,255,255,0.95)"/>
    <path d="M ${px(arcX1)} ${px(arcY1)} A ${px(rimR)} ${px(rimR)} 0 0 1 ${px(arcX2)} ${px(arcY2)}" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2.5" stroke-linecap="round"/>
  </g>`
}

function buildBattery(x: number, y: number): string {
  const segs = 5, w = 7, h = 4, gap = 2
  let out = ''
  for (let i = 0; i < segs; i++) {
    const filled = i < 4
    out += `<rect x="${px(x + i * (w + gap))}" y="${px(y)}" width="${w}" height="${h}" fill="${filled ? '#17835f' : 'rgba(255,255,255,0.08)'}" rx="1.5"/>`
  }
  return `<g opacity="0.9">${out}</g>`
}

function buildTelemetry(cx: number, y: number, sv: number): string {
  const op = Math.min(1, sv * 2).toFixed(2)
  const floating = `translateY(${(Math.sin(Date.now() * 0.001) * 3).toFixed(1)}px)`
  return `<g opacity="${op}">
    <rect x="${px(cx - 96)}" y="${px(y - 13)}" width="78" height="26" fill="rgba(8,10,20,0.88)" rx="13"/>
    <text x="${px(cx - 57)}" y="${px(y + 4.5)}" text-anchor="middle" font-size="10" font-family="'Courier New',monospace" fill="#a0c0ff" font-weight="600">⚡ 55 KM</text>
    <rect x="${px(cx + 18)}" y="${px(y - 13)}" width="88" height="26" fill="rgba(8,10,20,0.88)" rx="13"/>
    <text x="${px(cx + 62)}" y="${px(y + 4.5)}" text-anchor="middle" font-size="10" font-family="'Courier New',monospace" fill="#a0c0ff" font-weight="600">🏁 25KM/H</text>
  </g>`
}

function buildFrame(fi: number): string {
  const deg = fi * 5
  const rad = deg * Math.PI / 180
  const sinA = Math.sin(rad)
  const cosA = Math.cos(rad)
  const sv = Math.abs(sinA)           // side visibility 0→1
  const frontFacing = cosA >= 0       // are we looking at the front?

  // ── Deck dimensions ──────────────────────────────────────
  const BASE_DECK = 292
  const DECK_DEPTH = 28
  const deckW = Math.max(DECK_DEPTH, BASE_DECK * sv + DECK_DEPTH * (1 - sv))
  const deckX = 300 - deckW / 2
  const deckY = 248
  const deckH = 16
  const cx = 300

  // ── Lighting colour based on angle ───────────────────────
  const lp = (Math.cos(rad * 2) + 1) / 2          // 0→1 lighting phase
  const r = Math.round(15 + 25 * lp)
  const g = Math.round(30 + 30 * lp)
  const b = Math.round(100 + 80 * lp)
  const bodyMid = `rgba(${r},${g},${b+50},0.88)`
  const bodyEdge = `rgba(8,12,45,0.97)`

  // ── Wheel positions ───────────────────────────────────────
  const dir = sinA >= 0 ? 1 : -1
  const halfDeck = deckW * 0.44
  const rearX = cx + dir * halfDeck
  const frontX = cx - dir * halfDeck
  const wheelY = deckY + 52
  const rearR = 52
  const frontR = Math.max(32, 48 * (0.7 + 0.3 * sv))

  // ── Stem ──────────────────────────────────────────────────
  const stemBotX = cx - dir * deckW * 0.18
  const stemTopX = cx - dir * deckW * 0.12
  const stemTopY = 145
  const stemW = Math.max(7, 15 * sv + 7 * (1 - sv))

  // ── Handlebar ────────────────────────────────────────────
  const hbW = Math.max(22, 72 * sv)
  const hbCX = stemTopX
  const hbY = 143

  // ── Headlight x pos ──────────────────────────────────────
  const hlX = frontX - dir * 8 * sv

  // ── LED strip ────────────────────────────────────────────
  const ledY = deckY + deckH - 4
  const ledX = deckX

  const uid = `s${fi}`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" overflow="visible">
  <defs>
    <linearGradient id="bg${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bodyEdge}"/>
      <stop offset="35%" stop-color="${bodyMid}"/>
      <stop offset="65%" stop-color="${bodyMid}"/>
      <stop offset="100%" stop-color="${bodyEdge}"/>
    </linearGradient>
    <linearGradient id="stemG${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${bodyEdge}"/>
      <stop offset="50%" stop-color="rgba(40,60,160,0.9)"/>
      <stop offset="100%" stop-color="${bodyEdge}"/>
    </linearGradient>
    <linearGradient id="led${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="15%" stop-color="#00f0ff"/>
      <stop offset="85%" stop-color="#00f0ff"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <filter id="ledF${uid}" x="-50%" y="-300%" width="200%" height="700%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="dsF${uid}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <filter id="hlF${uid}" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="refClip${uid}">
      <rect x="0" y="320" width="600" height="80"/>
    </clipPath>
  </defs>

  <!-- L1: Ground shadow -->
  <ellipse cx="${px(cx)}" cy="374" rx="${px(deckW * 0.62)}" ry="10" fill="rgba(0,0,0,0.28)" filter="url(#dsF${uid})"/>

  <!-- L2: Wet road reflection -->
  <g clip-path="url(#refClip${uid})" opacity="0.28" transform="scale(1,-1) translate(0,${px(-(deckY * 2 + deckH + 76))})">
    <rect x="${px(deckX)}" y="${px(deckY)}" width="${px(deckW)}" height="${deckH}" fill="url(#bg${uid})" rx="5"/>
    <rect x="${px(deckX + 6)}" y="${px(deckY + 1)}" width="${px(deckW - 12)}" height="3" fill="rgba(255,255,255,0.18)" rx="2"/>
  </g>

  <!-- L6a: Rear wheel (behind body) -->
  ${buildWheel(rearX, wheelY, rearR, sv, deg, uid + 'r')}

  <!-- L3: Deck body -->
  <rect x="${px(deckX)}" y="${px(deckY)}" width="${px(deckW)}" height="${deckH}" fill="url(#bg${uid})" rx="5" stroke="rgba(0,180,255,0.12)" stroke-width="1.2"/>

  <!-- L4: Specular highlight strip -->
  <rect x="${px(deckX + 10)}" y="${px(deckY + 1.5)}" width="${px(deckW - 20)}" height="3" fill="rgba(255,255,255,0.22)" rx="2"/>
  <!-- Side edge highlight -->
  <rect x="${px(deckX)}" y="${px(deckY + 3)}" width="${px(deckW)}" height="1.5" fill="rgba(255,255,255,0.1)" rx="1"/>

  <!-- L5: LED underglow -->
  <rect x="${px(ledX)}" y="${px(ledY)}" width="${px(deckW)}" height="3.5" fill="url(#led${uid})" filter="url(#ledF${uid})" opacity="0.95"/>

  <!-- L7: Stem -->
  <line x1="${px(stemBotX)}" y1="${px(deckY + 2)}" x2="${px(stemTopX)}" y2="${stemTopY}"
        stroke="url(#stemG${uid})" stroke-width="${px(stemW)}" stroke-linecap="round"/>
  <!-- Stem specular -->
  <line x1="${px(stemBotX - 2)}" y1="${px(deckY + 2)}" x2="${px(stemTopX - 2)}" y2="${stemTopY}"
        stroke="rgba(255,255,255,0.13)" stroke-width="2" stroke-linecap="round"/>

  <!-- L8: Handlebar assembly -->
  <rect x="${px(hbCX - hbW / 2)}" y="${hbY - 5}" width="${px(hbW)}" height="10" fill="rgba(35,42,72,0.95)" rx="5"/>
  <!-- Left grip -->
  <rect x="${px(hbCX - hbW / 2)}" y="${hbY - 7}" width="${px(Math.min(18, hbW * 0.22))}" height="14" fill="rgba(15,18,28,0.98)" rx="7"/>
  <!-- Right grip -->
  <rect x="${px(hbCX + hbW / 2 - Math.min(18, hbW * 0.22))}" y="${hbY - 7}" width="${px(Math.min(18, hbW * 0.22))}" height="14" fill="rgba(15,18,28,0.98)" rx="7"/>
  <!-- Chrome clamp -->
  <rect x="${px(hbCX - 9)}" y="${hbY - 9}" width="18" height="18" fill="rgba(170,185,225,0.65)" rx="3"/>
  <rect x="${px(hbCX - 6)}" y="${hbY - 6}" width="12" height="12" fill="rgba(200,215,255,0.45)" rx="2"/>

  <!-- L9: Headlight -->
  <ellipse cx="${px(hlX)}" cy="${px(stemBotX > stemTopX ? deckY - 10 : deckY - 8)}" rx="${px(13 * sv + 4)}" ry="8" fill="rgba(200,220,255,0.9)" filter="url(#hlF${uid})"/>
  <ellipse cx="${px(hlX)}" cy="${px(stemBotX > stemTopX ? deckY - 10 : deckY - 8)}" rx="${px(6 * sv + 2)}" ry="4" fill="rgba(255,255,255,1)"/>

  <!-- L6b: Front wheel (in front of deck) -->
  ${buildWheel(frontX, wheelY, frontR, sv, deg, uid + 'f')}

  <!-- L10: Battery indicator -->
  ${buildBattery(stemTopX - 22, stemTopY - 22)}

  <!-- L11: Telemetry pills (fade in when side-visible) -->
  ${buildTelemetry(cx, deckY - 38, sv)}

  <!-- FRAME HUD aesthetic counter (design element, not debug) -->
  <text x="568" y="24" text-anchor="end" font-family="'Courier New',monospace" font-size="10" fill="rgba(160,180,220,0.35)" letter-spacing="1">FRAME ${String(fi).padStart(3,'0')} · 072</text>
</svg>`
}

// Pre-generate all 72 frames at module load
const frames: string[] = []
for (let i = 0; i < 72; i++) {
  frames.push(buildFrame(i))
}

export const scooterFrames: string[] = frames
export const TOTAL_FRAMES = 72
