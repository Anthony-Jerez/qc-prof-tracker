import Header from '../components/Header'
import EmptyState from '../components/EmptyState'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-qc-grey">
      <Header />
      <main className="flex flex-1 items-center px-6 pb-16 sm:px-10">
        <EmptyState
          eyebrow="404"
          title="Page not found"
          message="That link doesn't lead anywhere. Head back and search for a professor."
          actionTo="/"
          actionLabel="← Back to search"
        />
      </main>
    </div>
  )
}

export default NotFoundPage
