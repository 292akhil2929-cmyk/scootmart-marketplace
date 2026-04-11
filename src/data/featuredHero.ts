// ═══════════════════════════════════════════════════════════
// FEATURED HERO — CMS-ready vendor placement
// Change FEATURED_HERO_ID or edit /public/config/hero.json
// to swap the Zone 0 flagship ad without a code change
// ═══════════════════════════════════════════════════════════

export const FEATURED_HERO_ID = 6 // Dualtron Thunder 2 by default

export interface HeroConfig {
  scooterId: number
  campaignLabel?: string
}

/**
 * Reads /public/config/hero.json at build or request time.
 * Falls back to FEATURED_HERO_ID if fetch fails.
 */
export async function loadHeroConfig(): Promise<HeroConfig> {
  try {
    const res = await fetch('/config/hero.json', { cache: 'no-store' })
    if (!res.ok) throw new Error('no config')
    const json = (await res.json()) as HeroConfig
    return { scooterId: json.scooterId ?? FEATURED_HERO_ID, campaignLabel: json.campaignLabel }
  } catch {
    return { scooterId: FEATURED_HERO_ID, campaignLabel: 'FEATURED' }
  }
}
