import { useState, useEffect, useRef } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE

function getRandomFoodPosition(snake) {
  let position
  let isOnSnake = true

  while (isOnSnake) {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    isOnSnake = snake.some((segment) => segment.x === position.x && segment.y === position.y)
  }

  return position
}

function Snake() {
  const canvasRef = useRef(null)
  const directionRef = useRef({ x: 1, y: 0 })
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 5, y: 5 })
  const [gameStatus, setGameStatus] = useState('playing')
  const [score, setScore] = useState(0)
  
  
const changeDirection = (dx, dy) => {
    const dir = directionRef.current
    if (dx !== 0 && dir.x === 0) {
      directionRef.current = { x: dx, y: 0 }
    }
    if (dy !== 0 && dir.y === 0) {
      directionRef.current = { x: 0, y: dy }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      const dir = directionRef.current
      if (e.key === 'ArrowUp' && dir.y === 0) {
        directionRef.current = { x: 0, y: -1 }
      }
      if (e.key === 'ArrowDown' && dir.y === 0) {
        directionRef.current = { x: 0, y: 1 }
      }
      if (e.key === 'ArrowLeft' && dir.x === 0) {
        directionRef.current = { x: -1, y: 0 }
      }
      if (e.key === 'ArrowRight' && dir.x === 0) {
        directionRef.current = { x: 1, y: 0 }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (gameStatus !== 'playing') return

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const direction = directionRef.current
        const head = prevSnake[0]
        const newHead = { x: head.x + direction.x, y: head.y + direction.y }

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y >= GRID_SIZE) {
          setGameStatus('lost')
          return prevSnake
        }

        const hitSelf = prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        if (hitSelf) {
          setGameStatus('lost')
          return prevSnake
        }

        const newSnake = [newHead].concat(prevSnake)

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prevScore) => prevScore + 1)
          setFood(getRandomFoodPosition(newSnake))
          return newSnake
        }

        newSnake.pop()
        return newSnake
      })
    }, 150)

    return () => {
      clearInterval(interval)
    }
  }, [food, gameStatus])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    ctx.fillStyle = '#22d3ee'
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2)
    })

    ctx.fillStyle = '#f472b6'
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2)
  }, [snake, food])

  const handleReset = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood({ x: 5, y: 5 })
    directionRef.current = { x: 1, y: 0 }
    setScore(0)
    setGameStatus('playing')
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-gray-400">النقاط: {score}</p>

      {gameStatus === 'lost' && (
        <p className="text-xl font-bold text-red-400">انتهت اللعبة!</p>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="bg-gray-950 rounded-2xl border border-gray-800 max-w-full h-auto"
      />

      <p className="text-gray-400 text-sm">استخدم أسهم لوحة المفاتيح للتحكم</p>

      <div className="grid grid-cols-3 gap-2 w-36">
        <div></div>
        <button
          onClick={() => changeDirection(0, -1)}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-xl"
        >
          ↑
        </button>
        <div></div>

        <button
          onClick={() => changeDirection(-1, 0)}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-xl"
        >
          ←
        </button>
        <div></div>
        <button
          onClick={() => changeDirection(1, 0)}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-xl"
        >
          →
        </button>

        <div></div>
        <button
          onClick={() => changeDirection(0, 1)}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-xl"
        >
          ↓
        </button>
        <div></div>
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

export default Snake