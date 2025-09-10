import posthog from "posthog-js"

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"  

if (typeof window !== "undefined" && key) {  
  posthog.init(key, {  
    api_host: host,  
    capture_exceptions: true,  
    debug: process.env.NODE_ENV === "development",  
  })  
}  
