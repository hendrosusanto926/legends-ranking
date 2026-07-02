"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Background } from "@/components/layout/background";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, AlertCircle, Lock } from "lucide-react";

export function AdminLogin() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid key");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Background />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFD700]/10 mb-4">
              <Lock className="h-8 w-8 text-[#FFD700]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Admin Access
            </h1>
            <p className="text-[var(--text-secondary)]">
              Enter your authentication key to continue
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                    <KeyRound className="h-4 w-4 text-[#FFD700]" />
                    Auth Key
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter admin key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full gap-2">
                  <Lock className="h-4 w-4" />
                  {loading ? "Verifying..." : "Unlock Dashboard"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
