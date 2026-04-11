'use client'
import { useTransform, motion, useSpring } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'

interface Props {
  scrollYProgress: MotionValue<number>
  phase: number
}

interface CountUpProps { from: number; to: number; suffix?: string; active: boolean }

function CountUp({ from, to, suffix = '', active }: CountUpProps) {
  const progress = active ? 1 : 0
  return (
    <span className="tabular-nums">
      {active ? to : from}{suffix}
    </span>
  )
}

export function ScrollHUD({ scrollYProgress, phase }: Props) {
  // Per-phase element opacities
  const p1TextOp  = useTransform(scrollYProgress, [0, 0.02, 0.12, 0.17], [0, 1, 1, 0])
  const p2SpecOp  = useTransform(scrollYProgress, [0.15, 0.20, 0.38, 0.43], [0, 1, 1, 0])
  const p3PanelOp = useTransform(scrollYProgress, [0.39, 0.45, 0.58, 0.62], [0, 1, 1, 0])
  const p3PanelX  = useTransform(scrollYProgress, [0.39, 0.45], ['60px', '0px'])
  const p4CardsOp = useTransform(scrollYProgress, [0.60, 0.67, 0.80, 0.84], [0, 1, 1, 0])
  const p5TextOp  = useTransform(scrollYProgress, [0.82, 0.88, 1.0, 1.0], [0, 1, 1, 1])

  // Phase 2 spec callouts (each in its scroll window)
  const spec1Op = useTransform(scrollYProgress, [0.16, 0.19, 0.24, 0.27], [0, 1, 1, 0])
  const spec2Op = useTransform(scrollYProgress, [0.24, 0.27, 0.30, 0.33], [0, 1, 1, 0])
  const spec3Op = useTransform(scrollYProgress, [0.30, 0.33, 0.36, 0.39], [0, 1, 1, 0])
  const spec4Op = useTransform(scrollYProgress, [0.36, 0.39, 0.41, 0.43], [0, 1, 1, 0])

  const isDark = phase >= 4
  const textColor = isDark ? 'text-white' : phase === 3 ? 'text-[#111315]' : 'text-white'

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">

      {/* ════════════════════════════════
          PHASE 1 — PRESENCE
      ════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ opacity: p1TextOp }}
      >
        {/* "FIND YOUR PERFECT" */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-barlow font-300 text-[clamp(1.2rem,3.5vw,2rem)] tracking-[0.25em] text-white/70 uppercase mb-2"
        >
          Find Your Perfect
        </motion.p>

        {/* "ELECTRIC SCOOTER" — clip-path wipe */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="font-barlow font-900 text-[clamp(4rem,14vw,11rem)] leading-none tracking-tight text-white"
            style={{ textShadow: '0 0 80px rgba(47,92,255,0.4)' }}
          >
            ELECTRIC SCOOTER
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="font-dm text-white/50 text-base md:text-lg mt-4 max-w-lg text-center"
        >
          Compare 500+ models from verified UAE vendors.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="scroll-line" />
          <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-medium">Scroll to Explore</span>
        </motion.div>
      </motion.div>

      {/* ════════════════════════════════
          PHASE 2 — ORBIT SPEC CALLOUTS
      ════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 flex items-center"
        style={{ opacity: p2SpecOp }}
      >
        {/* Frame counter — aesthetic design element */}
        <div className="absolute top-5 right-6 font-mono text-[11px] text-white/30 tracking-widest">
          {/* This is shown in prod — it's a design element like Apple's product counter */}
          SCOOTSPHERE · AE
        </div>

        {/* Spec callouts — right side */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 text-right">
          <motion.div style={{ opacity: spec1Op }}>
            <div className="font-barlow font-800 text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-[#2f5cff]">
              <CountUp from={0} to={600} suffix="W" active={phase === 2} />
            </div>
            <div className="font-barlow font-400 text-white/50 text-xl tracking-widest uppercase">· Motor</div>
          </motion.div>

          <motion.div style={{ opacity: spec2Op }} className="mt-2">
            <div className="font-barlow font-800 text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-[#17835f]">
              <CountUp from={0} to={55} suffix=" KM" active={phase === 2} />
            </div>
            <div className="font-barlow font-400 text-white/50 text-xl tracking-widest uppercase">· Range</div>
          </motion.div>

          <motion.div style={{ opacity: spec3Op }} className="mt-2">
            <div className="font-barlow font-800 text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-[#f46a2f]">
              <CountUp from={0} to={25} suffix=" KM/H" active={phase === 2} />
            </div>
            <div className="font-barlow font-400 text-white/50 text-xl tracking-widest uppercase">· Top Speed</div>
          </motion.div>

          <motion.div style={{ opacity: spec4Op }} className="mt-2">
            <div className="font-barlow font-800 text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-[#00f0ff]">
              IP54
            </div>
            <div className="font-barlow font-400 text-white/50 text-xl tracking-widest uppercase">· Weather Sealed</div>
          </motion.div>
        </div>
      </motion.div>

      {/* ════════════════════════════════
          PHASE 3 — FREEZE & MODEL REVEAL
      ════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16"
        style={{ opacity: p3PanelOp }}
      >
        <motion.div
          className="bg-white/90 backdrop-blur-2xl rounded-3xl p-7 w-80 md:w-96 shadow-2xl border border-black/5 pointer-events-auto"
          style={{ x: p3PanelX }}
        >
          {/* Category pills */}
          <div className="flex gap-2 mb-4">
            {['COMMUTER','PERFORMANCE','OFF-ROAD'].map((cat, i) => (
              <motion.span
                key={cat}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-barlow font-600 text-[10px] uppercase tracking-[0.2em] px-3 py-1 border border-[#111315]/15 rounded-full text-[#111315]/50"
              >
                {cat}
              </motion.span>
            ))}
          </div>

          <p className="font-barlow font-300 text-xs tracking-[0.3em] uppercase text-[#111315]/40 mb-0.5">SEGWAY</p>
          <p className="font-barlow font-300 text-[10px] tracking-[0.25em] uppercase text-[#2f5cff] mb-1">FEATURED MODEL</p>
          <h2 className="font-barlow font-900 text-[5rem] leading-none tracking-tight text-[#111315]">MAX G2</h2>
          <p className="font-barlow font-700 text-[2.5rem] leading-none text-[#2f5cff] mb-5">AED 2,849</p>

          {/* Spec grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              { icon: '🔋', val: '70km', label: 'Range' },
              { icon: '⚡', val: '25km/h', label: 'Speed' },
              { icon: '🔧', val: '700W', label: 'Motor' },
              { icon: '⚖️', val: '25kg', label: 'Weight' },
            ].map(s => (
              <div key={s.label} className="bg-[#f6f4ef] rounded-2xl p-3 text-center">
                <div className="text-lg">{s.icon}</div>
                <div className="font-barlow font-700 text-base text-[#111315]">{s.val}</div>
                <div className="font-dm text-[10px] text-[#111315]/40 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>

          <a href="/browse?q=Segway+Max+G2" className="block w-full text-center font-barlow font-700 text-sm tracking-widest uppercase border-2 border-[#2f5cff] text-[#2f5cff] rounded-2xl py-3 hover:bg-[#2f5cff] hover:text-white transition-all">
            VIEW FULL SPECS →
          </a>
        </motion.div>
      </motion.div>

      {/* ════════════════════════════════
          PHASE 4 — MODEL CARDS
      ════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-6 md:pr-12"
        style={{ opacity: p4CardsOp }}
      >
        <div className="flex flex-col gap-3 w-64 md:w-72 pointer-events-auto">
          {[
            { brand: 'Xiaomi', model: 'Mi Pro 4', price: 'AED 1,999', badge: 'SALE', badgeC: '#f46a2f', big: false },
            { brand: 'Segway', model: 'Max G2', price: 'AED 2,849', badge: 'FEATURED', badgeC: '#2f5cff', big: true },
            { brand: 'Kaabo', model: 'Wolf King', price: 'AED 12,500', badge: 'BEAST', badgeC: '#d93f4f', big: false },
          ].map((card, i) => (
            <motion.div
              key={card.model}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                card.big
                  ? 'bg-white/8 border-[1.5px] border-[#2f5cff]/60 shadow-[0_0_30px_rgba(47,92,255,0.3)]'
                  : 'bg-white/4 border border-white/10'
              }`}
              style={{ backdropFilter: 'blur(20px)' }}
            >
              <span
                className="absolute top-3 right-3 font-barlow font-700 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                style={{ background: card.badgeC }}
              >{card.badge}</span>
              <div className="text-3xl mb-2">🛴</div>
              <p className="font-dm text-white/40 text-xs">{card.brand}</p>
              <p className="font-barlow font-700 text-white text-xl leading-tight">{card.model}</p>
              <p className="font-barlow font-900 text-[#2f5cff] text-lg mt-1">{card.price}</p>
              <div className="flex gap-2 mt-2">
                <a
                  href={`/browse?q=${encodeURIComponent(card.brand + ' ' + card.model)}`}
                  className="flex-1 text-center font-barlow font-600 text-xs uppercase tracking-wide border border-white/20 text-white/60 rounded-lg py-1.5 hover:bg-white/10 transition-colors"
                >
                  View
                </a>
                <button className="flex-1 font-barlow font-600 text-xs uppercase tracking-wide bg-[#2f5cff]/20 text-[#6d8cff] rounded-lg py-1.5 hover:bg-[#2f5cff]/40 transition-colors">
                  + Compare
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ════════════════════════════════
          PHASE 5 — THE CALL
      ════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-auto"
        style={{ opacity: p5TextOp }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-barlow font-900 text-[clamp(3rem,10vw,8rem)] leading-none tracking-tight text-white mb-3"
          style={{ textShadow: '0 0 120px rgba(47,92,255,0.4)' }}
        >
          Your ride is waiting.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 5 ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-barlow font-300 text-[clamp(1.5rem,3vw,2.5rem)] text-[#6d8cff] tracking-wide mb-3"
        >
          Compare. Choose. Ride.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 5 ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="font-dm text-white/30 text-sm mb-10"
        >
          500+ models · Verified UAE vendors · Free comparison
        </motion.p>

        <div className="flex gap-4 flex-wrap justify-center">
          <motion.a
            href="#storefront"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="font-barlow font-700 text-lg uppercase tracking-widest bg-[#2f5cff] text-white h-14 px-10 rounded-full flex items-center hover:scale-[1.04] transition-transform"
            style={{ boxShadow: '0 0 40px rgba(47,92,255,0.4)' }}
          >
            Enter The Store
          </motion.a>
          <motion.a
            href="/compare"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-barlow font-700 text-lg uppercase tracking-widest border-[1.5px] border-[#2f5cff] text-[#6d8cff] h-14 px-10 rounded-full flex items-center hover:bg-[#2f5cff] hover:text-white transition-all"
          >
            Compare Scooters
          </motion.a>
        </div>
      </motion.div>

      {/* Accessibility: static text for screen readers */}
      <div className="sr-only">
        <p>ScootSphere — UAE's #1 Electric Scooter Marketplace. Scroll to explore our 5-phase product showcase featuring scooter rotation, Dubai skyline, product specifications, model comparison, and the full store below.</p>
      </div>
    </div>
  )
}
