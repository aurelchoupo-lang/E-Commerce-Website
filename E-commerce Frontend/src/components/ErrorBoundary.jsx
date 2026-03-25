import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 dark:bg-gray-800 dark:bg-red-900/20 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4">
              <i className="fas fa-exclamation-triangle text-5xl text-red-500"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're sorry for the inconvenience. A technical error has occurred:
            </p>
            {this.state.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm max-h-32 overflow-auto">
                <p className="font-bold">Error:</p>
                <p>{this.state.error.toString()}</p>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-50 dark:bg-gray-800 dark:bg-blue-900/200 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
              >
                <i className="fas fa-redo mr-2"></i>Try Again
              </button>
              <a
                href="/"
                className="w-full block bg-gray-50 dark:bg-gray-9000 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition text-center"
              >
                <i className="fas fa-home mr-2"></i>Go Home
              </a>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200">
                  Technical Details (Dev Only)
                </summary>
                <pre className="mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto max-h-48">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
