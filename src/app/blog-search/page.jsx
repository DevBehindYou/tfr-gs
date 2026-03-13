"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
} from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import BlogCard from "../components/BlogCard";

export default function BlogSearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [stage, setStage] = useState("idle");
  const [showResults, setShowResults] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultsKey, setResultsKey] = useState(0);
  const [layout, setLayout] = useState(null);

  const containerRef = useRef(null);

  const titleControls = useAnimationControls();
  const searchControls = useAnimationControls();
  const resultsControls = useAnimationControls();

  const fetchBlogs = async (searchText = "") => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/blogs${searchText ? `?query=${encodeURIComponent(searchText)}` : ""}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      setBlogs([]);
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateLayout = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const sideGap = 16;

      const initialWidth = Math.min(width - sideGap * 2, 760);
      const topCenterWidth = Math.min(width - sideGap * 2, 560);
      const finalWidth = width < 768 ? width - sideGap * 2 : 440;

      const initialLeft = (width - initialWidth) / 2;
      const topCenterLeft = (width - topCenterWidth) / 2;
      const finalLeft = width < 768 ? sideGap : width - sideGap - finalWidth;

      const initialTop = Math.max(190, height / 2 - 28);

      setLayout({
        initialWidth,
        topCenterWidth,
        finalWidth,
        initialLeft,
        topCenterLeft,
        finalLeft,
        initialTop,
      });
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!layout) return;

    if (stage === "idle") {
      titleControls.set({ opacity: 1, y: 0 });
      searchControls.set({
        top: layout.initialTop,
        left: layout.initialLeft,
        width: layout.initialWidth,
      });
      resultsControls.set({ opacity: 0, y: 40 });
    }

    if (stage === "searched") {
      titleControls.set({ opacity: 0, y: -24 });
      searchControls.set({
        top: 16,
        left: layout.finalLeft,
        width: layout.finalWidth,
      });
      resultsControls.set({ opacity: 1, y: 0 });
    }
  }, [layout, stage, titleControls, searchControls, resultsControls]);

  const handleSearch = async () => {
    if (!layout) return;

    const trimmedQuery = query.trim();
    const requestPromise = fetchBlogs(trimmedQuery);

    if (stage === "idle") {
      setSubmittedQuery(trimmedQuery);

      await titleControls.start({
        opacity: 0,
        y: -24,
        transition: {
          duration: 0.30,
          ease: "easeOut",
        },
      });

      await searchControls.start({
        top: 16,
        left: layout.topCenterLeft,
        width: layout.topCenterWidth,
        transition: {
          duration: 0.70,
          ease: [0.22, 1, 0.36, 1],
        },
      });

      await searchControls.start({
        left: layout.finalLeft,
        width: layout.finalWidth,
        transition: {
          duration: 0.80,
          ease: [0.22, 1, 0.36, 1],
        },
      });

      setStage("searched");
      setShowResults(true);
      setResultsKey((prev) => prev + 1);

      resultsControls.set({ opacity: 0, y: 42 });

      await requestPromise;

      await resultsControls.start({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.50,
          ease: "easeOut",
        },
      });

      return;
    }

    setSubmittedQuery(trimmedQuery);

    await resultsControls.start({
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.30,
        ease: "easeInOut",
      },
    });

    await requestPromise;

    setResultsKey((prev) => prev + 1);

    await resultsControls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.30,
        ease: "easeOut",
      },
    });
  };

  return (
    <main className="w-full bg-transparent p-0 m-0">
      <div className="w-full overflow-hidden rounded-[18px] border border-white/10 bg-[#0b0712] shadow-2xl">
        <div
          ref={containerRef}
          className="relative h-129 w-full overflow-hidden"
        >
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

          <motion.div
            animate={titleControls}
            className="absolute inset-x-4 top-27.5 z-10 text-center md:inset-x-6"
          >
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-5xl">
              One Search. Every Insight.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 md:text-base">
              Experience a search engine for our blogs that feels as intuitive as <span className="font-bold italic text-white">ChatGPT</span>.
            </p>
          </motion.div>

          {layout && (
            <motion.div
              animate={searchControls}
              className="absolute z-20"
            >
              <SearchBar
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
              />
            </motion.div>
          )}

          <AnimatePresence>
            {showResults && (
              <motion.div
                key={resultsKey}
                animate={resultsControls}
                initial={false}
                className="custom-scrollbar absolute inset-0 z-10 overflow-y-auto px-4 pb-4 pt-28 md:px-5 md:pb-5 md:pt-28"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white md:text-2xl">
                    {submittedQuery
                      ? `Results for "${submittedQuery}"`
                      : "All blogs"}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    {loading
                      ? "Loading..."
                      : `${blogs.length} result${blogs.length === 1 ? "" : "s"}`}
                  </p>
                </div>

                {loading ? (
                  <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-white/70"
                  >
                    Loading blogs...
                  </motion.div>
                ) : blogs.length > 0 ? (
                  <motion.div
                    key={`grid-${submittedQuery}-${blogs.length}`}
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: 0.08,
                          delayChildren: 0.08,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                  >
                    {blogs.map((blog, index) => (
                      <motion.div
                        key={blog._id || blog.id || index}
                        variants={{
                          hidden: { opacity: 0, y: 44 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{
                          duration: 0.38,
                          ease: "easeOut",
                        }}
                      >
                        <BlogCard blog={blog} index={index} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/70"
                  >
                    No blogs found. Try another search term.
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function SearchBar({ query, setQuery, handleSearch }) {
  return (
    <div className="rounded-full border border-white/15 bg-white/10 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-center gap-1 rounded-full bg-black/20 px-2 py-2 sm:gap-2 sm:px-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
          <Search className="h-5 w-5 text-white/70" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Search blogs, topics, authors..."
          className="h-10 min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-white/40 sm:h-12 sm:px-2 sm:text-base"
        />

        <button
          onClick={handleSearch}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 sm:h-12 sm:w-12"
          aria-label="Search"
        >
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  );
}