
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";
import { Heart, Droplet, Users, Hospital } from "lucide-react";

const IndexPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blood/10 text-blood px-4 py-2 rounded-full text-sm font-medium">
                <Heart className="h-4 w-4" />
                <span>Saving Lives in Morocco</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Connecting Blood Donors with Those in Need
              </h1>
              
              <p className="text-lg text-gray-600">
                BloodConnect bridges the gap between blood donors and hospitals, creating a real-time network for blood donation across Morocco.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}>
                  {isAuthenticated ? "Go to Dashboard" : "Join as a Donor"}
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/map")}>
                  View Blood Needs Map
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-2">
                  <div className="bg-blood/10 p-2 rounded-full">
                    <Droplet className="h-5 w-5 text-blood" />
                  </div>
                  <div>
                    <h3 className="font-medium">Real-time Updates</h3>
                    <p className="text-sm text-gray-500">See where blood is needed most</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blood/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blood" />
                  </div>
                  <div>
                    <h3 className="font-medium">Community Network</h3>
                    <p className="text-sm text-gray-500">Join a network of donors</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 relative">
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                  alt="Blood donation" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blood/10 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-blood/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How BloodConnect Works</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our platform connects donors, hospitals, and patients in need through a simple and efficient process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blood/10 rounded-lg flex items-center justify-center mb-4">
                <Hospital className="h-6 w-6 text-blood" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hospitals & Centers</h3>
              <p className="text-gray-600">
                Hospitals can post real-time blood needs, specifying types, quantities, and urgency levels.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blood/10 rounded-lg flex items-center justify-center mb-4">
                <Droplet className="h-6 w-6 text-blood" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blood Donors</h3>
              <p className="text-gray-600">
                Donors can see where their blood type is needed and respond to requests in their area.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blood/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blood" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Patients</h3>
              <p className="text-gray-600">
                People in need can request blood directly, connecting with potential donors nearby.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-blood text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join BloodConnect today and become part of Morocco's life-saving network of blood donors and healthcare providers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate("/signup")}
              className="bg-white text-blood hover:bg-gray-100"
            >
              Sign Up Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="border-white text-white hover:bg-white/10"
            >
              Login
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="h-5 w-5 text-blood" />
              <span className="text-lg font-bold">
                Blood<span className="text-blood">Connect</span>
              </span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} BloodConnect Morocco. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
