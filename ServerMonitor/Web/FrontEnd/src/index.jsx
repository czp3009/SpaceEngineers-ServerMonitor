import React from "react";
import ReactDOM from "react-dom";
import {Button} from "@material-ui/core";

function App() {
    return (
        <Button variant="contained" color="primary">
            hello,world
        </Button>
    );
}

ReactDOM.render(<App/>, document.getElementById("root"));
