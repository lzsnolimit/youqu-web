import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.error('Error in wrapped component:', error, info);
    }

    render() {
        if (this.state.hasError) {
            // 你可以在这里自定义备用 UI
            return <div>Error occurred. Unable to render component.</div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;