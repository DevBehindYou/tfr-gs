'use client'

import { ArrowUpRight, PhoneCall } from 'lucide-react'
import { useState } from 'react'

const categories = [
  'General Inquiry',
  'SEO Services',
  'Website Development',
  'AI Solutions',
  'Content Writing',
  'Other',
]

const countryCodes = [
  { key: 'india', label: 'India', value: '+91' },
  { key: 'united-states', label: 'United States', value: '+1' },
  { key: 'canada', label: 'Canada', value: '+1' },
  { key: 'united-kingdom', label: 'United Kingdom', value: '+44' },
  { key: 'australia', label: 'Australia', value: '+61' },
  { key: 'new-zealand', label: 'New Zealand', value: '+64' },
  { key: 'united-arab-emirates', label: 'United Arab Emirates', value: '+971' },
  { key: 'saudi-arabia', label: 'Saudi Arabia', value: '+966' },
  { key: 'singapore', label: 'Singapore', value: '+65' },
  { key: 'malaysia', label: 'Malaysia', value: '+60' },
  { key: 'thailand', label: 'Thailand', value: '+66' },
  { key: 'indonesia', label: 'Indonesia', value: '+62' },
  { key: 'china', label: 'China', value: '+86' },
  { key: 'japan', label: 'Japan', value: '+81' },
  { key: 'south-korea', label: 'South Korea', value: '+82' },
  { key: 'russia', label: 'Russia', value: '+7' },
  { key: 'germany', label: 'Germany', value: '+49' },
  { key: 'france', label: 'France', value: '+33' },
  { key: 'netherlands', label: 'Netherlands', value: '+31' },
  { key: 'italy', label: 'Italy', value: '+39' },
  { key: 'spain', label: 'Spain', value: '+34' },
  { key: 'turkey', label: 'Turkey', value: '+90' },
  { key: 'south-africa', label: 'South Africa', value: '+27' },
  { key: 'brazil', label: 'Brazil', value: '+55' },
  { key: 'mexico', label: 'Mexico', value: '+52' },
]

