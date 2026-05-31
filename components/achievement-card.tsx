import type { AchievementProgress, AchievementTheme } from '@/lib/student-achievements'

type Props = {
  title: string
  description: string
  theme: AchievementTheme
  progress: AchievementProgress
  icon: React.ReactNode
}

export function AchievementCard({ title, description, theme, progress, icon }: Props) {
  return (
    <div
      className={`bg-white rounded-2xl border-2 ${theme.border} shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer`}
    >
      <div className={`absolute top-0 right-0 w-20 h-20 ${theme.corner} rounded-bl-full`} />
      <div className="relative">
        <div
          className={`w-16 h-16 rounded-full ${theme.iconBg} flex items-center justify-center mb-4`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-ink mb-1">{title}</h3>
        <p className="text-sm text-ink/70 mb-3">{description}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.bar} rounded-full transition-all duration-300`}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className={`text-xs font-semibold ${progress.statusClassName}`}>
            {progress.statusLabel}
          </span>
        </div>
      </div>
    </div>
  )
}
