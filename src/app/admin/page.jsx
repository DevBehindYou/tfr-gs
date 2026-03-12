"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";

const platformIcons = {
  Medium: "/icons/medium.png",
  LinkedIn: "/icons/linkedin.png",
  WordPress: "/icons/wordpress.png",
};

const emptyForm = {
  title: "",
  excerpt: "",
  author: "",
  date: "",
  image: "",
  href: "",
  tags: "",
  platform: "WordPress",
  platformIcon: "/icons/WordPress.png",
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/blogs", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch blogs");
      }

      setBlogs(data.blogs || []);
    } catch (err) {
      setError(err.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return blogs;

    return blogs.filter((blog) => {
      const text =
        `${blog.title} ${blog.excerpt} ${blog.author} ${blog.platform} ${(blog.tags || []).join(" ")}`.toLowerCase();
      return text.includes(q);
    });
  }, [blogs, search]);

  const openCreateModal = () => {
    setEditingBlog(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      author: blog.author || "",
      date: blog.date ? blog.date.slice(0, 10) : "",
      image: blog.image || "",
      href: blog.href || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      platform: blog.platform || "Medium",
      platformIcon:
        blog.platformIcon || platformIcons[blog.platform] || "/icons/medium.png",
    });
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      platform: value,
      platformIcon: platformIcons[value] || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        author: form.author.trim(),
        date: form.date,
        image: form.image.trim(),
        href: form.href.trim(),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        platform: form.platform.trim(),
        platformIcon: form.platformIcon.trim(),
      };

      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || `Failed to ${editingBlog ? "update" : "create"} blog`
        );
      }

      setSuccess(editingBlog ? "Blog updated." : "Blog created.");
      closeModal();
      fetchBlogs();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this blog?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Delete API did not return JSON. Response was: ${text.slice(0, 120)}`
        );
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to delete blog");
      }

      setSuccess("Blog deleted.");
      fetchBlogs();
    } catch (err) {
      setError(err.message || "Something went wrong while deleting.");
    } finally {
      setDeletingId("");
    }
  };

  const handleLogout = async () => {
  await fetch("/api/logout", {
    method: "POST",
  });

  window.location.href = "/login";
};

  return (
    <main className="min-h-screen bg-[#f5f5f7] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#111111] md:text-3xl">
                TFR — Blog CMS Admin Panel
              </h1>
              <p className="mt-1 text-sm text-[#666666]">
                Add, edit, and delete blog records from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-[#e5e5e5] px-5 py-3 text-sm font-medium text-[#111111] transition hover:bg-[#f5f5f5]"
              >
                Logout
              </button>

              <button
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add Blog
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777777]" />
              <input
                type="text"
                placeholder="Search title, author, tag, platform..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-full border border-[#e5e5e5] bg-white pl-11 pr-4 text-sm text-[#111111] outline-none transition focus:border-[#111111]"
              />
            </div>

            <div className="text-sm text-[#666666]">
              {filteredBlogs.length} blog{filteredBlogs.length === 1 ? "" : "s"}
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-3xl border border-[#ececec] bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#fafafa] text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#666666]">
                      Blog
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#666666]">
                      Author
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#666666]">
                      Date
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#666666]">
                      Platform
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#666666]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-sm text-[#666666]"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading blogs...
                        </span>
                      </td>
                    </tr>
                  ) : filteredBlogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-sm text-[#666666]"
                      >
                        No blogs found.
                      </td>
                    </tr>
                  ) : (
                    filteredBlogs.map((blog) => (
                      <tr
                        key={blog._id}
                        className="border-t border-[#f0f0f0] align-top"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-65 gap-3">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="h-14 w-20 rounded-xl object-cover"
                            />
                            <div>
                              <div className="line-clamp-1 text-sm font-semibold text-[#111111]">
                                {blog.title}
                              </div>
                              <div className="mt-1 line-clamp-2 text-xs leading-5 text-[#666666]">
                                {blog.excerpt}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#444444]">
                          {blog.author}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#444444]">
                          {blog.date
                            ? new Date(blog.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#444444]">
                          {blog.platform || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(blog)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e8e8] text-[#111111] transition hover:bg-[#f5f5f5]"
                              aria-label="Edit blog"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              disabled={deletingId === blog._id}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f3d3d3] text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              aria-label="Delete blog"
                            >
                              {deletingId === blog._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#111111] md:text-2xl">
                  {editingBlog ? "Edit Blog" : "Add Blog"}
                </h2>
                <p className="mt-1 text-sm text-[#666666]">
                  Fill the fields below and save your blog record.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e5e5] text-[#111111] transition hover:bg-[#f6f6f6]"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <Field label="Title">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Author">
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Date">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Platform">
                <select
                  name="platform"
                  value={form.platform}
                  onChange={handlePlatformChange}
                  className={inputClass}
                >
                  <option value="Medium">Medium</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="WordPress">WordPress</option>
                </select>
              </Field>

              <Field label="Image URL" className="md:col-span-2">
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Blog URL" className="md:col-span-2">
                <input
                  name="href"
                  value={form.href}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Platform Icon URL" className="md:col-span-2">
                <input
                  name="platformIcon"
                  value={form.platformIcon}
                  readOnly
                  className={`${inputClass} bg-[#f7f7f7]`}
                />
              </Field>

              <Field label="Tags" className="md:col-span-2">
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="AI Search, UX, Blogs"
                  className={inputClass}
                />
              </Field>

              <Field label="Excerpt" className="md:col-span-2">
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`${inputClass} resize-none rounded-[20px] py-3`}
                />
              </Field>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-[#e5e5e5] px-5 py-3 text-sm font-medium text-[#111111] transition hover:bg-[#f6f6f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {editingBlog ? "Update Blog" : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-[#222222]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-full border border-[#e5e5e5] bg-white px-4 text-sm text-[#111111] outline-none transition focus:border-[#111111]";