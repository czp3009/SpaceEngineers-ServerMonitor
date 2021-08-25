import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    LinearProgress,
    makeStyles,
    Paper,
    Theme,
    Typography
} from "@material-ui/core";
import type {ServerBasicInfo} from "../apis/BasicInfoApi";
import BasicInfoApi from "../apis/BasicInfoApi";
import MessageIcon from "@material-ui/icons/Message";
import StorageIcon from "@material-ui/icons/Storage";
import NetworkErrorPage from "./NetworkErrorPage";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

const useStyles = makeStyles((theme: Theme) => ({
    actionBar: {
        borderBottom: "2px solid rgba(0, 0, 0, 0.12)",
        "& svg": {
            margin: theme.spacing(1),
        },
        "& h6": {
            margin: theme.spacing(1),
        },
        "& hr": {
            margin: theme.spacing(0, 1),
        },
        "& .page-description": {
            marginRight: theme.spacing(4)
        }
    },
    content: {
        paddingTop: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(2)
    },
    inlineIconAndText: {
        display: "inline-flex",
        "& *": {
            marginRight: theme.spacing(1)
        }
    }
}))

export default function (
    {
        serverBasicInfo,
        onServerBasicInfoChange
    }: { serverBasicInfo?: ServerBasicInfo, onServerBasicInfoChange?: (ServerBasicInfo)=>{} }
) {
    const classes = useStyles()
    const [loading, setLoading] = useState(serverBasicInfo == null)
    const [fetchError: Error, setFetchError] = useState(null)
    const [fetchRetryEvent, setFetchRetryEvent] = useState(null)

    useEffect(() => {
        if (!loading) return
        BasicInfoApi.getBasicInfo()
            .then(it => onServerBasicInfoChange?.(it))
            .catch(setFetchError)
            .finally(() => setLoading(false))
        return () => {
            setLoading(true)
            setFetchError(null)
        }
    }, [fetchRetryEvent])

    function refresh(event) {
        setLoading(true)
        setFetchRetryEvent(event)
    }

    if (fetchError != null) {
        return <NetworkErrorPage error={fetchError} callback={refresh}/>
    }

    if (loading) {
        return <LinearProgress/>
    }

    return (
        <Box>
            <Container className={classes.actionBar} maxWidth={false}>
                <Grid container alignItems="center">
                    <HomeOutlinedIcon/>
                    <Typography variant="h6">Home</Typography>
                    <Divider orientation="vertical" flexItem/>
                    <Typography className="page-description" variant="h6">Server Basic Info</Typography>
                    <Button color="primary" onClick={refresh}>Refresh</Button>
                </Grid>
            </Container>
            <Container className={classes.content} maxWidth="lg">
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="subtitle1" className={classes.inlineIconAndText}>
                                {/*TODO: grid layout inline*/}
                                <StorageIcon/><span>Server info</span>{!serverBasicInfo.isReady &&
                            <WarningRoundedIcon color="secondary"/>}
                            </Typography>
                            <Typography variant="body2">Is ready: {serverBasicInfo.isReady.toString()}</Typography>
                            <Typography variant="body2">Players: {serverBasicInfo.players ?? "N/A"}</Typography>
                            <Typography variant="body2">Session
                                name: {serverBasicInfo.sessionName ?? "N/A"}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="subtitle1" className={classes.inlineIconAndText}>
                                <MessageIcon/> MOTD
                            </Typography>
                            <Typography variant="body2">{serverBasicInfo.messageOfToday}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
