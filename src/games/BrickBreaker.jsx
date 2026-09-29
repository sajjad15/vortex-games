import { useRef, useEffect, useState } from 'react'

const CANVAS_WIDTH = 480
const CANVAS_HEIGHT = 400
const PADDLE_WIDTH = 80
const PADDLE_HEIGHT = 12
const BALL_RADIUS = 6
const BRICK_ROWS = 4
const BRICK_COLS = 7
const BRICK_WIDTH = 60
const BRICK_HEIGHT = 18
const BRICK_GAP = 4
const BRICK_TOP = 40

function createBricks() {
  const bricks = []
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: c * (BRICK_WIDTH + BRICK_GAP) + 10,
        y: r * (BRICK_HEIGHT + BRICK_GAP) + BRICK_TOP,
        alive: true
      })
    }
  }
  return bricks
}

function createInitialState() {
  return {
    paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT - 30,
    ballDX: 3,
    ballDY: -3,
    bricks: createBricks()
  }
}

function BrickBreaker() {
  const canvasRef = useRef(null)
  const stateRef = useRef(createInitialState())
  const [gameStatus, setGameStatus] = useState('playing')
  const [, forceRender] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      let newX = mouseX - PADDLE_WIDTH / 2
      if (newX < 0) newX = 0
      if (newX > CANVAS_WIDTH - PADDLE_WIDTH) newX = CANVAS_WIDTH - PADDLE_WIDTH
      stateRef.current.paddleX = newX
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    const draw = () => {
      const state = stateRef.current

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.fillStyle = '#a855f7'
      state.bricks.forEach((brick) => {
        if (brick.alive) {
          ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT)
        }
      })

      ctx.fillStyle = '#22d3ee'
      ctx.fillRect(state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT)

      ctx.beginPath()
      ctx.arc(state.ballX, state.ballY, BALL_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = '#f472b6'
      ctx.fill()
      ctx.closePath()
    }

    const update = () => {
      const state = stateRef.current

      if (gameStatus !== 'playing') return

      state.ballX = state.ballX + state.ballDX
      state.ballY = state.ballY + state.ballDY

      if (state.ballX + BALL_RADIUS > CANVAS_WIDTH) state.ballDX = -state.ballDX
      if (state.ballX - BALL_RADIUS < 0) state.ballDX = -state.ballDX
      if (state.ballY - BALL_RADIUS < 0) state.ballDY = -state.ballDY

      if (state.ballY + BALL_RADIUS > CANVAS_HEIGHT - PADDLE_HEIGHT - 10) {
        if (state.ballX > state.paddleX && state.ballX < state.paddleX + PADDLE_WIDTH) {
          state.ballDY = -state.ballDY
        }
      }

      if (state.ballY + BALL_RADIUS > CANVAS_HEIGHT) {
        setGameStatus('lost')
      }

      state.bricks.forEach((brick) => {
        if (brick.alive) {
          const withinX = state.ballX > brick.x && state.ballX < brick.x + BRICK_WIDTH
          const withinY = state.ballY > brick.y && state.ballY < brick.y + BRICK_HEIGHT
          if (withinX && withinY) {
            brick.alive = false
            state.ballDY = -state.ballDY
          }
        }
      })

      const anyAlive = state.bricks.some((b) => b.alive)
      if (!anyAlive) {
        setGameStatus('won')
      }
    }

    const loop = () => {
      update()
      draw()
      animationId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [gameStatus])

  const handleReset = () => {
    stateRef.current = createInitialState()
    setGameStatus('playing')
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {gameStatus === 'won' && (
        <p className="text-xl font-bold text-green-400">فزت! كسرت كل الطوب</p>
      )}
      {gameStatus === 'lost' && (
        <p className="text-xl font-bold text-red-400">خسرت! حاول مرة ثانية</p>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-gray-950 rounded-2xl border border-gray-800 max-w-full h-auto"
      />

      <p className="text-gray-400 text-sm">حرك الماوس فوق المربع للتحكم بالمضرب</p>

      <button
        onClick={handleReset}
        className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-semibold"
      >
        لعبة جديدة
      </button>
    </div>
  )
}

export default BrickBreaker