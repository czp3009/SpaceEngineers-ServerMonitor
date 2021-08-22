import {
    AppBar,
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
import React, {useState} from "react";
import {BrowserRouter as Router, Link as RouterLink, Route, Switch} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

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
    drawerHeader: {
        minHeight: theme.mixins.toolbar.minHeight
    },
    drawerList: {
        width: 250,
        paddingTop: theme.spacing(2)
    }
}))

export default function () {
    const classes = useStyles()
    const [drawerOpened, setDrawerOpened] = useState(false)

    return (
        <Router>
            <div className={classes.root}>
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
                                SpaceEngineers Server Monitor
                            </Typography>
                        </Link>
                    </Toolbar>
                </AppBar>

                <Drawer className={classes.drawer} anchor="left" open={drawerOpened}
                        onClose={() => setDrawerOpened(false)}
                >
                    <div className={classes.drawerHeader}/>
                    <List className={classes.drawerList} onClick={() => setDrawerOpened(false)}>
                        <ListItem button component={RouterLink} to="/">
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItem>
                    </List>
                </Drawer>

                <Switch>
                    <Route path="/" exact>
                        <HomePage/>
                    </Route>
                    <Route>
                        <NotFoundPage/>
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}
