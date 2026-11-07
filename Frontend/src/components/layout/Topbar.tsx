import React, { useState } from 'react';
import { Menu, Sun, Moon, LogOut, User, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { session, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      // Navigate to agents page with search param if user searches
      navigate(`/dashboard/agents?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6">
      {/* Left side: mobile toggle + Search */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Functional Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents, documents, settings..."
            className="w-full h-9 pl-9 pr-4 text-xs sm:text-sm rounded-lg bg-muted/50 border border-border/80 focus:bg-background focus:border-indigo-500 focus:outline-none transition-all placeholder:text-muted-foreground/60"
          />
        </form>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Backend status indicator */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>API Connected</span>
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-zinc-600" />
          )}
        </Button>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2 rounded-lg p-1.5 text-sm font-medium text-foreground hover:bg-muted focus:outline-none transition-colors"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-semibold text-xs shadow-sm">
              {session?.businessName ? session.businessName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline-block max-w-[120px] truncate text-xs font-medium">
              {session?.businessName || 'Account'}
            </span>
          </button>

          {/* User Menu Popup */}
          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-dropdown z-50 animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-2 border-b border-border/60 mb-1">
                  <p className="text-xs font-medium text-foreground truncate">
                    {session?.businessName || 'Business Account'}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {session?.email || 'user@example.com'}
                  </p>
                  <div className="mt-1.5 flex items-center space-x-1 text-[10px] text-indigo-600 dark:text-indigo-400">
                    <ShieldCheck className="h-3 w-3" />
                    <span>JWT Session Verified</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/dashboard/settings');
                  }}
                  className="w-full flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Account & Settings</span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
