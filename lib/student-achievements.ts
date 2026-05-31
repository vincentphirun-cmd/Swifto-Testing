import {
  fetchStudentProfileCompletions,
  fetchStudentGstRegistered,
  sumStudentPayoutsFromCompletions,
} from '@/lib/profile-completions'

export type StudentAchievementStats = {
  totalEarned: number
  completedJobCount: number
  byCategory: Record<string, number>
}

export type AchievementProgress = {
  current: number
  target: number
  percent: number
  unlocked: boolean
  statusLabel: string
  statusClassName: string
}

export type AchievementTheme = {
  border: string
  corner: string
  iconBg: string
  iconColor: string
  bar: string
  unlockedText: string
}

export const EARNINGS_MILESTONES: {
  id: string
  title: string
  target: number
  theme: AchievementTheme
}[] = [
  {
    id: 'earn-10',
    title: 'First Dollar',
    target: 10,
    theme: {
      border: 'border-yellow-400',
      corner: 'bg-yellow-400/20',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      bar: 'bg-yellow-400',
      unlockedText: 'text-yellow-600',
    },
  },
  {
    id: 'earn-100',
    title: 'Hundred Club',
    target: 100,
    theme: {
      border: 'border-yellow-400',
      corner: 'bg-yellow-400/20',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      bar: 'bg-yellow-400',
      unlockedText: 'text-yellow-600',
    },
  },
  {
    id: 'earn-200',
    title: 'Two Hundred',
    target: 200,
    theme: {
      border: 'border-yellow-400',
      corner: 'bg-yellow-400/20',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      bar: 'bg-yellow-400',
      unlockedText: 'text-yellow-600',
    },
  },
  {
    id: 'earn-500',
    title: 'Half Grand',
    target: 500,
    theme: {
      border: 'border-orange-400',
      corner: 'bg-orange-400/20',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      bar: 'bg-orange-400',
      unlockedText: 'text-orange-600',
    },
  },
  {
    id: 'earn-750',
    title: 'Three Quarters',
    target: 750,
    theme: {
      border: 'border-orange-400',
      corner: 'bg-orange-400/20',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      bar: 'bg-orange-400',
      unlockedText: 'text-orange-600',
    },
  },
  {
    id: 'earn-1000',
    title: 'Grand Master',
    target: 1000,
    theme: {
      border: 'border-purple-400',
      corner: 'bg-purple-400/20',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      bar: 'bg-purple-400',
      unlockedText: 'text-purple-600',
    },
  },
]

export const JOB_TYPE_MILESTONES: {
  id: string
  title: string
  category: string
  categoryLabel: string
  target: number
  theme: AchievementTheme
}[] = [
  {
    id: 'cat-moving',
    title: 'Moving Expert',
    category: 'moving',
    categoryLabel: 'Moving',
    target: 5,
    theme: {
      border: 'border-blue-400',
      corner: 'bg-blue-400/20',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      bar: 'bg-blue-400',
      unlockedText: 'text-blue-600',
    },
  },
  {
    id: 'cat-cleaning',
    title: 'Cleaning Pro',
    category: 'cleaning',
    categoryLabel: 'Cleaning',
    target: 10,
    theme: {
      border: 'border-green-400',
      corner: 'bg-green-400/20',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      bar: 'bg-green-400',
      unlockedText: 'text-green-600',
    },
  },
  {
    id: 'cat-assembly',
    title: 'Assembly Ace',
    category: 'assembly',
    categoryLabel: 'Assembly',
    target: 3,
    theme: {
      border: 'border-indigo-400',
      corner: 'bg-indigo-400/20',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      bar: 'bg-indigo-400',
      unlockedText: 'text-indigo-600',
    },
  },
  {
    id: 'cat-yard-work',
    title: 'Garden Guru',
    category: 'yard-work',
    categoryLabel: 'Yard Work',
    target: 7,
    theme: {
      border: 'border-emerald-400',
      corner: 'bg-emerald-400/20',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      bar: 'bg-emerald-400',
      unlockedText: 'text-emerald-600',
    },
  },
  {
    id: 'cat-pet-care',
    title: 'Pet Lover',
    category: 'pet-care',
    categoryLabel: 'Pet Care',
    target: 5,
    theme: {
      border: 'border-pink-400',
      corner: 'bg-pink-400/20',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      bar: 'bg-pink-400',
      unlockedText: 'text-pink-600',
    },
  },
  {
    id: 'cat-delivery',
    title: 'Delivery Driver',
    category: 'delivery',
    categoryLabel: 'Delivery',
    target: 8,
    theme: {
      border: 'border-cyan-400',
      corner: 'bg-cyan-400/20',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      bar: 'bg-cyan-400',
      unlockedText: 'text-cyan-600',
    },
  },
]

