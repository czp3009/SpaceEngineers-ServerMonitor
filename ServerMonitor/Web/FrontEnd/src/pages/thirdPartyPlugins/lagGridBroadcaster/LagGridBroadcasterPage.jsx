import React, {useEffect, useState} from "react";
import ActionBar from "../../../components/ActionBar";
import {Box, Button, LinearProgress} from "@material-ui/core";
import TimelapseOutlinedIcon from "@material-ui/icons/TimelapseOutlined";
import RefreshIcon from "@material-ui/icons/Refresh";
import NetworkErrorPage from "../../error/NetworkErrorPage";
import LagGridBroadcasterApi from "../../../apis/LagGridBroadcasterApi";
import {BooleanParam, useQueryParam, withDefault} from "use-query-params";
import Content from "./components/Content.jsx";

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
