import { Users, BookOpen, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

interface AdminOverviewProps {
  stats: {
    totalUsers: number;
    bookCount: number;
    completedSessions: number;
  };
}

export function AdminOverview({ stats }: AdminOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Total Users" value={stats.totalUsers} icon={<Users className="h-5 w-5 text-primary" />} />
      <StatCard label="Books" value={stats.bookCount} icon={<BookOpen className="h-5 w-5 text-primary" />} />
      <StatCard label="Completed Reads" value={stats.completedSessions} icon={<Trophy className="h-5 w-5 text-primary" />} />
    </div>
  );
}

