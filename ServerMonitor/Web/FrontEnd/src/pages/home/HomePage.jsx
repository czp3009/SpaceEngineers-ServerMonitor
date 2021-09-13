import React, {useEffect, useState} from "react";
import {Box, Button, LinearProgress} from "@material-ui/core";
import type {ServerBasicInfo} from "../../apis/BasicInfoApi";
import BasicInfoApi from "../../apis/BasicInfoApi";
import NetworkErrorPage from "../error/NetworkErrorPage";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ActionBar from "../../components/ActionBar";
import RefreshIcon from "@material-ui/icons/Refresh";
import Content from "./components/Content";

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
