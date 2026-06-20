/** Unsplash imagery from design-handoff/redesign/data.js (Coral prototype). */
const img = (id: string, w: number, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80${h ? `&h=${h}` : ''}`

export const DESIGN_PHOTOS = {
  hero: img('1522202176988-66273c2fd55f', 1200),
  heroSecond: img('1529156069898-49953e39b3ac', 900),
  poster: img('1600880292203-757bb62b4baf', 900),
  community: img('1521737711867-e3b97375f902', 1100),
  avatar1: img('1494790108377-be9c29b29330', 200, 200),
  avatar2: img('1500648767791-00dcc994a43e', 200, 200),
  avatar3: img('1438761681033-6461ffad8d80', 200, 200),
  avatar4: img('1507003211169-0a1dd7228f2d', 200, 200),
  jobLawn: img('1592420114436-2f6f1c3e6f0a', 600),
  jobMoving: img('1530124566582-a618bc2615dc', 600),
  jobCleaning: img('1581578731548-c64695cc6952', 600),
  jobPet: img('1450778869180-41d0601e046e', 600),
  jobAssembly: img('1581992652564-44c42f5ad3ad', 600),
  jobDelivery: img('1542838132-92c53300491e', 600),
} as const

export const LANDING_FEATURED_JOBS = [
  { name: 'Lawn mowing', area: 'Ponsonby', dur: '2 hrs', pay: 45, photo: DESIGN_PHOTOS.jobLawn },
  { name: 'Help moving boxes', area: 'Newmarket', dur: '4 hrs', pay: 120, photo: DESIGN_PHOTOS.jobMoving },
  { name: 'Dog sitting', area: 'Grey Lynn', dur: 'Weekend', pay: 80, photo: DESIGN_PHOTOS.jobPet },
] as const
