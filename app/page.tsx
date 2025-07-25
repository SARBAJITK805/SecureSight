'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import IncidentPlayer from './components/IncidentPlayer';
import IncidentList from './components/IncidentList';
import Timeline from './components/Timeline';

export interface Camera {
  id: number;
  name: string;
  location: string;
}

export interface Incident {
  id: number;
  cameraId: number;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  camera: Camera;
}

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    const response = await fetch('/api/incidents');
    const data = await response.json();
    setIncidents(data.incidents);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedIncident(data.incidents.find((i: { resolved: any; }) => !i.resolved) || data.incidents[0]);
    setLoading(false);
  };

  const handleResolveIncident = async (incidentId: number) => {
    await fetch(`/api/incidents/${incidentId}/resolve`, { method: 'PATCH' });
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, resolved: true } : i));
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Navbar incidents={incidents} />
      <main className="flex-1 flex flex-col gap-2 xs:gap-4 p-2 xs:p-4 min-h-0 min-w-0">
        <div className="flex flex-col md:flex-row gap-2 xs:gap-4 flex-1 min-h-0 min-w-0 w-full">
          <div className="flex-1 min-w-0 min-h-0 flex items-stretch">
            <IncidentPlayer
              incident={selectedIncident}
              allIncidents={incidents}
              onIncidentSelect={setSelectedIncident}
            />
          </div>
          <div className="w-full md:w-96 max-w-full md:max-w-xs flex-shrink-0 min-w-0 min-h-0 mt-2 md:mt-0">
            <IncidentList
              incidents={incidents}
              selectedIncident={selectedIncident}
              onIncidentSelect={setSelectedIncident}
              onResolveIncident={handleResolveIncident}
              loading={loading}
            />
          </div>
        </div>
        <div className="h-40 xs:h-56 md:h-64 mt-2 xs:mt-4 min-w-0 min-h-0">
          <Timeline
            incidents={incidents}
            selectedIncident={selectedIncident}
            onIncidentSelect={setSelectedIncident}
            onTimeChange={() => {}}
          />
        </div>
      </main>
    </div>
  );
}
