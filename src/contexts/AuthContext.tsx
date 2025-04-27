
import React, { createContext, useContext, useState, useEffect } from "react";

// Define user roles
export type UserRole = "donor" | "hospital" | "requester" | "patient" | "admin";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bloodType?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

// Sample user data for demonstration (in a real app, this would come from a backend)
const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "Ahmed Donor",
    email: "donor@example.com",
    role: "donor",
    bloodType: "O+",
    location: {
      latitude: 33.589886,
      longitude: -7.603869,
    },
  },
  {
    id: "2",
    name: "Casablanca Hospital",
    email: "hospital@example.com",
    role: "hospital",
    location: {
      latitude: 33.596315,
      longitude: -7.619994,
    },
  },
  {
    id: "3",
    name: "Emergency Services",
    email: "emergency@example.com",
    role: "requester",
    location: {
      latitude: 33.573905,
      longitude: -7.615428,
    },
  },
  {
    id: "4",
    name: "Patient User",
    email: "patient@example.com",
    role: "patient",
    bloodType: "AB-",
    location: {
      latitude: 33.583676,
      longitude: -7.632264,
    },
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in (from localStorage in this demo)
  useEffect(() => {
    const storedUser = localStorage.getItem("bloodConnectUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function (simulated)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (in a real app, this would validate credentials against a backend)
    const foundUser = SAMPLE_USERS.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("bloodConnectUser", JSON.stringify(foundUser));
    } else {
      throw new Error("Invalid credentials");
    }
    
    setIsLoading(false);
  };

  // Signup function (simulated)
  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (SAMPLE_USERS.some(u => u.email === email)) {
      throw new Error("Email already exists");
    }
    
    // Create new user
    const newUser: User = {
      id: (SAMPLE_USERS.length + 1).toString(),
      name,
      email,
      role,
    };
    
    // In a real app, this would send the user to a backend
    SAMPLE_USERS.push(newUser);
    
    setUser(newUser);
    localStorage.setItem("bloodConnectUser", JSON.stringify(newUser));
    
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("bloodConnectUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);