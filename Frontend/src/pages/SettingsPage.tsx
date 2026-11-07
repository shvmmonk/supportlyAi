import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Mail,
  ShieldCheck,
  Server,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Info,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const SettingsPage: React.FC = () => {
  const { session, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in-50 duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings & Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review authenticated business details, session credentials, and frontend preferences.
        </p>
      </div>

      {/* Backend Profile Update Notice */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-muted-foreground flex items-center space-x-2.5">
        <Info className="h-4 w-4 text-indigo-500 shrink-0" />
        <div>
          <span className="font-semibold text-foreground">Account Integrity:</span> Business Name and Email are read directly from your verified JWT login payload. In compliance with the backend REST specifications, profile mutation endpoints are not exposed.
        </div>
      </div>

      {/* Business Profile (Read-Only as requested) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Information</CardTitle>
          <CardDescription>
            Account details established during business registration and verified via JWT.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="businessName">Business Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="businessName"
                  value={session?.businessName || ''}
                  readOnly
                  disabled
                  className="pl-9 bg-muted/40 cursor-not-allowed font-medium text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Authenticated Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  value={session?.email || ''}
                  readOnly
                  disabled
                  className="pl-9 bg-muted/40 cursor-not-allowed font-medium text-foreground"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground pt-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Session verified with Spring Boot Bearer token</span>
          </div>
        </CardContent>
      </Card>

      {/* Theme Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance & Interface</CardTitle>
          <CardDescription>
            Customize your SupportlyAI dashboard color theme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-xs font-medium transition-all ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                  : 'border-border bg-card hover:bg-muted text-muted-foreground'
              }`}
            >
              <Sun className="h-4 w-4 mb-2" />
              <span>Light</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-xs font-medium transition-all ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                  : 'border-border bg-card hover:bg-muted text-muted-foreground'
              }`}
            >
              <Moon className="h-4 w-4 mb-2" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-xs font-medium transition-all ${
                theme === 'system'
                  ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                  : 'border-border bg-card hover:bg-muted text-muted-foreground'
              }`}
            >
              <Laptop className="h-4 w-4 mb-2" />
              <span>System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Backend & Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Environment & Backend Services</CardTitle>
          <CardDescription>
            Target architecture configuration and verified service bindings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-border p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <Server className="h-4 w-4 text-indigo-600" />
              <div>
                <p className="font-semibold text-foreground">Spring Boot REST Server</p>
                <p className="text-muted-foreground font-mono">{apiBaseUrl}</p>
              </div>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-500/20">
              Active Host
            </span>
          </div>

          <div className="rounded-lg border border-border p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <Lock className="h-4 w-4 text-indigo-600" />
              <div>
                <p className="font-semibold text-foreground">Twilio & Groq Secrets</p>
                <p className="text-muted-foreground">Server-isolated in Spring Boot properties</p>
              </div>
            </div>
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 border border-indigo-500/20">
              Protected
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Session Termination */}
      <Card className="border-rose-500/20 bg-rose-500/5">
        <CardHeader>
          <CardTitle className="text-base text-rose-600 dark:text-rose-400">
            Sign Out
          </CardTitle>
          <CardDescription>
            Terminate your session and clear the stored JWT token from this device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="text-xs"
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            Sign Out of SupportlyAI
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