export default function QueryFormWindow() {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    countryCode: 'india',
    phoneNumber: '',
    category: '',
    companyName: '',
    query: '',
    newsletter: false,
    acceptTerms: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const selectedCountry =
    countryCodes.find((item) => item.key === formData.countryCode) || countryCodes[0]

  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function handlePhoneChange(value) {
    const onlyDigits = value.replace(/\D/g, '')
    updateField('phoneNumber', onlyDigits)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    if (!formData.acceptTerms) {
      setErrorMessage('Please accept the Privacy Policy and Terms of Service.')
      setIsSubmitting(false)
      return
    }

    try {
      const payload = {
        fullName: formData.fullName,
        emailAddress: formData.emailAddress,
        phoneNumber: `${selectedCountry.value} ${formData.phoneNumber}`.trim(),
        category: formData.category,
        companyName: formData.companyName,
        query: formData.query,
        newsletter: formData.newsletter,
      }

      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit query.')
      }

      setIsSubmitted(true)
      setFormData({
        fullName: '',
        emailAddress: '',
        countryCode: 'india',
        phoneNumber: '',
        category: '',
        companyName: '',
        query: '',
        newsletter: false,
        acceptTerms: false,
      })
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
    setFormData({
      fullName: '',
      emailAddress: '',
      countryCode: 'india',
      phoneNumber: '',
      category: '',
      companyName: '',
      query: '',
      newsletter: false,
      acceptTerms: false,
    })
    setErrorMessage('')
    setIsSubmitted(false)
  }

  return (
    <section className="bg-[#f7f2ea] px-0 md:px-4 py-12 text-[#141414] sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-4xl border border-[#5c4500]/10 bg-transparent p-2 md:p-6 xl:grid-cols-[0.95fr_1.35fr] xl:gap-14 xl:p-10">
          <div className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit rounded-full border border-[#5c4500]/30 bg-[#5c4500]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#5c4500]">
              Contact our team
            </p>

            <h2 className="max-w-130 text-4xl font-semibold leading-[1.05] text-[#141414] sm:text-5xl lg:text-6xl">
              <span className="text-[#5c4500]">Let’s build a better</span>
              <br />
              future together
            </h2>

            <div className="mt-6 flex items-center gap-3 text-[#5c4500]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#5c4500]/35 bg-[#5c4500]/10">
                <PhoneCall className="h-5 w-5" />
              </div>
              <a
                href="tel:+918790337974"
                className="text-base font-medium text-[#5c4500] transition hover:text-[#141414]"
              >
                +91 8790337974
              </a>
            </div>

            <p className="mt-8 max-w-117.5 text-base leading-8 text-[#3f3f46] sm:text-lg">
              Have a project in mind? Need help with SEO, websites, or AI led growth?
              Our team turns ideas into execution with speed and clarity.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#4f3b00] px-6 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
              >
                Submit Project Brief
              </button>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#5c4500] underline underline-offset-4 transition hover:text-[#141414]"
              >
                Alternatively, book a discovery call
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#7c3aed]/15 bg-white p-5 shadow-[0_16px_40px_rgba(124,58,237,0.08)] sm:p-7 lg:max-h-137.5 lg:overflow-y-auto lg:p-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#27272a]">
                      Full Name
                    </span>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      maxLength={30}
                      className="h-12 w-full rounded-xl border border-[#7c3aed]/25 bg-transparent px-4 text-sm text-[#141414] outline-none transition placeholder:text-[#6b7280] focus:border-[#7c3aed]"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#27272a]">
                      Email Address
                    </span>
                    <input
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => updateField('emailAddress', e.target.value)}
                      placeholder="Enter your email address"
                      maxLength={35}
                      className="h-12 w-full rounded-xl border border-[#7c3aed]/25 bg-transparent px-4 text-sm text-[#141414] outline-none transition placeholder:text-[#6b7280] focus:border-[#7c3aed]"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#27272a]">
                      Phone Number
                    </span>
                    <div className="flex overflow-hidden rounded-xl border border-[#5c4500]/25 focus-within:border-[#5c4500]">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => updateField('countryCode', e.target.value)}
                        className="h-12 min-w-8 border-r border-[#5c4500]/20 bg-[#faf7f2] px-3 text-sm text-[#141414] outline-none"
                      >
                        {countryCodes.map((item) => (
                          <option key={item.key} value={item.key}>
                          {item.value}
                          </option>
                        ))}
                      </select>

                      <div className="flex flex-1 flex-col justify-center bg-transparent px-4">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#604502]">
                          {selectedCountry.label}
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={15}
                          value={formData.phoneNumber}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder={`${selectedCountry.value} Enter phone number`}
                          className="w-full bg-transparent text-sm text-[#141414] outline-none placeholder:text-[#5c4500]"
                          required
                        />
                      </div>
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#27272a]">
                      Select a Category
                    </span>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="h-12 w-full rounded-xl border border-[#7c3aed]/25 bg-transparent px-4 text-sm text-[#3a2c00] outline-none transition focus:border-[#5c4500]"
                      required
                    >
                      <option value="">Select a Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#27272a]">
                    Company Name
                  </span>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder="Company name if any"
                    maxLength={50}
                    className="h-12 w-full rounded-xl border border-[#7c3aed]/25 bg-transparent px-4 text-sm text-[#141414] outline-none transition placeholder:text-[#6b7280] focus:border-[#604502]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#27272a]">
                    Type your query here
                  </span>
                  <textarea
                    value={formData.query}
                    onChange={(e) => updateField('query', e.target.value)}
                    placeholder="Write your query"
                    maxLength={120}
                    className="min-h-10 w-full resize-none rounded-xl border border-[#604502]/25 bg-transparent px-4 py-4 text-sm text-[#141414] outline-none transition placeholder:text-[#6b7280] focus:border-[#604502] wrap-anywhere [word-break:break-word]"
                    required
                  />
                  <div className="mt-1 text-right text-xs text-[#6b7280]">
                    {formData.query.length}/120
                  </div>
                </label>

                <label className="flex items-start gap-2 text-sm text-[#3f3f46]">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => updateField('newsletter', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border border-[#604502]/40 accent-[#604502]"
                  />
                  <span>
                    I am happy to receive updates and newsletters from The First Ranker.
                  </span>
                </label>

                <label className="flex items-start gap-2 text-sm text-[#3f3f46]">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => updateField('acceptTerms', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border border-[#604502]/40 accent-[#604502]"
                    required
                  />
                  <span>
                    By submitting this form I accept The First Ranker’s Privacy Policy and Terms of Service.
                  </span>
                </label>

                {errorMessage ? (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.acceptTerms}
                  className="flex h-14 w-full items-center justify-center rounded-xl bg-[#1d1d1d] px-6 text-base font-semibold text-white transition hover:bg-[#000000] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit the Form'}
                </button>
              </form>
            ) : (
              <div className="flex min-h-115 flex-col justify-center rounded-2xl border border-[#7c3aed]/20 bg-[#956600]/5 p-6 text-center sm:p-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#956600] text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>

                <h3 className="text-3xl font-semibold text-[#141414]">Thank you</h3>

                <p className="mx-auto mt-4 max-w-md text-base leading-8 text-[#52525b]">
                  Your query has been submitted successfully. Our team will review it and get back to you soon.
                </p>

                <button
                  type="button"
                  onClick={resetForm}
                  className="mx-auto mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-[#604502]/30 px-6 text-sm font-medium text-[#000000] transition hover:bg-[#7c3aed]/10 hover:text-[#141414]"
                >
                  Submit another query
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}