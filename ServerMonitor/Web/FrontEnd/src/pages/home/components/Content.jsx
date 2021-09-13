import {Box, Container, Grid, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import type {ServerBasicInfo} from "../../../apis/BasicInfoApi";
import StorageIcon from "@material-ui/icons/Storage";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import MessageIcon from "@material-ui/icons/Message";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        padding: theme.spacing(2)
    },
    allChildrenMarginRight1: {
        "& *": {
            marginRight: theme.spacing(1)
        }
    }
}))

export default function ({serverBasicInfo}: { serverBasicInfo: ServerBasicInfo }) {
    const classes = useStyles()
    return (
        <Box paddingTop={2}>
            <Container maxWidth="lg">
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid className={classes.allChildrenMarginRight1} container alignItems="center">
                                <StorageIcon/>
                                <Typography variant="subtitle1">Server info</Typography>
                                {!serverBasicInfo.isReady && <WarningRoundedIcon color="secondary"/>}
                            </Grid>
                            <Typography variant="body2">
                                Is ready: {serverBasicInfo.isReady.toString()}
                            </Typography>
                            <Typography variant="body2">
                                Players: {serverBasicInfo.players ?? "N/A"}
                            </Typography>
                            <Typography variant="body2">
                                Session name: {serverBasicInfo.sessionName ?? "N/A"}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid className={classes.allChildrenMarginRight1} container alignItems="center">
                                <MessageIcon/>
                                <Typography variant="subtitle1">MOTD</Typography>
                            </Grid>
                            <Typography variant="body2">{serverBasicInfo.messageOfToday}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
