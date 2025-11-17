import { redirect } from "next/navigation";

import { BookCard } from "@/components/books/BookCard";
import { ProgressList } from "@/components/dashboard/ProgressList";
import { Badge } from "@/components/ui/badge";
import { fetchServerUser } from "@/lib/auth";
import { listBooks } from "@/services/bookService";
import { getDashboardProgress } from "@/services/progressService";

export default async function DashboardPage() {
  const user = await fetchServerUser();
  if (!user) {
    redirect("/login");
  }

  let progress: Awaited<ReturnType<typeof getDashboardProgress>>;
  let books: Awaited<ReturnType<typeof listBooks>>;
  try {
    [progress, books] = await Promise.all([
      getDashboardProgress(user.id),
      listBooks({ includeHidden: false }),
    ]);
  } catch (error) {
    console.error(error);
    progress = { inProgress: [], completed: [] };
    books = [];
  }

  const recommended = books.filter((book) =>
    progress.inProgress?.every(
      (entry) => entry.book?._id?.toString() !== book._id?.toString(),
    ),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Hi {user.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground">
          Continue where you left off or start a new title from the library.
        </p>
        <Badge variant="secondary" className="mt-2">
          Role: {user.role}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProgressList
          title="In progress"
          items={progress.inProgress as any}
          emptyLabel="No active sessions yet. Open any title to begin."
        />
        <ProgressList
          title="Completed"
          items={progress.completed as any}
          emptyLabel="Complete your first book to see it here."
          completed
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recommended for you</h2>
          <p className="text-sm text-muted-foreground">
            Showing books you have not opened yet.
          </p>
        </div>
        {recommended.length === 0 ? (
          <div className="rounded-2xl border bg-muted/40 p-6 text-sm text-muted-foreground">
            You're all caught up! Browse the{" "}
            <span className="font-medium">library</span> for new reads.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommended.slice(0, 6).map((book) => (
              <BookCard key={book._id.toString()} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

