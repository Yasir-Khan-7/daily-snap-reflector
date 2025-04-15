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
  FileText,
  BrainCircuit,
  Clock,
  CheckCircle,
  ChevronRight
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group",
        isActive
          ? "bg-purple-100 text-purple-900 shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="w-4 h-4 transition-transform group-hover:scale-110">{icon}</span>}
      {children}
      {!isActive && <span className="absolute left-0 top-0 h-full w-0 bg-purple-100 rounded-lg opacity-0 transition-all duration-300 group-hover:w-1 group-hover:opacity-100"></span>}
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
    <header className="sticky top-0 z-30 w-full border-b backdrop-blur-sm bg-white/90 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Nav for Desktop */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 group transition-transform hover:scale-105">
            <img src="/logo.png" alt="Daily Snap" className="h-8 w-8 transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">Daily Snap</span>
          </Link>

          <nav className="hidden md:flex items-center gap-3">
            <NavLink href="/dashboard" icon={<Home className="h-4 w-4" />}>Dashboard</NavLink>
            <NavLink href="/notes" icon={<FileText className="h-4 w-4" />}>All Notes</NavLink>
            <NavLink href="/assistant" icon={<BrainCircuit className="h-4 w-4" />}>AI Assistant</NavLink>
            <NavLink href="/pomodoro" icon={<Clock className="h-4 w-4" />}>Pomodoro</NavLink>
            <NavLink href="/habits" icon={<CheckCircle className="h-4 w-4" />}>Habits</NavLink>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-purple-50 hover:bg-purple-100 hover:scale-105 transition-all">
                  <Avatar className="h-8 w-8 border border-purple-200 ring-2 ring-purple-500/20 transition-all hover:ring-purple-500/50">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xs font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-lg animate-in fade-in-80 zoom-in-95">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>My Account</span>
                    <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="hover:bg-purple-50 rounded-lg p-2 transition-colors flex items-center cursor-pointer">
                  <Link to="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-purple-50 rounded-lg p-2 transition-colors flex items-center cursor-pointer">
                  <Link to="/notes">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>All Notes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-purple-50 rounded-lg p-2 transition-colors flex items-center cursor-pointer">
                  <Link to="/assistant">
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    <span>AI Assistant</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-purple-50 rounded-lg p-2 transition-colors flex items-center cursor-pointer">
                  <Link to="/pomodoro">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Pomodoro Timer</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-purple-50 rounded-lg p-2 transition-colors flex items-center cursor-pointer">
                  <Link to="/habits">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Habit Tracker</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="hover:bg-red-50 text-red-600 rounded-lg p-2 transition-colors flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-50 transition-colors">
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:max-w-none bg-white/95 backdrop-blur-sm border-l border-purple-100">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-purple-200 ring-2 ring-purple-500/20">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
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
                    href="/assistant"
                    icon={<BrainCircuit className="h-4 w-4" />}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    AI Assistant
                  </NavLink>
                  <NavLink
                    href="/pomodoro"
                    icon={<Clock className="h-4 w-4" />}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pomodoro Timer
                  </NavLink>
                  <NavLink
                    href="/habits"
                    icon={<CheckCircle className="h-4 w-4" />}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Habit Tracker
                  </NavLink>
                  <NavLink
                    href="/auth"
                    icon={<LogOut className="h-4 w-4" />}
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50/50 via-white to-blue-50/30">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t backdrop-blur-sm bg-white/80 py-5 text-center text-sm text-gray-500">
        <div className="container">
          <p className="flex items-center justify-center gap-1">
            <span className="text-purple-600 font-semibold">Daily Snap</span> 
            <span>&copy; {new Date().getFullYear()}</span>
            <span>-</span>
            <span>Your daily reflection companion</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
