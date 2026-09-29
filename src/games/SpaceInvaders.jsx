import { useRef, useEffect, useState } from 'react'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 500
const SHIP_WIDTH = 30
const SHIP_HEIGHT = 15
const ENEMY_SIZE = 25
const ENEMY_ROWS = 3
const ENEMY_COLS = 6
const BULLET_SPEED = 6
const SHIP_SPEED = 5

function createEnemies() {
  const enemies = []
  for (let r = 0; r < ENEMY_ROWS; r++) {
    for (let c = 0; c < ENEMY_COLS; c++) {
      enemies.push({
        x: c * (ENEMY_SIZE + 15) + 30,
        y: r * (ENEMY_SIZE + 15) + 30,
        alive: true
      })
    }
  }
  return enemies
}

function createInitialState() {
  return {
    shipX: CANVAS_WIDTH / 2 - SHIP_WIDTH / 2,
    bullets: [],
    enemies: createEnemies(),
    enemyDirection: 1,
    keysPressed: {}
  }
}

function SpaceInvaders() {
  const canvasRef = useRef(null)
  const stateRef = useRef(createInitialState())
  const [gameStatus, setGameStatus] = useState('waiting')
  const [score, setScore] = useState(0)

  const handleStart = () => {
    if (gameStatus === 'waiting' || gameStatus === 'lost' || gameStatus === 'won') {
      stateRef.current = createInitialState()
      setScore(0)
      setGameStatus('playing')
    }
  }

  const fireBullet = () => {
    const state = stateRef.current
    state.bullets.push({ x: state.shipX + SHIP_WIDTH / 2, y: CANVAS_HEIGHT - 40 })
  }

  const setMoveLeft = (value) => {
    stateRef.current.keysPressed['ArrowLeft'] = value
  }

  const setMoveRight = (value) => {
    stateRef.current.keysPressed['ArrowRight'] = value
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      stateRef.current.keysPressed[e.key] = true
      if (e.key === ' ') {
        fireBullet()
      }
    }
    const handleKeyUp = (e) => {
      stateRef.current.keysPressed[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const draw = () => {
      const state = stateRef.current

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.fillStyle = '#22d3ee'
      ctx.fillRect(state.shipX, CANVAS_HEIGHT - 30, SHIP_WIDTH, SHIP_HEIGHT)

      ctx.fillStyle = '#facc15'
      state.bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 10)
      })

      ctx.fillStyle = '#f472b6'
      state.enemies.forEach((enemy) => {
        if (enemy.alive) {
          ctx.fillRect(enemy.x, enemy.y, ENEMY_SIZE, ENEMY_SIZE)
        }
      })
    }

    const update = () => {
      const state = stateRef.current

      if (gameStatus !== 'playing') return

      if (state.keysPressed['ArrowLeft'] && state.shipX > 0) {
        state.shipX = state.shipX - SHIP_SPEED
      }
      if (state.keysPressed['ArrowRight'] && state.shipX < CANVAS_WIDTH - SHIP_WIDTH) {
        state.shipX = state.shipX + SHIP_SPEED
      }

      state.bullets.forEach((bullet) => {
        bullet.y = bullet.y - BULLET_SPEED
      })
      state.bullets = state.bullets.filter((bullet) => bullet.y > 0)

      let hitWall = false
      state.enemies.forEach((enemy) => {
        if (!enemy.alive) return
        enemy.x = enemy.x + state.enemyDirection
        if (enemy.x <= 0 || enemy.x + ENEMY_SIZE >= CANVAS_WIDTH) {
          hitWall = true
        }
      })

      if (hitWall) {
        state.enemyDirection = -state.enemyDirection
        state.enemies.forEach((enemy) => {
          enemy.y = enemy.y + 15
        })
      }

      state.bullets.forEach((bullet) => {
        state.enemies.forEach((enemy) => {
          if (!enemy.alive) return
          const withinX = bullet.x > enemy.x && bullet.x < enemy.x + ENEMY_SIZE
          const withinY = bullet.y > enemy.y && bullet.y < enemy.y + ENEMY_SIZE
          if (withinX && withinY) {
            enemy.alive = false
            bullet.y = -100
            setScore((prevScore) => prevScore + 10)
          }
        })
      })

      const anyReachedBottom = state.enemies.some((enemy) => enemy.alive && enemy.y + ENEMY_SIZE > CANVAS_HEIGHT - 40)
      if (anyReachedBottom) {
        setGameStatus('lost')
      }

      const allDead = state.enemies.every((enemy) => !enemy.alive)
      if (allDead) {
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
      {gameStatus === 'won' && (
        <p className="text-xl font-bold text-green-400">فزت! اضغط للعب مرة ثانية</p>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleStart}
        className="bg-gray-950 rounded-2xl border border-gray-800 cursor-pointer max-w-full h-auto"
      />

      <p className="text-gray-400 text-sm">الأسهم للحركة، المسافة للإطلاق</p>

      <div className="flex items-center gap-4">
        <button
          onMouseDown={() => setMoveLeft(true)}
          onMouseUp={() => setMoveLeft(false)}
          onTouchStart={() => setMoveLeft(true)}
          onTouchEnd={() => setMoveLeft(false)}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg px-5 py-3 text-xl"
        >
          ←
        </button>
        <button
          onClick={fireBullet}
          className="bg-purple-600 hover:bg-purple-500 rounded-lg px-6 py-3 font-semibold"
        >
          إطلاق
        </button>
        <button
          onMouseDown={() => setMoveRight(true)}
          onMouseUp={() => setMoveRight(false)}
          onTouchStart={() => setMoveRight(true)}
          onTouchEnd={() => setMoveRight(false)}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg px-5 py-3 text-xl"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default SpaceInvaders