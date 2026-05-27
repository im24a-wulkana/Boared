import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useNineMensMorris } from '../hooks/useNineMensMorris'
import { useMinimax } from '../hooks/useMinimax'
import type { BotDifficulty } from '../hooks/useMinimax'
import MorrisBoard from '../components/MorrisBoard'

export default function NineMensMorrisBot() {
  const [difficulty, setDifficulty] = useState<BotDifficulty | null>(null)
  const game = useNineMensMorris()
  const bot = useMinimax(difficulty || 'medium')
  const [isPlayerWhite, setIsPlayerWhite] = useState(true)

  useEffect(() => {
    if (!difficulty || game.gameOver) return

    // Bot's turn
    if (game.currentPlayer === (isPlayerWhite ? 'black' : 'white')) {
      const timer = setTimeout(() => {
        // Handle pending removals from formed mills
        if (game.pendingRemovals > 0 && game.removingPlayer === game.currentPlayer) {
          const removal = bot.getRemovalChoice(game.board, game.currentPlayer)
          if (removal !== -1) {
            game.handleNodeClick(removal)
          }
        } else {
          // Bot makes a move or placement
          const { move, placement } = bot.makeMove(game.board, game.phase, game.currentPlayer)

          if (placement !== null) {
            game.handleNodeClick(placement)
          } else if (move) {
            game.handleNodeClick(move[0])
            setTimeout(() => {
              game.handleNodeClick(move[1])
            }, 300)
          }
        }
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [game.currentPlayer, game.phase, game.pendingRemovals, game.removingPlayer, difficulty, isPlayerWhite, bot, game])

  if (!difficulty) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/morris-select"
            className="inline-flex items-center gap-2 text-woodText hover:text-goldenTan text-opacity-70 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </Link>

          <div className="bg-darkMahogany rounded-2xl shadow-lg p-8 border border-goldenTan border-opacity-30">
            <h2 className="text-3xl font-bold text-woodText mb-8 text-center">
              Select Difficulty
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as BotDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setDifficulty(diff)
                      setIsPlayerWhite(true)
                    }}
                    className="bg-warmAmber hover:bg-goldenTan transition-colors text-nearBlack font-bold py-4 px-6 rounded-lg capitalize"
                  >
                    {diff}
                  </button>
                ))}
              </div>

              <p className="text-woodText text-opacity-70 text-sm mt-4">
                <strong>Easy:</strong> Random moves<br/>
                <strong>Medium:</strong> Tries to form mills, some strategy<br/>
                <strong>Hard:</strong> Advanced strategy and blocking
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/morris-select"
          className="inline-flex items-center gap-2 text-woodText hover:text-goldenTan text-opacity-70 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        <div className="bg-darkMahogany rounded-2xl shadow-lg p-8 border border-goldenTan border-opacity-30">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-woodText mb-2">
                Nine Men's Morris
              </h2>
              <p className="text-woodText text-opacity-70">
                {game.phase === 'placing'
                  ? 'Phase: Placing'
                  : game.phase === 'flying'
                    ? 'Phase: Flying'
                    : 'Phase: Moving'} | Difficulty: <strong className="capitalize">{difficulty}</strong>
              </p>
            </div>
            <button
              onClick={() => {
                game.restart()
                setDifficulty(null)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-warmAmber text-nearBlack rounded-lg font-semibold hover:bg-goldenTan transition-colors"
            >
              <RotateCcw size={18} />
              New Game
            </button>
          </div>

          {/* Game status */}
          {game.pendingRemovals > 0 && (
            <div className="mb-6 p-4 bg-yellow-900 border-l-4 border-yellow-600 rounded">
              <p className="text-yellow-200 font-semibold">
                🎯 Mill Formed! {game.removingPlayer === (isPlayerWhite ? 'white' : 'black') ? '(Your turn to remove)' : '(Bot is removing...)'}
                {game.pendingRemovals > 1 && ` (${game.pendingRemovals} pieces to remove)`}
                Select an opponent piece to remove.
              </p>
            </div>
          )}

          {game.gameOver && game.winner && (
            <div className="mb-6 p-4 bg-green-900 border-l-4 border-green-600 rounded">
              <p className="text-green-200 font-semibold text-lg">
                🎉 {game.winner === (isPlayerWhite ? 'white' : 'black') ? 'You Win!' : 'Bot Wins!'}
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
                  {game.currentPlayer === (isPlayerWhite ? 'white' : 'black') ? 'Your Turn' : "Bot's Turn"}
                </span>
              </div>
              <p className="text-woodText text-opacity-60 text-sm">
                Phase: <strong>{game.phase}</strong>
              </p>
            </div>
            {game.selectedNode !== null && game.currentPlayer === (isPlayerWhite ? 'white' : 'black') && (
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
            onNodeClick={game.currentPlayer === (isPlayerWhite ? 'white' : 'black') ? game.handleNodeClick : () => {}}
          />

          {/* Game stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-mediumDarkWood rounded-lg p-4 text-center border border-goldenTan border-opacity-20">
              <p className="text-sm text-woodText text-opacity-70 mb-2">
                {isPlayerWhite ? 'You' : 'Bot'} Remaining
              </p>
              <p className="text-2xl font-bold text-woodText">
                {isPlayerWhite ? game.whiteRemaining : game.blackRemaining}
              </p>
            </div>
            <div className="bg-mediumDarkWood rounded-lg p-4 text-center border border-goldenTan border-opacity-20">
              <p className="text-sm text-woodText text-opacity-70 mb-2">
                {isPlayerWhite ? 'You' : 'Bot'} Lost
              </p>
              <p className="text-2xl font-bold text-woodText">
                {isPlayerWhite ? game.whiteLost : game.blackLost}
              </p>
            </div>
            <div className="bg-mediumDarkWood rounded-lg p-4 text-center border border-goldenTan border-opacity-20">
              <p className="text-sm text-woodText text-opacity-70 mb-2">
                {isPlayerWhite ? 'Bot' : 'You'} Remaining
              </p>
              <p className="text-2xl font-bold text-woodText">
                {isPlayerWhite ? game.blackRemaining : game.whiteRemaining}
              </p>
            </div>
            <div className="bg-mediumDarkWood rounded-lg p-4 text-center border border-goldenTan border-opacity-20">
              <p className="text-sm text-woodText text-opacity-70 mb-2">
                {isPlayerWhite ? 'Bot' : 'You'} Lost
              </p>
              <p className="text-2xl font-bold text-woodText">
                {isPlayerWhite ? game.blackLost : game.whiteLost}
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
                <strong>Mills:</strong> Three pieces in a row (horizontally, vertically, or through midpoints)
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
