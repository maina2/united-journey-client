import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  TrophyIcon,
  PhotoIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/matches', label: 'Matches', icon: CalendarDaysIcon },
  { to: '/statistics', label: 'Statistics', icon: ChartBarSquareIcon },
  { to: '/leaderboards', label: 'Leaderboard', icon: TrophyIcon },
  { to: '/cards', label: 'Story Cards', icon: PhotoIcon },
  { to: '/profile', label: 'Profile', icon: UserCircleIcon },
]

export const MyUnitedNav = () => {
  return (
    <nav className="bg-united-white border-b border-united-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-united-red text-white'
                    : 'text-united-gray-600 hover:bg-united-gray-100 hover:text-united-black'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
