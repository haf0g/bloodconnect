
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BloodNeedsMap from "@/components/BloodNeedsMap";
import { NavBar } from "@/components/NavBar";

const MapPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Public page - no redirect needed
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1">
        <BloodNeedsMap />
      </div>
    </div>
  );
};

export default MapPage;
