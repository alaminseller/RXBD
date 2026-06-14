'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * React Error Boundary that catches JavaScript errors in child components.
 * Displays a friendly error message with a "Try Again" button.
 * Logs errors to console (future: Sentry integration).
 * Uses teal color scheme for consistency.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console (future: Sentry integration)
    console.error('[RxBD ErrorBoundary]', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[300px] p-6">
          <Card className="max-w-md w-full border-[#0d6b6e]/20">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-[#0d6b6e]/10 flex items-center justify-center mx-auto">
                <AlertTriangle className="h-7 w-7 text-[#0d6b6e]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Something went wrong
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  An unexpected error occurred. Don&apos;t worry, your data is safe.
                </p>
              </div>
              {this.state.error && (
                <div className="bg-muted/50 rounded-lg p-3 text-left">
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <Button
                onClick={this.handleRetry}
                className="gap-2 bg-gradient-to-r from-[#0d6b6e] to-[#14919b] hover:from-[#0a5759] hover:to-[#117a84]"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
