#!/bin/sh
# Generate runtime config for the frontend so public env vars can be injected at container start.
RUNTIME_CONFIG_PATH="/app/public/runtime-config.js"
mkdir -p "$(dirname "$RUNTIME_CONFIG_PATH")"

cat > "$RUNTIME_CONFIG_PATH" <<EOF
window.__RUNTIME_CONFIG__ = {
	NEXT_PUBLIC_POSTHOG_KEY: "${NEXT_PUBLIC_POSTHOG_KEY}",
	NEXT_PUBLIC_POSTHOG_HOST: "${NEXT_PUBLIC_POSTHOG_HOST}",
}
EOF

# Run migrations/push and then start the server
pnpm dlx drizzle-kit push
exec node server.js
