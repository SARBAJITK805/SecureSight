'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { Incident, Camera } from '../page'

interface TimelineProps {
  incidents: Incident[]
  selectedIncident: Incident | null
  onIncidentSelect: (incident: Incident) => void
  onTimeChange: (timeInSeconds: number) => void
}

const TOTAL_HOURS = 24
const TIMELINE_HEIGHT = 48

const TYPE_STYLES = {
  GUN_THREAT:      'bg-red-600 border-red-500',
  UNAUTHORIZED_ACCESS: 'bg-orange-500 border-orange-400',
  FACE_RECOGNIZED: 'bg-blue-500 border-blue-400',
  TRAFFIC_CONGESTION: 'bg-cyan-600 border-cyan-400',
  MULTIPLE:        'bg-gray-700 border-gray-500',
}
const TYPE_LABEL = {
  GUN_THREAT: 'Gun Threat',
  UNAUTHORIZED_ACCESS: 'Unauthorised Access',
  FACE_RECOGNIZED: 'Face Recognised',
  TRAFFIC_CONGESTION: 'Traffic congestion',
  MULTIPLE: 'Multiple Events',
}

const formatTime = (seconds: number, showSeconds = true) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}${showSeconds ? ':'+String(s).padStart(2,'0') : ''}`
}

export default function Timeline({
  incidents = [],
  selectedIncident,
  onIncidentSelect,
  onTimeChange,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState(3 * 3600 + 12 * 60 + 37) 

  const cameras = Array.from(
    incidents.reduce((map, i) => map.set(i.camera.id, i.camera), new Map<number, Camera>()).values()
  ).sort((a, b) => a.id - b.id)

  const timeToX = useCallback((seconds: number) => {
    if (!timelineRef.current) return 0
    const timelineWidth = timelineRef.current.offsetWidth
    return (seconds / (TOTAL_HOURS * 3600)) * timelineWidth
  }, [])

  
  const onMarkerSeek = (event: { clientX: number }) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const timelineWidth = timelineRef.current.offsetWidth
    const newTime = Math.round((x / timelineWidth) * (TOTAL_HOURS * 3600))
    setCurrentTime(newTime)
    onTimeChange(newTime)
  }

  
  const renderTimeTicks = () => {
    const ticks = []
    for (let hour = 0; hour <= TOTAL_HOURS; hour += 1) {
      ticks.push(
        <div key={hour} className="flex-1 text-xs text-gray-400 text-center" style={{ minWidth: 40 }}>
          {String(hour).padStart(2, '0')}:00
        </div>
      )
    }
    return <div className="flex w-full px-2">{ticks}</div>
  }

  
  const renderCameraRows = () =>
    cameras.map((camera, idx) => (
      <div
        key={camera.id}
        className="relative flex items-center h-12 select-none"
        style={{ minHeight: `${TIMELINE_HEIGHT}px` }}
      >
        <span className="w-24 text-xs text-gray-300 flex-shrink-0">{camera.name}</span>
        <div className="flex-1 relative h-full">
          {/* Event bars */}
          {incidents
            .filter(ev => ev.cameraId === camera.id)
            .map(ev => {
              const startS = new Date(ev.tsStart).getUTCHours() * 3600 + new Date(ev.tsStart).getUTCMinutes() * 60 + new Date(ev.tsStart).getUTCSeconds()
              const endS = new Date(ev.tsEnd).getUTCHours() * 3600 + new Date(ev.tsEnd).getUTCMinutes() * 60 + new Date(ev.tsEnd).getUTCSeconds()
              const left = timeToX(startS)
              let width = timeToX(endS) - left
              width = Math.max(width, 30)
              const style = `${TYPE_STYLES[ev.type as keyof typeof TYPE_STYLES] || 'bg-gray-600 border-gray-600'}`
              return (
                <button
                  key={ev.id}
                  className={`absolute top-1 h-7 rounded text-xs px-2 flex items-center transition-all ${style} border-2 outline-none hover:opacity-90`}
                  style={{
                    left,
                    width,
                    zIndex: selectedIncident?.id === ev.id ? 4 : 2,
                    borderColor: selectedIncident?.id === ev.id ? '#fde047' : undefined,
                  }}
                  title={TYPE_LABEL[ev.type as keyof typeof TYPE_LABEL] || ev.type}
                  onClick={e => { e.stopPropagation(); onIncidentSelect(ev); setCurrentTime(startS) }}
                >
                  <span className="truncate">{TYPE_LABEL[ev.type as keyof typeof TYPE_LABEL] || ev.type}</span>
                </button>
              )
            })}
        </div>
      </div>
    ))

  
  const markerPos = timeToX(currentTime)

  return (
    <div className="bg-[#1F2937] rounded-lg flex flex-col p-2 xs:p-3 min-h-0 min-w-0">
      
      <div className="flex items-center justify-between mb-1 pl-24 xs:pl-0">
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-700 rounded"><SkipBack className="w-5 h-5" /></button>
          <button className="p-1 hover:bg-gray-700 rounded"><Play className="w-5 h-5" /></button>
          <button className="p-1 hover:bg-gray-700 rounded"><SkipForward className="w-5 h-5" /></button>
        </div>
        <div className="text-sm font-mono text-gray-300">{formatTime(currentTime)}</div>
        <div className="rounded px-2 py-1 text-xs bg-gray-800 ml-2">1x</div>
      </div>
      
      <div className="flex">
        <div className="w-24"></div>
        <div className="flex-1">{renderTimeTicks()}</div>
      </div>
      
      <div
        ref={timelineRef}
        className="relative flex flex-col bg-black/25 rounded overflow-x-auto py-1 select-none"
        style={{ minHeight: TIMELINE_HEIGHT * cameras.length + 16, minWidth: 480 }}
        onClick={onMarkerSeek}
      >
        {renderCameraRows()}
        
        <div className="absolute top-0 bottom-0 z-30" style={{ left: markerPos, width: 0 }}>
          <div className="w-0.5 bg-yellow-400 h-full"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-mono text-xs rounded py-0.5 px-1 shadow-lg mt-[-30px]">
            {formatTime(currentTime, false)}
          </div>
        </div>
      </div>
    </div>
  )
}
