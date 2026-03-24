import { RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Only log in development
    if (import.meta.env.DEV) {
      // biome-ignore lint/suspicious/noConsole: dev-only
      console.error("[ErrorBoundary]", error, info);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          data-ocid="app.error_state"
          className="flex flex-col items-center justify-center h-full min-h-[200px] gap-4 px-6 py-12 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Something went wrong
            </p>
            <p className="text-xs text-muted-foreground">
              An unexpected error occurred. Tap below to try again.
            </p>
          </div>
          <button
            type="button"
            data-ocid="app.error_state"
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange text-white text-sm font-semibold hover:bg-orange/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tap to retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Lightweight suspense fallback — centered spinner */
export function PageLoadingFallback() {
  return (
    <div
      data-ocid="app.loading_state"
      className="flex items-center justify-center h-full min-h-[300px]"
    >
      <div className="w-8 h-8 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
    </div>
  );
}
