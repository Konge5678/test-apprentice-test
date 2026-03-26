"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full ring-0 border">
        <CardHeader>
          <CardTitle>Logg inn</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passord</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {state.error ? (
              <p className="text-sm text-red-600">{state.error}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Logger inn..." : "Logg inn"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Har du ikke konto?{" "}
              <Link href="/signup" className="underline">
                Opprett konto
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
