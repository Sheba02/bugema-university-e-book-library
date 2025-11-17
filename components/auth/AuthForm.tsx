"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validators";
import { useAuthActions } from "@/hooks/useAuth";

type Mode = "login" | "register";

const schemaMap = {
  login: loginSchema,
  register: registerSchema,
} as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { login, register: registerUser, isLoggingIn, isRegistering, error } =
    useAuthActions();

  const form = useForm<LoginInput | RegisterInput>({
    resolver: zodResolver(schemaMap[mode]),
    defaultValues:
      mode === "login"
        ? ({
            email: "",
            password: "",
          } as LoginInput)
        : ({
            name: "",
            email: "",
            password: "",
          } as RegisterInput),
  });

  const onSubmit = async (values: LoginInput | RegisterInput) => {
    if (mode === "login") {
      await login(values as LoginInput);
      router.push("/dashboard");
    } else {
      await registerUser(values as RegisterInput);
      router.push("/dashboard");
    }
  };

  const isPending = mode === "login" ? isLoggingIn : isRegistering;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Jane Doe"
            {...form.register("name")}
          />
          <FieldError message={(form.formState.errors as any)?.name?.message} />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@bugema.ac.ug"
          {...form.register("email")}
        />
        <FieldError message={form.formState.errors?.email?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          {...form.register("password")}
        />
        <FieldError message={form.formState.errors?.password?.message} />
      </div>
      {error && (
        <p className="text-sm text-destructive">
          {error || "There was an error. Please try again."}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
      </Button>
    </form>
  );
}