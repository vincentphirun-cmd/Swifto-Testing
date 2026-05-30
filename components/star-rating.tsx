type StarRatingInputProps = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  label?: string
}

export function StarRatingInput({ value, onChange, disabled, label }: StarRatingInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-medium text-ink">{label}</p>
      )}
      <div className="flex items-center gap-1" role="group" aria-label={label ?? 'Rating'}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            className="p-1 rounded-lg hover:bg-ink/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
          >
            <svg
              className={`w-9 h-9 ${
                star <= value ? 'text-primary fill-primary' : 'text-ink/20 fill-ink/20'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-xs text-ink/60">{value} out of 5</p>
      )}
    </div>
  )
}

type StarRatingDisplayProps = {
  rating: number
  reviewCount: number
  starSize?: 'sm' | 'md' | 'lg'
}

const starSizes = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
}

export function StarRatingDisplay({ rating, reviewCount, starSize = 'md' }: StarRatingDisplayProps) {
  const sizeClass = starSizes[starSize]
  const displayRating = reviewCount > 0 ? Number(rating).toFixed(1) : '—'
  const filledStars = reviewCount > 0 ? Math.round(Number(rating)) : 0

  return (
    <div className="text-center space-y-3">
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClass} ${
              star <= filledStars ? 'text-primary fill-primary' : 'text-ink/20 fill-ink/20'
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-primary">{displayRating}</p>
        <p className="text-sm text-ink/70">
          {reviewCount === 0
            ? 'No reviews yet'
            : `Based on ${reviewCount} review${reviewCount === 1 ? '' : 's'}`}
        </p>
      </div>
    </div>
  )
}
