import Link from "next/link";

import { AuthForm } from "@/components/auth/AuthForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create student account</CardTitle>
          <CardDescription>
            Access curated notes, recommended readings, and your progress
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="register" />
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        Already have access?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}

