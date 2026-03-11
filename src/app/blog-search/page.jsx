"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import BlogCard from "../components/BlogCard";

const blogs = [
  {
    id: 1,
    title: "How AI Search Is Changing Blog Discovery",
    excerpt:
      "A practical look at search UX patterns, semantic matching, and what modern content discovery should feel like.",
    author: "Vaibhav Kishnani",
    date: "March 12, 2026",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    href: "/blog/ai-search-blog-discovery",
    tags: ["AI Search", "UX", "Blogs"],
  },
  {
    id: 2,
    title: "Next.js Blog Architecture for Fast Search",
    excerpt:
      "Set up a clean content structure with server routes, MongoDB Atlas, and a responsive blog listing experience.",
    author: "Content Whale Team",
    date: "March 10, 2026",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    href: "/blog/nextjs-blog-architecture",
    tags: ["Next.js", "MongoDB", "Architecture"],
  },
  {
    id: 3,
    title: "Designing a Search First Blog Interface",
    excerpt:
      "Learn how to create a search led layout where the input becomes the anchor element after the results load.",
    author: "Product Team",
    date: "March 8, 2026",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    href: "/blog/search-first-blog-interface",
    tags: ["Design", "Search", "Frontend"],
  },
];

export default function BlogSearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const filteredBlogs = useMemo(() => {
    if (!submittedQuery.trim()) return blogs;

    return blogs.filter((blog) => {
      const searchableText =
        `${blog.title} ${blog.excerpt} ${blog.author} ${blog.tags.join(" ")}`.toLowerCase();

      return searchableText.includes(submittedQuery.toLowerCase());
    });
  }, [submittedQuery]);

  const handleSearch = () => {
    setSubmittedQuery(query.trim());
    setHasSearched(true);
  };

  return (
    <main className="w-full bg-transparent p-0 m-0">
      <div className="w-full overflow-hidden rounded-[18px] border-white/50 border-2 bg-[#0b0712] shadow-2xl">
        <div className="relative h-125 w-full overflow-hidden md:h-125">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/search-bg.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(199,91,255,0.20),transparent_24%),radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.18),transparent_18%),linear-gradient(135deg,rgba(3,3,3,0.55)_0%,rgba(9,6,18,0.65)_35%,rgba(19,9,22,0.6)_70%,rgba(9,9,9,0.7)_100%)]" />

          <div className="relative z-10 flex h-full flex-col p-5 md:p-8">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className={`flex w-full ${hasSearched ? "justify-end" : "flex-1 items-center justify-center"}`}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className={`w-full ${hasSearched ? "max-w-md" : "max-w-3xl"}`}
              >
                {!hasSearched && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 text-center"
                  >
                    <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                      Search blogs like ChatGPT
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 md:text-base">
                      Type a topic, press Enter, and the search bar moves to the top right as the matching blog cards load.
                    </p>
                  </motion.div>
                )}

                <div className="rounded-full border border-white/15 bg-white/10 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                  <div className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-2">
                    <Search className="h-5 w-5 text-white/70" />

                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder="Search blogs, topics, authors..."
                      className="h-12 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/40 md:text-base"
                    />

                    <button
                      onClick={handleSearch}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
                      aria-label="Search"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {hasSearched && (
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.35 }}
                  className="mt-4 flex-1 overflow-y-auto pr-1"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white md:text-2xl">
                        {submittedQuery ? `Results for “${submittedQuery}”` : "All blogs"}
                      </h2>
                      <p className="mt-1 text-sm text-white/60">
                        {filteredBlogs.length} result{filteredBlogs.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBlogs.map((blog, index) => (
                      <BlogCard key={blog.id} blog={blog} index={index} />
                    ))}
                  </div>

                  {filteredBlogs.length === 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
                      No blogs found. Try another search term.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}