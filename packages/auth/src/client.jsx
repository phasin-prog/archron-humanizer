import { ClerkProvider, SignInButton, UserButton, useAuth, useUser, useSession, } from "@clerk/nextjs";
import { thTH } from "@clerk/localizations";
export { ClerkProvider, SignInButton, UserButton, useAuth, useUser, useSession };
export function SignedIn({ children }) {
    const { isSignedIn } = useAuth();
    return isSignedIn ? <>{children}</> : null;
}
export function SignedOut({ children }) {
    const { isSignedIn } = useAuth();
    return !isSignedIn ? <>{children}</> : null;
}
export function ArchronClerkProvider({ children }) {
    return (<ClerkProvider localization={thTH} signInUrl="/th/login" signUpUrl="/th/register">
      {children}
    </ClerkProvider>);
}
export function useRole() {
    const { user } = useUser();
    return user?.publicMetadata?.role ?? "member";
}
