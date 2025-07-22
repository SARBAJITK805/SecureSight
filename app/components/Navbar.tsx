import { Shield, Camera, Film, AlertTriangle, Users } from 'lucide-react'
import { Incident } from '../page'

interface NavbarProps {
  incidents: Incident[]
}

export default function Navbar({ incidents }: NavbarProps) {
  return (
    <nav className="bg-[#161B22] border-b border-gray-700 px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4 md:space-x-8">
        <span className="text-2xl font-bold text-white tracking-wider">MANDIACX</span>
        <div className="hidden md:flex items-center space-x-2">
          <NavItem icon={<Shield className="w-4 h-4" />} label="Dashboard" active />
          <NavItem icon={<Camera className="w-4 h-4" />} label="Cameras" />
          <NavItem icon={<Film className="w-4 h-4" />} label="Scenes" />
          <NavItem icon={<AlertTriangle className="w-4 h-4" />} label="Incidents" />
          <NavItem icon={<Users className="w-4 h-4" />} label="Users" />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center ring-2 ring-gray-600">
          <span className="text-sm font-medium">SK</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-white">Sarbajit Kundu</p>
          <p className="text-xs text-gray-400">sarbajit@mandiacx.com</p>
        </div>
      </div>
    </nav>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <button
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
        active
          ? 'bg-green-500/10 text-green-400'
          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
