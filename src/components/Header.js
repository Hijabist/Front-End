import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ showLogout = false }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");

    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const getUserInitials = () => {
    if (!user) return "G";
    const name = user.displayName || user.email;
    if (!name) return "G";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src="/logo_hijabist.svg" alt="Hijabist Logo" className="h-6 w-6" />
          <span>Hijabist</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="text-sm font-medium hover:text-secondary">Home</Link>
              <Link to="/about" className="text-sm font-medium hover:text-secondary">About Us</Link>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm font-medium hover:text-secondary">Home</Link>
              <Link to="/analysis" className="text-sm font-medium hover:text-secondary">Color Analysis</Link>
              <Link to="/about" className="text-sm font-medium hover:text-secondary">About Us</Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.displayName || user?.email || "User"} />
                      <AvatarFallback className="bg-rose-100 text-rose-600">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.displayName || user?.email || "Guest"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "guest@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will need to sign in again to access your saved analyses and profile.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleLogout}
                          className="bg-rose-400 hover:bg-rose-500"
                        >
                          Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-50">
            <div className="flex flex-col p-4 space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-secondary">Home</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-secondary">About Us</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/analysis" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-secondary">Color Analysis</Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-secondary">Profile</Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-red-600 hover:underline text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-secondary">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-secondary">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}