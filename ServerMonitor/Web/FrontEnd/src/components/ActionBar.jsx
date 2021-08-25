import React from "react";
import {Box, Container, Divider, Grid, makeStyles, Theme, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    actionBar: {
        flexGrow: 1,
        borderBottom: "2px solid rgba(0, 0, 0, 0.12)"
    },
    icon: {
        margin: theme.spacing(1)
    },
    title: {
        margin: theme.spacing(1)
    },
    divide: {
        margin: theme.spacing(0, 1)
    },
    subTitle: {
        margin: theme.spacing(1, 4, 1, 1)
    },
    children: {
        display: "flex",
        flexGrow: 1,
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
        <Box className={classes.actionBar}>
            <Container maxWidth={false}>
                <Grid container alignItems="center">
                    <Box className={classes.icon}>{icon}</Box>
                    <Typography className={classes.title} variant="h6">{title}</Typography>
                    <Divider className={classes.divide} orientation="vertical" flexItem/>
                    <Typography className={classes.subTitle} variant="h6">{subTitle}</Typography>
                    <Box className={classes.children}>
                        {children}
                    </Box>
                </Grid>
            </Container>
        </Box>
    )
}
