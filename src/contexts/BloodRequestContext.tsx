
import React, { createContext, useContext, useState } from "react";
import { User, UserRole } from "./AuthContext";

// Blood type enum
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

// Blood request status
export type RequestStatus = "pending" | "matched" | "completed" | "cancelled";

// Blood request interface
export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterType: UserRole;
  bloodType: BloodType;
  quantity: number;
  urgency: "low" | "medium" | "high" | "critical";
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: RequestStatus;
  createdAt: string;
  description?: string;
  contactPhone: string;
}

interface BloodRequestContextType {
  requests: BloodRequest[];
  addRequest: (request: Omit<BloodRequest, "id" | "createdAt" | "status">) => void;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
  getRequestsByLocation: (lat: number, lng: number, radiusKm: number) => BloodRequest[];
  getRequestsByUser: (userId: string) => BloodRequest[];
}

// Sample data
const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: "1",
    requesterId: "2",
    requesterName: "Casablanca Hospital",
    requesterType: "hospital",
    bloodType: "O+",
    quantity: 3,
    urgency: "high",
    location: {
      latitude: 33.596315,
      longitude: -7.619994,
      address: "Casablanca Hospital, Bd El Massira El Khadra, Casablanca",
    },
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    description: "Needed for emergency surgery",
    contactPhone: "+212-522-123456",
  },
  {
    id: "2",
    requesterId: "3",
    requesterName: "Emergency Services",
    requesterType: "requester",
    bloodType: "AB-",
    quantity: 2,
    urgency: "critical",
    location: {
      latitude: 33.573905,
      longitude: -7.615428,
      address: "Emergency Center, Rue Mohammed V, Casablanca",
    },
    status: "pending",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    description: "Traffic accident victims",
    contactPhone: "+212-522-654321",
  },
  {
    id: "3",
    requesterId: "2",
    requesterName: "Casablanca Hospital",
    requesterType: "hospital",
    bloodType: "A+",
    quantity: 1,
    urgency: "medium",
    location: {
      latitude: 33.596315,
      longitude: -7.619994,
      address: "Casablanca Hospital, Bd El Massira El Khadra, Casablanca",
    },
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    description: "Scheduled surgery tomorrow",
    contactPhone: "+212-522-123456",
  },
  {
    id: "4",
    requesterId: "4",
    requesterName: "Patient User",
    requesterType: "patient",
    bloodType: "B+",
    quantity: 1,
    urgency: "low",
    location: {
      latitude: 33.583676,
      longitude: -7.632264,
      address: "Private Clinic, Quartier Racine, Casablanca",
    },
    status: "pending",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    description: "Treatment for chronic condition",
    contactPhone: "+212-655-789012",
  },
  {
    id: "5",
    requesterId: "3",
    requesterName: "Emergency Services",
    requesterType: "requester",
    bloodType: "O-",
    quantity: 4,
    urgency: "high",
    location: {
      latitude: 33.950000,
      longitude: -6.850000,
      address: "Rabat Central Hospital, Avenue Hassan II, Rabat",
    },
    status: "pending",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    description: "Multiple trauma patients",
    contactPhone: "+212-537-234567",
  }
];

const BloodRequestContext = createContext<BloodRequestContextType>({
  requests: [],
  addRequest: () => {},
  updateRequestStatus: () => {},
  getRequestsByLocation: () => [],
  getRequestsByUser: () => [],
});

export const BloodRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<BloodRequest[]>(INITIAL_REQUESTS);

  // Add a new blood request
  const addRequest = (request: Omit<BloodRequest, "id" | "createdAt" | "status">) => {
    const newRequest: BloodRequest = {
      ...request,
      id: (requests.length + 1).toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    setRequests([...requests, newRequest]);
  };

  // Update a request status
  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  // Get requests by location and radius
  const getRequestsByLocation = (lat: number, lng: number, radiusKm: number) => {
    // Simple distance calculation (this is approximate)
    const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    return requests.filter(
      (request) => 
        distance(
          lat, 
          lng, 
          request.location.latitude, 
          request.location.longitude
        ) <= radiusKm
    );
  };

  // Get requests by user
  const getRequestsByUser = (userId: string) => {
    return requests.filter((request) => request.requesterId === userId);
  };

  return (
    <BloodRequestContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        getRequestsByLocation,
        getRequestsByUser,
      }}
    >
      {children}
    </BloodRequestContext.Provider>
  );
};

// Custom hook to use the blood request context
export const useBloodRequests = () => useContext(BloodRequestContext);
