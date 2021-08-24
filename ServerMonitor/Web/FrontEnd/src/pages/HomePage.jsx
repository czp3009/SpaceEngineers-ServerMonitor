import React, {useEffect, useState} from "react";
import {Box, Container, Grid, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import type {ServerBasicInfo} from "../apis/BasicInfoApi";
import BasicInfoApi from "../apis/BasicInfoApi";
import MessageIcon from "@material-ui/icons/Message";
import StorageIcon from "@material-ui/icons/Storage";
import LoadingPage from "./LoadingPage";
import NetworkErrorPage from "./NetworkErrorPage";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(2)
    }
}))

export default function () {
    const classes = useStyles()
    const [serverBasicInfo: ServerBasicInfo, setServerBasicInfo] = useState(null)
    const [fetchError: Error, setFetchError] = useState(null)
    const [fetchRetryEvent, setFetchRetryEvent] = useState(null)

    useEffect(() => {
        if (serverBasicInfo != null) return
        BasicInfoApi.getBasicInfo().then(setServerBasicInfo).catch(setFetchError)
        return () => {
            setServerBasicInfo(null)
            setFetchError(null)
        }
    }, [fetchRetryEvent])

    if (fetchError != null) {
        return <NetworkErrorPage error={fetchError} callback={setFetchRetryEvent}/>
    }

    if (serverBasicInfo == null) {
        return <LoadingPage/>
    }

    return (
        <Box className={classes.root}>
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
        </Box>
    )
}
