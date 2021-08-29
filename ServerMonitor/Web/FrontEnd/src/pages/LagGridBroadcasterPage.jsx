import React, {useEffect, useState} from "react";
import ActionBar from "../components/ActionBar";
import {
    Box,
    Button,
    Container,
    Drawer,
    FormControl,
    Grid,
    InputLabel,
    LinearProgress,
    makeStyles,
    MenuItem,
    Select,
    Theme,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import TimelapseOutlinedIcon from "@material-ui/icons/TimelapseOutlined";
import RefreshIcon from "@material-ui/icons/Refresh";
import NetworkErrorPage from "./NetworkErrorPage";
import type {MeasureResult} from "../apis/LagGridBroadcasterApi";
import LagGridBroadcasterApi from "../apis/LagGridBroadcasterApi";
import Alert from "@material-ui/lab/Alert";
import ToolbarWithBottomBorder from "../components/ToolbarWithBottomBorder";
import {BooleanParam, StringParam, useQueryParam, withDefault} from "use-query-params";
import stringComparer from "../utils/stringComparer";

//constants
const filterWidth = 300

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

const useContentStyles = makeStyles((theme: Theme) => ({
    content: {
        pointerEvents: props => props.loading ? "none" : "inherit",
        opacity: props => props.loading ? "0.2" : "inherit"
    }
}))

function Content(
    {loading, measureResult}: { loading: boolean, measureResult?: MeasureResult }
) {
    const classes = useContentStyles({loading: measureResult?.latestMeasureTime != null && loading})
    const [orderBy, setOrderBy] = useQueryParam("orderBy", withDefault(StringParam, "time"))
    if (measureResult == null || (measureResult.latestMeasureTime == null && loading)) return null

    const totalMainThreadTimePerTick = measureResult.latestResults.reduce((acc, current) => acc + current.mainThreadTimePerTick, 0)
    const measureTime = new Date(measureResult.latestMeasureTime).toLocaleString()

    //copy and order measureResult
    const latestResults = measureResult.latestResults?.slice()
    if (latestResults != null) {
        switch (orderBy) {
            case "faction":
                latestResults.sort((a, b) => stringComparer(a.factionName, b.factionName))
                break
            case "player":
                latestResults.sort((a, b) => stringComparer(a.playerDisplayName, b.playerDisplayName))
                break
            case "time" :
                latestResults.sort((a, b) => b.mainThreadTimePerTick - a.mainThreadTimePerTick)
                break
        }
    }

    return (
        <Box className={classes.content} paddingTop={2}>
            <Container maxWidth={false}>
                {
                    measureResult.latestMeasureTime == null || latestResults == null ?
                        <Alert severity="error">No data! The server has not run measure command yet.</Alert> :
                        <Grid container direction="column" spacing={4}>
                            <Grid item xs={12}>
                                <Typography>
                                    <strong>Last measure time:</strong> {measureTime}
                                </Typography>
                            </Grid>
                            <Grid container item xs={12} direction="column">
                                {latestResults.map(result => {
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

function FilterContent({measureResult}: { measureResult: MeasureResult }) {
    const [orderBy, setOrderBy] = useQueryParam("orderBy", withDefault(StringParam, "time"))

    return (
        <Box display="flex" flexDirection="column" flex="auto" padding={2}>
            <FormControl variant="outlined">
                <InputLabel>OrderBy</InputLabel>
                <Select value={orderBy} onChange={event => setOrderBy(event.target.value)} label="OrderBy">
                    <MenuItem value="time">Time</MenuItem>
                    <MenuItem value="player">Player</MenuItem>
                    <MenuItem value="faction">Faction</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}

export default function () {
    const [loading, setLoading] = useState(true)
    const [measureResult, setMeasureResult] = useState(null)
    const [fetchError: Error, setFetchError] = useState(null)
    const [fetchRetryEvent, setFetchRetryEvent] = useState(null)
    const [showFilter, setShowFilter] = useQueryParam("filter", BooleanParam);

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
            <Box display="flex" flexDirection="column" flex="auto"
                 maxWidth={showFilter ? `calc(100% - ${filterWidth}px)` : "100%"}>
                <ActionBar icon={<TimelapseOutlinedIcon/>} title="LagGridBroadcaster" subTitle="Grids Measurement">
                    <Button startIcon={<RefreshIcon/>} color="primary" onClick={refresh}>
                        Refresh
                    </Button>
                    {
                        !showFilter &&
                        <Button color="primary" flexEnd={true} onClick={() => setShowFilter(!showFilter)}>
                            Show Filter
                        </Button>
                    }
                </ActionBar>
                {content}
            </Box>
            <Drawer variant="persistent" anchor="right" open={showFilter} transitionDuration={0}>
                <Toolbar/>
                <ToolbarWithBottomBorder variant="dense" disableGutters>
                    <Box display="flex" flexDirection="row" flex="auto" alignItems="center" paddingX={2}>
                        <Box display="flex" flex="auto" alignItems="center">
                            <Typography variant="h6" noWrap>Filter</Typography>
                        </Box>
                        <Box display="flex" justifyContent="flex-end" alignItems="center">
                            <Button color="primary" style={{fontWeight: 550}} onClick={() => setShowFilter(false)}>
                                Hide Filter
                            </Button>
                        </Box>
                    </Box>
                </ToolbarWithBottomBorder>
                <Box width={filterWidth}>
                    {measureResult == null ? <LinearProgress/> : <FilterContent measureResult={measureResult}/>}
                </Box>
            </Drawer>
        </Box>
    )
}
