import { useState, useRef, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { IconBolt, IconCircle, IconGrid, IconCards, IconBrick, IconSnake, IconWing, IconFootprint, IconBlocks, IconTower, IconAlien } from './Icons'
import GameWorld from './GameWorld'
import AccountPage from './AccountPage'
import AboutPage from './AboutPage'
import { IconUser } from './Icons'
import TicTacToe from './games/TicTacToe'
import Game2048 from './games/Game2048'
import MemoryGame from './games/MemoryGame'
import BrickBreaker from './games/BrickBreaker'
import Snake from './games/Snake'
import FlappyBird from './games/FlappyBird'
import DinoRunner from './games/DinoRunner'
import Tetris from './games/Tetris'
import TowerBuilder from './games/TowerBuilder'
import SpaceInvaders from './games/SpaceInvaders'

function ReactionGame(props) {
  const [status, setStatus] = useState('idle')
  const [reactionTime, setReactionTime] = useState(null)
  const startTimeRef = useRef(null)
  const timeoutRef = useRef(null)

  const startGame = () => {
    setStatus('waiting')
    const delay = Math.random() * 3000 + 1500
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now()
      setStatus('ready')
    }, delay)
  }

  const canRestart = (s) => {
    if (s === 'idle') return true
    if (s === 'result') return true
    if (s === 'tooSoon') return true
    return false
  }

  const handleClick = () => {
    if (status === 'waiting') {
      clearTimeout(timeoutRef.current)
      setStatus('tooSoon')
      return
    }
    if (status === 'ready') {
      const time = Date.now() - startTimeRef.current
      setReactionTime(time)
      setStatus('result')
      return
    }
    if (canRestart(status)) {
      startGame()
    }
  }


  const getBoxStyle = () => {
    if (status === 'waiting') return 'bg-red-600'
    if (status === 'ready') return 'bg-green-500'
    if (status === 'tooSoon') return 'bg-orange-500'
    return 'bg-purple-600'
  }

  const getMessage = () => {
    if (status === 'idle') return 'اضغط للبدء'
    if (status === 'waiting') return 'انتظر... اللون الأخضر'
    if (status === 'ready') return 'اضغط الآن'
    if (status === 'tooSoon') return 'بدري! جرب مرة ثانية'
    if (status === 'result') return 'زمن رد فعلك: ' + reactionTime
    return ''
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        onClick={handleClick}
        className={'w-full max-w-md h-64 rounded-3xl flex items-center justify-center cursor-pointer transition-colors duration-200 ' + getBoxStyle()}
      >
        <p className="text-2xl font-bold text-white text-center px-6">
          {getMessage()}
        </p>
      </div>

    </div>
  )
}


function AuthBox(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async () => {
    const result = await supabase.auth.signUp({ email: email, password: password })
    if (result.error) {
      setMessage('خطأ: ' + result.error.message)
    } else {
      setMessage('تم إنشاء الحساب! تحقق من إيميلك للتأكيد')
    }
  }

  const handleSignIn = async () => {
    const result = await supabase.auth.signInWithPassword({ email: email, password: password })
    if (result.error) {
      setMessage('خطأ: ' + result.error.message)
    } else {
      props.onLogin(result.data.user)
    }
  }

  return (
    <div className="w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-800 p-6">
      <button
        onClick={props.onBack}
        className="text-gray-400 text-sm mb-4 hover:text-white"
      >
        رجوع
      </button>
      <h2 className="text-lg font-bold text-center mb-4 text-purple-400">
        تسجيل الدخول
      </h2>
      <input
        type="email"
        placeholder="الإيميل"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-2 rounded-lg bg-gray-800 text-white outline-none border border-gray-700"
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSignIn}
          className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold"
        >
          دخول
        </button>
        <button
          onClick={handleSignUp}
          className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
        >
          حساب جديد
        </button>
      </div>
      {message && (
        <p className="text-sm text-center mt-3 text-gray-300">{message}</p>
      )}
    </div>
  )
}

