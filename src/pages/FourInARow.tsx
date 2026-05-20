import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function FourInARow() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-softBrown hover:text-softBrown text-opacity-70 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-softBrown mb-4">
            Four in a Row
          </h2>
          <p className="text-softBrown text-opacity-70">
            Coming soon...
          </p>
        </div>
      </div>
    </main>
  )
}
