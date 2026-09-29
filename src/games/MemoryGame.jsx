import { useState, useEffect } from 'react'

const ICONS = ['🎮', '🎯', '🎲', '🎸', '🚀', '⭐', '🔥', '💎']

function createShuffledCards() {
  const pairs = ICONS.concat(ICONS)
  const cards = pairs.map((icon, index) => ({
    id: index,
    icon: icon,
    isFlipped: false,
    isMatched: false
  }))

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = cards[i]
    cards[i] = cards[j]
    cards[j] = temp
  }

  return cards
}

function MemoryGame() {
  const [cards, setCards] = useState(() => createShuffledCards())
  const [flippedIds, setFlippedIds] = useState([])
  const [moves, setMoves] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  const isWon = cards.every((card) => card.isMatched)

  const handleCardClick = (id) => {
    if (isLocked) return

    const clickedCard = cards.find((c) => c.id === id)
    if (clickedCard.isFlipped) return
    if (clickedCard.isMatched) return
    if (flippedIds.length === 2) return

    const newCards = cards.map((c) => {
      if (c.id === id) {
        return { id: c.id, icon: c.icon, isFlipped: true, isMatched: c.isMatched }
      }
      return c
    })
    setCards(newCards)

    const newFlippedIds = flippedIds.concat([id])
    setFlippedIds(newFlippedIds)

    if (newFlippedIds.length === 2) {
      setMoves(moves + 1)
      setIsLocked(true)

      const firstCard = newCards.find((c) => c.id === newFlippedIds[0])
      const secondCard = newCards.find((c) => c.id === newFlippedIds[1])

      if (firstCard.icon === secondCard.icon) {
        setTimeout(() => {
          const matchedCards = newCards.map((c) => {
            if (c.id === newFlippedIds[0] || c.id === newFlippedIds[1]) {
              return { id: c.id, icon: c.icon, isFlipped: true, isMatched: true }
            }
            return c
          })
          setCards(matchedCards)
          setFlippedIds([])
          setIsLocked(false)
        }, 600)
      } else {
        setTimeout(() => {
          const resetCards = newCards.map((c) => {
            if (c.id === newFlippedIds[0] || c.id === newFlippedIds[1]) {
              return { id: c.id, icon: c.icon, isFlipped: false, isMatched: false }
            }
            return c
          })
          setCards(resetCards)
          setFlippedIds([])
          setIsLocked(false)
        }, 1000)
      }
    }
  }

  const handleReset = () => {
    setCards(createShuffledCards())
    setFlippedIds([])
    setMoves(0)
    setIsLocked(false)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-gray-400 text-sm">اضغط بطاقتين لتطابقهما</p>
      <p className="text-gray-400">عدد المحاولات: {moves}</p>

      {isWon && (
        <p className="text-xl font-bold text-green-400">أحسنت! فزت باللعبة</p>
      )}

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={'w-16 h-16 rounded-xl text-3xl flex items-center justify-center transition-colors ' + (card.isFlipped ? 'bg-purple-700' : 'bg-gray-800 hover:bg-gray-700')}
          >
            {card.isFlipped ? card.icon : ''}
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

export default MemoryGame