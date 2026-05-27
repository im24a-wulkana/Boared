import type { Player, GamePhase } from './useNineMensMorris'

interface Board {
  [key: number]: Player | null
}

export type BotDifficulty = 'easy' | 'medium' | 'hard'

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

const MILLS = [
  // Outer ring
  [0, 1, 2],
  [2, 3, 4],
  [4, 5, 6],
  [6, 7, 0],
  // Middle ring
  [8, 9, 10],
  [10, 11, 12],
  [12, 13, 14],
  [14, 15, 8],
  // Inner ring
  [16, 17, 18],
  [18, 19, 20],
  [20, 21, 22],
  [22, 23, 16],
  // Spokes
  [1, 9, 17],
  [3, 11, 19],
  [5, 13, 21],
  [7, 15, 23],
]

const countPieces = (board: Board, player: Player): number => {
  return Object.values(board).filter((p) => p === player).length
}

const hasMill = (board: Board, position: number): boolean => {
  const player = board[position]
  return MILLS.some((mill) => mill.includes(position) && mill.every((pos) => board[pos] === player))
}

const getMillsForPlayer = (board: Board, player: Player): number => {
  let count = 0
  const countedMills = new Set<string>()

  for (const mill of MILLS) {
    if (mill.every((pos) => board[pos] === player)) {
      const key = mill.sort().join('-')
      if (!countedMills.has(key)) {
        count++
        countedMills.add(key)
      }
    }
  }
  return count
}

const getMobility = (board: Board, player: Player, phase: GamePhase): number => {
  let moves = 0

  for (let i = 0; i < 24; i++) {
    if (board[i] === player) {
      if (phase === 'flying') {
        moves += Object.values(board).filter((p) => p === null).length
      } else {
        const adj = (ADJACENCY[i as keyof typeof ADJACENCY] || []).filter((pos) => board[pos] === null)
        moves += adj.length
      }
    }
  }

  return moves
}

const getRemovablePieces = (board: Board, player: Player): number[] => {
  const removable: number[] = []

  for (let i = 0; i < 24; i++) {
    if (board[i] === player) {
      const inMill = hasMill(board, i)
      const allInMills = Object.entries(board)
        .filter(([, p]) => p === player)
        .every(([pos]) => hasMill(board, Number(pos)))

      if (!inMill || allInMills) {
        removable.push(i)
      }
    }
  }

  return removable
}

const evaluateBoard = (board: Board, player: Player, phase: GamePhase): number => {
  const opponent = player === 'white' ? 'black' : 'white'
  let score = 0

  // Piece count (most important)
  const playerPieces = countPieces(board, player)
  const opponentPieces = countPieces(board, opponent)
  score += (playerPieces - opponentPieces) * 200

  // Mills formed
  const playerMills = getMillsForPlayer(board, player)
  const opponentMills = getMillsForPlayer(board, opponent)
  score += (playerMills - opponentMills) * 150

  // Mobility
  const playerMobility = getMobility(board, player, phase)
  const opponentMobility = getMobility(board, opponent, phase)
  score += (playerMobility - opponentMobility) * 20

  // Strategic positions (center connectors)
  const strategicPositions = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]
  for (const pos of strategicPositions) {
    if (board[pos] === player) score += 15
    if (board[pos] === opponent) score -= 15
  }

  // Double mill potential (adjacent mills sharing a piece)
  for (let i = 0; i < 24; i++) {
    if (board[i] === player) {
      let millCount = 0
      for (const mill of MILLS) {
        if (mill.includes(i) && mill.every((pos) => board[pos] === player)) {
          millCount++
        }
      }
      if (millCount >= 2) score += 100 // Double mill bonus
    }
  }

  return score
}

