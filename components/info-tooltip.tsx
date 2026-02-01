'use client'

import { useState } from 'react'

interface InfoTooltipProps {
  content: string
  className?: string
}

export function InfoTooltip({ content, className = '' }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false)
  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-ink/50 hover:text-primary focus:text-primary focus:outline-none transition-colors p-0.5 rounded-full"
        aria-label="More information"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {visible && (
        <div
          className="absolute z-50 left-0 top-full mt-1 w-72 p-3 text-sm text-ink bg-white border border-ink/20 rounded-xl shadow-lg"
          role="tooltip"
        >
          {content}
        </div>
      )}
    </span>
  )
}
