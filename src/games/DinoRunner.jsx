import { useRef, useEffect, useState } from 'react'

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 200
const GROUND_Y = 160
const DINO_SIZE = 30
const GRAVITY = 0.6
const JUMP_STRENGTH = -11
const OBSTACLE_WIDTH = 15
const OBSTACLE_HEIGHT = 30

function createInitialState() {
  return {
    dinoY: GROUND_Y - DINO_SIZE,
    dinoVelocity: 0,
    isJumping: false,
    obstacles: [{ x: CANVAS_WIDTH }],
    speed: 4
  }
}

function DinoRunner() {
  const canvasRef = useRef(null)
  const stateRef = useRef(createInitialState())
  const [gameStatus, setGameStatus] = useState('waiting')
  const [score, setScore] = useState(0)

  const handleJump = () => {
    if (gameStatus === 'waiting') {
      setGameStatus('playing')
      return
    }
    if (gameStatus === 'lost') {
      stateRef.current = createInitialState()
      setScore(0)
      setGameStatus('playing')
      return
    }
    if (!stateRef.current.isJumping) {
      stateRef.current.dinoVelocity = JUMP_STRENGTH
      stateRef.current.isJumping = true
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        handleJump()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const draw = () => {
      const state = stateRef.current

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.strokeStyle = '#374151'
      ctx.beginPath()
      ctx.moveTo(0, GROUND_Y)
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y)
      ctx.stroke()

      ctx.fillStyle = '#22d3ee'
      ctx.fillRect(60, state.dinoY, DINO_SIZE, DINO_SIZE)

      ctx.fillStyle = '#f472b6'
      state.obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, GROUND_Y - OBSTACLE_HEIGHT, OBSTACLE_WIDTH, OBSTACLE_HEIGHT)
      })
    }

    const update = () => {
      const state = stateRef.current

      if (gameStatus !== 'playing') return

      state.dinoVelocity = state.dinoVelocity + GRAVITY
      state.dinoY = state.dinoY + state.dinoVelocity

      if (state.dinoY > GROUND_Y - DINO_SIZE) {
        state.dinoY = GROUND_Y - DINO_SIZE
        state.isJumping = false
      }

      state.obstacles.forEach((obstacle) => {
        obstacle.x = obstacle.x - state.speed
      })

      const lastObstacle = state.obstacles[state.obstacles.length - 1]
      if (lastObstacle.x < CANVAS_WIDTH - 200 - Math.random() * 150) {
        state.obstacles.push({ x: CANVAS_WIDTH })
      }

      state.obstacles = state.obstacles.filter((obstacle) => obstacle.x > -OBSTACLE_WIDTH)

      state.obstacles.forEach((obstacle) => {
        const dinoLeft = 60
        const dinoRight = 60 + DINO_SIZE
        const dinoTop = state.dinoY
        const dinoBottom = state.dinoY + DINO_SIZE

        const obstacleLeft = obstacle.x
        const obstacleRight = obstacle.x + OBSTACLE_WIDTH
        const obstacleTop = GROUND_Y - OBSTACLE_HEIGHT
        const obstacleBottom = GROUND_Y

        const overlapX = dinoRight > obstacleLeft && dinoLeft < obstacleRight
        const overlapY = dinoBottom > obstacleTop && dinoTop < obstacleBottom

        if (overlapX && overlapY) {
          setGameStatus('lost')
        }
      })

      state.speed = state.speed + 0.002
      setScore((prevScore) => prevScore + 1)
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
      <p className="text-gray-400">النقاط: {Math.floor(score / 10)}</p>

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

      <p className="text-gray-400 text-sm">اضغط على المربع أو المسافة للقفز</p>
    </div>
  )
}

export default DinoRunner