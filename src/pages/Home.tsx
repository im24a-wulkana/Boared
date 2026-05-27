import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'

const MorrisGraphic = () => (
  <svg viewBox="0 0 200 200" className="w-32 h-32">
    {/* Outer square */}
    <rect x="20" y="20" width="160" height="160" fill="none" stroke="#c8873a" strokeWidth="3" />
    {/* Middle square */}
    <rect x="50" y="50" width="100" height="100" fill="none" stroke="#c8873a" strokeWidth="3" />
    {/* Inner square */}
    <rect x="80" y="80" width="40" height="40" fill="none" stroke="#c8873a" strokeWidth="3" />

    {/* Connection lines */}
    <line x1="100" y1="20" x2="100" y2="80" stroke="#c8873a" strokeWidth="2" />
    <line x1="100" y1="120" x2="100" y2="180" stroke="#c8873a" strokeWidth="2" />
    <line x1="20" y1="100" x2="80" y2="100" stroke="#c8873a" strokeWidth="2" />
    <line x1="120" y1="100" x2="180" y2="100" stroke="#c8873a" strokeWidth="2" />

    {/* Pieces - white */}
    <circle cx="100" cy="50" r="8" fill="#f5e6c8" stroke="#c8873a" strokeWidth="2" />
    <circle cx="50" cy="100" r="8" fill="#f5e6c8" stroke="#c8873a" strokeWidth="2" />

    {/* Pieces - black */}
    <circle cx="150" cy="100" r="8" fill="#1a0a02" stroke="#c8873a" strokeWidth="2" />
    <circle cx="100" cy="150" r="8" fill="#1a0a02" stroke="#c8873a" strokeWidth="2" />
    <circle cx="80" cy="80" r="8" fill="#1a0a02" stroke="#c8873a" strokeWidth="2" />
  </svg>
)

const FourInARowGraphic = () => (
  <svg viewBox="0 0 200 200" className="w-32 h-32">
    {/* Grid - 7 columns x 6 rows */}
    <g stroke="#c8873a" strokeWidth="2">
      {/* Vertical lines - full height */}
      <line x1="30" y1="30" x2="30" y2="192.9" />
      <line x1="57.15" y1="30" x2="57.15" y2="192.9" />
      <line x1="84.3" y1="30" x2="84.3" y2="192.9" />
      <line x1="111.45" y1="30" x2="111.45" y2="192.9" />
      <line x1="138.6" y1="30" x2="138.6" y2="192.9" />
      <line x1="165.75" y1="30" x2="165.75" y2="192.9" />
      <line x1="192.9" y1="30" x2="192.9" y2="192.9" />

      {/* Horizontal lines - full width */}
      <line x1="30" y1="30" x2="192.9" y2="30" />
      <line x1="30" y1="57.15" x2="192.9" y2="57.15" />
      <line x1="30" y1="84.3" x2="192.9" y2="84.3" />
      <line x1="30" y1="111.45" x2="192.9" y2="111.45" />
      <line x1="30" y1="138.6" x2="192.9" y2="138.6" />
      <line x1="30" y1="165.75" x2="192.9" y2="165.75" />
      <line x1="30" y1="192.9" x2="192.9" y2="192.9" />
    </g>

    {/* Column 0 - Red pieces */}
    <circle cx="43.575" cy="179.15" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />
    <circle cx="43.575" cy="152" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />

    {/* Column 1 - Mixed pieces */}
    <circle cx="70.725" cy="179.15" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="70.725" cy="152" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="70.725" cy="124.85" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />
    <circle cx="70.725" cy="97.7" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />

    {/* Column 2 - Mixed pieces */}
    <circle cx="97.875" cy="179.15" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />
    <circle cx="97.875" cy="152" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />
    <circle cx="97.875" cy="124.85" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="97.875" cy="97.7" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />
    <circle cx="97.875" cy="70.55" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />

    {/* Column 3 - Mixed pieces tall stack */}
    <circle cx="125.025" cy="179.15" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="125.025" cy="152" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="125.025" cy="124.85" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />
    <circle cx="125.025" cy="97.7" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="125.025" cy="70.55" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />
    <circle cx="125.025" cy="43.4" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />

    {/* Column 4 - Mixed pieces */}
    <circle cx="152.175" cy="179.15" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />
    <circle cx="152.175" cy="152" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />
    <circle cx="152.175" cy="124.85" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="152.175" cy="97.7" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />

    {/* Column 5 - Mixed pieces */}
    <circle cx="179.325" cy="179.15" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="179.325" cy="152" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="179.325" cy="124.85" r="5" fill="#e74c3c" stroke="#c8873a" strokeWidth="1" />

    {/* Column 6 - Yellow pieces */}
    <circle cx="206.475" cy="179.15" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="206.475" cy="152" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
    <circle cx="206.475" cy="124.85" r="5" fill="#f1c40f" stroke="#c8873a" strokeWidth="1" />
  </svg>
)

