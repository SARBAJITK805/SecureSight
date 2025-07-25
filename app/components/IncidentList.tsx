import { Check, AlertTriangle, Shield, Eye, Zap, ChevronRight } from 'lucide-react'
import { useState } from 'react'
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
  const [showResolved, setShowResolved] = useState(false);
  const unresolved = incidents.filter(i => !i.resolved);
  const resolved = incidents.filter(i => i.resolved);
  const shown = showResolved ? resolved : unresolved;

  return (
    <div className="flex flex-col h-full bg-[#161B22] rounded-lg overflow-hidden min-h-0 min-w-0">
      {/* Header and the "Show Resolved" button */}
      <div className="flex items-center justify-between p-4 border-b border-[#22252B] bg-[#1A1F26]">
        <div className="flex items-center gap-2 text-lg font-semibold text-white">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>
            {showResolved ? `${resolved.length} Resolved` : `${unresolved.length} Unresolved`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <Check className="w-4 h-4 text-green-400" />
          {resolved.length} resolved
          <button
            className={`
              ml-3 px-3 py-1.5 rounded-lg font-bold border
              transition text-xs 
              ${showResolved 
                ? "bg-green-500 text-black border-green-500 hover:bg-green-600"
                : "bg-gray-800 text-gray-200 border-green-500 hover:bg-green-600 hover:text-black"
              }
            `}
            onClick={() => setShowResolved(r => !r)}
          >
            {showResolved ? "Show Unresolved" : "Show Resolved"}
          </button>
        </div>
      </div>
      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0 space-y-3 bg-[#161B22]">
        {loading ? (
          <div className="flex justify-center items-center py-12 text-gray-400">Loading...</div>
        ) : shown.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            {showResolved ? 'No resolved incidents.' : 'No unresolved incidents.'}
          </div>
        ) : (
          shown.map(incident => (
            <div
              key={incident.id}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all border 
                ${selectedIncident?.id === incident.id 
                  ? 'bg-[#20242c] border-[#37e3a1] shadow-lg' 
                  : 'bg-[#191E24] border-transparent hover:border-[#333945]'
                }
                ${incident.resolved ? 'opacity-60' : ''}
              `}
              onClick={() => onIncidentSelect(incident)}
            >
              <img
                src={incident.thumbnailUrl}
                alt={incident.type}
                className="w-16 h-12 object-cover rounded bg-gray-700 border border-[#232834]"
              />
              <div className="flex flex-col flex-1 min-w-0 gap-1">
                <span className={`text-xs font-bold tracking-wide uppercase 
                  ${incident.type === 'GUN_THREAT' ? 'text-red-400'
                    : incident.type === 'UNAUTHORIZED_ACCESS' ? 'text-orange-400'
                    : incident.type === 'FACE_RECOGNIZED' ? 'text-blue-400'
                    : incident.type === 'SUSPICIOUS_BEHAVIOR' ? 'text-yellow-400'
                    : 'text-gray-300'
                  }`
                }>
                  {incident.type === 'GUN_THREAT'
                    ? "Gun Threat"
                    : incident.type === 'UNAUTHORIZED_ACCESS'
                    ? "Unauthorised Access"
                    : incident.type === 'FACE_RECOGNIZED'
                    ? "Face Recognised"
                    : incident.type === 'SUSPICIOUS_BEHAVIOR'
                    ? "Suspicious Behavior"
                    : incident.type}
                </span>
                <span className="text-xs text-gray-300 truncate">{incident.camera.name}</span>
                <span className="text-xs font-mono text-gray-500">{incident.tsStart}</span>
              </div>
              {!incident.resolved && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onResolveIncident(incident.id);
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-[#222b36] text-green-400 font-bold text-xs rounded-lg shadow-sm border border-green-500 hover:bg-green-600 hover:text-white transition"
                >
                  <span>Resolve</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {incident.resolved && (
                <span className="ml-2 text-xs text-green-400 font-medium">Resolved</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
