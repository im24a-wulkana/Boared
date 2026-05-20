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
  selectedForRemoval: number | null
  gameOver: boolean
  winner: Player | null
}

// Board positions (24 total - 3 concentric squares with 8 points each)
// Adjacency: only orthogonally adjacent points on the same line or connecting lines
const ADJACENCY = {
  // Outer square (0-7): corners [0,2,4,6] and midpoints [1,3,5,7]
  0: [1, 7, 8],      // top-left corner: [1 right], [7 down], [8 inner-connection]
  1: [0, 2, 9],      // top midpoint: [0 left], [2 right], [9 inner-connection]
  2: [1, 3, 10],     // top-right corner: [1 left], [3 down], [10 inner-connection]
  3: [2, 4, 11],     // right midpoint: [2 up], [4 down], [11 inner-connection]
  4: [3, 5, 12],     // bottom-right corner: [3 up], [5 left], [12 inner-connection]
  5: [4, 6, 13],     // bottom midpoint: [4 right], [6 left], [13 inner-connection]
  6: [5, 7, 14],     // bottom-left corner: [5 right], [7 up], [14 inner-connection]
  7: [6, 0, 15],     // left midpoint: [6 down], [0 up], [15 inner-connection]
  // Middle square (8-15): corners [8,10,12,14] and midpoints [9,11,13,15]
  8: [0, 9, 15],     // top-left corner: [0 outer], [9 right], [15 left]
  9: [1, 8, 10, 17],     // top midpoint: [1 outer], [8 left], [10 right]
  10: [2, 9, 11],    // top-right corner: [2 outer], [9 left], [11 down]
  11: [3, 10, 12, 19],   // right midpoint: [3 outer], [10 up], [12 down]
  12: [4, 11, 13],   // bottom-right corner: [4 outer], [11 up], [13 left]
  13: [5, 12, 14, 21],   // bottom midpoint: [5 outer], [12 right], [14 left], [21 inner-down]
  14: [6, 13, 15],   // bottom-left corner: [6 outer], [13 right], [15 up]
  15: [7, 14, 8, 23],    // left midpoint: [7 outer], [14 down], [8 right]
  // Inner square (16-23): corners [16,18,20,22] and midpoints [17,19,21,23]
  16: [8, 17, 23],   // top-left corner: [8 outer], [17 right], [23 left]
  17: [9, 16, 18],   // top midpoint: [9 outer], [16 left], [18 right]   // top midpoint: [9 outer], [16 left], [18 right]
  18: [10, 17, 19],  // top-right corner: [10 outer], [17 left], [19 down]
  19: [11, 18, 20],  // right midpoint: [11 outer], [18 up], [20 down]  // right midpoint: [11 outer], [18 up], [20 down]
  20: [12, 19, 21],  // bottom-right corner: [12 outer], [19 up], [21 left]
  21: [13, 20, 22],  // bottom midpoint: [13 outer], [20 right], [22 left]  // bottom midpoint: [13 outer], [20 right], [22 left]
  22: [14, 21, 23],  // bottom-left corner: [14 outer], [21 right], [23 up]
  23: [15, 22, 16],  // left midpoint: [15 outer], [22 down], [16 right]  // left midpoint: [15 outer], [22 down], [16 right]
}

// Mill combinations - only aligned positions
const MILLS = [
  // Outer square horizontal lines
  [0, 1, 2],
  [4, 5, 6],
  // Outer square vertical lines
  [2, 3, 4],
  [6, 7, 0],
  // Middle square horizontal lines
  [8, 9, 10],
  [12, 13, 14],
  // Middle square vertical lines
  [10, 11, 12],
  [14, 15, 8],
  // Inner square horizontal lines
  [16, 17, 18],
  [20, 21, 22],
  // Inner square vertical lines
  [18, 19, 20],
  [22, 23, 16],
  // Cross lines through midpoints (vertical)
  [1, 9, 17],
  [3, 11, 19],
  [5, 13, 21],
  [7, 15, 23],
]

const detectMill = (board: Board, positions: number[]): boolean => {
  return MILLS.some((mill) =>
    mill.every((pos) => board[pos] === board[positions[0]])
  )
}

const hasMill = (board: Board, position: number): boolean => {
  const player = board[position]
  return MILLS.some((mill) => mill.includes(position) && mill.every((pos) => board[pos] === player))
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
    selectedForRemoval: null,
    gameOver: false,
    winner: null,
  })

  const countPieces = useCallback((board: Board, player: Player): number => {
    return Object.values(board).filter((p) => p === player).length
  }, [])

  const canRemovePiece = useCallback(
    (board: Board, position: number, player: Player): boolean => {
      if (board[position] !== player) return false
      if (!hasMill(board, position)) return true

      const allInMills = Object.entries(board)
        .filter(([, p]) => p === player)
        .every(([pos]) => hasMill(board, Number(pos)))

      return allInMills
    },
    []
  )

  const handleNodeClick = useCallback(
    (nodeIndex: number) => {
      if (gameState.gameOver) return

      if (gameState.millFormed) {
        // Player must remove an opponent's piece after forming a mill
        const opponent = gameState.currentPlayer === 'white' ? 'black' : 'white'

        if (
          gameState.board[nodeIndex] === opponent &&
          canRemovePiece(gameState.board, nodeIndex, opponent)
        ) {
          const newBoard = { ...gameState.board }
          newBoard[nodeIndex] = null

          const newLostCount =
            gameState.currentPlayer === 'white'
              ? gameState.blackLost + 1
              : gameState.whiteLost + 1

          const winner =
            newLostCount >= 7
              ? gameState.currentPlayer
              : null

          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            blackLost: gameState.currentPlayer === 'white' ? newLostCount : prev.blackLost,
            whiteLost: gameState.currentPlayer === 'black' ? newLostCount : prev.whiteLost,
            millFormed: false,
            currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white',
            gameOver: !!winner,
            winner,
          }))
        }
        return
      }

      if (gameState.phase === 'placing') {
        if (gameState.board[nodeIndex] !== null) return

        const newBoard = { ...gameState.board }
        newBoard[nodeIndex] = gameState.currentPlayer

        const millFormed = detectMill(newBoard, [nodeIndex])

        if (millFormed) {
          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            selectedNode: null,
            validMoves: [],
            millFormed: true,
          }))
          return
        }

        const whiteRemaining = gameState.whiteRemaining - (gameState.currentPlayer === 'white' ? 1 : 0)
        const blackRemaining = gameState.blackRemaining - (gameState.currentPlayer === 'black' ? 1 : 0)

        const newPhase =
          whiteRemaining === 0 && blackRemaining === 0 ? 'moving' : 'placing'

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
          // Clicking the same piece deselects it
          setGameState((prev) => ({
            ...prev,
            selectedNode: null,
            validMoves: [],
          }))
        } else if (gameState.board[nodeIndex] === gameState.currentPlayer) {
          // Clicking another piece of the same player reselects it
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

          const millFormed = detectMill(newBoard, [nodeIndex])

          if (millFormed) {
            setGameState((prev) => ({
              ...prev,
              board: newBoard,
              selectedNode: null,
              validMoves: [],
              millFormed: true,
            }))
            return
          }

          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            selectedNode: null,
            validMoves: [],
            currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white',
          }))
        }
      }
    },
    [gameState, canRemovePiece, countPieces]
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
