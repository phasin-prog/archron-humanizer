import {
  ClerkProvider,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
  useSession,
} from "@clerk/nextjs"
import { thTH } from "@clerk/localizations"
import type { Role } from "@archron/shared"

export { ClerkProvider, SignInButton, UserButton, useAuth, useUser, useSession }

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth()
  return isSignedIn ? <>{children}</> : null
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth()
  return !isSignedIn ? <>{children}</> : null
}

export function ArchronClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      localization={thTH}
      signInUrl="/th/login"
      signUpUrl="/th/register"
    >
      {children}
    </ClerkProvider>
  )
}

export function useRole(): Role {
  const { user } = useUser()
  return (user?.publicMetadata?.role as Role) ?? "member"
}
