import { useRef, useEffect, useState } from 'react'

const CANVAS_WIDTH = 300
const CANVAS_HEIGHT = 450
const BLOCK_HEIGHT = 25
const INITIAL_WIDTH = 100
const MOVE_SPEED = 3

function createInitialState() {
  return {
    blocks: [
      { x: (CANVAS_WIDTH - INITIAL_WIDTH) / 2, width: INITIAL_WIDTH, color: '#a855f7' }
    ],
    currentX: 0,
    currentWidth: INITIAL_WIDTH,
    direction: 1,
    cameraOffset: 0
  }
}

const COLORS = ['#a855f7', '#22d3ee', '#f472b6', '#facc15', '#4ade80']

function TowerBuilder() {
  const canvasRef = useRef(null)
  const stateRef = useRef(createInitialState())
  const [gameStatus, setGameStatus] = useState('waiting')
  const [score, setScore] = useState(0)

  const handleDrop = () => {
    const state = stateRef.current

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

    const lastBlock = state.blocks[state.blocks.length - 1]
    const currentLeft = state.currentX
    const currentRight = state.currentX + state.currentWidth
    const lastLeft = lastBlock.x
    const lastRight = lastBlock.x + lastBlock.width

    const overlapLeft = Math.max(currentLeft, lastLeft)
    const overlapRight = Math.min(currentRight, lastRight)
    const overlapWidth = overlapRight - overlapLeft

    if (overlapWidth <= 0) {
      setGameStatus('lost')
      return
    }

    const newColor = COLORS[state.blocks.length % COLORS.length]
    state.blocks.push({ x: overlapLeft, width: overlapWidth, color: newColor })
    state.currentWidth = overlapWidth
    state.cameraOffset = state.cameraOffset + BLOCK_HEIGHT

    setScore(state.blocks.length - 1)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const draw = () => {
      const state = stateRef.current

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      state.blocks.forEach((block, index) => {
        const y = CANVAS_HEIGHT - (index + 1) * BLOCK_HEIGHT + state.cameraOffset
        ctx.fillStyle = block.color
        ctx.fillRect(block.x, y, block.width, BLOCK_HEIGHT - 2)
      })

      if (gameStatus === 'playing') {
        const y = CANVAS_HEIGHT - (state.blocks.length + 1) * BLOCK_HEIGHT + state.cameraOffset
        ctx.fillStyle = COLORS[state.blocks.length % COLORS.length]
        ctx.fillRect(state.currentX, y, state.currentWidth, BLOCK_HEIGHT - 2)
      }
    }

    const update = () => {
      const state = stateRef.current

      if (gameStatus !== 'playing') return

      state.currentX = state.currentX + MOVE_SPEED * state.direction

      if (state.currentX + state.currentWidth > CANVAS_WIDTH) {
        state.direction = -1
      }
      if (state.currentX < 0) {
        state.direction = 1
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
      <p className="text-gray-400">الطوابق: {score}</p>

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
        onClick={handleDrop}
        className="bg-gray-950 rounded-2xl border border-gray-800 cursor-pointer max-w-full h-auto"
      />

      <p className="text-gray-400 text-sm">اضغط لإسقاط الكتلة</p>
    </div>
  )
}

export default TowerBuilder