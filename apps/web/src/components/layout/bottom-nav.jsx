"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@archron/auth/client";
import { cn } from "@archron/ui";
import { SearchIcon, ExploreIcon, SupportIcon, ProfileIcon } from "@archron/ui";
export function BottomNav() {
    const pathname = usePathname();
    const items = [
        { href: "/search", label: "Search", icon: SearchIcon },
        { href: "/guides", label: "Guides", icon: ExploreIcon },
        { href: "/support", label: "Support", icon: SupportIcon },
    ];
    return (<>
      {/* Spacer so content doesn't hide behind bottom nav */}
      <div className="h-16 md:hidden"/>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 backdrop-blur-md md:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (<Link key={item.href} href={item.href} className={cn("flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors duration-[var(--motion-fast)]", isActive
                    ? "bg-primary/5 text-primary"
                    : "text-text-muted hover:text-text")}>
                <Icon className="h-5 w-5"/>
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>);
        })}

          {/* Profile / Sign In */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className={cn("flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors duration-[var(--motion-fast)]", "text-text-muted hover:text-text")}>
                <ProfileIcon className="h-5 w-5"/>
                <span className="text-[10px] font-medium leading-none">Sign In</span>
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/profile" className={cn("flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors duration-[var(--motion-fast)]", pathname.startsWith("/profile")
            ? "bg-primary/5 text-primary"
            : "text-text-muted hover:text-text")}>
              <ProfileIcon className="h-5 w-5"/>
              <span className="text-[10px] font-medium leading-none">Profile</span>
            </Link>
          </SignedIn>
        </div>
      </nav>
    </>);
}
