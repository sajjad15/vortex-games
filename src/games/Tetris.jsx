import { useState, useEffect, useRef } from 'react'

const COLS = 10
const ROWS = 20

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
}

const COLORS = {
  I: '#22d3ee',
  O: '#facc15',
  T: '#a855f7',
  S: '#4ade80',
  Z: '#f87171',
  J: '#60a5fa',
  L: '#fb923c'
}

const SHAPE_KEYS = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']

function getRandomShapeKey() {
  return SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)]
}

function createEmptyBoard() {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
}

function rotateShape(shape) {
  const rows = shape.length
  const cols = shape[0].length
  const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0))

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c]
    }
  }

  return rotated
}

function checkCollision(board, shape, posX, posY) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 0) continue

      const newX = posX + c
      const newY = posY + r

      if (newX < 0 || newX >= COLS) return true
      if (newY >= ROWS) return true
      if (newY >= 0 && board[newY][newX]) return true
    }
  }
  return false
}

function mergeShapeToBoard(board, shape, posX, posY, colorKey) {
  const newBoard = board.map((row) => row.slice())

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        const y = posY + r
        const x = posX + c
        if (y >= 0) {
          newBoard[y][x] = colorKey
        }
      }
    }
  }

  return newBoard
}

function clearFullRows(board) {
  const remainingRows = board.filter((row) => row.some((cell) => cell === null))
  const clearedCount = ROWS - remainingRows.length

  const newRows = Array(clearedCount).fill(null).map(() => Array(COLS).fill(null))
  const newBoard = newRows.concat(remainingRows)

  return { newBoard: newBoard, clearedCount: clearedCount }
}

function Tetris() {
  const [board, setBoard] = useState(() => createEmptyBoard())
  const [currentShape, setCurrentShape] = useState(() => SHAPES[getRandomShapeKey()])
  const [currentColorKey, setCurrentColorKey] = useState('I')
  const [posX, setPosX] = useState(4)
  const [posY, setPosY] = useState(0)
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState('playing')

  const spawnNewShape = () => {
    const key = getRandomShapeKey()
    setCurrentShape(SHAPES[key])
    setCurrentColorKey(key)
    setPosX(4)
    setPosY(0)
  }

  useEffect(() => {
    if (gameStatus !== 'playing') return

    const interval = setInterval(() => {
      setPosY((prevY) => {
        const newY = prevY + 1
        if (checkCollision(board, currentShape, posX, newY)) {
          const merged = mergeShapeToBoard(board, currentShape, posX, prevY, currentColorKey)
          const result = clearFullRows(merged)
          setBoard(result.newBoard)
          setScore((prevScore) => prevScore + result.clearedCount * 100)

          if (checkCollision(result.newBoard, SHAPES[getRandomShapeKey()], 4, 0)) {
            setGameStatus('lost')
          } else {
            spawnNewShape()
          }
          return 0
        }
        return newY
      })
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [board, currentShape, currentColorKey, posX, gameStatus])

  const moveLeftAction = () => {
    if (gameStatus !== 'playing') return
    if (!checkCollision(board, currentShape, posX - 1, posY)) {
      setPosX(posX - 1)
    }
  }

  const moveRightAction = () => {
    if (gameStatus !== 'playing') return
    if (!checkCollision(board, currentShape, posX + 1, posY)) {
      setPosX(posX + 1)
    }
  }

  const moveDownAction = () => {
    if (gameStatus !== 'playing') return
    if (!checkCollision(board, currentShape, posX, posY + 1)) {
      setPosY(posY + 1)
    }
  }

  const rotateAction = () => {
    if (gameStatus !== 'playing') return
    const rotated = rotateShape(currentShape)
    if (!checkCollision(board, rotated, posX, posY)) {
      setCurrentShape(rotated)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') moveLeftAction()
      if (e.key === 'ArrowRight') moveRightAction()
      if (e.key === 'ArrowDown') moveDownAction()
      if (e.key === 'ArrowUp') rotateAction()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [board, currentShape, posX, posY, gameStatus])

  const handleReset = () => {
    setBoard(createEmptyBoard())
    spawnNewShape()
    setScore(0)
    setGameStatus('playing')
  }

  const getDisplayBoard = () => {
    const display = board.map((row) => row.slice())

    for (let r = 0; r < currentShape.length; r++) {
      for (let c = 0; c < currentShape[r].length; c++) {
        if (currentShape[r][c] === 1) {
          const y = posY + r
          const x = posX + c
          if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
            display[y][x] = currentColorKey
          }
        }
      }
    }

    return display
  }

  const displayBoard = getDisplayBoard()

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-gray-400">النقاط: {score}</p>

      {gameStatus === 'lost' && (
        <p className="text-xl font-bold text-red-400">انتهت اللعبة!</p>
      )}

      <div className="bg-gray-950 p-2 rounded-xl border border-gray-800 max-w-full overflow-x-auto">
        {displayBoard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                style={{ backgroundColor: cell ? COLORS[cell] : '#111827' }}
                className="w-5 h-5 border border-gray-900"
              />
            ))}
          </div>
        ))}
      </div>

      <p className="text-gray-400 text-sm">الأسهم: تحريك ودوران</p>

      <div className="flex gap-2">
        <button onClick={moveLeftAction} className="bg-gray-800 hover:bg-gray-700 rounded-lg px-5 py-3 text-xl">←</button>
        <button onClick={rotateAction} className="bg-gray-800 hover:bg-gray-700 rounded-lg px-5 py-3 text-xl">↻</button>
        <button onClick={moveDownAction} className="bg-gray-800 hover:bg-gray-700 rounded-lg px-5 py-3 text-xl">↓</button>
        <button onClick={moveRightAction} className="bg-gray-800 hover:bg-gray-700 rounded-lg px-5 py-3 text-xl">→</button>
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

export default Tetris