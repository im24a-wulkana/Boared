type Player = 'white' | 'black'

interface BoardProps {
  board: { [key: number]: Player | null }
  selectedNode: number | null
  validMoves: number[]
  onNodeClick: (index: number) => void
}

// Board coordinates for 24 positions (3 concentric squares)
const POSITIONS: { [key: number]: [number, number] } = {
  0: [50, 50],
  1: [150, 50],
  2: [250, 50],
  3: [250, 150],
  4: [250, 250],
  5: [150, 250],
  6: [50, 250],
  7: [50, 150],
  8: [50, 150],
  9: [100, 100],
  10: [200, 100],
  11: [200, 200],
  12: [200, 300],
  13: [100, 300],
  14: [0, 300],
  15: [0, 200],
  16: [0, 100],
  17: [100, 0],
  18: [200, 0],
  19: [200, 100],
  20: [200, 200],
  21: [100, 200],
  22: [0, 200],
  23: [0, 100],
}

// Correct positions - 3 concentric squares, 8 points each
const BOARD_POSITIONS: { [key: number]: [number, number] } = {
  // Outer square (0-7)
  0: [50, 50],
  1: [150, 50],
  2: [250, 50],
  3: [250, 150],
  4: [250, 250],
  5: [150, 250],
  6: [50, 250],
  7: [50, 150],
  // Middle square (8-15)
  8: [100, 100],
  9: [150, 100],
  10: [200, 100],
  11: [200, 150],
  12: [200, 200],
  13: [150, 200],
  14: [100, 200],
  15: [100, 150],
  // Inner square (16-23)
  16: [125, 125],
  17: [150, 125],
  18: [175, 125],
  19: [175, 150],
  20: [175, 175],
  21: [150, 175],
  22: [125, 175],
  23: [125, 150],
}

export default function MorrisBoard({
  board,
  selectedNode,
  validMoves,
  onNodeClick,
}: BoardProps) {
  const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 300
    const y = ((e.clientY - rect.top) / rect.height) * 300

    // Find closest node within click radius
    let closestNode = -1
    let closestDist = 24

    for (let i = 0; i < 24; i++) {
      const [nx, ny] = BOARD_POSITIONS[i]
      const dist = Math.hypot(x - nx, y - ny)
      if (dist < closestDist) {
        closestDist = dist
        closestNode = i
      }
    }

    if (closestNode !== -1) {
      onNodeClick(closestNode)
    }
  }

  return (
    <div className="flex justify-center mb-8">
      <svg
        width="400"
        height="400"
        viewBox="0 0 300 300"
        className="border border-goldenTan border-opacity-20 rounded-lg cursor-pointer"
        style={{
          backgroundColor: '#5c3520',
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)'
        }}
        onClick={handleSVGClick}
      >
        {/* Lines connecting positions */}
        {/* Outer square */}
        <line x1="50" y1="50" x2="250" y2="50" stroke="#d4a96a" strokeWidth="2" />
        <line x1="250" y1="50" x2="250" y2="250" stroke="#d4a96a" strokeWidth="2" />
        <line x1="250" y1="250" x2="50" y2="250" stroke="#d4a96a" strokeWidth="2" />
        <line x1="50" y1="250" x2="50" y2="50" stroke="#d4a96a" strokeWidth="2" />

        {/* Middle square */}
        <line x1="100" y1="100" x2="200" y2="100" stroke="#d4a96a" strokeWidth="2" />
        <line x1="200" y1="100" x2="200" y2="200" stroke="#d4a96a" strokeWidth="2" />
        <line x1="200" y1="200" x2="100" y2="200" stroke="#d4a96a" strokeWidth="2" />
        <line x1="100" y1="200" x2="100" y2="100" stroke="#d4a96a" strokeWidth="2" />

        {/* Inner square */}
        <line x1="125" y1="125" x2="175" y2="125" stroke="#d4a96a" strokeWidth="2" />
        <line x1="175" y1="125" x2="175" y2="175" stroke="#d4a96a" strokeWidth="2" />
        <line x1="175" y1="175" x2="125" y2="175" stroke="#d4a96a" strokeWidth="2" />
        <line x1="125" y1="175" x2="125" y2="125" stroke="#d4a96a" strokeWidth="2" />

        {/* Diagonal lines from midpoints */}
        <line x1="150" y1="50" x2="150" y2="250" stroke="#d4a96a" strokeWidth="2" />
        <line x1="50" y1="150" x2="250" y2="150" stroke="#d4a96a" strokeWidth="2" />

        {/* Nodes */}
        {Array.from({ length: 24 }).map((_, i) => {
          const [x, y] = BOARD_POSITIONS[i]
          const piece = board[i]
          const isSelected = selectedNode === i
          const isValid = validMoves.includes(i)

          return (
            <g key={i}>
              {/* Hover area */}
              <circle
                cx={x}
                cy={y}
                r="24"
                fill="transparent"
                style={{
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.3'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0'
                }}
              />

              {/* Node circle */}
              <circle
                cx={x}
                cy={y}
                r="8"
                fill={isSelected ? '#d4a96a' : isValid ? '#a68850' : 'transparent'}
                stroke="#d4a96a"
                strokeWidth="2"
              />

              {/* Piece */}
              {piece && (
                <g>
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="none"
                      stroke="#d4a96a"
                      strokeWidth="3"
                      style={{
                        animation: 'pulse 0.6s ease-in-out infinite'
                      }}
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill={piece === 'white' ? '#f5e6c8' : '#1a0a02'}
                    stroke="#d4a96a"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
