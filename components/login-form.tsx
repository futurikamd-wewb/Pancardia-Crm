"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const [email, setEmail] = useState("admin@hospitalcrm.local");
  const [password, setPassword] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Login failed.");
      setSubmitting(false);
      return;
    }

    router.push(nextPath as Route);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@hospitalcrm.local"
          />
        </div>
        <div className="field full">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
          />
        </div>
      </div>

      {error ? <p className="inline-note">{error}</p> : null}

      <div className="form-actions">
        <button className="pill-button" disabled={submitting} type="submit">
          {submitting ? "Signing in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