const ChessGraphic = () => {
  const cellSize = 22.5
  const offset = 20
  const getPieceX = (col: number) => offset + col * cellSize + cellSize / 2
  const getPieceY = (row: number) => offset + row * cellSize + cellSize / 2

  const Pawn = ({ x, y, white }: { x: number; y: number; white: boolean }) => (
    <g fill={white ? '#f5e6c8' : '#1a0a02'} stroke={white ? '#1a0a02' : '#f5e6c8'} strokeWidth="0.8" transform={white ? '' : `rotate(180 ${x} ${y})`}>
      <circle cx={x} cy={y - 2.5} r="3.5" />
      <rect x={x - 2} y={y - 0.5} width="4" height="3.5" />
    </g>
  )

  const Rook = ({ x, y, white }: { x: number; y: number; white: boolean }) => (
    <g fill={white ? '#f5e6c8' : '#1a0a02'} stroke={white ? '#1a0a02' : '#f5e6c8'} strokeWidth="0.8" transform={white ? '' : `rotate(180 ${x} ${y})`}>
      <rect x={x - 3.5} y={y - 4} width="7" height="1.5" />
      <rect x={x - 2.2} y={y - 2.2} width="4.4" height="6" />
    </g>
  )

  const Knight = ({ x, y, white }: { x: number; y: number; white: boolean }) => (
    <g fill={white ? '#f5e6c8' : '#1a0a02'} stroke={white ? '#1a0a02' : '#f5e6c8'} strokeWidth="0.9" transform={white ? '' : `rotate(180 ${x} ${y})`}>
      {/* Horse head */}
      <circle cx={x + 0.7} cy={y - 2.8} r="2.5" />
      {/* Snout */}
      <path d={`M ${x + 2} ${y - 2.2} L ${x + 3.2} ${y - 1.5}`} strokeLinecap="round" fill="none" />
      {/* Neck */}
      <line x1={x + 0.7} y1={y - 0.2} x2={x + 0.7} y2={y + 0.8} strokeWidth="2" />
      {/* Body */}
      <ellipse cx={x - 0.8} cy={y + 1.8} rx="2.5" ry="2" />
      {/* Front legs */}
      <line x1={x + 0.7} y1={y + 2.2} x2={x + 0.7} y2={y + 4} strokeWidth="1.2" />
      {/* Back legs */}
      <line x1={x - 2} y1={y + 2.2} x2={x - 2} y2={y + 4} strokeWidth="1.2" />
    </g>
  )

  const Bishop = ({ x, y, white }: { x: number; y: number; white: boolean }) => (
    <g fill={white ? '#f5e6c8' : '#1a0a02'} stroke={white ? '#1a0a02' : '#f5e6c8'} strokeWidth="0.8" transform={white ? '' : `rotate(180 ${x} ${y})`}>
      <circle cx={x} cy={y - 3} r="2.5" />
      <polygon points={`${x},${y - 0.5} ${x - 2.5},${y + 2.5} ${x + 2.5},${y + 2.5}`} />
    </g>
  )

  const Queen = ({ x, y, white }: { x: number; y: number; white: boolean }) => (
    <g fill={white ? '#f5e6c8' : '#1a0a02'} stroke={white ? '#1a0a02' : '#f5e6c8'} strokeWidth="0.8" transform={white ? '' : `rotate(180 ${x} ${y})`}>
      <circle cx={x} cy={y - 3} r="2.5" />
      <polygon points={`${x},${y - 0.5} ${x - 2.5},${y + 2.5} ${x + 2.5},${y + 2.5}`} />
      <rect x={x - 1} y={y - 1.5} width="2" height="3" />
    </g>
  )

  const King = ({ x, y, white }: { x: number; y: number; white: boolean }) => (
    <g fill={white ? '#f5e6c8' : '#1a0a02'} stroke={white ? '#1a0a02' : '#f5e6c8'} strokeWidth="0.8" transform={white ? '' : `rotate(180 ${x} ${y})`}>
      <circle cx={x} cy={y - 2.5} r="2.5" />
      <line x1={x} y1={y - 4.2} x2={x} y2={y - 3.2} strokeWidth="1.2" />
      <polygon points={`${x},${y - 0.5} ${x - 2.5},${y + 2.5} ${x + 2.5},${y + 2.5}`} />
    </g>
  )

  return (
    <svg viewBox="0 0 200 200" className="w-32 h-32">
      {/* Chessboard */}
      {Array.from({ length: 64 }).map((_, i) => {
        const row = Math.floor(i / 8)
        const col = i % 8
        const isLight = (row + col) % 2 === 0
        return (
          <rect
            key={i}
            x={offset + col * cellSize}
            y={offset + row * cellSize}
            width={cellSize}
            height={cellSize}
            fill={isLight ? '#d4a96a' : '#5c3520'}
          />
        )
      })}

      {/* White pieces - row 7 (back rank) */}
      <Rook x={getPieceX(0)} y={getPieceY(7)} white={true} />
      <Knight x={getPieceX(1)} y={getPieceY(7)} white={true} />
      <Bishop x={getPieceX(2)} y={getPieceY(7)} white={true} />
      <Queen x={getPieceX(3)} y={getPieceY(7)} white={true} />
      <King x={getPieceX(4)} y={getPieceY(7)} white={true} />
      <Bishop x={getPieceX(5)} y={getPieceY(7)} white={true} />
      <Knight x={getPieceX(6)} y={getPieceY(7)} white={true} />
      <Rook x={getPieceX(7)} y={getPieceY(7)} white={true} />

      {/* White pawns - row 6 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Pawn key={`wp${i}`} x={getPieceX(i)} y={getPieceY(6)} white={true} />
      ))}

      {/* Black pieces - row 0 (back rank) */}
      <Rook x={getPieceX(0)} y={getPieceY(0)} white={false} />
      <Knight x={getPieceX(1)} y={getPieceY(0)} white={false} />
      <Bishop x={getPieceX(2)} y={getPieceY(0)} white={false} />
      <Queen x={getPieceX(3)} y={getPieceY(0)} white={false} />
      <King x={getPieceX(4)} y={getPieceY(0)} white={false} />
      <Bishop x={getPieceX(5)} y={getPieceY(0)} white={false} />
      <Knight x={getPieceX(6)} y={getPieceY(0)} white={false} />
      <Rook x={getPieceX(7)} y={getPieceY(0)} white={false} />

      {/* Black pawns - row 1 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Pawn key={`bp${i}`} x={getPieceX(i)} y={getPieceY(1)} white={false} />
      ))}
    </svg>
  )
}

const games = [
  {
    title: 'Nine Men\'s Morris',
    description: 'A classic strategy game of three in a row. Play against friends or challenge an AI opponent.',
    path: '/morris-select',
    color: 'bg-darkMahogany',
    graphic: MorrisGraphic,
  },
  {
    title: 'Four in a Row',
    description: 'Drop colored discs into columns and be the first to connect four in a row. Simple rules, endless strategy.',
    path: '/four-in-a-row',
    color: 'bg-darkMahogany',
    graphic: FourInARowGraphic,
  },
  {
    title: 'Chess',
    description: 'The timeless game of kings. Master the ultimate strategy game with knights, bishops, rooks, and more.',
    path: '/chess',
    color: 'bg-darkMahogany',
    graphic: ChessGraphic,
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
          {games.map((game) => {
            const GraphicComponent = game.graphic
            return (
            <Link
              key={game.path}
              to={game.path}
              className="bg-darkMahogany rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden fadeIn border border-goldenTan border-opacity-20 block group flex flex-col"
            >
              <div className={`h-40 ${game.color} flex items-center justify-center`}>
                <GraphicComponent />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-woodText mb-3 group-hover:text-goldenTan transition-colors">
                  {game.title}
                </h3>
                <p className="text-woodText text-opacity-70 mb-6 text-sm leading-relaxed flex-grow">
                  {game.description}
                </p>

                <div className="inline-flex items-center gap-2 px-6 py-2 bg-warmAmber text-nearBlack rounded-lg font-semibold whitespace-nowrap">
                  <Play size={18} />
                  Play
                </div>
              </div>
            </Link>
          )
          })}
        </div>
      </div>
    </main>
  )
}
