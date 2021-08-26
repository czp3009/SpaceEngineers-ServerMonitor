import React from "react";
import {Box, Divider, makeStyles, Theme, Toolbar, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    actionBar: {
        borderBottom: "2px solid rgba(0, 0, 0, 0.12)"
    },
    toolBar: {
        flexWrap: "wrap"
    },
    icon: {
        marginRight: theme.spacing(2)
    },
    title: {
        marginRight: theme.spacing(2)
    },
    divide: {
        marginRight: theme.spacing(2)
    },
    subTitle: {
        marginRight: theme.spacing(4)
    },
    children: {
        "& button": {
            fontWeight: 550
        }
    }
}))

export default function (
    {
        icon,
        title,
        subTitle,
        children
    }: { icon: React.ReactNode, title: string, subTitle: string, children?: React.ReactNode }
) {
    const classes = useStyles()
    return (
        // hide action button as ... if screen resize
        <Box className={classes.actionBar}>
            <Toolbar variant="dense" className={classes.toolBar}>
                <Box display="flex" alignItems="center">
                    <Box className={classes.icon} display="flex" alignItems="center">{icon}</Box>
                    <Typography className={classes.title} variant="h6">{title}</Typography>
                    <Divider className={classes.divide} orientation="vertical" flexItem/>
                    <Typography className={classes.subTitle} variant="h6">{subTitle}</Typography>
                </Box>
                <Box className={classes.children} display="flex" flex="auto" alignItems="center">
                    {children}
                </Box>
            </Toolbar>
        </Box>
    )
}
