'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ 
  children, 
  apiKey, 
  apiHost 
}: { 
  children: React.ReactNode
  apiKey: string
  apiHost: string
}) {
  useEffect(() => {
    posthog.init(apiKey, {
      api_host: apiHost,
      defaults: '2025-05-24',
    })
  }, [apiKey, apiHost])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}