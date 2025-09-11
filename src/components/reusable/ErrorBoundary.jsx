import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can log error details to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback || <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
