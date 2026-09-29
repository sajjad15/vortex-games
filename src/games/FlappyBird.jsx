import { useRef, useEffect, useState } from 'react'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 500
const BIRD_SIZE = 20
const GRAVITY = 0.5
const JUMP_STRENGTH = -8
const PIPE_WIDTH = 60
const PIPE_GAP = 150
const PIPE_SPEED = 2

function createInitialState() {
  return {
    birdY: CANVAS_HEIGHT / 2,
    birdVelocity: 0,
    pipes: [
      { x: CANVAS_WIDTH, gapY: 200, passed: false }
    ]
  }
}

function FlappyBird() {
  const canvasRef = useRef(null)
  const stateRef = useRef(createInitialState())
  const [gameStatus, setGameStatus] = useState('waiting')
  const [score, setScore] = useState(0)

  const handleJump = () => {
    if (gameStatus === 'waiting') {
      setGameStatus('playing')
    }
    if (gameStatus === 'lost') {
      stateRef.current = createInitialState()
      setScore(0)
      setGameStatus('playing')
      return
    }
    stateRef.current.birdVelocity = JUMP_STRENGTH
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const draw = () => {
      const state = stateRef.current

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.fillStyle = '#22d3ee'
      state.pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY)
        ctx.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - pipe.gapY - PIPE_GAP)
      })

      ctx.fillStyle = '#f472b6'
      ctx.beginPath()
      ctx.arc(80, state.birdY, BIRD_SIZE / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.closePath()
    }

    const update = () => {
      const state = stateRef.current

      if (gameStatus !== 'playing') return

      state.birdVelocity = state.birdVelocity + GRAVITY
      state.birdY = state.birdY + state.birdVelocity

      if (state.birdY - BIRD_SIZE / 2 < 0) {
        setGameStatus('lost')
      }
      if (state.birdY + BIRD_SIZE / 2 > CANVAS_HEIGHT) {
        setGameStatus('lost')
      }

      state.pipes.forEach((pipe) => {
        pipe.x = pipe.x - PIPE_SPEED
      })

      const lastPipe = state.pipes[state.pipes.length - 1]
      if (lastPipe.x < CANVAS_WIDTH - 220) {
        state.pipes.push({
          x: CANVAS_WIDTH,
          gapY: 80 + Math.random() * (CANVAS_HEIGHT - 260),
          passed: false
        })
      }

      state.pipes = state.pipes.filter((pipe) => pipe.x > -PIPE_WIDTH)

      state.pipes.forEach((pipe) => {
        const birdLeft = 80 - BIRD_SIZE / 2
        const birdRight = 80 + BIRD_SIZE / 2
        const birdTop = state.birdY - BIRD_SIZE / 2
        const birdBottom = state.birdY + BIRD_SIZE / 2

        const withinPipeX = birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH
        const hitTopPipe = birdTop < pipe.gapY
        const hitBottomPipe = birdBottom > pipe.gapY + PIPE_GAP

        if (withinPipeX && (hitTopPipe || hitBottomPipe)) {
          setGameStatus('lost')
        }

        if (!pipe.passed && pipe.x + PIPE_WIDTH < 80) {
          pipe.passed = true
          setScore((prevScore) => prevScore + 1)
        }
      })
    }

    const loop = () => {
      update()
      draw()
      animationId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [gameStatus])

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-gray-400">النقاط: {score}</p>

      {gameStatus === 'waiting' && (
        <p className="text-lg font-semibold text-cyan-400">اضغط للبدء</p>
      )}
      {gameStatus === 'lost' && (
        <p className="text-xl font-bold text-red-400">انتهت اللعبة! اضغط للمحاولة مرة ثانية</p>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleJump}
        className="bg-gray-950 rounded-2xl border border-gray-800 cursor-pointer max-w-full h-auto"
      />

      <p className="text-gray-400 text-sm">اضغط على المربع للقفز</p>
    </div>
  )
}

export default FlappyBird