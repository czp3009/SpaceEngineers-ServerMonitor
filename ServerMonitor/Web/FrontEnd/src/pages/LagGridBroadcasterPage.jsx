import React, {useEffect, useState} from "react";
import ActionBar from "../components/ActionBar";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormGroup,
    Grid,
    InputLabel,
    LinearProgress,
    makeStyles,
    MenuItem,
    Select,
    Theme,
    Typography,
    useMediaQuery,
    withStyles
} from "@material-ui/core";
import TimelapseOutlinedIcon from "@material-ui/icons/TimelapseOutlined";
import RefreshIcon from "@material-ui/icons/Refresh";
import NetworkErrorPage from "./NetworkErrorPage";
import type {MeasureResult} from "../apis/LagGridBroadcasterApi";
import LagGridBroadcasterApi from "../apis/LagGridBroadcasterApi";
import Alert from "@material-ui/lab/Alert";
import {BooleanParam, StringParam, useQueryParam, withDefault} from "use-query-params";
import compareString from "../utils/compareString"

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: "auto",
        paddingTop: theme.spacing(2),
        pointerEvents: props => props.loading ? "none" : "inherit",
        opacity: props => props.loading ? "0.2" : "inherit"
    },
    filter: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: 300,
        [theme.breakpoints.down("xs")]: {
            width: "100%"
        },
        padding: theme.spacing(3),
        borderLeft: "1px solid rgba(0, 0, 0, 0.12)"
    },
    filterFormControl: {
        marginBottom: theme.spacing(2)
    },
    filterHorizontalButton: {
        whiteSpace: "nowrap",
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}))

function Content(
    {loading, measureResult}: { loading: boolean, measureResult?: MeasureResult }
) {
    const classes = useContentStyles({loading: measureResult?.latestMeasureTime != null && loading})
    const [showFilter, setShowFilter] = useQueryParam("filter", withDefault(BooleanParam, false))
    const [orderBy, setOrderBy] = useQueryParam("orderBy", withDefault(StringParam, "time"))
    const downXs = useMediaQuery(theme => theme.breakpoints.down("xs"))
    if (measureResult == null || (measureResult.latestMeasureTime == null && loading)) return null

    const totalMainThreadTimePerTick = measureResult.latestResults?.reduce((acc, current) => acc + current.mainThreadTimePerTick, 0)

    //copy and order measureResult
    const latestResults = measureResult.latestResults?.slice()
    if (latestResults != null) {
        switch (orderBy) {
            case "faction":
                latestResults.sort((a, b) => compareString(a.factionName, b.factionName))
                break
            case "player":
                latestResults.sort((a, b) => compareString(a.playerDisplayName, b.playerDisplayName))
                break
            case "time" :
                latestResults.sort((a, b) => b.mainThreadTimePerTick - a.mainThreadTimePerTick)
                break
        }
    }

    function resetFilter() {
        setOrderBy(undefined)
    }

    return (
        <Box display="flex" flexDirection="row" flex="auto">
            {
                (!downXs || !showFilter) &&
                <Box className={classes.content}>
                    <Container maxWidth={false}>
                        {
                            measureResult.latestMeasureTime == null || latestResults == null ?
                                <Alert severity="error">No data! The server has not run measure command yet.</Alert> :
                                <Grid container direction="column" spacing={4}>
                                    <Grid item xs={12}>
                                        <Typography>
                                            <strong>Last measure time: </strong>
                                            <span style={{whiteSpace: "nowrap"}}>
                                                {new Date(measureResult.latestMeasureTime).toLocaleString()}
                                            </span>
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
                                                                <BorderLinearProgress variant="determinate"
                                                                                      value={progress}/>
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
            }
            {
                showFilter &&
                <Box className={classes.filter}>
                    <FormControl className={classes.filterFormControl} variant="outlined" fullWidth size="small">
                        <InputLabel>OrderBy</InputLabel>
                        <Select value={orderBy} onChange={event => setOrderBy(event.target.value)} label="OrderBy">
                            <MenuItem value="time">Time</MenuItem>
                            <MenuItem value="player">Player</MenuItem>
                            <MenuItem value="faction">Faction</MenuItem>
                        </Select>
                    </FormControl>
                    <FormGroup row>
                        <Button className={classes.filterHorizontalButton} variant="outlined" color="primary"
                                onClick={() => resetFilter()}>
                            Reset
                        </Button>
                        <Button className={classes.filterHorizontalButton} variant="outlined" color="primary"
                                onClick={() => setShowFilter(undefined)}>
                            Hide Filter
                        </Button>
                    </FormGroup>
                </Box>
            }
        </Box>
    )
}

export default function () {
    const [loading, setLoading] = useState(true)
    const [measureResult, setMeasureResult] = useState(null)
    const [fetchError: Error, setFetchError] = useState(null)
    const [fetchRetryEvent, setFetchRetryEvent] = useState(null)
    const [showFilter, setShowFilter] = useQueryParam("filter", withDefault(BooleanParam, false))

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

    function toggleFilter() {
        if (showFilter) {
            setShowFilter(undefined)
        } else {
            setShowFilter(true)
        }
    }

    return (
        <Box display="flex" flexDirection="column" flex="auto">
            <ActionBar icon={<TimelapseOutlinedIcon/>} title="LagGridBroadcaster" subTitle="Grids Measurement">
                <Button startIcon={<RefreshIcon/>} color="primary" onClick={refresh}>
                    Refresh
                </Button>
                <Button color="primary" flexEnd={true} onClick={toggleFilter}>
                    {showFilter ? "Hide Filter" : "Show Filter"}
                </Button>
            </ActionBar>
            {content}
        </Box>
    )
}
