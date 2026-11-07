import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles, Building2, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/api/auth';
import { toast } from 'sonner';

const signupSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(50, 'Business name must be under 50 characters'),
  email: z.string().email('Please enter a valid business email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be under 100 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      businessName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    try {
      const response = await authApi.signup({
        businessName: values.businessName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      toast.success(response.message || 'Registration successful! Please log in.');
      navigate('/login', {
        state: { registeredEmail: values.email.trim().toLowerCase() },
      });
    } catch (err: any) {
      const message = err.message || 'Failed to complete registration. Please try again.';
      setServerError(message);
      toast.error('Registration failed', {
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
          <CardTitle className="text-xl font-bold">Create your workspace</CardTitle>
          <CardDescription>
            Register your business to begin managing WhatsApp AI customer support.
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
              <Label htmlFor="businessName">Business Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="businessName"
                  placeholder="Acme Store"
                  className="pl-9"
                  error={!!errors.businessName}
                  disabled={isSubmitting}
                  {...register('businessName')}
                />
              </div>
              {errors.businessName && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Business Email</Label>
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
              <Label htmlFor="password">Password</Label>
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

            <div className="rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center space-x-1.5 font-medium text-foreground/80">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>Backend Integration Ready</span>
              </div>
              <p>Submits to Spring Boot endpoint <code className="text-foreground font-mono">POST /api/auth/signup</code></p>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-medium h-10 mt-2"
              isLoading={isSubmitting}
            >
              Register Business
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/60 py-4 text-xs text-muted-foreground">
          <span>Already registered?</span>
          <Link
            to="/login"
            className="ml-1.5 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
