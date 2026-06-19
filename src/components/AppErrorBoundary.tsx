import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center">
          <h1 className="text-xl font-bold text-navira-navy">Something went wrong</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{this.state.error.message}</p>
          <button
            type="button"
            className="mt-6 rounded-md bg-navira-red px-4 py-2 text-sm text-white"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
