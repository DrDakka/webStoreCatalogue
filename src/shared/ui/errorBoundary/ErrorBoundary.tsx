import { Component, ErrorInfo, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

const DefaultFallback = ({ error }: { error: Error | null }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '48px 24px',
      minHeight: '40vh',
      textAlign: 'center',
    }}
  >
    <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
      Something went wrong
    </h2>
    {error && (
      <p style={{ color: '#89939a', fontSize: '14px' }}>{error.message}</p>
    )}
    <button
      type="button"
      onClick={() => window.location.reload()}
      style={{
        padding: '8px 24px',
        border: '1px solid #313237',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '14px',
      }}
    >
      Reload page
    </button>
  </div>
);

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <DefaultFallback error={this.state.error} />
      );
    }

    return this.props.children;
  }
}
