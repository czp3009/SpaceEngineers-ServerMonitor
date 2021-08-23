import React, {useEffect, useState} from "react";
import {Container, Grid, LinearProgress, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import type {ServerBasicInfo} from "../api/BasicInfoApi";
import BasicInfoApi from "../api/BasicInfoApi";
import MessageIcon from "@material-ui/icons/Message";
import StorageIcon from "@material-ui/icons/Storage";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(2)
    }
}))

export default function () {
    const [serverBasicInfo: ServerBasicInfo, setServerBasicInfo] = useState(null)

    useEffect(() => {
        if (serverBasicInfo != null) return
        BasicInfoApi.getBasicInfo().then(it => setServerBasicInfo(it))
    }, [])

    const classes = useStyles()
    if (serverBasicInfo == null) {
        return (<LinearProgress/>)
    }

    return (
        <div className={classes.root}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant={"h6"}>
                                <StorageIcon/>
                                Server info
                            </Typography>
                            <Typography>Is ready: {serverBasicInfo.isReady.toString()}</Typography>
                            <Typography>Players: {serverBasicInfo.players ?? "N/A"}</Typography>
                            <Typography>Session name: {serverBasicInfo.sessionName ?? "N/A"}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant={"h6"}>
                                <MessageIcon/>
                                MOTD
                            </Typography>
                            <Typography>{serverBasicInfo.messageOfToday}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
