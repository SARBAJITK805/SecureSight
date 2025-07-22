import { useState } from 'react'
import { Play, Pause, Volume2, Maximize2, Camera } from 'lucide-react'
import { Incident } from '../page'

interface IncidentPlayerProps {
  incident: Incident | null
  allIncidents: Incident[]
  onIncidentSelect: (incident: Incident) => void
}

export default function IncidentPlayer({ incident, allIncidents, onIncidentSelect }: IncidentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)

  if (!incident) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg">
        <div className="text-center">
          <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No incident selected</p>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GUN_THREAT': return 'bg-red-600'
      case 'UNAUTHORIZED_ACCESS': return 'bg-orange-600'
      case 'FACE_RECOGNIZED': return 'bg-blue-600'
      case 'SUSPICIOUS_BEHAVIOR': return 'bg-yellow-600'
      default: return 'bg-gray-600'
    }
  }

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  
  const otherCameras = allIncidents
    .filter(i => i.cameraId !== incident.cameraId)
    .slice(0, 2)

  return (
    <div className="h-full flex flex-col">
      
      <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
        
        <div className="absolute top-4 left-4 z-10">
          <span className={`${getTypeColor(incident.type)} px-3 py-1 rounded-full text-sm font-medium text-white`}>
            {getTypeLabel(incident.type)}
          </span>
        </div>

        
        <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 px-3 py-1 rounded">
          <p className="text-sm font-medium">{incident.camera.name}</p>
          <p className="text-xs text-gray-300">{incident.camera.location}</p>
        </div>

        
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={incident.thumbnailUrl}
            alt={`${incident.type} incident`}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              
              (e.target as HTMLImageElement).src = '/api/placeholder/800/450'
            }}
          />
        </div>

        
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-4 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        
        <div className="absolute bottom-16 left-4 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
          {formatTime(currentTime)} / {formatTime(120)}
        </div>
      </div>

      
      <div className="mt-4 bg-gray-800 rounded-lg p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="bg-gray-700 rounded-full h-1">
            <div 
              className="bg-blue-500 rounded-full h-1 transition-all duration-200"
              style={{ width: `${(currentTime / 120) * 100}%` }}
            />
          </div>
        </div>

        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {new Date(incident.tsStart).toLocaleTimeString()} - {new Date(incident.tsEnd).toLocaleTimeString()}
            </span>
            <button className="p-2 hover:bg-gray-700 rounded">
              <Maximize2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      
      {otherCameras.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2 text-gray-300">Other Active Cameras</h3>
          <div className="flex space-x-3">
            {otherCameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => onIncidentSelect(cam)}
                className="relative group"
              >
                <img
                  src={cam.thumbnailUrl}
                  alt={cam.camera.name}
                  className="w-24 h-16 object-cover rounded bg-gray-700 group-hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/api/placeholder/96/64'
                  }}
                />
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 px-1 rounded text-xs">
                  {cam.camera.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}