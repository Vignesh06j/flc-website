'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface Pastor {
  name: string
  role: string
  image: string
}

const ITEM_WIDTH = 284
const GAP = 24

const pastors: Pastor[] = [
  {
    name: 'Karthika Paul',
    role: "Women's Group Leader and Teen's Pastor",
    image:
      'https://www.figma.com/api/mcp/asset/35e828d5-9094-49eb-a55b-e9b50cf00f62',
  },
  {
    name: 'Ps. Jason Manasseh Paul',
    role: 'Associate Pastor. Creative/Worship and Youth Pastor.',
    image:
      'https://www.figma.com/api/mcp/asset/18f7b245-f7cd-4e69-ac98-77b88ec2c8bf',
  },
  {
    name: 'Pastor Periannan',
    role: 'Administrative Pastor',
    image:
      'https://www.figma.com/api/mcp/asset/03a5e871-0b40-4cda-bb91-74e2ef0534e0',
  },
  {
    name: 'Pastor Sanjeev Kumar',
    role: 'Assistant Pastor',
    image:
      'https://www.figma.com/api/mcp/asset/8729c765-a674-4855-bec5-b92740a02157',
  },
  {
    name: 'Ps. Samuel Alexander',
    role: 'Administrative Pastor',
    image:
      'https://www.figma.com/api/mcp/asset/35e828d5-9094-49eb-a55b-e9b50cf00f62',
  },
]

export function PastoralTeam() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const totalDistance = (pastors.length - 1) * (ITEM_WIDTH + GAP)
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance])

  return (
    /* scroll-driven container — occupies vertical scroll space */
    <div ref={containerRef} className="relative h-[300vh]">
      {/* sticky viewport — stays fixed while user scrolls through */}
      <div
        className="sticky top-0 h-screen flex items-center overflow-visible"
        style={{ width: ITEM_WIDTH, marginLeft: 'calc(50vw - 142px)' }}
      >
        <motion.div
          className="flex will-change-transform"
          style={{ x, gap: GAP }}
        >
          {pastors.map((pastor) => (
            <div
              key={pastor.name}
              className="relative shrink-0 rounded-[14px] overflow-hidden bg-white"
              style={{ width: ITEM_WIDTH, height: 400 }}
            >
              {/* Photo */}
              <img
                src={pastor.image}
                alt={pastor.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Name / role overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-[94px] bg-black/50 text-white px-5 flex flex-col justify-center gap-1 overflow-hidden">
                <p className="font-[family-name:var(--font-lora)] font-bold text-[22px] leading-tight truncate">
                  {pastor.name}
                </p>
                <p className="font-[family-name:var(--font-work-sans)] font-medium text-[12px] leading-snug line-clamp-2">
                  {pastor.role}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
