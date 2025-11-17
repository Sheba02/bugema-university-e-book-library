import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-2 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Bugema University E-Book Library</p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="https://www.bugemauniv.ac.ug"
            target="_blank"
            className="hover:text-foreground"
          >
            Official Site
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/support" className="hover:text-foreground">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}


