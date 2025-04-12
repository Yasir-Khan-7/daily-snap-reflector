
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User,
  Settings,
  Menu,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const NavLink = ({ href, icon, children, className, onClick }: NavLinkProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === href;
  
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        isActive 
          ? "bg-purple-100 text-purple-900 font-medium" 
          : "text-gray-600 hover:bg-gray-100",
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </Link>
  );
};

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  if (!user) return null;
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Nav for Desktop */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-purple-600">Daily Snap</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-5">
            <NavLink href="/dashboard">Dashboard</NavLink>
          </nav>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <p className="text-sm text-gray-600">
              {user.email}
            </p>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:max-w-none">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">
                    {user.email}
                  </p>
                </div>
                <nav className="flex flex-col gap-2">
                  <NavLink 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    href="/auth" 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Sign Out
                  </NavLink>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};
