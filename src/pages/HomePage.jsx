import Header from '../components/Header'
import HeroBand from '../components/HeroBand'
import SearchBar from '../components/SearchBar'

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <HeroBand />
      <main className="flex flex-1 flex-col items-center px-6 pt-14 pb-14 sm:pb-20 lg:pt-10">
        <h2 className="font-display text-2xl font-medium tracking-[-0.03em] text-qc-charcoal sm:text-3xl">
          Find Your Professor
        </h2>
        <p className="mt-3 max-w-md text-center text-sm leading-[1.7] text-qc-charcoal/60 sm:text-base">
          Search by{' '}
          <span className="font-semibold text-qc-charcoal">
            Last Name, First Initial
          </span>
        </p>
        <div className="mt-8 w-full max-w-xl">
          <SearchBar />
        </div>
      </main>
    </div>
  )
}

export default HomePage
