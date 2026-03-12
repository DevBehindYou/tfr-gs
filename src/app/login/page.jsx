"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7] p-4">
      <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#111111]">Admin Login</h1>
          <p className="mt-2 text-sm text-[#666666]">
            Sign in to manage your blog records.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#222222]">
              Username
            </span>
            <div className="flex h-12 items-center rounded-full border border-[#e5e5e5] px-4">
              <User className="mr-3 h-4 w-4 text-[#777777]" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-sm text-[#111111] outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#222222]">
              Password
            </span>
            <div className="flex h-12 items-center rounded-full border border-[#e5e5e5] px-4">
              <LockKeyhole className="mr-3 h-4 w-4 text-[#777777]" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-sm text-[#111111] outline-none"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#111111] text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}