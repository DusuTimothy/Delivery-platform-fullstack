import { useEffect, useState } from 'react'
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, PackagePlus, Package, CreditCard, User, Inbox, History, Users, Bike, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../graphics/Brand'
import UserAvatar from './UserAvatar'

// Layout = the frame around every logged-in page:
// a top navigation bar (changes per role) + the actual page content (<Outlet/>)

// Small icon per menu item so the nav reads at a glance
const icons = {
  Dashboard: LayoutDashboard,
  'New Delivery': PackagePlus,
  'My Deliveries': Package,
  Payments: CreditCard,
  Profile: User,
  'Available Jobs': Inbox,
  History: History,
  Users: Users,
  Riders: Bike,
  Deliveries: Package,
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light',
  )

  // Close the mobile menu whenever the page changes
  useEffect(() => setMenuOpen(false), [location.pathname])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('dp_theme', next)
    } catch {
      // private mode: theme just won't persist
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Navigation menu depends on WHO is logged in
  const links = {
    CUSTOMER: [
      { to: '/customer', label: 'Dashboard' },
      { to: '/customer/new-delivery', label: 'New Delivery' },
      { to: '/customer/deliveries', label: 'My Deliveries' },
      { to: '/customer/payments', label: 'Payments' },
      { to: '/profile', label: 'Profile' },
    ],
    RIDER: [
      { to: '/rider', label: 'Dashboard' },
      { to: '/rider/jobs', label: 'Available Jobs' },
      { to: '/rider/assigned', label: 'My Deliveries' },
      { to: '/rider/history', label: 'History' },
      { to: '/profile', label: 'Profile' },
    ],
    ADMIN: [
      { to: '/admin', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/riders', label: 'Riders' },
      { to: '/admin/deliveries', label: 'Deliveries' },
      { to: '/admin/payments', label: 'Payments' },
      { to: '/profile', label: 'Profile' },
    ],
  }

  const menu = user ? links[user.role] || [] : []

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/">
            <Logo />
          </Link>

          <ul className={`nav-menu${menuOpen ? ' open' : ''}`}>
            {menu.map((item) => {
              const Icon = icons[item.label] || Settings
              return (
                <li key={item.to}>
                  <Link
                    className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
                    to={item.to}
                    aria-current={location.pathname === item.to ? 'page' : undefined}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="navbar-right">
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user && (
              <>
                <span className="user-chip">
                  <UserAvatar user={user} size={32} />
                  <span className="user-name">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="role-chip">{user.role}</span>
                </span>
                <button className="btn btn-ghost btn-sm logout-btn" onClick={handleLogout}>
                  <LogOut size={14} aria-hidden="true" />
                  <span className="logout-label">Logout</span>
                </button>
              </>
            )}

            {/* Hamburger: only visible on small screens (see CSS) */}
            <button
              className="icon-btn nav-toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
