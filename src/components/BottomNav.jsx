import { NavLink } from 'react-router-dom'
import { Home, TrendingUp, ArrowLeftRight, User } from 'lucide-react'
import './BottomNav.css'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/trending', icon: TrendingUp, label: 'Trending' },
  { to: '/trade', icon: ArrowLeftRight, label: 'Trade' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <div className="nav-icon-wrap">
            <Icon size={22} strokeWidth={1.8} />
          </div>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
