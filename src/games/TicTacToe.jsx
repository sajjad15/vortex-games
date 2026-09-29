import { useState, useEffect } from 'react'

function checkWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i][0]
    const b = lines[i][1]
    const c = lines[i][2]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function getEmptyIndexes(squares) {
  const empty = []
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) empty.push(i)
  }
  return empty
}

function getComputerMove(squares) {
  const empty = getEmptyIndexes(squares)

  for (let i = 0; i < empty.length; i++) {
    const test = squares.slice()
    test[empty[i]] = 'O'
    if (checkWinner(test) === 'O') return empty[i]
  }

  for (let i = 0; i < empty.length; i++) {
    const test = squares.slice()
    test[empty[i]] = 'X'
    if (checkWinner(test) === 'X') return empty[i]
  }

  if (!squares[4]) return 4

  const corners = [0, 2, 6, 8].filter((i) => !squares[i])
  if (corners.length > 0) return corners[0]

  return empty[0]
}

function TicTacToe() {
  const [mode, setMode] = useState(null)
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)

  const winner = checkWinner(squares)
  const isFull = squares.every((s) => s !== null)

  const handleClick = (index) => {
    if (squares[index]) return
    if (winner) return
    if (mode === 'computer' && !isXNext) return

    const newSquares = squares.slice()
    newSquares[index] = isXNext ? 'X' : 'O'
    setSquares(newSquares)
    setIsXNext(!isXNext)
  }

  useEffect(() => {
    if (mode !== 'computer') return
    if (isXNext) return
    if (winner) return
    if (isFull) return

    const timeout = setTimeout(() => {
      const move = getComputerMove(squares)
      const newSquares = squares.slice()
      newSquares[move] = 'O'
      setSquares(newSquares)
      setIsXNext(true)
    }, 500)

    return () => clearTimeout(timeout)
  }, [squares, isXNext, mode])

  const handleReset = () => {
    setSquares(Array(9).fill(null))
    setIsXNext(true)
  }

  const handleChooseMode = (newMode) => {
    setMode(newMode)
    handleReset()
  }

  const getStatus = () => {
    if (winner) return 'الفائز: ' + winner
    if (isFull) return 'تعادل!'
    if (isXNext) return 'دور اللاعب: X'
    return 'دور اللاعب: O'
  }

  const getCellColor = (value) => {
    if (value === 'X') return 'text-purple-400'
    if (value === 'O') return 'text-cyan-400'
    return 'text-white'
  }

  if (!mode) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg font-semibold text-gray-200">اختر طريقة اللعب</p>
        <button
          onClick={() => handleChooseMode('friend')}
          className="w-64 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-semibold"
        >
          لعب ضد صديق
        </button>
        <button
          onClick={() => handleChooseMode('computer')}
          className="w-64 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full font-semibold"
        >
          لعب ضد الكمبيوتر
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={() => setMode(null)}
        className="text-gray-400 hover:text-white text-sm"
      >
        تغيير طريقة اللعب
      </button>

      <p className="text-xl font-semibold text-gray-200">{getStatus()}</p>

      <div className="grid grid-cols-3 gap-3">
        {squares.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={'w-24 h-24 bg-gray-900 border border-gray-700 rounded-xl text-4xl font-bold flex items-center justify-center hover:bg-gray-800 transition-colors ' + getCellColor(value)}
          >
            {value}
          </button>
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

export default TicTacToe