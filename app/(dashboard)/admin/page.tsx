import { redirect } from "next/navigation";

import { AdminDashboardClient } from "@/app/(dashboard)/admin/AdminDashboardClient";
import { fetchServerUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await fetchServerUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Administration
        </p>
        <h1 className="text-3xl font-semibold">Library control center</h1>
        <p className="text-muted-foreground">
          Upload image-based books, organize categories, and manage student
          access.
        </p>
      </div>
      <AdminDashboardClient />
    </div>
  );
}

