import { Player, GamePhase } from './useNineMensMorris'

interface Board {
  [key: number]: Player | null
}

export type BotDifficulty = 'easy' | 'medium' | 'hard'

const ADJACENCY = {
  0: [1, 7, 8],
  1: [0, 2, 9],
  2: [1, 3, 10],
  3: [2, 4, 11],
  4: [3, 5, 12],
  5: [4, 6, 13],
  6: [5, 7, 14],
  7: [6, 0, 15],
  8: [0, 9, 15],
  9: [1, 8, 10, 17],
  10: [2, 9, 11],
  11: [3, 10, 12, 19],
  12: [4, 11, 13],
  13: [5, 12, 14, 21],
  14: [6, 13, 15],
  15: [7, 14, 8, 23],
  16: [8, 17, 23],
  17: [9, 16, 18],
  18: [10, 17, 19],
  19: [11, 18, 20],
  20: [12, 19, 21],
  21: [13, 20, 22],
  22: [14, 21, 23],
  23: [15, 22, 16],
} as const

const MILLS = [
  [0, 1, 2],
  [4, 5, 6],
  [2, 3, 4],
  [6, 7, 0],
  [8, 9, 10],
  [12, 13, 14],
  [10, 11, 12],
  [14, 15, 8],
  [16, 17, 18],
  [20, 21, 22],
  [18, 19, 20],
  [22, 23, 16],
  [1, 9, 17],
  [3, 11, 19],
  [5, 13, 21],
  [7, 15, 23],
]

const hasMill = (board: Board, position: number): boolean => {
  const player = board[position]
  return MILLS.some((mill) => mill.includes(position) && mill.every((pos) => board[pos] === player))
}

const detectMill = (board: Board, positions: number[]): boolean => {
  return MILLS.some((mill) =>
    mill.every((pos) => board[pos] === board[positions[0]])
  )
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

const countPieces = (board: Board, player: Player): number => {
  return Object.values(board).filter((p) => p === player).length
}

export const useBot = (difficulty: BotDifficulty) => {
  const getValidPlacementMoves = (board: Board): number[] => {
    return Object.keys(board)
      .map(Number)
      .filter((pos) => board[pos] === null)
  }

  const getValidMovingMoves = (board: Board, player: Player): Array<[number, number]> => {
    const moves: Array<[number, number]> = []
    const pieceCount = countPieces(board, player)
    const isFlying = pieceCount === 3

    for (let i = 0; i < 24; i++) {
      if (board[i] === player) {
        const validMoves = isFlying
          ? getValidFlyingMoves(board)
          : getValidAdjacentMoves(board, i)

        for (const move of validMoves) {
          moves.push([i, move])
        }
      }
    }

    return moves
  }

  const scoreMove = (board: Board, from: number, to: number, player: Player): number => {
    const opponent = player === 'white' ? 'black' : 'white'
    let score = 0

    // Make the move
    const testBoard = { ...board }
    testBoard[from] = null
    testBoard[to] = player

    // Check if move forms a mill
    if (detectMill(testBoard, [to])) {
      score += 1000
    }

    // Prefer moving pieces out of corners to center positions
    if ([0, 2, 4, 6, 16, 18, 20, 22].includes(to)) {
      score -= 50
    }
    if ([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 8, 10, 12, 14].includes(to)) {
      score += 30
    }

    // Block opponent's potential mills (medium/hard)
    if (difficulty !== 'easy') {
      for (const mill of MILLS) {
        const opponentCount = mill.filter((pos) => testBoard[pos] === opponent).length
        const emptyCount = mill.filter((pos) => testBoard[pos] === null).length
        if (opponentCount === 2 && emptyCount === 1) {
          const emptyPos = mill.find((pos) => testBoard[pos] === null)
          if (emptyPos === to) score += 500
        }
      }
    }

    return score
  }

  const getRemovalChoice = (board: Board, player: Player): number => {
    const opponent = player === 'white' ? 'black' : 'white'
    const removablePieces: number[] = []

    for (let i = 0; i < 24; i++) {
      if (board[i] === opponent) {
        const inMill = hasMill(board, i)
        const allInMills = Object.entries(board)
          .filter(([, p]) => p === opponent)
          .every(([pos]) => hasMill(board, Number(pos)))

        if (!inMill || allInMills) {
          removablePieces.push(i)
        }
      }
    }

    if (removablePieces.length === 0) return -1

    if (difficulty === 'easy') {
      return removablePieces[Math.floor(Math.random() * removablePieces.length)]
    }

    if (difficulty === 'medium') {
      // Prefer removing pieces that break mill patterns
      let best = removablePieces[0]
      let bestScore = -1

      for (const piece of removablePieces) {
        if (hasMill(board, piece)) {
          return piece // Prioritize removing pieces in mills if possible
        }
      }

      return best
    }

    // Hard: strategic removal
    let best = removablePieces[0]
    let bestScore = -1

    for (const piece of removablePieces) {
      let score = 0

      if (hasMill(board, piece)) {
        score += 100
      }

      // Remove pieces that are blocking opponent's moves
      const adjacentToOpponent = (ADJACENCY[piece as keyof typeof ADJACENCY] || []).some(
        (pos) => board[pos] === 'white' || board[pos] === 'black'
      )
      if (adjacentToOpponent) {
        score += 50
      }

      if (score > bestScore) {
        bestScore = score
        best = piece
      }
    }

    return best
  }

  const makeMove = (
    board: Board,
    phase: GamePhase,
    player: Player
  ): { move: [number, number] | null; placement: number | null } => {
    if (phase === 'placing') {
      const available = getValidPlacementMoves(board)
      if (available.length === 0) return { move: null, placement: null }

      if (difficulty === 'easy') {
        return {
          move: null,
          placement: available[Math.floor(Math.random() * available.length)],
        }
      }

      if (difficulty === 'medium') {
        // Prefer center positions
        const center = available.filter((pos) => [9, 11, 13, 15].includes(pos))
        return {
          move: null,
          placement: center.length > 0 ? center[0] : available[0],
        }
      }

      // Hard: try to form mills or block opponent
      let best = available[0]
      let bestScore = -1

      for (const placement of available) {
        const testBoard = { ...board }
        testBoard[placement] = player
        let score = 0

        if (detectMill(testBoard, [placement])) {
          score += 500
        }

        // Prefer center
        if ([9, 11, 13, 15].includes(placement)) score += 50
        if ([1, 3, 5, 7].includes(placement)) score += 25

        if (score > bestScore) {
          bestScore = score
          best = placement
        }
      }

      return { move: null, placement: best }
    }

    const moves = getValidMovingMoves(board, player)
    if (moves.length === 0) return { move: null, placement: null }

    if (difficulty === 'easy') {
      const randomMove = moves[Math.floor(Math.random() * moves.length)]
      return { move: randomMove, placement: null }
    }

    if (difficulty === 'medium') {
      const millMoves = moves.filter(([from, to]) => {
        const testBoard = { ...board }
        testBoard[from] = null
        testBoard[to] = player
        return detectMill(testBoard, [to])
      })

      if (millMoves.length > 0) {
        return { move: millMoves[0], placement: null }
      }

      const randomMove = moves[Math.floor(Math.random() * moves.length)]
      return { move: randomMove, placement: null }
    }

    // Hard: use scoring
    let best = moves[0]
    let bestScore = -1

    for (const [from, to] of moves) {
      const score = scoreMove(board, from, to, player)
      if (score > bestScore) {
        bestScore = score
        best = [from, to] as [number, number]
      }
    }

    return { move: best, placement: null }
  }

  return {
    makeMove,
    getRemovalChoice,
  }
}
