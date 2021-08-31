import React, {useEffect, useState} from "react";
import {Box, Button, Container, Grid, LinearProgress, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import type {ServerBasicInfo} from "../apis/BasicInfoApi";
import BasicInfoApi from "../apis/BasicInfoApi";
import MessageIcon from "@material-ui/icons/Message";
import StorageIcon from "@material-ui/icons/Storage";
import NetworkErrorPage from "./NetworkErrorPage";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ActionBar from "../components/ActionBar";
import RefreshIcon from "@material-ui/icons/Refresh";

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

function Content({serverBasicInfo}: { serverBasicInfo: ServerBasicInfo }) {
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

export default function (
    {
        serverBasicInfo,
        onServerBasicInfoChange
    }: { serverBasicInfo: ServerBasicInfo, onServerBasicInfoChange: (ServerBasicInfo)=>{} }
) {
    const [loading, setLoading] = useState(false)
    const [fetchError: Error, setFetchError] = useState(null)
    const [fetchRetryEvent, setFetchRetryEvent] = useState(null)

    useEffect(() => {
        if (!loading) return
        const abortController = new AbortController()
        BasicInfoApi.getBasicInfo(abortController.signal)
            .then(onServerBasicInfoChange)
            .catch(setFetchError)
            .finally(() => setLoading(false))
        return () => {
            abortController.abort()
            setLoading(true)
            setFetchError(null)
        }
    }, [fetchRetryEvent])

    function refresh(event) {
        setLoading(true)
        setFetchRetryEvent(event)
    }

    let content: React.Component
    if (fetchError != null) {
        content = <NetworkErrorPage error={fetchError} callback={refresh}/>
    } else if (loading) {
        content = <LinearProgress/>
    } else {
        content = <Content serverBasicInfo={serverBasicInfo}/>
    }

    return (
        <Box display="flex" flexDirection="column" flex="auto">
            <ActionBar icon={<HomeOutlinedIcon/>} title="Home" subTitle="Server Basic Info">
                <Button startIcon={<RefreshIcon/>} color="primary" onClick={refresh}>Refresh</Button>
            </ActionBar>
            {content}
        </Box>
    )
}
