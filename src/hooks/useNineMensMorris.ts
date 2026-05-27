import { useState, useCallback } from 'react'

export type Player = 'white' | 'black'
export type GamePhase = 'placing' | 'moving' | 'flying'

interface Board {
  [key: number]: Player | null
}

interface GameState {
  board: Board
  currentPlayer: Player
  phase: GamePhase
  whiteRemaining: number
  blackRemaining: number
  whiteLost: number
  blackLost: number
  selectedNode: number | null
  validMoves: number[]
  millFormed: boolean
  pendingRemovals: number // how many pieces still need to be removed
  removingPlayer: Player | null // which player must remove the piece(s)
  selectedForRemoval: number | null
  gameOver: boolean
  winner: Player | null
}

// 24 positions: Outer (0-7), Middle (8-15), Inner (16-23)
// Each ring: TL, TM, TR, MR, BR, BM, BL, ML (clockwise from top-left)

// All 16 mills: 4 outer, 4 middle, 4 inner, 4 spokes
const MILLS = [
  // Outer ring
  [0, 1, 2],   // top horizontal
  [2, 3, 4],   // right vertical
  [4, 5, 6],   // bottom horizontal
  [6, 7, 0],   // left vertical
  // Middle ring
  [8, 9, 10],  // top horizontal
  [10, 11, 12], // right vertical
  [12, 13, 14], // bottom horizontal
  [14, 15, 8],  // left vertical
  // Inner ring
  [16, 17, 18], // top horizontal
  [18, 19, 20], // right vertical
  [20, 21, 22], // bottom horizontal
  [22, 23, 16], // left vertical
  // Spokes (crossing all 3 rings)
  [1, 9, 17],   // top spoke
  [3, 11, 19],  // right spoke
  [5, 13, 21],  // bottom spoke
  [7, 15, 23],  // left spoke
]

// Adjacency: valid moves during phase 2 (moving)
// NO diagonal connections, only along lines
const ADJACENCY = {
  // Outer ring
  0: [1, 7],
  1: [0, 2, 9],
  2: [1, 3],
  3: [2, 4, 11],
  4: [3, 5],
  5: [4, 6, 13],
  6: [5, 7],
  7: [6, 0, 15],
  // Middle ring
  8: [9, 15],
  9: [8, 10, 17],  // ✅ connect inward to 17, not back to 1
  10: [9, 11],
  11: [10, 12, 19], // ✅ connect inward to 19, not back to 3
  12: [11, 13],
  13: [12, 14, 21], // ✅ connect inward to 21, not back to 5
  14: [13, 15],
  15: [14, 8, 23],  // ✅ connect inward to 23, not back to 7
  // Inner ring
  16: [17, 23],
  17: [16, 18, 9],
  18: [17, 19],
  19: [18, 20, 11],
  20: [19, 21],
  21: [20, 22, 13],
  22: [21, 23],
  23: [22, 16, 15],
} as const

const millKey = (mill: number[]): string => mill.join(',')

const isInMill = (board: Board, pos: number): boolean => {
  const occupant = board[pos]
  if (!occupant) return false
  return MILLS.some((mill) => mill.includes(pos) && mill.every((p) => board[p] === occupant))
}

const countNewlyFormedMills = (board: Board, player: Player, prevActiveMills: Set<string>): number => {
  let count = 0
  for (const mill of MILLS) {
    const key = millKey(mill)
    if (mill.every((pos) => board[pos] === player) && !prevActiveMills.has(key)) {
      count++
    }
  }
  return count
}

const getActiveMills = (board: Board, player: Player): Set<string> => {
  const active = new Set<string>()
  for (const mill of MILLS) {
    if (mill.every((pos) => board[pos] === player)) {
      active.add(millKey(mill))
    }
  }
  return active
}

const countPieces = (board: Board, player: Player): number => {
  return Object.values(board).filter((p) => p === player).length
}

const canRemovePiece = (board: Board, position: number, targetPlayer: Player): boolean => {
  // Cannot remove from empty position
  if (board[position] !== targetPlayer) return false

  // Can always remove pieces NOT in mills
  if (!isInMill(board, position)) return true

  // Can only remove pieces IN mills if ALL opponent pieces are in mills
  const allInMills = Object.keys(board)
    .map(Number)
    .filter((pos) => board[pos] === targetPlayer)
    .every((pos) => isInMill(board, pos))

  return allInMills
}

