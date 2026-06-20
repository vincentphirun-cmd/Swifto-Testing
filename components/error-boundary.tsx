'use client'

import { Component, ReactNode } from 'react'
import { isAbortError } from '@/lib/abort-error'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Suppress AbortError - it's expected during auth redirects
    if (isAbortError(error)) {
      return { hasError: false }
    }
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Suppress AbortError - it's expected during auth redirects
    if (isAbortError(error)) {
      return
    }
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-canvas">
          <div className="text-center text-ink">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-ink-muted">Please refresh the page or try again later.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
