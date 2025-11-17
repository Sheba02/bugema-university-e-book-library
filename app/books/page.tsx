import Link from "next/link";

import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listBooks, getCategories } from "@/services/bookService";

interface BooksPageProps {
  searchParams: {
    q?: string;
    category?: string;
  };
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const search = searchParams.q || undefined;
  const category =
    searchParams.category && searchParams.category !== "all"
      ? searchParams.category
      : undefined;

  let books: Awaited<ReturnType<typeof listBooks>> = [];
  let categories: string[] = [];
  try {
    [books, categories] = await Promise.all([
      listBooks({ search, category, includeHidden: false }),
      getCategories(),
    ]);
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Library</h1>
          <p className="text-muted-foreground">
            Browse digitized titles by category or keyword. Images load directly
            from <code>/public/books</code>.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </header>

      <form className="grid gap-4 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-[2fr,1fr,auto]">
        <Input
          name="q"
          placeholder="Search by title or category"
          defaultValue={search || ""}
        />
        <select
          name="category"
          defaultValue={category || "all"}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <Button type="submit">Apply</Button>
      </form>

      {books.length === 0 ? (
        <div className="rounded-2xl border bg-muted/40 p-6 text-center text-muted-foreground">
          No books match your filters. Make sure you have uploaded image files
          into <code>/public/books/&lt;folder&gt;</code> and added their metadata
          via the admin dashboard.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

