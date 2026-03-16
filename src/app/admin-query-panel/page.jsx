"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  Download,
  Filter,
  Loader2,
  LogOut,
  Search,
  Shield,
  Trash2,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusClasses(status) {
  if (status === "new") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (status === "in-progress") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  return "border-sky-400/20 bg-sky-400/10 text-sky-200";
}

function escapeCsvValue(value) {
  const stringValue = value == null ? "" : String(value);
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

export default function AdminQueryPanel() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadQueries(
    currentSearch = searchValue,
    currentStatus = statusFilter
  ) {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const params = new URLSearchParams();

      if (currentSearch.trim()) {
        params.set("search", currentSearch.trim());
      }

      if (currentStatus && currentStatus !== "all") {
        params.set("status", currentStatus);
      }

      const queryString = params.toString();
      const url = queryString ? `/api/queries?${queryString}` : "/api/queries";

      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to load queries.");
      }

      setItems(Array.isArray(result.data) ? result.data : []);
      setVisibleCount(10);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong.");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadQueries("", "all");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadQueries(searchValue, statusFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, statusFilter]);

  async function updateStatus(id, nextStatus) {
    try {
      const response = await fetch(`/api/queries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to update status.");
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: nextStatus } : item
        )
      );
    } catch (error) {
      alert(error.message || "Something went wrong.");
    }
  }

  async function deleteQuery(id) {
    const confirmed = window.confirm("Delete this query?");
    if (!confirmed) return;

    try {
      setIsDeleting(id);

      const response = await fetch(`/api/queries/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete query.");
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setIsDeleting("");
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  function handleExportCsv() {
    try {
      setIsExporting(true);

      if (!items.length) {
        alert("No queries available to export.");
        return;
      }

      const headers = [
        "Full Name",
        "Email Address",
        "Phone Number",
        "Category",
        "Company Name",
        "Newsletter",
        "Status",
        "Query",
        "Created At",
      ];

      const rows = items.map((item) => [
        item.fullName || "",
        item.emailAddress || "",
        item.phoneNumber || "",
        item.category || "",
        item.companyName || "",
        item.newsletter ? "Yes" : "No",
        item.status || "",
        item.query || "",
        item.createdAt ? formatDate(item.createdAt) : "",
      ]);

      const csvContent = [
        headers.map(escapeCsvValue).join(","),
        ...rows.map((row) => row.map(escapeCsvValue).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.setAttribute("download", `queries-${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export CSV.");
    } finally {
      setIsExporting(false);
    }
  }

  const counts = useMemo(() => {
    return {
      total: items.length,
      newCount: items.filter((item) => item.status === "new").length,
      resolvedCount: items.filter((item) => item.status === "resolved").length,
    };
  }, [items]);

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);

  const hasMoreItems = visibleCount < items.length;

  return (
    <main className="min-h-screen bg-[#0A0A0B] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-white/55">Admin panel</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Query panel
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              onClick={handleExportCsv}
              disabled={isExporting || !items.length}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export CSV
            </button>

            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by name, email, category"
              className="h-12 w-full rounded-full border border-white/12 bg-white/6 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="flex h-12 items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4">
            <Filter className="h-4 w-4 text-white/45" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-white outline-none"
            >
              <option value="all" className="bg-black text-white">
                All status
              </option>
              <option value="new" className="bg-black text-white">
                New
              </option>
              <option value="in-progress" className="bg-black text-white">
                In progress
              </option>
              <option value="resolved" className="bg-black text-white">
                Resolved
              </option>
            </select>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
            <p className="text-sm text-white/55">Total queries</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {counts.total}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
            <p className="text-sm text-white/55">New</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {counts.newCount}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
            <p className="text-sm text-white/55">Resolved</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {counts.resolvedCount}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/3 p-10 text-center text-white/70">
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading queries...
            </span>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading ? (
          <div className="space-y-5">
            {visibleItems.map((item) => (
              <article
                key={item.id}
                className="rounded-[28px] border border-white/10 bg-white/4 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
              >
                <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${getStatusClasses(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm text-white/55">
                        <Clock3 className="h-4 w-4" />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h2 className="wrap-break-word text-2xl font-semibold text-white">
                        {item.fullName}
                      </h2>
                      <p className="mt-1 wrap-break-word text-sm text-white/60">
                        {item.emailAddress}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                      <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                          Phone Number
                        </p>
                        <p className="mt-2 wrap-break-word text-sm text-white/85">
                          {item.phoneNumber}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                          Category
                        </p>
                        <p className="mt-2 wrap-break-word text-sm text-white/85">
                          {item.category}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-4 xl:col-span-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                          Company Name
                        </p>
                        <p className="mt-2 wrap-break-word text-sm text-white/85">
                          {item.companyName || "Not provided"}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                          Newsletter
                        </p>
                        <p className="mt-2 text-sm text-white/85">
                          {item.newsletter ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    <div className="max-w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                        Type your query here
                      </p>
                      <p className="mt-2 max-w-full overflow-hidden whitespace-pre-wrap wrap-break-word text-sm leading-7 text-white/75 [word-break:break-word]">
                        {item.query}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-55 flex-col gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 lg:w-55">
                    <p className="text-sm font-medium text-white">
                      Update status
                    </p>

                    <button
                      onClick={() => updateStatus(item.id, "new")}
                      className="h-11 rounded-full border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10"
                    >
                      Mark as new
                    </button>

                    <button
                      onClick={() => updateStatus(item.id, "in-progress")}
                      className="h-11 rounded-full border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10"
                    >
                      Mark in progress
                    </button>

                    <button
                      onClick={() => updateStatus(item.id, "resolved")}
                      className="h-11 rounded-full bg-white text-sm text-black transition hover:scale-[1.01]"
                    >
                      Mark resolved
                    </button>

                    <button
                      onClick={() => deleteQuery(item.id)}
                      disabled={isDeleting === item.id}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 text-sm text-red-200 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {isDeleting === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete query
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-10 text-center text-white/70">
                No query records found.
              </div>
            ) : null}

            {hasMoreItems ? (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Load More
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}