"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Camera, AlertTriangle, Crosshair, SearchCode, Users } from 'lucide-react'
import { Incident, Camera as CameraType } from '../page'

const CAMERA_LABEL_WIDTH = 160 // px (w-40)
const TRACK_HEIGHT = 80
const HOURS_IN_DAY = 24

interface TimelineProps {
  incidents: Incident[]
  selectedIncident?: Incident | null
  onIncidentSelect?: (incident: Incident) => void
  onTimeChange?: (timeInSeconds: number) => void
}

const INCIDENT_TYPE_META = {
  UNAUTHORIZED_ACCESS: { label: "Unauthorised Access", color: "bg-red-500 border-red-400", icon: <AlertTriangle className="w-3 h-3" /> },
  GUN_THREAT:         { label: "Gun Threat",          color: "bg-orange-500 border-orange-400", icon: <Crosshair className="w-3 h-3" /> },
  FACE_RECOGNIZED:    { label: "Face Recognised",     color: "bg-blue-500 border-blue-400", icon: <SearchCode className="w-3 h-3" /> },
  TRAFFIC_CONGESTION: { label: "Traffic Congestion",  color: "bg-teal-500 border-teal-400", icon: <Users className="w-3 h-3" /> },
  SUSPICIOUS_BEHAVIOR:{ label: "Suspicious Behavior", color: "bg-yellow-600 border-yellow-500", icon: <AlertTriangle className="w-3 h-3" /> }
};
function getIncidentTypeMeta(type: string) {
  // Fallback to default meta if the mapping is not found
  return INCIDENT_TYPE_META[type as keyof typeof INCIDENT_TYPE_META] ||
    {label: type.replace(/_/g," "), color:"bg-gray-500 border-gray-400", icon: <Users className="w-3 h-3" />};
}

