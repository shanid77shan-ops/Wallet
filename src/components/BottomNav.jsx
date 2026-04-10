import { NavLink } from 'react-router-dom'
import { House, ChartLine, ArrowsLeftRight, Users, User } from '@phosphor-icons/react'
import './BottomNav.css'

const navItems = [
  { to: '/',         icon: House,          label: 'Wallet'  },
  { to: '/trending', icon: ChartLine,      label: 'Market'  },
  { to: '/trade',    icon: ArrowsLeftRight, label: 'Trade'   },
  { to: '/p2p',      icon: Users,          label: 'P2P'     },
  { to: '/profile',  icon: User,           label: 'Profile' },
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
