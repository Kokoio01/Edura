import { createAuthClient } from "better-auth/react"
import { adminClient, apiKeyClient } from "better-auth/client/plugins"

const authClient = createAuthClient({
    plugins: [
        adminClient(),
        apiKeyClient()
    ]
})

export const { signIn, signOut, useSession, admin, updateUser, changePassword, apiKey } = authClient;