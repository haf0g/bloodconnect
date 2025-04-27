import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import { useBloodRequests, BloodRequest } from "@/contexts/BloodRequestContext";
import { Card } from "@/components/ui/card";
import { BloodRequestCard } from "./BloodRequestCard";
import { useAuth } from "@/contexts/AuthContext";
import "leaflet/dist/leaflet.css";

// Create a custom marker icon
const customIcon = (urgency: string) => {
  let color = "";
  switch (urgency) {
    case "critical":
      color = "#ef4444";
      break;
    case "high":
      color = "#f97316";
      break;
    case "medium":
      color = "#eab308";
      break;
    case "low":
      color = "#22c55e";
      break;
    default:
      color = "#6b7280";
  }

  return new Icon({ 
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
    )}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};  

// Create a custom cluster icon
const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  return new DivIcon({
    html: `<div><span>${count}</span></div>`,
    className: `marker-cluster marker-cluster-${
      count < 10 ? "small" : count < 50 ? "medium" : "large"
    }`,
    iconSize: [40, 40],
  });
};

const BloodNeedsMap = () => {
  const { requests } = useBloodRequests();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  
  // Default to Morocco's geographical center if no user location
  const defaultPosition: [number, number] = [31.7917, -7.0926];
  const zoomLevel = 6;
  
  // Use user's location if available
  const mapCenter = user?.location 
    ? [user.location.latitude, user.location.longitude] as [number, number]
    : defaultPosition;

  // Handle click on a marker
  const handleMarkerClick = (request: BloodRequest) => {
    setSelectedRequest(request);
  };

  // Handle responding to a request
  const handleRespondToRequest = (requestId: string) => {
    console.log(`Responding to request ${requestId}`);
    // In a real app, this would open a flow to respond to the request
  };

  // Reset selected request when component unmounts
  useEffect(() => {
    return () => {
      setSelectedRequest(null);
    };
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-3/4 h-full">
        <MapContainer 
          center={mapCenter}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          className="h-full w-full rounded-lg shadow-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {requests.map((request) => (
            <Marker
              key={request.id}
              position={[request.location.latitude, request.location.longitude]}
              icon={customIcon(request.urgency)}
              eventHandlers={{
                click: () => handleMarkerClick(request),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{request.bloodType} Needed</h3>
                  <p className="text-sm">{request.requesterName}</p>
                  <p className="text-xs text-muted-foreground">{request.location.address}</p>
                  <button 
                    className="mt-2 text-xs text-blood hover:underline"
                    onClick={() => handleMarkerClick(request)}
                  >
                    View details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="w-full md:w-1/4 h-full flex flex-col gap-4">
        <Card className="p-4 bg-white shadow-lg h-full overflow-auto">
          <h2 className="text-xl font-bold mb-4">
            {selectedRequest 
              ? `Blood Request Details`
              : `Blood Requests (${requests.length})`
            }
          </h2>
          
          {selectedRequest ? (
            <div className="space-y-4">
              <BloodRequestCard 
                request={selectedRequest} 
                onRespond={() => handleRespondToRequest(selectedRequest.id)}
              />
              <button 
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setSelectedRequest(null)}
              >
                Back to all requests
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-auto pr-2">
              {requests.map((request) => (
                <div key={request.id} onClick={() => handleMarkerClick(request)}>
                  <BloodRequestCard request={request} compact={true} onRespond={() => handleMarkerClick(request)} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BloodNeedsMap;
