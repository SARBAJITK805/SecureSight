import { Shield, Camera, AlertTriangle, Users, Settings } from 'lucide-react'

interface NavbarProps {
  unresolvedCount: number
  showResolved: boolean
  onToggleResolved: () => void
}

export default function Navbar({ unresolvedCount, showResolved, onToggleResolved }: NavbarProps) {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
    
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">SecureSight</span>
          </div>
          
        
          <div className="hidden md:flex items-center space-x-6 ml-8">
            <NavItem icon={<Camera className="w-4 h-4" />} label="Dashboard" active />
            <NavItem icon={<AlertTriangle className="w-4 h-4" />} label="Incidents" />
            <NavItem icon={<Users className="w-4 h-4" />} label="Cameras" />
          </div>
        </div>

    
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{unresolvedCount} Unresolved</span>
          </div>

        
          <button
            onClick={onToggleResolved}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              showResolved
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            {showResolved ? 'Hide Resolved' : 'Show Resolved'}
          </button>

        
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>

        
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">SK</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Sarbajit Kundu</p>
              <p className="text-xs text-gray-400">sarbajit@mandiacx.com</p>
            </div>
          </div>
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
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:text-white hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}