import React, {useEffect, useState} from "react";
import ActionBar from "../components/ActionBar";
import {Box, Button, Container, Grid, LinearProgress, makeStyles, Theme, Typography} from "@material-ui/core";
import TimelapseIcon from "@material-ui/icons/Timelapse";
import RefreshIcon from "@material-ui/icons/Refresh";
import NetworkErrorPage from "./NetworkErrorPage";
import type {MeasureResult} from "../apis/LagGridBroadcasterApi";
import LagGridBroadcasterApi from "../apis/LagGridBroadcasterApi";
import Alert from "@material-ui/lab/Alert";
import BorderLinearProgress from "../components/BorderLinearProgress";

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        paddingTop: theme.spacing(2),
        pointerEvents: props => props.loading ? "none" : "inherit",
        opacity: props => props.loading ? "0.2" : "inherit"
    }
}))

function Content({loading, measureResult}: { loading: boolean, measureResult?: MeasureResult }) {
    const classes = useStyles({loading: measureResult?.latestMeasureTime != null && loading})
    if (measureResult == null || (measureResult.latestMeasureTime == null && loading)) return null

    const totalMainThreadTimePerTick = measureResult.latestResults.reduce((acc, current) => acc + current.mainThreadTimePerTick, 0)
    const measureTime = new Date(measureResult.latestMeasureTime).toLocaleString()

    return (
        <Box className={classes.content}>
            <Container maxWidth={false}>
                {
                    measureResult.latestMeasureTime == null || measureResult.latestResults == null ?
                        <Alert severity="error">No data! The server has not run measure command yet.</Alert> :
                        <Grid container spacing={4} direction="column">
                            <Grid item xs={12}>
                                <Typography>
                                    <strong>Last measure time:</strong> {measureTime}
                                </Typography>
                            </Grid>
                            <Grid container spacing={2} item xs={12} direction="column">
                                {measureResult.latestResults.map(result => {
                                    const progress = result.mainThreadTimePerTick / totalMainThreadTimePerTick * 100
                                    const owner = result.factionName != null ? `[${result.factionName}]` : "" + result.playerDisplayName
                                    return (
                                        <Grid item xs={12} key={result.entityId}>
                                            <Typography>
                                                {result.entityDisplayName}({owner})
                                            </Typography>
                                            <Box display="flex" alignItems="center">
                                                <Box flex="auto">
                                                    <BorderLinearProgress variant="determinate" value={progress}/>
                                                </Box>
                                                <Typography style={{minWidth: 60, marginLeft: 8}}>
                                                    {(result.mainThreadTimePerTick * 1000).toFixed(0)} µs
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                }
            </Container>
        </Box>
    )
}

export default function () {
    const [loading, setLoading] = useState(true)
    const [measureResult, setMeasureResult] = useState(null)
    const [fetchError: Error, setFetchError] = useState(null)
    const [fetchRetryEvent, setFetchRetryEvent] = useState(null)

    useEffect(() => {
        if (!loading) return
        const abortController = new AbortController()
        LagGridBroadcasterApi.getLatestMeasureResult(abortController.signal)
            .then(setMeasureResult)
            .catch(setFetchError)
            .finally(() => setLoading(false))
        return () => {
            abortController.abort()
            setLoading(true)
            setFetchError(null)
        }
    }, [fetchRetryEvent])

    function refresh(event) {
        if (fetchError != null) setMeasureResult(null)
        setLoading(true)
        setFetchRetryEvent(event)
    }

    let content: React.Component
    if (fetchError != null) {
        content = <NetworkErrorPage error={fetchError} callback={refresh}/>
    } else {
        content = (
            <>
                {loading && <LinearProgress/>}
                {measureResult && <Content loading={loading} measureResult={measureResult}/>}
            </>
        )
    }

    return (
        <Box>
            <ActionBar icon={<TimelapseIcon/>} title="LagGridBroadcaster" subTitle="Grids Measurement">
                <Button startIcon={<RefreshIcon/>} color="primary" onClick={refresh}>Refresh</Button>
                <Box display="flex" flex="auto" justifyContent="flex-end">
                    <Button color="primary">Show Filter</Button>
                </Box>
            </ActionBar>
            {content}
        </Box>
    )
}
