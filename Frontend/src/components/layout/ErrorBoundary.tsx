import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 rounded-full bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {this.state.error?.message ||
              'An unexpected error occurred while rendering this view.'}
          </p>
          <div className="mt-6 flex space-x-3">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Application
            </Button>
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
