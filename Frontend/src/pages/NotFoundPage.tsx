import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center selection:bg-indigo-500 selection:text-white">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4 ring-8 ring-indigo-500/5">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        404
      </h1>
      <p className="mt-2 text-base font-medium text-muted-foreground">
        Page not found
      </p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex space-x-3">
        <Link to="/dashboard">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-xs">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
