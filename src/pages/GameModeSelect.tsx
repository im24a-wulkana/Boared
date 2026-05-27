import { Link } from 'react-router-dom'
import { Users, Cpu } from 'lucide-react'

export default function GameModeSelect() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-woodText mb-4">
            Nine Men's Morris
          </h2>
          <p className="text-woodText text-opacity-70 text-lg">
            Choose a game mode
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Player vs Player */}
          <Link
            to="/morris"
            className="bg-darkMahogany rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden fadeIn border border-goldenTan border-opacity-20 block group p-8 text-center"
          >
            <Users size={48} className="mx-auto mb-4 text-warmAmber" />
            <h3 className="text-2xl font-bold text-woodText mb-3 group-hover:text-goldenTan transition-colors">
              Player vs Player
            </h3>
            <p className="text-woodText text-opacity-70 mb-6">
              Play against a friend on the same device
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-warmAmber text-nearBlack rounded-lg font-semibold">
              Play
            </div>
          </Link>

          {/* Player vs Bot */}
          <Link
            to="/morris-bot"
            className="bg-darkMahogany rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden fadeIn border border-goldenTan border-opacity-20 block group p-8 text-center"
          >
            <Cpu size={48} className="mx-auto mb-4 text-warmAmber" />
            <h3 className="text-2xl font-bold text-woodText mb-3 group-hover:text-goldenTan transition-colors">
              Player vs Bot
            </h3>
            <p className="text-woodText text-opacity-70 mb-6">
              Play against an AI opponent with adjustable difficulty
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-warmAmber text-nearBlack rounded-lg font-semibold">
              Play
            </div>
          </Link>
        </div>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-woodText hover:text-goldenTan transition-colors text-opacity-70"
          >
            ← Back to Menu
          </Link>
        </div>
      </div>
    </main>
  )
}
