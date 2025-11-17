"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserTableProps {
  users: UserRecord[];
  onRoleChange: (userId: string, role: string) => Promise<void>;
  isUpdating?: boolean;
}

export function UserTable({
  users,
  onRoleChange,
  isUpdating,
}: UserTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleToggleRole = async (user: UserRecord) => {
    const nextRole = user.role === "ADMIN" ? "STUDENT" : "ADMIN";
    setPendingId(user._id);
    try {
      await onRoleChange(user._id, nextRole);
    } finally {
      setPendingId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        No users found yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating || pendingId === user._id}
                  onClick={() => handleToggleRole(user)}
                >
                  {pendingId === user._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `Make ${user.role === "ADMIN" ? "Student" : "Admin"}`
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
