'use client'

import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import IncidentPlayer from './components/IncidentPlayer'
import IncidentList from './components/IncidentList'

export interface Camera {
  id: number
  name: string
  location: string
}

export interface Incident {
  id: number
  cameraId: number
  type: string
  tsStart: string
  tsEnd: string
  thumbnailUrl: string
  resolved: boolean
  camera: Camera
}

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [showResolved, setShowResolved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIncidents()
  }, [showResolved])

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/incidents?resolved=${showResolved}`)
      const data = await response.json()
      setIncidents(data.incidents)
      
      if (!selectedIncident && data.incidents.length > 0) {
        setSelectedIncident(data.incidents[0])
      }
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolveIncident = async (incidentId: number) => {
    try {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      })
      
      if (response.ok) {
        setIncidents(prev => 
          prev.map(incident => 
            incident.id === incidentId 
              ? { ...incident, resolved: !incident.resolved }
              : incident
          )
        )
  
        if (!showResolved) {
          setIncidents(prev => prev.filter(incident => incident.id !== incidentId))
          
          if (selectedIncident?.id === incidentId) {
            const remainingIncidents = incidents.filter(i => i.id !== incidentId)
            setSelectedIncident(remainingIncidents.length > 0 ? remainingIncidents[0] : null)
          }
        }
      }
    } catch (error) {
      console.error('Error resolving incident:', error)
    }
  }

  const unresolvedCount = incidents.filter(i => !i.resolved).length

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar 
        unresolvedCount={unresolvedCount}
        showResolved={showResolved}
        onToggleResolved={() => setShowResolved(!showResolved)}
      />
      
      <div className="flex h-[calc(100vh-64px)]">
        <div className="flex-1 p-6">
          <IncidentPlayer 
            incident={selectedIncident}
            allIncidents={incidents}
            onIncidentSelect={setSelectedIncident}
          />
        </div>
        
        <div className="w-96 border-l border-gray-700">
          <IncidentList
            incidents={incidents}
            selectedIncident={selectedIncident}
            onIncidentSelect={setSelectedIncident}
            onResolveIncident={handleResolveIncident}
            showResolved={showResolved}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}