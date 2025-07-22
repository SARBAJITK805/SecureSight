import { Check, X, AlertTriangle, Eye, Shield, Zap } from 'lucide-react'
import { Incident } from '../page'

interface IncidentListProps {
  incidents: Incident[]
  selectedIncident: Incident | null
  onIncidentSelect: (incident: Incident) => void
  onResolveIncident: (id: number) => void
  showResolved: boolean
  loading: boolean
}

export default function IncidentList({ 
  incidents, 
  selectedIncident, 
  onIncidentSelect, 
  onResolveIncident,
  showResolved,
  loading 
}: IncidentListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'GUN_THREAT': return <Shield className="w-4 h-4" />
      case 'UNAUTHORIZED_ACCESS': return <AlertTriangle className="w-4 h-4" />
      case 'FACE_RECOGNIZED': return <Eye className="w-4 h-4" />
      case 'SUSPICIOUS_BEHAVIOR': return <Zap className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GUN_THREAT': return 'text-red-400 bg-red-900/20'
      case 'UNAUTHORIZED_ACCESS': return 'text-orange-400 bg-orange-900/20'
      case 'FACE_RECOGNIZED': return 'text-blue-400 bg-blue-900/20'
      case 'SUSPICIOUS_BEHAVIOR': return 'text-yellow-400 bg-yellow-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading incidents...</p>
        </div>
      </div>
    )
  }

  const unresolvedCount = incidents.filter(i => !i.resolved).length
  const resolvedCount = incidents.filter(i => i.resolved).length

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {showResolved ? 'All Incidents' : 'Active Incidents'}
          </h2>
          <div className="text-sm text-gray-400">
            {showResolved ? `${incidents.length} total` : `${unresolvedCount} active`}
          </div>
        </div>
        
        {!showResolved && unresolvedCount > 0 && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium">{unresolvedCount} Unresolved Incidents</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {incidents.length === 0 ? (
          <div className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">
              {showResolved ? 'No incidents found' : 'No unresolved incidents'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                selected={selectedIncident?.id === incident.id}
                onSelect={() => onIncidentSelect(incident)}
                onResolve={() => onResolveIncident(incident.id)}
                getTypeIcon={getTypeIcon}
                getTypeColor={getTypeColor}
                getTypeLabel={getTypeLabel}
                formatTime={formatTime}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface IncidentCardProps {
  incident: Incident
  selected: boolean
  onSelect: () => void
  onResolve: () => void
  getTypeIcon: (type: string) => React.ReactNode
  getTypeColor: (type: string) => string
  getTypeLabel: (type: string) => string
  formatTime: (dateString: string) => string
  formatDate: (dateString: string) => string
}

function IncidentCard({
  incident,
  selected,
  onSelect,
  onResolve,
  getTypeIcon,
  getTypeColor,
  getTypeLabel,
  formatTime,
  formatDate
}: IncidentCardProps) {
  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
        selected
          ? 'border-blue-500 bg-blue-900/20'
          : incident.resolved
          ? 'border-gray-600 bg-gray-800/50 opacity-60'
          : 'border-gray-600 bg-gray-800 hover:bg-gray-750'
      }`}
      onClick={onSelect}
    >
      <div className="flex space-x-3">
        
        <div className="relative flex-shrink-0">
          <img
            src={incident.thumbnailUrl}
            alt={`${incident.type} incident`}
            className="w-16 h-12 object-cover rounded bg-gray-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/api/placeholder/64/48'
            }}
          />
          {incident.resolved && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
              <Check className="w-4 h-4 text-green-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(incident.type)}`}>
              {getTypeIcon(incident.type)}
              <span>{getTypeLabel(incident.type)}</span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onResolve()
              }}
              className={`p-1 rounded transition-colors ${
                incident.resolved
                  ? 'text-green-400 hover:text-green-300'
                  : 'text-gray-400 hover:text-white'
              }`}
              title={incident.resolved ? 'Mark as unresolved' : 'Mark as resolved'}
            >
              {incident.resolved ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-sm font-medium text-gray-200 mb-1">
            {incident.camera.name}
          </p>
          <p className="text-xs text-gray-400 mb-2">
            {incident.camera.location}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(incident.tsStart)}</span>
            <span>
              {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}