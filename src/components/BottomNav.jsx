import { NavLink } from 'react-router-dom'
import { House, Coins, User } from '@phosphor-icons/react'
import './BottomNav.css'

const navItems = [
  { to: '/',        icon: House,  label: 'Home'    },
  { to: '/assets',  icon: Coins,  label: 'Assets'  },
  { to: '/profile', icon: User,   label: 'Profile' },
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
            <Icon size={22} weight="fill" />
          </div>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
