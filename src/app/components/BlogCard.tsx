"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, User2 } from "lucide-react";
import Link from "next/link";

type BlogCardProps = {
  blog: {
    _id?: string;
    id?: string | number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    image: string;
    href: string;
    tags?: string[];
  };
  index?: number;
};

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        href={blog.href}
        className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/15"
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        <div className="p-5 md:p-6">
          <h3 className="text-xl font-semibold leading-tight text-white">
            {blog.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {blog.date}
            </span>

            <span className="inline-flex items-center gap-2">
              <User2 className="h-4 w-4" />
              By {blog.author}
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/80 md:text-base">
            {blog.excerpt}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition group-hover:translate-x-1">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}