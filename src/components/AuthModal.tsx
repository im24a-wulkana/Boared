import { useState } from 'react'
import { X } from 'lucide-react'

interface AuthModalProps {
  onSuccess: (user: { id: string; username?: string }) => void
  onClose: () => void
}

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (tab === 'register' && !username) {
      setError('Username is required')
      return
    }

    // Mock auth - in real app, call Supabase
    onSuccess({
      id: '1',
      username: username || email.split('@')[0],
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-darkMahogany rounded-2xl shadow-xl w-full max-w-md mx-4 fadeIn relative border border-goldenTan border-opacity-30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-woodText hover:text-goldenTan text-opacity-50 hover:text-opacity-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex gap-4 mb-8 border-b border-goldenTan border-opacity-30">
            <button
              onClick={() => {
                setTab('login')
                setError('')
              }}
              className={`pb-4 font-semibold transition-colors ${
                tab === 'login'
                  ? 'text-woodText border-b-2 border-warmAmber'
                  : 'text-woodText text-opacity-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setTab('register')
                setError('')
              }}
              className={`pb-4 font-semibold transition-colors ${
                tab === 'register'
                  ? 'text-woodText border-b-2 border-warmAmber'
                  : 'text-woodText text-opacity-50'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-woodText mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-goldenTan bg-mediumDarkWood text-woodText rounded-lg focus:outline-none focus:ring-2 focus:ring-warmAmber focus:border-transparent"
                  placeholder="Choose a username"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-woodText mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-goldenTan bg-mediumDarkWood text-woodText rounded-lg focus:outline-none focus:ring-2 focus:ring-warmAmber focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-woodText mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-goldenTan bg-mediumDarkWood text-woodText rounded-lg focus:outline-none focus:ring-2 focus:ring-warmAmber focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full bg-warmAmber text-nearBlack py-2 rounded-lg font-semibold hover:bg-goldenTan transition-colors mt-6"
            >
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
