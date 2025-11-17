import Link from "next/link";
import { BookOpen, ShieldCheck, UsersRound } from "lucide-react";

import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listBooks } from "@/services/bookService";

export default async function Home() {
  let books: Awaited<ReturnType<typeof listBooks>> = [];
  try {
    books = await listBooks({ includeHidden: false });
  } catch (error) {
    console.warn("Mongo connection not ready. Showing empty state.");
  }

  return (
    <div className="space-y-16">
      <section className="rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background px-6 py-12 shadow-sm md:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-max">
              Bugema University E-Book Library
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Read, learn, and stay ahead with curated course materials.
            </h1>
            <p className="text-lg text-muted-foreground">
              A powerful digital library platform designed for academic excellence. 
Books are managed by administrators through the admin panel, enabling students 
to track their reading progress seamlessly across all devices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Create account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="grid w-full max-w-md gap-4">
            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Easyreading"
              description="Every book consists of numbered pages for instant rendering."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Multi-Device Sync"
              description="Seamlessly continue reading across your phone, tablet, and computer"
            />
            <FeatureCard
              icon={<UsersRound className="h-5 w-5" />}
              title="Admin & Student roles"
              description="Admins manage uploads, categories, and users while students focus on learning."
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Featured titles</h2>
            <p className="text-sm text-muted-foreground">
              Explore our growing collection of course materials and textbooks
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/books">Browse all</Link>
          </Button>
        </div>
        {books.length === 0 ? (
          <div className="rounded-2xl border bg-muted/40 p-6 text-muted-foreground">
            No books yet. Sign in as an admin and use the upload form to create
            your first digital title. Remember to place page images inside
            <code className="mx-1 rounded bg-background px-1 py-0.5">
              /public/books/my-folder/1.jpg
            </code>
            , <code>2.jpg</code>, and so on.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.slice(0, 6).map((book) => (
              <BookCard key={book._id.toString()} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border bg-background/60 p-4 shadow">
      <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
