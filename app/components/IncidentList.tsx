import { Check, AlertTriangle, Shield, Eye, Zap, ChevronRight } from 'lucide-react'
import { Incident } from '../page'

interface Props {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onIncidentSelect: (i: Incident) => void;
  onResolveIncident: (id: number) => void;
  loading: boolean;
}

export default function IncidentList({
  incidents,
  selectedIncident,
  onIncidentSelect,
  onResolveIncident,
  loading,
}: Props) {
  const unresolved = incidents.filter(i => !i.resolved);
  const resolved = incidents.filter(i => i.resolved);

  return (
    <div className="flex flex-col h-full bg-[#161B22] rounded-lg overflow-hidden min-h-0 min-w-0">
      <div className="p-3 border-b border-gray-700 flex flex-col gap-1">
        <div className="flex items-center text-base font-semibold">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-1" />
          <span>{unresolved.length} Unresolved Incidents</span>
          <Check className="w-4 h-4 ml-3 text-green-500" />
          <span className="ml-1 text-xs text-gray-400">{resolved.length} resolved incidents</span>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 p-2 min-h-0">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : unresolved.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No unresolved incidents.</div>
        ) : (
          <div className="space-y-2">
            {unresolved.map(incident => (
              <div
                key={incident.id}
                className={`flex gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${
                  selectedIncident?.id === incident.id
                    ? 'bg-gray-700 border-green-500'
                    : 'hover:bg-gray-800 border-transparent'
                }`}
                onClick={() => onIncidentSelect(incident)}
              >
                <img
                  src={incident.thumbnailUrl}
                  alt={incident.type}
                  className="w-20 h-12 object-cover rounded bg-gray-700"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium text-xs">
                    {incident.type === 'GUN_THREAT' && (
                      <span className="text-red-400">Gun Threat</span>
                    )}
                    {incident.type === 'UNAUTHORIZED_ACCESS' && (
                      <span className="text-orange-400">Unauthorized Access</span>
                    )}
                    {incident.type === 'FACE_RECOGNIZED' && (
                      <span className="text-blue-400">Face Recognised</span>
                    )}
                    {incident.type === 'SUSPICIOUS_BEHAVIOR' && (
                      <span className="text-yellow-400">Suspicious Behavior</span>
                    )}
                  </span>
                  <span className="text-xs text-gray-300 truncate">{incident.camera.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{incident.tsStart}</span>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onResolveIncident(incident.id);
                  }}
                  className="text-green-400 text-xs flex items-center font-semibold hover:text-green-300"
                >
                  Resolve <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}