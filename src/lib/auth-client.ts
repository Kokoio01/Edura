import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

const authClient = createAuthClient({
    plugins: [
        adminClient()
    ]
})

export const { signIn, signOut, useSession, admin, updateUser, changePassword } = authClient;