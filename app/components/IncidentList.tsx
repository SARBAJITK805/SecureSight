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
      <div className="p-4 border-b border-gray-700 flex flex-col gap-2">
        <div className="flex items-center text-lg font-semibold">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-white">{unresolved.length} Unresolved Incidents</span>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span>+</span>
          </div>
          <div className="flex items-center ml-3">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          </div>
          <div className="flex items-center ml-3">
            <Check className="w-4 h-4 text-green-500 mr-1" />
            <span>{resolved.length} resolved incidents</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-3 min-h-0">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : unresolved.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No unresolved incidents.</div>
        ) : (
          <div className="space-y-3">
            {unresolved.map(incident => (
              <div
                key={incident.id}
                className={`flex gap-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                  selectedIncident?.id === incident.id
                    ? 'bg-gray-700/50 border-purple-500'
                    : 'hover:bg-gray-800/50 border-transparent hover:border-gray-600'
                }`}
                onClick={() => onIncidentSelect(incident)}
              >
                <div className="relative">
                  <img
                    src={incident.thumbnailUrl}
                    alt={incident.type}
                    className="w-16 h-12 object-cover rounded bg-gray-700 flex-shrink-0"
                  />
                  {selectedIncident?.id === incident.id && (
                    <div className="absolute inset-0 border-2 border-purple-500 rounded"></div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 min-w-0 justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm mb-1">
                        {incident.type === 'GUN_THREAT' && (
                          <span className="text-red-400">🔫 Gun Threat</span>
                        )}
                        {incident.type === 'UNAUTHORIZED_ACCESS' && (
                          <span className="text-orange-400">🚪 Unauthorised Access</span>
                        )}
                        {incident.type === 'FACE_RECOGNIZED' && (
                          <span className="text-blue-400">👤 Face Recognised</span>
                        )}
                        {incident.type === 'SUSPICIOUS_BEHAVIOR' && (
                          <span className="text-yellow-400">⚠️ Suspicious Behavior</span>
                        )}
                      </span>
                      <div className="flex items-center text-xs text-gray-300 mb-1">
                        <span className="mr-2">📹</span>
                        <span className="truncate">{incident.camera.name}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">🕐</span>
                        <span className="font-mono">{new Date(incident.tsStart).toLocaleTimeString('en-GB', { hour12: false })} - {new Date(incident.tsEnd).toLocaleTimeString('en-GB', { hour12: false })} on {new Date(incident.tsStart).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onResolveIncident(incident.id);
                      }}
                      className="text-yellow-400 text-sm flex items-center font-medium hover:text-yellow-300 px-3 py-1 rounded bg-yellow-400/10 hover:bg-yellow-400/20"
                    >
                      Resolve <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}