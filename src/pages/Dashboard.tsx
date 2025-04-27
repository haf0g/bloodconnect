
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBloodRequests, BloodRequest } from "@/contexts/BloodRequestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BloodRequestCard } from "@/components/BloodRequestCard";
import { NavBar } from "@/components/NavBar";
import { Droplet, MapPin, ArrowRight, Calendar, Users, User, Hospital, Flag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { requests } = useBloodRequests();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Filter relevant requests based on user role
  const getRelevantRequests = (): BloodRequest[] => {
    if (!user) return [];

    switch (user.role) {
      case "donor":
        // For donors, prioritize requests that match their blood type
        return requests
          .filter(req => req.status === "pending")
          .sort((a, b) => {
            // If user has blood type and it matches, prioritize those
            if (user.bloodType) {
              const aMatches = a.bloodType === user.bloodType;
              const bMatches = b.bloodType === user.bloodType;
              if (aMatches && !bMatches) return -1;
              if (!aMatches && bMatches) return 1;
            }
            
            // Then sort by urgency
            const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
          })
          .slice(0, 3);
      
      case "hospital":
        // For hospitals, show their own requests
        return requests
          .filter(req => req.requesterId === user.id)
          .slice(0, 3);
      
      case "requester":
        // For emergency services, show their own requests and critical ones nearby
        return requests
          .filter(req => req.requesterId === user.id || req.urgency === "critical")
          .slice(0, 3);
      
      case "patient":
        // For patients, show requests matching their blood type
        return requests
          .filter(req => req.bloodType === user.bloodType || req.requesterId === user.id)
          .slice(0, 3);
      
      default:
        return requests.slice(0, 3);
    }
  };

  const relevantRequests = getRelevantRequests();

  // Handle responding to a blood request
  const handleRespondToRequest = (requestId: string) => {
    // In a real app, this would open a flow to respond to the request
    toast({
      title: "Response recorded",
      description: "Thank you for your willingness to donate. The requester will contact you soon.",
    });
  };

  // Create new blood request (for hospitals, emergency services, and patients)
  const handleCreateRequest = () => {
    navigate("/new-request");
  };

  // Get welcome message and stats based on user role
  const getDashboardContent = () => {
    if (!user) return null;

    switch (user.role) {
      case "donor":
        return {
          title: `Welcome, ${user.name}`,
          description: "Thank you for being a blood donor. Your contributions save lives across Morocco.",
          stats: [
            { icon: <Droplet className="h-5 w-5 text-blood" />, title: "Your Blood Type", value: user.bloodType || "Not Set" },
            { icon: <Flag className="h-5 w-5 text-blood" />, title: "Nearby Requests", value: requests.filter(r => r.status === "pending").length },
            { icon: <User className="h-5 w-5 text-blood" />, title: "Last Donation", value: "Not Available" },
          ],
          action: {
            text: "View Nearby Donation Centers",
            onClick: () => navigate("/map"),
          },
        };
      
      case "hospital":
        return {
          title: `Welcome, ${user.name}`,
          description: "Manage your blood requests and connect with donors in your area.",
          stats: [
            { icon: <Flag className="h-5 w-5 text-blood" />, title: "Active Requests", value: requests.filter(r => r.requesterId === user.id && r.status === "pending").length },
            { icon: <Users className="h-5 w-5 text-blood" />, title: "Donors Reached", value: "72" },
            { icon: <Calendar className="h-5 w-5 text-blood" />, title: "Response Rate", value: "64%" },
          ],
          action: {
            text: "Create New Blood Request",
            onClick: handleCreateRequest,
          },
        };
      
      case "requester":
        return {
          title: `Welcome, ${user.name}`,
          description: "Request and manage emergency blood needs across Morocco.",
          stats: [
            { icon: <Flag className="h-5 w-5 text-blood" />, title: "Your Requests", value: requests.filter(r => r.requesterId === user.id).length },
            { icon: <Hospital className="h-5 w-5 text-blood" />, title: "Connected Hospitals", value: "6" },
            { icon: <Users className="h-5 w-5 text-blood" />, title: "Available Donors", value: "124" },
          ],
          action: {
            text: "Create Emergency Request",
            onClick: handleCreateRequest,
          },
        };
      
      case "patient":
        return {
          title: `Welcome, ${user.name}`,
          description: "Find blood donors and track blood availability for your needs.",
          stats: [
            { icon: <Droplet className="h-5 w-5 text-blood" />, title: "Your Blood Type", value: user.bloodType || "Not Set" },
            { icon: <MapPin className="h-5 w-5 text-blood" />, title: "Nearby Donors", value: "38" },
            { icon: <Hospital className="h-5 w-5 text-blood" />, title: "Nearby Centers", value: "4" },
          ],
          action: {
            text: "Request Blood Donation",
            onClick: handleCreateRequest,
          },
        };
      
      default:
        return {
          title: `Welcome to BloodConnect`,
          description: "Connect with blood donors and request blood across Morocco.",
          stats: [],
          action: {
            text: "Explore Blood Needs Map",
            onClick: () => navigate("/map"),
          },
        };
    }
  };

  const dashboardContent = getDashboardContent();

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">{dashboardContent?.title}</CardTitle>
              <CardDescription>{dashboardContent?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {dashboardContent?.stats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center p-4 bg-white rounded-lg border">
                    <div className="bg-blood/10 p-2 rounded-full mb-2">
                      {stat.icon}
                    </div>
                    <span className="text-sm text-gray-500">{stat.title}</span>
                    <span className="text-xl font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
              
              <Button className="w-full sm:w-auto" onClick={dashboardContent?.action.onClick}>
                {dashboardContent?.action.text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/map")}>
                <MapPin className="mr-2 h-4 w-4" />
                View Blood Needs Map
              </Button>
              
              {(user.role === "hospital" || user.role === "requester" || user.role === "patient") && (
                <Button className="w-full justify-start" variant="outline" onClick={handleCreateRequest}>
                  <Droplet className="mr-2 h-4 w-4" />
                  Create Blood Request
                </Button>
              )}
              
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </CardContent>
          </Card>
          
          {/* Blood Requests Section */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Blood Requests</CardTitle>
                <CardDescription>
                  {user.role === "donor" 
                    ? "Blood requests that need your help"
                    : "Recent blood requests in your area"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/map")}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {relevantRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relevantRequests.map((request) => (
                    <BloodRequestCard 
                      key={request.id}
                      request={request}
                      onRespond={() => handleRespondToRequest(request.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No blood requests found for your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
