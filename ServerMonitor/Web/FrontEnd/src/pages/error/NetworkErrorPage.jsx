import React from "react";
import {Link, Typography} from "@material-ui/core";

export default function ({error, callback}: { error: Error, callback?: Function }) {
    function onClick(event) {
        event.preventDefault()
        callback?.(event)
    }

    return (
        <Typography variant="h6">
            Network error: {error.message}, please <Link href="#" onClick={onClick}>Try again.</Link>
        </Typography>
    )
}
