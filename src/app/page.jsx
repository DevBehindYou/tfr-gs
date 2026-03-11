import Link from "next/link";

export default function HomePage() {
  return (
   <main className="flex min-h-screen items-center justify-center bg-[#dbd7cf] p-6">  
      <div className="w-full max-w-3xl rounded-[28px] border border-black/10 bg-[#0b0712] p-10 text-center shadow-2xl">
        <h1 className="text-4xl font-semibold text-white">Blog Search</h1>
        <p className="mt-4 text-white/70">
          Open the blog search interface and start exploring your content.
        </p>

        <Link
          href="/blog-search"
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-105"
        >
          Open Search
        </Link>
      </div>
    </main>
  );
}