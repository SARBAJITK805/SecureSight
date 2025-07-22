import { Camera } from 'lucide-react'
import { Incident } from '../page'

interface Props {
  incident: Incident | null;
  allIncidents: Incident[];
  onIncidentSelect: (i: Incident) => void;
}
export default function IncidentPlayer({ incident, allIncidents, onIncidentSelect }: Props) {
  const otherIncidents = allIncidents
    .filter(i => !i.resolved && i.id !== incident?.id)
    .slice(0, 3);

  if (!incident) {
    return (
      <div className="bg-black rounded-lg flex-1 flex items-center justify-center min-h-48">
        <Camera className="w-16 h-16 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg flex-1 flex flex-col min-h-0 min-w-0">
      <div className="flex-1 flex items-center justify-center min-h-0 min-w-0">
        <img
          src={incident.thumbnailUrl}
          alt={incident.type}
          className="object-contain max-w-full max-h-full w-full h-full rounded-lg"
          onError={e => ((e.target as HTMLImageElement).src = '/api/placeholder/800/450')}
        />
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 px-2">
        {[incident, ...otherIncidents].map((item, idx) => (
          <button
            key={item.id}
            className={`border-2 ${item.id === incident.id ? 'border-green-500' : 'border-transparent'} rounded-md p-1 bg-black/60`}
            onClick={() => onIncidentSelect(item)}
            style={{ width: '56px', height: '38px' }}
          >
            <img
              src={item.thumbnailUrl}
              alt={item.type}
              className="object-cover w-full h-full rounded"
            />
          </button>
        ))}
      </div>
      <span className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-xs rounded">{incident.tsStart}</span>
    </div>
  );
}
