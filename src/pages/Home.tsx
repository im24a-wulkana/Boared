import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'

const games = [
  {
    title: 'Nine Men\'s Morris',
    description: 'A classic strategy game of three in a row. Play against friends or challenge an AI opponent.',
    path: '/morris-select',
    color: 'bg-darkMahogany',
  },
  {
    title: 'Four in a Row',
    description: 'Drop colored discs into columns and be the first to connect four in a row. Simple rules, endless strategy.',
    path: '/four-in-a-row',
    color: 'bg-darkMahogany',
  },
  {
    title: 'Chess',
    description: 'The timeless game of kings. Master the ultimate strategy game with knights, bishops, rooks, and more.',
    path: '/chess',
    color: 'bg-darkMahogany',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-woodText mb-4">
            Classic Board Games
          </h2>
          <p className="text-woodText text-opacity-70 text-lg">
            Choose a game and start playing. Enjoy timeless strategy and skill.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <Link
              key={game.path}
              to={game.path}
              className="bg-darkMahogany rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden fadeIn border border-goldenTan border-opacity-20 block group"
            >
              <div className={`h-32 ${game.color}`} />

              <div className="p-6">
                <h3 className="text-xl font-bold text-woodText mb-3 group-hover:text-goldenTan transition-colors">
                  {game.title}
                </h3>
                <p className="text-woodText text-opacity-70 mb-6 text-sm leading-relaxed">
                  {game.description}
                </p>

                <div className="inline-flex items-center gap-2 px-6 py-2 bg-warmAmber text-nearBlack rounded-lg font-semibold">
                  <Play size={18} />
                  Play
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
