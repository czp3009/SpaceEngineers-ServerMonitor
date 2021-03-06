import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    LinearProgress,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Theme,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import HelpIcon from "@material-ui/icons/Help";
import React, {useEffect, useState} from "react";
import {Link as RouterLink, Route, Switch} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/error/NotFoundPage";
import AboutPage from "./pages/about/AboutPage";
import type {ServerBasicInfo} from "./apis/BasicInfoApi";
import BasicInfoApi from "./apis/BasicInfoApi";
import TimelapseIcon from "@material-ui/icons/Timelapse";
import LinearProgressSuspense from "./components/LinearProgressSuspense";

const LagGridBroadcasterPage = React.lazy(() => import("./pages/thirdPartyPlugins/lagGridBroadcaster/LagGridBroadcasterPage"))

const useStyles = makeStyles((theme: Theme) => ({
    bar: {
        zIndex: theme.zIndex.drawer + 1
    },
    barTitle: {
        color: "white",
        padding: theme.spacing(0, 1),
        "&:hover": {
            textDecoration: "none"
        }
    },
    drawer: {
        zIndex: `${theme.zIndex.drawer} !important`,
        flexShrink: 1
    },
    drawerPaper: {
        width: 250,
        [theme.breakpoints.down("xs")]: {
            width: "100%"
        }
    }
}))

function UserInterface(
    {
        serverBasicInfo: basicInfo,
        onServerBasicInfoChange: onBasicInfoChange
    }: { serverBasicInfo: ServerBasicInfo, onServerBasicInfoChange: (ServerBasicInfo)=>{} }
) {
    const classes = useStyles()
    const [drawerOpened, setDrawerOpened] = useState(false)

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <AppBar className={classes.bar} position="sticky">
                <Toolbar>
                    <Box display="flex">
                        <IconButton edge="start" color="inherit" onClick={() => setDrawerOpened(!drawerOpened)}>
                            <MenuIcon/>
                        </IconButton>
                    </Box>
                    <Box display="flex">
                        <Link className={classes.barTitle} component={RouterLink} to="/"
                              onClick={() => setDrawerOpened(false)}>
                            <Typography variant="h6" noWrap>
                                {basicInfo.sessionName ?? "SpaceEngineers Server Monitor"}
                            </Typography>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer classes={{root: classes.drawer, paper: classes.drawerPaper}} anchor="left"
                    open={drawerOpened} onClose={() => setDrawerOpened(false)}>
                <Toolbar/>
                <List onClick={() => setDrawerOpened(false)}>
                    <ListItem button component={RouterLink} to="/">
                        <ListItemIcon>
                            <HomeIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItem>
                    {
                        basicInfo.thirdPartyPluginSupport.lagGridBroadcasterPlugin &&
                        <ListItem button component={RouterLink} to="/thirdParty/lagGridBroadcaster">
                            <ListItemIcon>
                                <TimelapseIcon/>
                            </ListItemIcon>
                            <ListItemText primary="LagGridBroadcaster"/>
                        </ListItem>
                    }
                    <ListItem button component={RouterLink} to="/about">
                        <ListItemIcon>
                            <HelpIcon/>
                        </ListItemIcon>
                        <ListItemText primary="About"/>
                    </ListItem>
                </List>
            </Drawer>

            <Switch>
                <Route path="/" exact>
                    <HomePage serverBasicInfo={basicInfo} onServerBasicInfoChange={onBasicInfoChange}/>
                </Route>
                <Route path="/thirdParty/lagGridBroadcaster" exact>
                    <LinearProgressSuspense>
                        <LagGridBroadcasterPage/>
                    </LinearProgressSuspense>
                </Route>
                <Route path="/about" exact>
                    <AboutPage/>
                </Route>
                <Route>
                    <NotFoundPage/>
                </Route>
            </Switch>
        </Box>
    )
}

export default function () {
    const [serverBasicInfo: ServerBasicInfo, setServerBasicInfo] = useState(null)
    const [fetchError: Error, setFetchError] = useState(null)

    useEffect(() => {
        if (serverBasicInfo?.sessionName == null) return
        document.title = serverBasicInfo.sessionName
    }, [serverBasicInfo?.sessionName])

    //error occurred
    if (fetchError != null) {
        return (
            <Typography variant="h6">
                Error: {fetchError.message}, please check your network and refresh this page.
            </Typography>
        )
    }

    //load server basic info before everything
    if (serverBasicInfo == null) {
        BasicInfoApi.getBasicInfo(null, response => {
            if (response.ok) return response
            throw new Error(response.statusText)
        }).then(setServerBasicInfo).catch(setFetchError)
        return <LinearProgress/>
    }

    return <UserInterface serverBasicInfo={serverBasicInfo} onServerBasicInfoChange={setServerBasicInfo}/>
}
