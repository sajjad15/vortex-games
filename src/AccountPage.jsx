import { useState } from 'react'
import { supabase } from './supabaseClient'
import GameWorld from './GameWorld'

function AccountPage(props) {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setMessage('كلمة المرور لازم تكون 6 أحرف على الأقل')
      return
    }
    const result = await supabase.auth.updateUser({ password: newPassword })
    if (result.error) {
      setMessage('خطأ: ' + result.error.message)
    } else {
      setMessage('تم تغيير كلمة المرور')
      setNewPassword('')
    }
  }

  const joinDate = new Date(props.user.created_at).toLocaleDateString('ar')

  return (
    <div className="page-enter min-h-screen text-white flex flex-col items-center px-6 py-10">
      <GameWorld />

      <div className="w-full max-w-md">
        <button
          onClick={props.onBack}
          className="mb-8 text-gray-400 hover:text-white"
        >
          رجوع
        </button>

        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
          حسابي
        </h1>

        <div className="glass-card border rounded-2xl p-6 mb-6">
          <p className="text-gray-400 text-sm mb-1">الإيميل</p>
          <p className="mb-4">{props.user.email}</p>
          <p className="text-gray-400 text-sm mb-1">تاريخ الانضمام</p>
          <p>{joinDate}</p>
        </div>


        <div className="glass-card border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 text-purple-400">تغيير كلمة المرور</h2>
          <input
            type="password"
            placeholder="كلمة المرور الجديدة"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700"
          />
          <button
            onClick={handleChangePassword}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold"
          >
            حفظ
          </button>
          {message && (
            <p className="text-sm text-center mt-3 text-gray-300">{message}</p>
          )}
        </div>

        <button
          onClick={props.onLogout}
          className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}

export default AccountPage