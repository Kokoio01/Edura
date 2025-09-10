import posthog from "posthog-js"

// Type for the runtime config object injected into the page
type RuntimeConfig = {
  NEXT_PUBLIC_POSTHOG_KEY?: string
  NEXT_PUBLIC_POSTHOG_HOST?: string
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig
  }
}

// Read config from a runtime-injected global if available, otherwise fall back to
// build-time env vars. This allows injecting public keys at container start.
function getRuntimeConfig(): RuntimeConfig {
  if (typeof window !== "undefined" && window.__RUNTIME_CONFIG__) {
    return window.__RUNTIME_CONFIG__ as RuntimeConfig
  }

  return {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
  }
}

const cfg = getRuntimeConfig()
const key = cfg.NEXT_PUBLIC_POSTHOG_KEY
const host = cfg.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"

if (typeof window !== "undefined" && key) {
  posthog.init(key, {
    api_host: host,
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  })
}
