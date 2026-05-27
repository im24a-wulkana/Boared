import { useState } from 'react'
import { User, LogOut } from 'lucide-react'
import AuthModal from './AuthModal'

interface User {
  id: string
  username?: string
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleAuthSuccess = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setShowDropdown(false)
  }

  const getInitials = (username?: string) => {
    if (!username) return 'U'
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className="bg-darkMahogany bg-opacity-80 backdrop-blur-md border-b border-goldenTan border-opacity-30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-woodText">BOARED</h1>

          <div className="relative">
            {!isLoggedIn ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-warmAmber hover:bg-goldenTan transition-colors text-nearBlack font-medium"
              >
                <User size={20} />
                Sign In
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-warmAmber text-nearBlack font-semibold hover:shadow-md transition-shadow"
                >
                  {getInitials(user?.username)}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-darkMahogany rounded-lg shadow-lg border border-goldenTan border-opacity-30 fadeIn">
                    <button className="w-full text-left px-4 py-2 hover:bg-mediumDarkWood transition-colors text-woodText font-medium rounded-t-lg">
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-mediumDarkWood transition-colors text-woodText font-medium rounded-b-lg flex items-center gap-2 border-t border-goldenTan border-opacity-30"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {showAuthModal && (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  )
}
