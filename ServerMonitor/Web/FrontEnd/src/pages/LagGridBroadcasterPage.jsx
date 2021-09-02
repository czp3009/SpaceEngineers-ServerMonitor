import React, {useEffect, useState} from "react";
import ActionBar from "../components/ActionBar";
import {
    Box,
    Button,
    Container,
    Divider,
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
import withValidDefault from "../queryParamConfigs/withValidDefault";

const selectMenuProps = {anchorOrigin: {vertical: "top", horizontal: "center"}, getContentAnchorEl: null}
const unitTable = {
    ns: {
        lowerBound: 0,
        upperBound: 0.001,
        multiple: 1000 * 1000,
        fractionDigits: 0
    },
    us: {
        lowerBound: 0.001,
        upperBound: 1,
        multiple: 1000,
        fractionDigits: 0,
        display: "μs"
    },
    ms: {
        lowerBound: 1,
        upperBound: 1000,
        multiple: 1,
        fractionDigits: 0
    },
    s: {
        lowerBound: 1000,
        upperBound: Number.MAX_VALUE,
        multiple: 0.001,
        fractionDigits: 2
    }
}

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

function ResultItem({result, progress, totalMainThreadTimePerTick, unit}) {
    if (progress == null) {
        if (totalMainThreadTimePerTick == null) {
            progress = 0
        } else {
            progress = result.mainThreadTimePerTick / totalMainThreadTimePerTick * 100
        }
    }
    const owner = result.factionName != null ? `[${result.factionName}]` : "" + result.playerDisplayName

    //format time
    //mainThreadTimePerTick is in ms
    let time = result.mainThreadTimePerTick
    let timeUnit = "ms"
    let unitDefinition = unitTable[timeUnit]
    if (unit === "auto") {
        for (const [key, value] of Object.entries(unitTable)) {
            if (time >= value.lowerBound && time < value.upperBound) {
                timeUnit = key
                unitDefinition = unitTable[key]
                break
            }
        }
    } else {
        unitDefinition = unitTable[unit]
    }
    time = (time * unitDefinition.multiple).toFixed(unitDefinition.fractionDigits)
    timeUnit = unitDefinition.display ?? timeUnit

    return (
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
                        {time}{timeUnit}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

const useContentStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        flex: "auto",
        pointerEvents: props => props.loading ? "none" : "inherit",
        opacity: props => props.loading ? "0.2" : "inherit"
    },
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: "auto",
        paddingTop: theme.spacing(2)
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
    },
    inMenuDivider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}))

function Content(
    {loading, measureResult}: { loading: boolean, measureResult?: MeasureResult }
) {
    const classes = useContentStyles({loading: measureResult?.latestMeasureTime != null && loading})
    const [showFilter, setShowFilter] = useQueryParam("filter", withDefault(BooleanParam, false))
    const [groupBy, setGroupBy] = useQueryParam("groupBy", withValidDefault(StringParam, "none", ["player", "faction"]))
    const [unit, setUnit] = useQueryParam("unit", withValidDefault(StringParam, "auto", ["s", "ms", "us", "ns"]))   //μ cause compare issue
    const downXs = useMediaQuery(theme => theme.breakpoints.down("xs"))

    //still loading
    if (measureResult == null || (measureResult.latestMeasureTime == null && loading)) return null

    //if no data yet, this var may be null
    const totalMainThreadTimePerTick = measureResult.latestResults?.reduce((acc, current) => acc + current.mainThreadTimePerTick, 0)

    //copy and sort measureResult
    const latestResults = measureResult.latestResults?.slice()
    if (latestResults != null) {
        latestResults.sort((a, b) => b.mainThreadTimePerTick - a.mainThreadTimePerTick)
    }

    function resetFilter() {
        setGroupBy(undefined)
        setUnit(undefined)
    }

    return (
        <Box className={classes.root}>
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
                                        {latestResults.map(result =>
                                            <Grid item xs={12} key={result.entityId}>
                                                <ResultItem result={result}
                                                            totalMainThreadTimePerTick={totalMainThreadTimePerTick}
                                                            unit={unit}/>
                                            </Grid>
                                        )}
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
                        <InputLabel id="groupBy">Group by</InputLabel>
                        <Select MenuProps={selectMenuProps} label="groupBy" value={groupBy}
                                onChange={event => setGroupBy(event.target.value)}>
                            <MenuItem value="player">Player</MenuItem>
                            <MenuItem value="faction">Faction</MenuItem>
                            <Divider className={classes.inMenuDivider}/>
                            <MenuItem value="none">No grouping</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.filterFormControl} variant="outlined" fullWidth size="small">
                        <InputLabel id="unit">Unit</InputLabel>
                        <Select MenuProps={selectMenuProps} label="unit" value={unit}
                                onChange={event => setUnit(event.target.value)}>
                            <MenuItem value="s">Second</MenuItem>
                            <MenuItem value="ms">Millisecond</MenuItem>
                            <MenuItem value="us">Microsecond</MenuItem>
                            <MenuItem value="ns">Nanosecond</MenuItem>
                            <Divider className={classes.inMenuDivider}/>
                            <MenuItem value="auto">Auto</MenuItem>
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
