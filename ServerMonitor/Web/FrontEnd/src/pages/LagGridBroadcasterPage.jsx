import React, {useEffect, useState} from "react";
import ActionBar from "../components/ActionBar";
import {
    Box,
    Button,
    Container,
    Grid,
    LinearProgress,
    makeStyles,
    Theme,
    Typography,
    withStyles
} from "@material-ui/core";
import TimelapseOutlinedIcon from "@material-ui/icons/TimelapseOutlined";
import RefreshIcon from "@material-ui/icons/Refresh";
import NetworkErrorPage from "./NetworkErrorPage";
import type {MeasureResult} from "../apis/LagGridBroadcasterApi";
import LagGridBroadcasterApi from "../apis/LagGridBroadcasterApi";
import Alert from "@material-ui/lab/Alert";

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 20,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: "#1a90ff",
    },
}))(LinearProgress)

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        pointerEvents: props => props.loading ? "none" : "inherit",
        opacity: props => props.loading ? "0.2" : "inherit"
    }
}))

function Content(
    {loading, showFilter, measureResult}: { loading: boolean, showFilter: boolean, measureResult?: MeasureResult }
) {
    const classes = useStyles({loading: measureResult?.latestMeasureTime != null && loading})
    if (measureResult == null || (measureResult.latestMeasureTime == null && loading)) return null

    const totalMainThreadTimePerTick = measureResult.latestResults.reduce((acc, current) => acc + current.mainThreadTimePerTick, 0)
    const measureTime = new Date(measureResult.latestMeasureTime).toLocaleString()

    return (
        <Box className={classes.content} paddingTop={2}>
            <Container maxWidth={false}>
                {
                    measureResult.latestMeasureTime == null || measureResult.latestResults == null ?
                        <Alert severity="error">No data! The server has not run measure command yet.</Alert> :
                        <Grid container direction="column" spacing={4}>
                            <Grid item xs={12}>
                                <Typography>
                                    <strong>Last measure time:</strong> {measureTime}
                                </Typography>
                            </Grid>
                            <Grid container item xs={12} direction="column">
                                {measureResult.latestResults.map(result => {
                                    const progress = result.mainThreadTimePerTick / totalMainThreadTimePerTick * 100
                                    const owner = result.factionName != null ? `[${result.factionName}]` : "" + result.playerDisplayName
                                    return (
                                        <Grid item xs={12} key={result.entityId}>
                                            <Box display="flex" flexDirection="column" paddingY={1}>
                                                <Typography>
                                                    {result.entityDisplayName}({owner})
                                                </Typography>
                                                <Box display="flex" alignItems="center">
                                                    <Box flex="auto" mr={1}>
                                                        <BorderLinearProgress variant="determinate" value={progress}/>
                                                    </Box>
                                                    <Box>
                                                        <Typography color="textSecondary">
                                                            {(result.mainThreadTimePerTick * 1000).toFixed(0)}µs
                                                        </Typography>
                                                    </Box>
                                                </Box>
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
    const [showFilter, setShowFilter] = useState(false)

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
                {measureResult && <Content loading={loading} showFilter={showFilter} measureResult={measureResult}/>}
            </>
        )
    }

    return (
        <Box>
            <ActionBar icon={<TimelapseOutlinedIcon/>} title="LagGridBroadcaster" subTitle="Grids Measurement">
                <Button startIcon={<RefreshIcon/>} color="primary" onClick={refresh}>Refresh</Button>
                <Button color="primary" flexEnd={true} onClick={() => setShowFilter(!showFilter)}>
                    {showFilter ? "Hide Filter" : "Show Filter"}
                </Button>
            </ActionBar>
            {content}
        </Box>
    )
}
