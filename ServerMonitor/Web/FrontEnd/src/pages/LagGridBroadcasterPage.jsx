import React from "react";
import ActionBar from "../components/ActionBar";
import {Box, Button, Grid} from "@material-ui/core";
import TimelapseIcon from "@material-ui/icons/Timelapse";
import RefreshIcon from "@material-ui/icons/Refresh";

export default function () {
    return (
        <Box>
            <ActionBar icon={<TimelapseIcon/>} title="LagGridBroadcaster" subTitle="Grids Measurement">
                <Button startIcon={<RefreshIcon/>} color="primary">Refresh</Button>
                <Box style={{flex: "auto"}}>
                    <Grid container item justifyContent="flex-end">
                        <Button color="primary">Show Filter</Button>
                    </Grid>
                </Box>
            </ActionBar>
        </Box>
    )
}