export default function Timeline({
  incidents,
  selectedIncident,
  onIncidentSelect,
  onTimeChange,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [timelineWidth, setTimelineWidth] = useState(800)
  const [scrubberPosition, setScrubberPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [scrubTime, setScrubTime] = useState<Date | null>(null)

  // Compute 24h window around data (with 2h padding)
  const get24HourWindow = React.useCallback(() => {
    if (!incidents.length) {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      return { start, end };
    }
    const times = incidents.flatMap(inc => [new Date(inc.tsStart), new Date(inc.tsEnd)]);
    const min = new Date(Math.min(...times.map(d=>+d)));
    const max = new Date(Math.max(...times.map(d=>+d)));
    // at least 24h between min and max, pad to 24h
    let start = new Date(min.getTime() - 2 * 60 * 60 * 1000);
    let end = new Date(max.getTime() + 2 * 60 * 60 * 1000);
    // Force window to be 24h
    if (end.getTime() - start.getTime() < 24*60*60*1000) {
      end = new Date(start.getTime() + 24*60*60*1000);
    }
    return { start, end };
  }, [incidents]);
  const { start: windowStart, end: windowEnd } = get24HourWindow();
  const totalWindowDuration = windowEnd.getTime() - windowStart.getTime();

  // Cameras and grouping
  const cameras = React.useMemo(() => {
    const map = new Map<number, CameraType>();
    incidents.forEach(inc => { if (inc.camera) map.set(inc.camera.id, inc.camera); });
    return Array.from(map.values()).sort((a,b)=>a.id-b.id);
  }, [incidents]);
  const incidentsByCamera = React.useMemo(() => {
    const by: { [id:number]: Incident[] } = {};
    incidents.forEach(inc => {
      if (!by[inc.cameraId]) by[inc.cameraId] = [];
      by[inc.cameraId].push(inc);
    });
    return by;
  }, [incidents]);

  // Track width responsive
  useEffect(() => {
    const handler = () => {
      if (timelineRef.current) setTimelineWidth(timelineRef.current.clientWidth);
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Generate time markers for the *actual window* NOT just 0-23:00!
  const generateTimeMarkers = useCallback(() => {
    if (!timelineWidth || totalWindowDuration === 0) return [];
    const markers = [];
    for (let hour = 0; hour <= HOURS_IN_DAY; hour++) {
      const markerTime = new Date(windowStart.getTime() + (hour/24)*totalWindowDuration);
      // place marker at: (markerTime - windowStart) / windowDuration * width
      const position = (hour/24) * timelineWidth;
      markers.push({
        markerTime,
        label: markerTime.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: false }),
        position
      });
    }
    return markers;
  }, [timelineWidth, totalWindowDuration, windowStart]);

  // Get incident bar position/width
  const calculateIncidentPosition = useCallback((tsStart: string, tsEnd: string) => {
    if (!timelineWidth || !totalWindowDuration) return { left: 0, width: 0 };
    const incidentStart = new Date(tsStart).getTime();
    const incidentEnd = new Date(tsEnd).getTime();
    if (incidentEnd <= windowStart.getTime() || incidentStart >= windowEnd.getTime()) return {left: 0, width: 0};
    const startMs = Math.max(incidentStart, windowStart.getTime());
    const endMs = Math.min(incidentEnd, windowEnd.getTime());
    const left = ((startMs - windowStart.getTime()) / totalWindowDuration) * timelineWidth;
    const width = Math.max(((endMs - startMs) / totalWindowDuration) * timelineWidth, 12);
    return { left, width };
  }, [timelineWidth, totalWindowDuration, windowStart, windowEnd]);

  // --- SCRUBBER: position <-> time conversion ---
  function posToTime(px: number) {
    // px on bar (after camera label), timelineWidth total (not including label)
    const clamped = Math.max(0, Math.min(px, timelineWidth));
    const timeMs = windowStart.getTime() + (clamped / timelineWidth) * totalWindowDuration;
    return new Date(timeMs);
  }
  function timeToPos(dt: Date) {
    const ms = Math.max(windowStart.getTime(), Math.min(dt.getTime(), windowEnd.getTime()));
    return ((ms - windowStart.getTime()) / totalWindowDuration) * timelineWidth;
  }

  // --- marker Events ---
  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = timelineRef.current!.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const px = Math.max(0, Math.min(clickX, timelineWidth));
    // set position and fire
    setScrubberPosition(px);
    const seekTime = posToTime(px);
    setScrubTime(seekTime);
    if (onTimeChange) onTimeChange(Math.floor((seekTime.getTime() - windowStart.getTime())/1000));
  }, [timelineWidth, posToTime, onTimeChange, windowStart]);
  const handleMarkerClick = (pos: number, markerTime: Date) => {
    setScrubberPosition(pos);
    setScrubTime(markerTime);
    if (onTimeChange) onTimeChange(Math.floor((markerTime.getTime() - windowStart.getTime())/1000));
  }

  // --- SCRUBBING (dragging) ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleTimelineClick(e)
  }
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const px = Math.max(0, Math.min(e.clientX - rect.left, timelineWidth));
    setScrubberPosition(px);
    const seekTime = posToTime(px);
    setScrubTime(seekTime);
    if (onTimeChange) onTimeChange(Math.floor((seekTime.getTime() - windowStart.getTime())/1000));
  }, [isDragging, timelineWidth, posToTime, onTimeChange, windowStart])
  const handleMouseUp = useCallback(() => setIsDragging(false), [])
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // --- Sync scrubber with external selectedIncident/time ---
  useEffect(() => {
    if (selectedIncident) {
      // Snap scrubber to selected incident start
      const dt = new Date(selectedIncident.tsStart);
      const pos = timeToPos(dt);
      setScrubberPosition(pos);
      setScrubTime(dt);
    }
  // eslint-disable-next-line
  }, [selectedIncident]);

  // When window/width changes and scrubTime is set, update position
  useEffect(() => {
    if (scrubTime) setScrubberPosition(timeToPos(scrubTime));
  // eslint-disable-next-line
  }, [timelineWidth, windowStart.getTime(), windowEnd.getTime()]);

  // --- Click incident to move scrubber and call select ---
  const handleIncidentClick = (incident: Incident) => {
    const dt = new Date(incident.tsStart);
    const pos = timeToPos(dt);
    setScrubberPosition(pos);
    setScrubTime(dt);
    if (onIncidentSelect) onIncidentSelect(incident);
    if (onTimeChange) onTimeChange(Math.floor((dt.getTime() - windowStart.getTime())/1000));
  }

  const timeMarkers = generateTimeMarkers();

  return (
    <div className="flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Incident Timeline</h3>
        <div className="text-xs text-gray-400">
          {windowStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} -{' '}
          {windowEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Timeline + ticks */}
      <div className="flex-1 overflow-hidden">
        {/* Time scales */}
        <div className="flex bg-gray-850 border-b border-gray-700">
          <div className="w-40 flex-shrink-0 p-3 text-xs text-gray-400 font-medium border-r border-gray-700 bg-gray-800">
            Camera List
          </div>
          <div className="flex-1 relative h-16 bg-gray-900" ref={timelineRef}>
            {/* Markers */}
            {timeMarkers.map((marker, i) => (
              <button
                key={i}
                className="absolute top-0 bottom-0 flex flex-col justify-center items-center text-xs text-gray-400 cursor-pointer"
                style={{ left: `${marker.position}px`, transform: 'translateX(-50%)' }}
                title={marker.label}
                tabIndex={0}
                onClick={() => handleMarkerClick(marker.position, marker.markerTime)}
              >
                <div className="bg-gray-900 px-2 py-1 rounded border border-gray-700 font-mono text-white text-center">{marker.label}</div>
                <div className="absolute top-0 bottom-0 w-px bg-gray-600 opacity-50"></div>
              </button>
            ))}
          </div>
        </div>
        {/* Camera tracks */}
        <div className="max-h-80 overflow-y-auto timeline-scrollbar">
          {cameras.map((camera, camIndex) => (
            <div key={camera.id} className="flex border-b border-gray-700 hover:bg-gray-800 transition-colors" style={{ minHeight: TRACK_HEIGHT }}>
              {/* Camera Label */}
              <div className="w-40 flex-shrink-0 p-4 flex items-center space-x-2 border-r border-gray-700 bg-gray-850">
                <Camera className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="text-sm min-w-0">
                  <div className="text-white font-medium truncate">{camera.name}</div>
                  <div className="text-xs text-gray-400 truncate">{camera.location}</div>
                </div>
              </div>
              {/* Incidents & Track */}
              <div
                className="flex-1 relative h-20 bg-gray-800 cursor-crosshair"
                style={{ minWidth: timelineWidth + 'px' }}
                onMouseDown={handleMouseDown}
                onClick={handleTimelineClick}
              >
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {timeMarkers.map((marker, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-gray-600 opacity-30"
                      style={{ left: `${marker.position}px` }}
                    />
                  ))}
                </div>
                {/* Incidents */}
                {(incidentsByCamera[camera.id] || []).map((incident) => {
                  const { left, width } = calculateIncidentPosition(incident.tsStart, incident.tsEnd);
                  if (width === 0) return null;
                  const typeMeta = getIncidentTypeMeta(incident.type);
                  const isResolved = incident.resolved;
                  const isActive = selectedIncident?.id === incident.id;
                  return (
                    <div
                      key={incident.id}
                      className={`absolute top-3 bottom-3 rounded border-2 ${typeMeta.color} ${
                        isResolved ? 'opacity-50' : 'opacity-90'
                      } hover:opacity-100 shadow-lg z-10 cursor-pointer flex items-center transition-all ${
                        isActive ? 'border-yellow-400 ring-2 ring-yellow-200' : ''
                      }`}
                      style={{ left: `${left}px`, width: `${Math.max(width, 12)}px` }}
                      title={`${typeMeta.label}\nStart: ${new Date(incident.tsStart).toLocaleString()}\nEnd: ${new Date(incident.tsEnd).toLocaleString()}${isResolved ? '\nStatus: Resolved' : '\nStatus: Active'}`}
                      onClick={e => { e.stopPropagation(); handleIncidentClick(incident); }}
                    >
                      <div className="flex items-center h-full px-2">
                        <div className="flex items-center space-x-1 text-white text-xs">
                          {typeMeta.icon}
                          {width > 80 && (
                            <span className="font-medium truncate">
                              {typeMeta.label}
                            </span>
                          )}
                        </div>
                      </div>
                      {isResolved && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                      )}
                    </div>
                  );
                })}
                {/* Scrubber: only once (on top camera row) */}
                {camIndex === 0 && (
                  <div
                    className={`absolute top-0 bottom-0 w-1 bg-white z-30 shadow-xl transition-all ${
                      isDragging ? 'bg-blue-400 w-2' : 'hover:bg-gray-200'
                    }`}
                    style={{ left: `${scrubberPosition}px` }}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-white border border-gray-400 rounded-sm"></div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-white border border-gray-400 rounded-sm"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer legend */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-t border-gray-700 text-xs text-gray-300">
        <div className="flex items-center space-x-4">
          <span>Drag the scrubber to navigate • Click incidents to jump to time</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Scrubber Position</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          {Object.entries(INCIDENT_TYPE_META).map(([type, meta]) => (
            <div key={type} className="flex items-center space-x-1">
              <div className={`w-3 h-2 ${meta.color.split(' ')[0]} rounded-sm`} />
              <span>{meta.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .timeline-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .timeline-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .timeline-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .timeline-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        .bg-gray-850 {
          background-color: #1f2937;
        }
      `}</style>
    </div>
  )
}
