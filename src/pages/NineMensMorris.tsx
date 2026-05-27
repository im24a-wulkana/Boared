import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Gamepad2 } from 'lucide-react'
import { useNineMensMorris } from '../hooks/useNineMensMorris'
import MorrisBoard from '../components/MorrisBoard'

export default function NineMensMorris() {
  const game = useNineMensMorris()

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-woodText hover:text-goldenTan text-opacity-70 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </Link>

        <div className="bg-darkMahogany rounded-2xl shadow-lg p-8 border border-goldenTan border-opacity-30">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <Gamepad2 size={56} className="text-warmAmber" />
              <div>
                <h2 className="text-3xl font-bold text-woodText mb-2">
                  Nine Men's Morris
                </h2>
                <p className="text-woodText text-opacity-70">
                  {game.phase === 'placing'
                    ? 'Phase: Placing'
                    : game.phase === 'flying'
                      ? 'Phase: Flying'
                      : 'Phase: Moving'}
                </p>
              </div>
            </div>
            <button
              onClick={game.restart}
              className="flex items-center gap-2 px-4 py-2 bg-warmAmber text-nearBlack rounded-lg font-semibold hover:bg-goldenTan transition-colors"
            >
              <RotateCcw size={18} />
              Restart
            </button>
          </div>

          {/* Game status */}
          {game.millFormed && (
            <div className="mb-6 p-4 bg-yellow-900 border-l-4 border-yellow-600 rounded">
              <p className="text-yellow-200 font-semibold">
                🎯 Mill Formed! Select an opponent piece to remove.
              </p>
            </div>
          )}

          {game.gameOver && game.winner && (
            <div className="mb-6 p-4 bg-green-900 border-l-4 border-green-600 rounded">
              <p className="text-green-200 font-semibold text-lg">
                🎉 {game.winner === 'white' ? 'White' : 'Black'} Wins!
              </p>
            </div>
          )}

          {/* Current turn indicator */}
          <div className="mb-8 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full border-2 border-goldenTan ${
                    game.currentPlayer === 'white' ? 'bg-ivory' : 'bg-nearBlack'
                  }`}
                />
                <span className="text-woodText font-semibold">
                  {game.currentPlayer === 'white' ? 'White' : 'Black'} Turn
                </span>
              </div>
              <p className="text-woodText text-opacity-60 text-sm">
                Phase: <strong>{game.phase}</strong>
              </p>
            </div>
            {game.selectedNode !== null && (
              <p className="text-woodText text-opacity-70 text-sm">
                Selected: Node {game.selectedNode} | {game.validMoves.length} valid moves available
              </p>
            )}
          </div>

          {/* Board */}
          <MorrisBoard
            board={game.board}
            selectedNode={game.selectedNode}
            validMoves={game.validMoves}
            onNodeClick={game.handleNodeClick}
          />

          {/* Game stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-mediumDarkWood rounded-lg p-4 text-center border border-goldenTan border-opacity-20">
              <p className="text-sm text-woodText text-opacity-70 mb-2">
                White Remaining
              </p>
              <p className="text-2xl font-bold text-woodText">
                {game.whiteRemaining}
              </p>
            </div>
            <div className="bg-mediumDarkWood rounded-lg p-4 text-center border border-goldenTan border-opacity-20">
              <p className="text-sm text-woodText text-opacity-70 mb-2">
                White Lost
              </p>
              <p className="text-2xl font-bold text-woodText">
                {game.whiteLost}
              </p>
            </div>
            <div className="bg-mediumDarkWood rounded-lg p-4 text-center border border-goldenTan border-opacity-20">
              <p className="text-sm text-woodText text-opacity-70 mb-2">
                Black Remaining
              </p>
              <p className="text-2xl font-bold text-woodText">
                {game.blackRemaining}
              </p>
            </div>
            <div className="bg-mediumDarkWood rounded-lg p-4 text-center border border-goldenTan border-opacity-20">
              <p className="text-sm text-woodText text-opacity-70 mb-2">
                Black Lost
              </p>
              <p className="text-2xl font-bold text-woodText">
                {game.blackLost}
              </p>
            </div>
          </div>

          {/* Rules */}
          <details className="border-t border-goldenTan border-opacity-30 pt-6">
            <summary className="cursor-pointer font-semibold text-woodText hover:text-goldenTan text-opacity-70">
              Game Rules
            </summary>
            <div className="mt-4 space-y-3 text-sm text-woodText text-opacity-70">
              <p>
                <strong>Phase 1 - Placing:</strong> Each player alternately places 9 pieces on empty
                nodes.
              </p>
              <p>
                <strong>Phase 2 - Moving:</strong> Players move pieces to adjacent connected nodes.
              </p>
              <p>
                <strong>Phase 3 - Flying:</strong> When a player has only 3 pieces, they can move to
                any empty node.
              </p>
              <p>
                <strong>Mills:</strong> Three pieces in a row (horizontally, vertically, or diagonally)
                form a mill. Capture an opponent piece when you form a mill.
              </p>
              <p>
                <strong>Win:</strong> Reduce opponent to 2 pieces or block all legal moves.
              </p>
            </div>
          </details>
        </div>
      </div>
    </main>
  )
}
