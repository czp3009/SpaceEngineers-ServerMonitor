import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    FormGroup,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Theme,
    Typography,
    useMediaQuery
} from "@material-ui/core";
import type {MeasureResult} from "../../../../apis/LagGridBroadcasterApi";
import {BooleanParam, StringParam, useQueryParam, withDefault} from "use-query-params";
import withValidDefault from "../../../../queryParamConfigs/withValidDefault";
import Alert from "@material-ui/lab/Alert";
import React from "react";
import ResultItem from "./ResultItem";

const selectMenuProps = {anchorOrigin: {vertical: "top", horizontal: "center"}, getContentAnchorEl: null}

const useStyles = makeStyles((theme: Theme) => ({
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

export default function ({loading, measureResult}: { loading: boolean, measureResult?: MeasureResult }) {
    const classes = useStyles({loading: measureResult?.latestMeasureTime != null && loading})
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
