import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Layout = () => {
  const { user, logout } = useAuth()

  const navLinkClass = ({ isActive }) => 
    `px-3 py-2 rounded-md ${isActive ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-primary-600 hover:text-white'}`

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Saylo.hire</h1>
            </div>
            
            <nav className="hidden md:flex space-x-4 items-center">
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/interview/setup" className={navLinkClass}>New Interview</NavLink>
              <NavLink to="/history" className={navLinkClass}>History</NavLink>
              <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
              <button 
                onClick={logout} 
                className="ml-4 px-3 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white"
              >
                Logout
              </button>
            </nav>
            
            {/* Mobile menu button - would need additional logic for mobile menu */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Saylo.hire - AI-Powered Mock Interviews
        </div>
      </footer>
    </div>
  )
}

export default Layout 