import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[AeroLux ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 shadow-luxury">
            <div className="w-14 h-14 rounded-full bg-red-950/40 text-red-400 border border-red-800/40 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl text-white font-bold mb-2">
              Flight Navigation Interruption
            </h1>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              An unexpected condition occurred while rendering this flight deck view.
              Our automated systems have recorded the anomaly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={this.handleReset}
                icon={Home}
                className="w-full sm:w-auto"
              >
                Return to Terminal
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
                icon={RefreshCw}
                className="w-full sm:w-auto"
              >
                Reload Avionics
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
