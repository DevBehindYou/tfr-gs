'use client'

import { Clock3, Filter, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function getStatusClasses(status) {
  if (status === 'new') {
    return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
  }

  if (status === 'in-progress') {
    return 'border-amber-400/20 bg-amber-400/10 text-amber-200'
  }

  return 'border-sky-400/20 bg-sky-400/10 text-sky-200'
}

export default function AdminQueryPanel() {
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  async function loadQueries(currentSearch = searchValue, currentStatus = statusFilter) {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const params = new URLSearchParams()

      if (currentSearch.trim()) {
        params.set('search', currentSearch.trim())
      }

      if (currentStatus && currentStatus !== 'all') {
        params.set('status', currentStatus)
      }

      const queryString = params.toString()
      const url = queryString ? `/api/queries?${queryString}` : '/api/queries'

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
      })

      const result = await response.json()

      console.log('Admin query API result:', result)

      if (!response.ok) {
        throw new Error(result.message || 'Failed to load queries.')
      }

      setItems(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.error('Load queries error:', error)
      setErrorMessage(error.message || 'Something went wrong.')
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadQueries('', 'all')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadQueries(searchValue, statusFilter)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, statusFilter])

  async function updateStatus(id, nextStatus) {
    try {
      const response = await fetch(`/api/queries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update status.')
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: nextStatus } : item
        )
      )
    } catch (error) {
      alert(error.message || 'Something went wrong.')
    }
  }

  async function deleteQuery(id) {
    const confirmed = window.confirm('Delete this query?')
    if (!confirmed) return

    try {
      const response = await fetch(`/api/queries/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete query.')
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      alert(error.message || 'Something went wrong.')
    }
  }

  const totalQueries = items.length
  const newQueries = items.filter((item) => item.status === 'new').length
  const resolvedQueries = items.filter((item) => item.status === 'resolved').length

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

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex h-12 min-w-70 items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 backdrop-blur-xl">
              <Search className="h-4 w-4 text-white/45" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by name, email, category"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>

            <div className="flex h-12 items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 backdrop-blur-xl">
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
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
            <p className="text-sm text-white/55">Total queries</p>
            <p className="mt-2 text-3xl font-semibold text-white">{totalQueries}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
            <p className="text-sm text-white/55">New</p>
            <p className="mt-2 text-3xl font-semibold text-white">{newQueries}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
            <p className="text-sm text-white/55">Resolved</p>
            <p className="mt-2 text-3xl font-semibold text-white">{resolvedQueries}</p>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-white/10 bg-white/3 p-10 text-center text-white/70">
            Loading queries...
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <div className="space-y-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-[28px] border border-white/10 bg-white/4 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${getStatusClasses(item.status)}`}
                      >
                        {item.status}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm text-white/55">
                        <Clock3 className="h-4 w-4" />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-white">
                        {item.fullName}
                      </h2>
                      <p className="mt-1 text-sm text-white/60">
                        {item.emailAddress}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                          Phone Number
                        </p>
                        <p className="mt-2 text-sm text-white/85">{item.phoneNumber}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                          Category
                        </p>
                        <p className="mt-2 text-sm text-white/85">{item.category}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 xl:col-span-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                          Company Name
                        </p>
                        <p className="mt-2 text-sm text-white/85">
                          {item.companyName || 'Not provided'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                          Newsletter
                        </p>
                        <p className="mt-2 text-sm text-white/85">
                          {item.newsletter ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                        Type your query here
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/75">
                        {item.query}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-55 flex-col gap-3 rounded-3xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-medium text-white">Update status</p>

                    <button
                      onClick={() => updateStatus(item.id, 'new')}
                      className="h-11 rounded-full border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10"
                    >
                      Mark as new
                    </button>

                    <button
                      onClick={() => updateStatus(item.id, 'in-progress')}
                      className="h-11 rounded-full border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10"
                    >
                      Mark in progress
                    </button>

                    <button
                      onClick={() => updateStatus(item.id, 'resolved')}
                      className="h-11 rounded-full bg-white text-sm text-black transition hover:scale-[1.01]"
                    >
                      Mark resolved
                    </button>

                    <button
                      onClick={() => deleteQuery(item.id)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 text-sm text-red-200 transition hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete query
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {items.length === 0 && (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/3 p-10 text-center text-white/70">
                No query records found.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}