import React from 'react';
import ReactDOM from "react-dom";
import {CssBaseline} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";
import theme from "./theme";
import App from "./App";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {QueryParamProvider} from "use-query-params";
import {ErrorBoundary} from "react-error-boundary";

function ErrorFallback({error}) {
    return (
        <div>
            <p>Error occurred, please send error message to developers</p>
            <pre>{error.stack}</pre>
        </div>
    )
}

ReactDOM.render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <QueryParamProvider ReactRouterRoute={Route}>
                    <App/>
                </QueryParamProvider>
            </Router>
        </ThemeProvider>
    </ErrorBoundary>,
    document.getElementById("root")
)
