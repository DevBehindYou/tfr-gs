import Link from "next/link";
import { Search, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent p-6">
      <div className="w-full max-w-3xl rounded-[28px] border border-black/10 bg-[#0b0712] p-8 text-center shadow-2xl md:p-10">
        <h1 className="text-4xl font-semibold text-white">TFR — Admin Panel</h1>
        <p className="mt-4 text-white/70">
          Open the search interface or go to the admin panel to manage blog data.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/blog-search"
            className="inline-flex min-w-45 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <Search className="h-4 w-4" />
            Open Search Engine
          </Link>

          <Link
            href="/admin"
            className="inline-flex min-w-45 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-105"
          >
            <Shield className="h-4 w-4" />
            Open Admin Panel
          </Link>
          
        </div>
      </div>
    </main>
  );
}