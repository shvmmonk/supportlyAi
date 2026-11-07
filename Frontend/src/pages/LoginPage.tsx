import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  // Check if passed from registration
  const defaultEmail = (location.state as any)?.registeredEmail || '';
  const fromLocation = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const response = await authApi.login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (!response.token) {
        throw new Error('Authentication failed: Missing token in response');
      }

      // Store in auth context (documented session strategy, no console token dumping)
      login({
        token: response.token,
        email: response.email || values.email.trim().toLowerCase(),
        businessName: response.businessName || 'Business Owner',
      });

      toast.success(response.message || 'Welcome back to SupportlyAI!');
      navigate(fromLocation, { replace: true });
    } catch (err: any) {
      const message = err.message || 'Invalid credentials or connection issue.';
      setServerError(message);
      toast.error('Authentication failed', {
        description: message,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4 py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      {/* Brand logo */}
      <div className="mb-6 flex items-center space-x-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Supportly<span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </span>
      </div>

      <Card className="w-full max-w-md border-border/80 shadow-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl font-bold">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your credentials to access your WhatsApp support dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="mb-4 flex items-start space-x-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@example.com"
                  className="pl-9"
                  error={!!errors.email}
                  disabled={isSubmitting}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  error={!!errors.password}
                  disabled={isSubmitting}
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-border/50 bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center space-x-1.5 font-medium text-foreground/80">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                <span>Spring Boot REST Integration</span>
              </div>
              <p>Authenticates against <code className="text-foreground font-mono">POST /api/auth/login</code> and stores verified Bearer token.</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-medium h-10 mt-2"
              isLoading={isSubmitting}
            >
              Sign In
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/60 py-4 text-xs text-muted-foreground">
          <span>Need a Supportly account?</span>
          <Link
            to="/signup"
            className="ml-1.5 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Create account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