const getValidAdjacentMoves = (board: Board, from: number): number[] => {
  return (ADJACENCY[from as keyof typeof ADJACENCY] || []).filter(
    (pos) => board[pos] === null
  )
}

const getValidFlyingMoves = (board: Board): number[] => {
  return Object.keys(board)
    .map(Number)
    .filter((pos) => board[pos] === null)
}

const hasValidMoves = (board: Board, player: Player): boolean => {
  const pieceCount = countPieces(board, player)

  // Flying: can move to any empty position
  if (pieceCount === 3) {
    return Object.values(board).some((p) => p === null)
  }

  // Moving: check if any piece has an adjacent empty position
  for (let i = 0; i < 24; i++) {
    if (board[i] === player) {
      const adjacentEmpty = getValidAdjacentMoves(board, i)
      if (adjacentEmpty.length > 0) return true
    }
  }

  return false
}

export const useNineMensMorris = () => {
  const initialBoard: Board = Object.fromEntries(
    Array.from({ length: 24 }, (_, i) => [i, null])
  )

  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard,
    currentPlayer: 'white',
    phase: 'placing',
    whiteRemaining: 9,
    blackRemaining: 9,
    whiteLost: 0,
    blackLost: 0,
    selectedNode: null,
    validMoves: [],
    millFormed: false,
    pendingRemovals: 0,
    removingPlayer: null,
    selectedForRemoval: null,
    gameOver: false,
    winner: null,
  })

  const handleNodeClick = useCallback(
    (nodeIndex: number) => {
      if (gameState.gameOver) return

      // Handle piece removal after forming a mill
      if (gameState.pendingRemovals > 0) {
        const opponent = gameState.removingPlayer === 'white' ? 'black' : 'white'
        if (gameState.board[nodeIndex] === opponent && canRemovePiece(gameState.board, nodeIndex, opponent)) {
          const newBoard = { ...gameState.board }
          newBoard[nodeIndex] = null

          const newLostCount =
            gameState.removingPlayer === 'white'
              ? gameState.blackLost + 1
              : gameState.whiteLost + 1

          const remainingRemovals = gameState.pendingRemovals - 1

          if (remainingRemovals === 0) {
            // All removals done - player who removed stays active for next move (official rules)
            const movingPlayer = gameState.removingPlayer!
            const opponent = movingPlayer === 'white' ? 'black' : 'white'
            let winner: Player | null = null

            // Determine correct phase for the moving player
            const movingPhase = gameState.whiteRemaining === 0 && gameState.blackRemaining === 0
              ? (countPieces(newBoard, movingPlayer) === 3 ? 'flying' : 'moving')
              : gameState.phase

            // Check win conditions on opponent
            const opponentPieceCount = countPieces(newBoard, opponent)
            const stillPlacing = gameState.whiteRemaining > 0 || gameState.blackRemaining > 0

            if (opponentPieceCount < 3 && !stillPlacing) {
              // Opponent has < 3 pieces (only counts after placing phase)
              winner = movingPlayer
            } else if (movingPhase !== 'placing' && !hasValidMoves(newBoard, opponent)) {
              // Opponent has no valid moves
              winner = movingPlayer
            }

            setGameState((prev) => ({
              ...prev,
              board: newBoard,
              blackLost: movingPlayer === 'white' ? newLostCount : prev.blackLost,
              whiteLost: movingPlayer === 'black' ? newLostCount : prev.whiteLost,
              millFormed: false,
              pendingRemovals: 0,
              removingPlayer: null,
              selectedNode: null,
              validMoves: [],
              phase: movingPhase,
              currentPlayer: movingPlayer,
              gameOver: !!winner,
              winner,
            }))
          } else {
            // More removals needed
            setGameState((prev) => ({
              ...prev,
              board: newBoard,
              blackLost: gameState.removingPlayer === 'white' ? newLostCount : prev.blackLost,
              whiteLost: gameState.removingPlayer === 'black' ? newLostCount : prev.whiteLost,
              pendingRemovals: remainingRemovals,
            }))
          }
        }
        return
      }

      if (gameState.phase === 'placing') {
        if (gameState.board[nodeIndex] !== null) return

        const newBoard = { ...gameState.board }
        newBoard[nodeIndex] = gameState.currentPlayer

        const whiteRemaining = gameState.whiteRemaining - (gameState.currentPlayer === 'white' ? 1 : 0)
        const blackRemaining = gameState.blackRemaining - (gameState.currentPlayer === 'black' ? 1 : 0)

        // Calculate previous active mills for this player
        const prevActiveMills = getActiveMills(gameState.board, gameState.currentPlayer)
        const newlyFormedMillCount = countNewlyFormedMills(newBoard, gameState.currentPlayer, prevActiveMills)
        const millFormed = newlyFormedMillCount > 0

        const newPhase =
          whiteRemaining === 0 && blackRemaining === 0 ? 'moving' : 'placing'

        if (millFormed) {
          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            selectedNode: null,
            validMoves: [],
            whiteRemaining,
            blackRemaining,
            phase: newPhase,
            millFormed: true,
            pendingRemovals: newlyFormedMillCount,
            removingPlayer: gameState.currentPlayer,
          }))
          return
        }

        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          whiteRemaining,
          blackRemaining,
          phase: newPhase,
          selectedNode: null,
          validMoves: [],
          currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white',
        }))
      } else if (gameState.phase === 'moving' || gameState.phase === 'flying') {
        if (gameState.selectedNode === null) {
          if (gameState.board[nodeIndex] === gameState.currentPlayer) {
            const pieceCount = countPieces(gameState.board, gameState.currentPlayer)
            const validMoves =
              pieceCount === 3
                ? getValidFlyingMoves(gameState.board)
                : getValidAdjacentMoves(gameState.board, nodeIndex)

            setGameState((prev) => ({
              ...prev,
              selectedNode: nodeIndex,
              validMoves,
              phase: pieceCount === 3 ? 'flying' : 'moving',
            }))
          }
        } else if (nodeIndex === gameState.selectedNode) {
          setGameState((prev) => ({
            ...prev,
            selectedNode: null,
            validMoves: [],
          }))
        } else if (gameState.board[nodeIndex] === gameState.currentPlayer) {
          const pieceCount = countPieces(gameState.board, gameState.currentPlayer)
          const validMoves =
            pieceCount === 3
              ? getValidFlyingMoves(gameState.board)
              : getValidAdjacentMoves(gameState.board, nodeIndex)

          setGameState((prev) => ({
            ...prev,
            selectedNode: nodeIndex,
            validMoves,
            phase: pieceCount === 3 ? 'flying' : 'moving',
          }))
        } else if (gameState.validMoves.includes(nodeIndex)) {
          const newBoard = { ...gameState.board }
          newBoard[gameState.selectedNode] = null
          newBoard[nodeIndex] = gameState.currentPlayer

          const prevActiveMills = getActiveMills(gameState.board, gameState.currentPlayer)
          const newlyFormedMillCount = countNewlyFormedMills(newBoard, gameState.currentPlayer, prevActiveMills)
          const millFormed = newlyFormedMillCount > 0

          if (millFormed) {
            setGameState((prev) => ({
              ...prev,
              board: newBoard,
              selectedNode: null,
              validMoves: [],
              millFormed: true,
              pendingRemovals: newlyFormedMillCount,
              removingPlayer: gameState.currentPlayer,
            }))
            return
          }

          const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white'
          const opponentPieceCount = countPieces(newBoard, nextPlayer)

          // Determine next phase
          const nextPhase = opponentPieceCount === 3 ? 'flying' : gameState.phase

          // Check if opponent has lost
          if (opponentPieceCount < 3 || !hasValidMoves(newBoard, nextPlayer)) {
            setGameState((prev) => ({
              ...prev,
              board: newBoard,
              selectedNode: null,
              validMoves: [],
              gameOver: true,
              winner: gameState.currentPlayer,
            }))
            return
          }

          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            selectedNode: null,
            validMoves: [],
            phase: nextPhase,
            currentPlayer: nextPlayer,
          }))
        }
      }
    },
    [gameState]
  )

  const restart = useCallback(() => {
    setGameState({
      board: initialBoard,
      currentPlayer: 'white',
      phase: 'placing',
      whiteRemaining: 9,
      blackRemaining: 9,
      whiteLost: 0,
      blackLost: 0,
      selectedNode: null,
      validMoves: [],
      millFormed: false,
      pendingRemovals: 0,
      removingPlayer: null,
      selectedForRemoval: null,
      gameOver: false,
      winner: null,
    })
  }, [])

  return {
    ...gameState,
    handleNodeClick,
    restart,
    setSelectedForRemoval: (index: number | null) => {
      setGameState((prev) => ({
        ...prev,
        selectedForRemoval: index,
      }))
    },
  }
}
