import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NAME_PATTERN = /^[A-Za-z'.\- ]+,\s*[A-Za-z].*$/

function SearchBar() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = value.trim().replace(/\s+/g, ' ')

    if (!trimmed) {
      setError("Enter a professor's name to search.")
      return
    }
    if (!NAME_PATTERN.test(trimmed)) {
      setError('Use the format LAST NAME, F — e.g. ABREGO, R.')
      return
    }

    setError('')
    navigate(`/prof/${encodeURIComponent(trimmed.toUpperCase())}`)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex items-stretch overflow-hidden rounded-xl border border-qc-charcoal/10 bg-white shadow-[0_20px_40px_-20px_rgba(34,34,34,0.35),0_2px_6px_rgba(196,18,48,0.06)] transition-shadow duration-300 focus-within:shadow-[0_20px_40px_-20px_rgba(34,34,34,0.35),0_0_0_3px_rgba(196,18,48,0.3)]">
        <input
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError('')
          }}
          placeholder="Enter professor's name…"
          aria-label="Professor name"
          aria-invalid={Boolean(error)}
          aria-describedby="search-hint"
          className="w-full bg-transparent px-5 py-4 text-base text-qc-charcoal placeholder:text-qc-charcoal/35 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="flex shrink-0 items-center justify-center bg-qc-red px-6 text-white transition-colors duration-200 hover:bg-qc-red-dim active:bg-qc-red-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M21 21l-4.3-4.3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <p
        id="search-hint"
        role={error ? 'alert' : undefined}
        className={`mt-3 text-xs transition-colors duration-200 ${
          error ? 'text-qc-red' : 'text-qc-charcoal/40'
        }`}
      >
        {error || 'Format: LAST NAME, First Initial'}
      </p>
    </form>
  )
}

export default SearchBar
