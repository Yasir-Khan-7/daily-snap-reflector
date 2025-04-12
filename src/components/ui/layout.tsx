import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  User,
  Home,
  BarChart3,
  Menu,
  X,
  FileText
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  // Get user's initials for avatar
  const getUserInitials = () => {
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Nav for Desktop */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">Daily Snap</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <NavLink href="/dashboard" icon={<Home className="h-4 w-4" />}>Dashboard</NavLink>
            <NavLink href="/notes" icon={<FileText className="h-4 w-4" />}>All Notes</NavLink>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-purple-50">
                  <Avatar className="h-8 w-8 border border-purple-200">
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>My Account</span>
                    <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/notes" className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>All Notes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-purple-200">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">User Account</p>
                  </div>
                </div>
                <nav className="flex flex-col gap-2">
                  <NavLink
                    href="/dashboard"
                    icon={<Home className="h-4 w-4" />}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    href="/notes"
                    icon={<FileText className="h-4 w-4" />}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    All Notes
                  </NavLink>
                  <NavLink
                    href="/auth"
                    icon={<LogOut className="h-4 w-4" />}
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-white py-4 text-center text-sm text-gray-500">
        <div className="container">
          <p>Daily Snap &copy; {new Date().getFullYear()} - Your daily reflection companion</p>
        </div>
      </footer>
    </div>
  );
};