export const useMinimax = (difficulty: BotDifficulty) => {
  const getMaxDepth = (phase: GamePhase): number => {
    if (difficulty === 'easy') return 1
    if (difficulty === 'medium') return 3
    // Hard difficulty: deeper search for moving, shallower for placing
    return phase === 'placing' ? 4 : 6
  }

  const getValidMoves = (board: Board, player: Player): Array<[number, number]> => {
    const moves: Array<[number, number]> = []
    const isFlying = countPieces(board, player) === 3

    for (let i = 0; i < 24; i++) {
      if (board[i] === player) {
        const validDests = isFlying
          ? Object.keys(board).map(Number).filter((p) => board[p] === null)
          : (ADJACENCY[i as keyof typeof ADJACENCY] || []).filter((p) => board[p] === null)

        for (const dest of validDests) {
          moves.push([i, dest])
        }
      }
    }

    return moves
  }

  const getValidPlacements = (board: Board): number[] => {
    return Object.keys(board).map(Number).filter((p) => board[p] === null)
  }

  const minimax = (
    board: Board,
    phase: GamePhase,
    isMaximizing: boolean,
    player: Player,
    depth: number,
    maxDepth: number,
    alpha: number = -Infinity,
    beta: number = Infinity
  ): number => {
    if (depth === maxDepth) {
      return evaluateBoard(board, player, phase)
    }

    const current = isMaximizing ? player : player === 'white' ? 'black' : 'white'

    if (phase === 'placing') {
      const placements = getValidPlacements(board)

      if (isMaximizing) {
        let maxEval = -Infinity
        for (const placement of placements) {
          const testBoard = { ...board }
          testBoard[placement] = current

          const eval_ = minimax(
            testBoard,
            phase,
            !isMaximizing,
            player,
            depth + 1,
            maxDepth,
            alpha,
            beta
          )
          maxEval = Math.max(maxEval, eval_)
          alpha = Math.max(alpha, eval_)
          if (beta <= alpha) break
        }
        return maxEval
      } else {
        let minEval = Infinity
        for (const placement of placements) {
          const testBoard = { ...board }
          testBoard[placement] = current

          const eval_ = minimax(
            testBoard,
            phase,
            !isMaximizing,
            player,
            depth + 1,
            maxDepth,
            alpha,
            beta
          )
          minEval = Math.min(minEval, eval_)
          beta = Math.min(beta, eval_)
          if (beta <= alpha) break
        }
        return minEval
      }
    } else {
      const moves = getValidMoves(board, current)

      if (moves.length === 0) {
        return evaluateBoard(board, player, phase)
      }

      if (isMaximizing) {
        let maxEval = -Infinity
        for (const [from, to] of moves) {
          const testBoard = { ...board }
          testBoard[from] = null
          testBoard[to] = current

          const eval_ = minimax(
            testBoard,
            phase,
            !isMaximizing,
            player,
            depth + 1,
            maxDepth,
            alpha,
            beta
          )
          maxEval = Math.max(maxEval, eval_)
          alpha = Math.max(alpha, eval_)
          if (beta <= alpha) break
        }
        return maxEval
      } else {
        let minEval = Infinity
        for (const [from, to] of moves) {
          const testBoard = { ...board }
          testBoard[from] = null
          testBoard[to] = current

          const eval_ = minimax(
            testBoard,
            phase,
            !isMaximizing,
            player,
            depth + 1,
            maxDepth,
            alpha,
            beta
          )
          minEval = Math.min(minEval, eval_)
          beta = Math.min(beta, eval_)
          if (beta <= alpha) break
        }
        return minEval
      }
    }
  }

  const makeMove = (
    board: Board,
    phase: GamePhase,
    player: Player
  ): { move: [number, number] | null; placement: number | null } => {
    const maxDepth = getMaxDepth(phase)

    if (phase === 'placing') {
      const placements = getValidPlacements(board)

      if (placements.length === 0) return { move: null, placement: null }
      if (difficulty === 'easy') {
        return { move: null, placement: placements[Math.floor(Math.random() * placements.length)] }
      }

      // For placing phase, use faster evaluation
      if (difficulty === 'medium') {
        // Quick heuristic: prefer positions that form mills or connect to many nodes
        let best = placements[0]
        let bestScore = -Infinity

        for (const placement of placements) {
          const testBoard = { ...board }
          testBoard[placement] = player

          let score = evaluateBoard(testBoard, player, phase)

          // Bonus for connecting nodes
          const adjCount = (ADJACENCY[placement as keyof typeof ADJACENCY] || []).length
          score += adjCount * 5

          if (score > bestScore) {
            bestScore = score
            best = placement
          }
        }

        return { move: null, placement: best }
      }

      // Hard difficulty: still use minimax but with reduced depth
      let best = placements[0]
      let bestScore = -Infinity
      let evaluated = 0
      const maxEvaluations = Math.min(placements.length, 15) // Limit evaluations to speed up

      for (const placement of placements) {
        const testBoard = { ...board }
        testBoard[placement] = player

        const score = minimax(testBoard, phase, false, player, 1, maxDepth)

        if (score > bestScore) {
          bestScore = score
          best = placement
        }

        evaluated++
        if (evaluated >= maxEvaluations) break // Early exit if evaluating too many
      }

      return { move: null, placement: best }
    }

    const moves = getValidMoves(board, player)

    if (moves.length === 0) return { move: null, placement: null }
    if (difficulty === 'easy') {
      return { move: moves[Math.floor(Math.random() * moves.length)], placement: null }
    }

    let best = moves[0]
    let bestScore = -Infinity

    for (const [from, to] of moves) {
      const testBoard = { ...board }
      testBoard[from] = null
      testBoard[to] = player

      const score = minimax(testBoard, phase, false, player, 1, maxDepth)

      if (score > bestScore) {
        bestScore = score
        best = [from, to] as [number, number]
      }
    }

    return { move: best, placement: null }
  }

  const getRemovalChoice = (board: Board, player: Player): number => {
    const opponent = player === 'white' ? 'black' : 'white'
    const removable = getRemovablePieces(board, opponent)

    if (removable.length === 0) return -1

    if (difficulty === 'easy') {
      return removable[Math.floor(Math.random() * removable.length)]
    }

    let best = removable[0]
    let bestScore = -Infinity

    for (const piece of removable) {
      const testBoard = { ...board }
      testBoard[piece] = null

      const score = evaluateBoard(testBoard, player, 'moving')

      if (score > bestScore) {
        bestScore = score
        best = piece
      }
    }

    return best
  }

  return {
    makeMove,
    getRemovalChoice,
  }
}
