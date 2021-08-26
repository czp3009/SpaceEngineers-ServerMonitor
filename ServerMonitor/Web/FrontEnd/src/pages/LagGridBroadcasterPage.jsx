import React from "react";
import ActionBar from "../components/ActionBar";
import {Box, Button} from "@material-ui/core";
import TimelapseIcon from "@material-ui/icons/Timelapse";
import RefreshIcon from "@material-ui/icons/Refresh";

export default function () {
    return (
        <Box>
            <ActionBar icon={<TimelapseIcon/>} title="LagGridBroadcaster" subTitle="Grids Measurement">
                <Button startIcon={<RefreshIcon/>} color="primary">Refresh</Button>
                <Box display="flex" flex="auto" justifyContent="flex-end">
                    <Button color="primary">Show Filter</Button>
                </Box>
            </ActionBar>
        </Box>
    )
}
