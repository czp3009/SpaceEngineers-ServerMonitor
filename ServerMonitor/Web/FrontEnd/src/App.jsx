import {
    AppBar,
    Box,
    Drawer,
    IconButton,
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
import InfoIcon from "@material-ui/icons/Info";
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Link as RouterLink, Route, Switch} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";
import type {ServerBasicInfo} from "./apis/BasicInfoApi";
import BasicInfoApi from "./apis/BasicInfoApi";
import LoadingPage from "./pages/LoadingPage";
import NetworkErrorPage from "./pages/NetworkErrorPage";

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

export default function () {
    const classes = useStyles()
    const [drawerOpened, setDrawerOpened] = useState(false)
    //fetch basic info before all page
    const [serverBasicInfo: ServerBasicInfo, setServerBasicInfo] = useState(null)
    const [sessionName: string, setSessionName] = useState(localStorage.getItem("sessionName"))  //read data from local storage
    const [fetchError: Error, setFetchError] = useState(null)
    const [fetchRetryEvent, setFetchRetryEvent] = useState(null)

    if (sessionName != null) {
        document.title = sessionName
    }

    useEffect(() => {
        BasicInfoApi.getBasicInfo()
            .then(it => {
                setServerBasicInfo(it)
                const retrievedSessionName = it.sessionName
                if (retrievedSessionName != null) {
                    localStorage.setItem("sessionName", retrievedSessionName)
                    document.title = retrievedSessionName
                    setSessionName(retrievedSessionName)
                }
            })
            .catch(setFetchError)
        return () => {
            setServerBasicInfo(null)
            setFetchError(null)
        }
    }, [fetchRetryEvent])

    let Content
    if (fetchError != null) {
        Content = () => (
            <NetworkErrorPage error={fetchError} callback={setFetchRetryEvent}/>
        )
    } else if (serverBasicInfo == null) {
        Content = () => (
            <LoadingPage/>
        )
    } else {
        Content = () => (
            <>
                <Drawer className={classes.drawer} anchor="left" open={drawerOpened}
                        onClose={() => setDrawerOpened(false)}
                >
                    <List className={classes.drawerList} onClick={() => setDrawerOpened(false)}>
                        <ListItem button component={RouterLink} to="/">
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItem>
                        <ListItem button component={RouterLink} to="/about">
                            <ListItemIcon>
                                <InfoIcon/>
                            </ListItemIcon>
                            <ListItemText primary="About"/>
                        </ListItem>
                    </List>
                </Drawer>

                <main>
                    <Switch>
                        <Route path="/" exact>
                            <HomePage serverBasicInfo={serverBasicInfo}/>
                        </Route>
                        <Route path="/about" exact>
                            <AboutPage/>
                        </Route>
                        <Route>
                            <NotFoundPage/>
                        </Route>
                    </Switch>
                </main>
            </>
        )
    }

    return (
        <Router>
            <Box className={classes.root}>
                <AppBar className={classes.bar} position="sticky">
                    <Toolbar>
                        <IconButton edge="start" className={classes.barIconButton} color="inherit"
                                    onClick={() => setDrawerOpened(!drawerOpened)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Link className={classes.barTitle} component={RouterLink} to="/"
                              onClick={() => setDrawerOpened(false)}
                        >
                            <Typography variant="h6">
                                {sessionName ?? "SpaceEngineers Server Monitor"}
                            </Typography>
                        </Link>
                    </Toolbar>
                </AppBar>

                <Content/>
            </Box>
        </Router>
    )
}
