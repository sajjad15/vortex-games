import { useState, useEffect } from 'react'

function createEmptyGrid() {
  return Array(4).fill(null).map(() => Array(4).fill(0))
}

function addRandomTile(grid) {
  const emptyCells = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) {
        emptyCells.push([r, c])
      }
    }
  }
  if (emptyCells.length === 0) return grid

  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  const [r, c] = emptyCells[randomIndex]
  const newGrid = grid.map((row) => row.slice())
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4
  return newGrid
}

function slideRowLeft(row) {
  let arr = row.filter((val) => val !== 0)
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] = arr[i] * 2
      arr[i + 1] = 0
    }
  }
  arr = arr.filter((val) => val !== 0)
  while (arr.length < 4) {
    arr.push(0)
  }
  return arr
}

function rotateGrid(grid) {
  const newGrid = createEmptyGrid()
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      newGrid[c][3 - r] = grid[r][c]
    }
  }
  return newGrid
}

function moveLeft(grid) {
  return grid.map((row) => slideRowLeft(row))
}

function moveRight(grid) {
  let rotated = rotateGrid(rotateGrid(grid))
  rotated = moveLeft(rotated)
  return rotateGrid(rotateGrid(rotated))
}

function moveUp(grid) {
  let rotated = rotateGrid(rotateGrid(rotateGrid(grid)))
  rotated = moveLeft(rotated)
  return rotateGrid(rotated)
}

function moveDown(grid) {
  let rotated = rotateGrid(grid)
  rotated = moveLeft(rotated)
  return rotateGrid(rotateGrid(rotateGrid(rotated)))
}

function gridsAreEqual(a, b) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (a[r][c] !== b[r][c]) return false
    }
  }
  return true
}

function canMove(grid) {
  const left = moveLeft(grid)
  const right = moveRight(grid)
  const up = moveUp(grid)
  const down = moveDown(grid)

  if (!gridsAreEqual(grid, left)) return true
  if (!gridsAreEqual(grid, right)) return true
  if (!gridsAreEqual(grid, up)) return true
  if (!gridsAreEqual(grid, down)) return true
  return false
}

function getTileColor(value) {
  if (value === 2) return 'bg-gray-700 text-white'
  if (value === 4) return 'bg-gray-600 text-white'
  if (value === 8) return 'bg-purple-700 text-white'
  if (value === 16) return 'bg-purple-600 text-white'
  if (value === 32) return 'bg-purple-500 text-white'
  if (value === 64) return 'bg-pink-600 text-white'
  if (value === 128) return 'bg-pink-500 text-white'
  if (value === 256) return 'bg-cyan-600 text-white'
  if (value === 512) return 'bg-cyan-500 text-white'
  if (value === 1024) return 'bg-yellow-500 text-black'
  if (value === 2048) return 'bg-yellow-400 text-black'
  return 'bg-gray-900'
}

function Game2048() {
  const [grid, setGrid] = useState(() => {
    let initial = createEmptyGrid()
    initial = addRandomTile(initial)
    initial = addRandomTile(initial)
    return initial
  })
  const [gameOver, setGameOver] = useState(false)

  const handleMove = (direction) => {
    if (gameOver) return

    let newGrid
    if (direction === 'left') newGrid = moveLeft(grid)
    if (direction === 'right') newGrid = moveRight(grid)
    if (direction === 'up') newGrid = moveUp(grid)
    if (direction === 'down') newGrid = moveDown(grid)

    if (gridsAreEqual(grid, newGrid)) return

    newGrid = addRandomTile(newGrid)
    setGrid(newGrid)

    if (!canMove(newGrid)) {
      setGameOver(true)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handleMove('left')
      if (e.key === 'ArrowRight') handleMove('right')
      if (e.key === 'ArrowUp') handleMove('up')
      if (e.key === 'ArrowDown') handleMove('down')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  const handleReset = () => {
    let initial = createEmptyGrid()
    initial = addRandomTile(initial)
    initial = addRandomTile(initial)
    setGrid(initial)
    setGameOver(false)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-gray-400 text-sm">استخدم أسهم لوحة المفاتيح للتحريك</p>

      <div className="grid grid-cols-3 gap-2 w-36">
        <div></div>
        <button onClick={() => handleMove('up')} className="bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-xl">↑</button>
        <div></div>

        <button onClick={() => handleMove('left')} className="bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-xl">←</button>
        <div></div>
        <button onClick={() => handleMove('right')} className="bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-xl">→</button>

        <div></div>
        <button onClick={() => handleMove('down')} className="bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-xl">↓</button>
        <div></div>
      </div>

      {gameOver && (
        <p className="text-xl font-bold text-red-400">انتهت اللعبة!</p>
      )}

      <div className="bg-gray-950 p-3 rounded-2xl border border-gray-800">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-3 mb-3">
            {row.map((value, colIndex) => (
              <div
                key={colIndex}
                className={'w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold ' + getTileColor(value)}
              >
                {value !== 0 ? value : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={handleReset}
        className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-semibold"
      >
        لعبة جديدة
      </button>
    </div>
  )
}

export default Game2048