function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedGame, setSelectedGame] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      const session = result.data.session
      if (session) {
        setUser(session.user)
      }
      setIsLoading(false)
    })
  }, [])

useEffect(() => {
    if (!user) return
    supabase
      .from('leaderboard')
      .select('score')
      .eq('user_id', user.id)
      .eq('game', 'reaction')
      .order('score', { ascending: true })
      .limit(1)
      .then((result) => {
        if (result.data && result.data.length > 0) {
          setBestScore(result.data[0].score)
        }
      })
  }, [user, refreshKey])


const goStart = () => {
    if (user) {
      setPage('game')
    } else {
      setPage('login')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSelectedGame(null)
    setPage('landing')
  }

  const handleScoreSaved = () => {
    setRefreshKey(refreshKey + 1)
  }

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    setPage('game')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-2xl font-bold text-purple-400 animate-pulse">VORTEX</p>
      </div>
    )
  }

  if (page === 'landing') {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <div className="glow-pulse absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="glow-pulse absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={() => setPage('about')}
          className="absolute top-6 right-6 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold z-20 transition-colors"
        >
          من نحن
        </button>

        {user ? (
          <button
            onClick={() => setPage('account')}
            className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full z-20 transition-colors"
          >
            <IconUser color="#a855f7" />
          </button>
        ) : (
          <button
            onClick={() => setPage('login')}
            className="absolute top-6 left-6 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold z-20 transition-colors"
          >
            تسجيل الدخول
          </button>
        )}

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
          <span className="fade-up text-sm tracking-[0.3em] text-gray-400 uppercase mb-4">
            WELCOME TO THE ARENA
          </span>

          <h1 className="fade-up delay-1 text-6xl md:text-8xl font-bold text-center mb-6 bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
            VORTEX
          </h1>

          <p className="fade-up delay-2 text-gray-400 text-lg text-center max-w-xl mb-10">
           ألعاب كلاسيكية بروح جديدة
          </p>

          <button
            onClick={goStart}
            className="fade-up delay-3 px-10 py-4 bg-white text-black font-semibold rounded-full hover:bg-purple-400 hover:text-white transition-all duration-300"
          >
           الالعاب
          </button>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600">
            © 2026 VORTEX
          </p>
        </div>
      </div>
    )
  }

  if (page === 'about') {
    return <AboutPage onBack={() => setPage('landing')} />
  }

  if (page === 'account') {
    return (
      <AccountPage
        user={user}
        onBack={() => setPage('landing')}
        onLogout={handleLogout}
      />
    )
  }

  if (page === 'login') {
    return (
      <div className="page-enter min-h-screen bg-black text-white flex items-center justify-center px-6">
        <AuthBox onLogin={handleLogin} onBack={() => setPage('landing')} />
      </div>
    )
  }

  return (
    <div className="page-enter min-h-screen text-white flex flex-col items-center px-6 py-10">
      <button
        onClick={() => setPage('landing')}
        className="self-start mb-6 text-gray-400 hover:text-white transition-colors"
      >
        ← الرئيسية
      </button>
      <span className="text-sm tracking-[0.3em] text-gray-400 uppercase mb-4">
        CHOOSE YOUR GAME
      </span>

      <h1 className="text-5xl font-bold text-center mb-10 pb-2 leading-normal bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
       اختر لعبتك 
      </h1>

      <GameWorld />

      <div className="flex items-center gap-4 mb-10">
        <p className="text-gray-400">مرحباً {user.email}</p>
        <button
          onClick={handleLogout}
          className="px-4 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>

      {!selectedGame && (
        <div className="page-enter grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <button
            onClick={() => setSelectedGame('reaction')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-purple-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconBolt color="#a855f7" />
            </div>
            <p className="text-xl font-bold">اختبار السرعة</p>
          </button>

          <button
            onClick={() => setSelectedGame('tictactoe')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconCircle color="#22d3ee" />
            </div>
            <p className="text-xl font-bold">إكس أو</p>
          </button>

          <button
            onClick={() => setSelectedGame('2048')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-pink-500 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconGrid color="#f472b6" />
            </div>
            <p className="text-xl font-bold">2048</p>
          </button>

          <button
            onClick={() => setSelectedGame('memory')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-yellow-500 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconCards color="#eab308" />
            </div>
            <p className="text-xl font-bold">الذاكرة</p>
          </button>

          <button
            onClick={() => setSelectedGame('brickbreaker')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-orange-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconBrick color="#f97316" />
            </div>
            <p className="text-xl font-bold">تكسير الطوب</p>
          </button>

          <button
            onClick={() => setSelectedGame('snake')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-green-500 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconSnake color="#22c55e" />
            </div>
            <p className="text-xl font-bold">الثعبان</p>
          </button>

          <button
            onClick={() => setSelectedGame('flappybird')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconWing color="#3b82f6" />
            </div>
            <p className="text-xl font-bold">الطائر القافز</p>
          </button>

          <button
            onClick={() => setSelectedGame('dino')}
           className="glass-card group border rounded-2xl p-8 text-center hover:border-teal-500 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconFootprint color="#14b8a6" />
            </div>
            <p className="text-xl font-bold">الديناصور</p>
          </button>

          <button
            onClick={() => setSelectedGame('tetris')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-indigo-500 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconBlocks color="#6366f1" />
            </div>
            <p className="text-xl font-bold">تتريس</p>
          </button>

          <button
            onClick={() => setSelectedGame('tower')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-amber-500 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconTower color="#f59e0b" />
            </div>
            <p className="text-xl font-bold">بناء البرج</p>
          </button>

          <button
            onClick={() => setSelectedGame('spaceinvaders')}
            className="glass-card group border rounded-2xl p-8 text-center hover:border-red-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
          >
            <div className="flex justify-center mb-4 group-hover:scale-125 transition-transform duration-300">
              <IconAlien color="#ef4444" />
            </div>
            <p className="text-xl font-bold">غزاة الفضاء</p>
          </button>

        </div>
      )}

      {selectedGame && (
        <div className="page-enter w-full max-w-2xl">
          <button
            onClick={() => setSelectedGame(null)}
            className="mb-8 text-gray-400 hover:text-white"
          >
            رجوع للألعاب
          </button>

          {selectedGame === 'reaction' && (
            <div className="flex flex-col items-center">
              <ReactionGame onScoreSaved={handleScoreSaved} userId={user.id} />
            </div>
          )}

          {selectedGame === 'tictactoe' && (
            <div className="flex flex-col items-center">
              <TicTacToe />
            </div>
          )}

          {selectedGame === '2048' && (
            <div className="flex flex-col items-center">
              <Game2048 />
            </div>
          )}

          {selectedGame === 'memory' && (
            <div className="flex flex-col items-center">
              <MemoryGame />
            </div>
          )}

          {selectedGame === 'brickbreaker' && (
            <div className="flex flex-col items-center">
              <BrickBreaker />
            </div>
          )}

          {selectedGame === 'snake' && (
            <div className="flex flex-col items-center">
              <Snake userId={user.id} playerName={user.email.split('@')[0]} onScoreSaved={handleScoreSaved} />
            </div>
          )}

          {selectedGame === 'flappybird' && (
            <div className="flex flex-col items-center">
              <FlappyBird />
            </div>
          )}

          {selectedGame === 'dino' && (
            <div className="flex flex-col items-center">
              <DinoRunner />
            </div>
          )}

          {selectedGame === 'tetris' && (
            <div className="flex flex-col items-center">
              <Tetris />
            </div>
          )}

          {selectedGame === 'tower' && (
            <div className="flex flex-col items-center">
              <TowerBuilder />
            </div>
          )}

          {selectedGame === 'spaceinvaders' && (
            <div className="flex flex-col items-center">
              <SpaceInvaders />
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-600 mt-16 mb-4">© 2026 VORTEX</p>
    </div>
  )
}

export default App