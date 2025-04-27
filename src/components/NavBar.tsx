
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, LogOut, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-blood" />
          <span className="text-xl font-bold" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            Blood<span className="text-blood">Connect</span>
          </span>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="mt-6 flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 p-2 border-b pb-4">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate("/map")}>
                      Blood Needs Map
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate("/profile")}>
                      Profile
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate("/prediction")}>
                      Prediction
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2 text-destructive" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="default" onClick={() => navigate("/login")}>
                      Login
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/signup")}>
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
            <>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate("/map")}>
                Blood Needs Map
              </Button>
              <Button variant="ghost" onClick={() => navigate("/prediction")}>
                Prediction
              </Button>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="gap-2" 
                onClick={() => navigate("/profile")}
              >
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </Button>
              <Button variant="outline" className="gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button variant="default" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
