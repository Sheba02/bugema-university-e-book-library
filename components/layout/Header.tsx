"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuthActions, useCurrentUser } from "@/hooks/useAuth";
import type { SessionUser } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Library" },
  { href: "/books", label: "Browse", roles: undefined },
  { href: "/dashboard", label: "My Dashboard", roles: ["STUDENT", "ADMIN"] },
  { href: "/admin", label: "Admin", roles: ["ADMIN"] },
];

interface HeaderProps {
  initialUser: SessionUser | null;
}

export function Header({ initialUser }: HeaderProps) {
  const { data: userData } = useCurrentUser();
  const { logout, isLoggingOut } = useAuthActions();
  const user = userData ?? initialUser;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = navLinks.filter(
    (link) => !link.roles || (user && link.roles.includes(user.role)),
  );

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((prev) => !prev)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="text-lg font-semibold">
            Bugema E-Library
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden text-sm font-medium text-muted-foreground sm:inline-flex">
                {user.name} • {user.role}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Join</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      {open && (
        <div className="border-t bg-background px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

