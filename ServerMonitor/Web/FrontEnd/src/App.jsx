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
import {BrowserRouter as Router, Link as RouterLink, Route, Switch} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";
import type {ServerBasicInfo} from "./apis/BasicInfoApi";
import BasicInfoApi from "./apis/BasicInfoApi";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    bar: {
        zIndex: theme.zIndex.drawer + 1
    },
    barIconButton: {
        marginRight: theme.spacing(2),
    },
    barTitle: {
        color: "white",
        "&:hover": {
            textDecoration: "none"
        }
    },
    drawer: {
        zIndex: `${theme.zIndex.drawer} !important`,
    },
    drawerList: {
        width: 250,
        paddingTop: theme.mixins.toolbar.minHeight + theme.spacing(2)
    }
}))

function UserInterface(
    {
        sessionName,
        serverBasicInfo,
        onServerBasicInfoChange
    }: { sessionName?: string, serverBasicInfo?: ServerBasicInfo, onServerBasicInfoChange?: (ServerBasicInfo)=>{} }
) {
    const classes = useStyles()
    const [drawerOpened, setDrawerOpened] = useState(false)

    return (
        <Router>
            <Box className={classes.root}>
                <AppBar className={classes.bar} position="sticky">
                    <Toolbar>
                        <IconButton edge="start" className={classes.barIconButton} color="inherit"
                                    onClick={() => setDrawerOpened(!drawerOpened)}>
                            <MenuIcon/>
                        </IconButton>
                        <Link className={classes.barTitle} component={RouterLink} to="/"
                              onClick={() => setDrawerOpened(false)}>
                            <Typography variant="h6">
                                {sessionName ?? "SpaceEngineers Server Monitor"}
                            </Typography>
                        </Link>
                    </Toolbar>
                </AppBar>

                <Drawer className={classes.drawer} anchor="left" open={drawerOpened}
                        onClose={() => setDrawerOpened(false)}>
                    <List className={classes.drawerList} onClick={() => setDrawerOpened(false)}>
                        <ListItem button component={RouterLink} to="/">
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItem>
                        <ListItem button component={RouterLink} to="/about">
                            <ListItemIcon>
                                <HelpIcon/>
                            </ListItemIcon>
                            <ListItemText primary="About"/>
                        </ListItem>
                    </List>
                </Drawer>

                <main>
                    <Switch>
                        <Route path="/" exact>
                            <HomePage serverBasicInfo={serverBasicInfo}
                                      onServerBasicInfoChange={onServerBasicInfoChange}/>
                        </Route>
                        <Route path="/about" exact>
                            <AboutPage/>
                        </Route>
                        <Route>
                            <NotFoundPage/>
                        </Route>
                    </Switch>
                </main>
            </Box>
        </Router>
    )
}

export default function () {
    const [sessionName: string, setSessionName] = useState(localStorage.getItem("sessionName"))
    const [serverBasicInfo: ServerBasicInfo, setServerBasicInfo] = useState(null)
    const [fetchError: Error, setFetchError] = useState(null)

    useEffect(() => {
        if (sessionName != null) {
            document.title = sessionName
            localStorage.setItem("sessionName", sessionName)
        }
    }, [sessionName])

    function onServerBasicInfoChange(newServerBasicInfo: ServerBasicInfo) {
        setServerBasicInfo(newServerBasicInfo)
        if (newServerBasicInfo.sessionName != null) {
            setSessionName(newServerBasicInfo.sessionName)
        }
    }

    const userInterface = <UserInterface sessionName={sessionName} serverBasicInfo={serverBasicInfo}
                                         onServerBasicInfoChange={onServerBasicInfoChange}/>

    //sessionName exist in cache or changed after first render
    if (sessionName != null) {
        return userInterface
    }

    //error occurred
    if (fetchError != null) {
        return (
            <Typography variant={"h6"}>
                Error: {fetchError.message}, please check your network and refresh this page.
            </Typography>
        )
    }

    //loading
    if (serverBasicInfo == null) {
        BasicInfoApi.getBasicInfo()
            .then(it => onServerBasicInfoChange(it))
            .catch(setFetchError)
        return <LinearProgress/>
    }

    return userInterface
}