export const TOTAL_JOBS_MILESTONES: {
  id: string
  title: string
  target: number
  theme: AchievementTheme
}[] = [
  {
    id: 'jobs-10',
    title: 'Getting Started',
    target: 10,
    theme: {
      border: 'border-yellow-400',
      corner: 'bg-yellow-400/20',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      bar: 'bg-yellow-400',
      unlockedText: 'text-yellow-600',
    },
  },
  {
    id: 'jobs-25',
    title: 'Quarter Century',
    target: 25,
    theme: {
      border: 'border-orange-400',
      corner: 'bg-orange-400/20',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      bar: 'bg-orange-400',
      unlockedText: 'text-orange-600',
    },
  },
  {
    id: 'jobs-50',
    title: 'Half Century',
    target: 50,
    theme: {
      border: 'border-red-400',
      corner: 'bg-red-400/20',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      bar: 'bg-red-400',
      unlockedText: 'text-red-600',
    },
  },
  {
    id: 'jobs-100',
    title: 'Century Club',
    target: 100,
    theme: {
      border: 'border-purple-400',
      corner: 'bg-purple-400/20',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      bar: 'bg-purple-400',
      unlockedText: 'text-purple-600',
    },
  },
]

export type AchievementUnlockTheme = Pick<AchievementTheme, 'unlockedText'>

export function getCountProgress(
  current: number,
  target: number,
  theme: AchievementUnlockTheme
): AchievementProgress {
  const unlocked = current >= target
  const percent = unlocked ? 100 : Math.min(100, Math.round((current / target) * 100))
  return {
    current,
    target,
    percent,
    unlocked,
    statusLabel: unlocked ? '✓' : `${Math.min(current, target)}/${target}`,
    statusClassName: unlocked ? theme.unlockedText : 'text-ink/60',
  }
}

export function getEarningsProgress(
  totalEarned: number,
  target: number,
  theme: AchievementUnlockTheme
): AchievementProgress {
  const unlocked = totalEarned >= target
  const percent = unlocked ? 100 : Math.min(100, Math.round((totalEarned / target) * 100))
  return {
    current: totalEarned,
    target,
    percent,
    unlocked,
    statusLabel: unlocked ? '✓' : `${percent}%`,
    statusClassName: unlocked ? theme.unlockedText : 'text-ink/60',
  }
}

export async function fetchStudentAchievementStats(
  userId: string
): Promise<StudentAchievementStats> {
  const jobs = await fetchStudentProfileCompletions(userId)
  const gstRegistered = await fetchStudentGstRegistered(userId)
  const byCategory: Record<string, number> = {}
  for (const job of jobs) {
    if (!job.category) continue
    byCategory[job.category] = (byCategory[job.category] ?? 0) + 1
  }
  return {
    totalEarned: sumStudentPayoutsFromCompletions(jobs, gstRegistered),
    completedJobCount: jobs.length,
    byCategory,
  }
}

export function countUnlockedAchievements(stats: StudentAchievementStats): {
  unlocked: number
  total: number
} {
  const total =
    EARNINGS_MILESTONES.length +
    JOB_TYPE_MILESTONES.length +
    TOTAL_JOBS_MILESTONES.length

  let unlocked = 0
  for (const m of EARNINGS_MILESTONES) {
    if (stats.totalEarned >= m.target) unlocked++
  }
  for (const m of JOB_TYPE_MILESTONES) {
    if ((stats.byCategory[m.category] ?? 0) >= m.target) unlocked++
  }
  for (const m of TOTAL_JOBS_MILESTONES) {
    if (stats.completedJobCount >= m.target) unlocked++
  }
  return { unlocked, total }
}
