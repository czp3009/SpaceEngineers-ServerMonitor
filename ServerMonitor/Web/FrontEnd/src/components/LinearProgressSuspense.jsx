import React, {Suspense} from "react";
import {LinearProgress} from "@material-ui/core";

export default function ({children}) {
    return (
        <Suspense fallback={<LinearProgress/>}>
            {children}
        </Suspense>
    )
}
