import React from "react";
import {Box, Container, Grid, Link, makeStyles, Theme, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        "& h4": {
            margin: theme.spacing(2, 0)
        },
        "& p": {
            marginBottom: theme.spacing(2)
        }
    }
}))

export default function () {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Container>
                <Grid container direction="column">
                    <Typography variant="h4">Space Engineers Server Monitor</Typography>
                    <Typography>
                        This is a server plugin aimed to provide interactive web-based monitor for players.
                    </Typography>
                    <Typography>
                        If you find bugs or have any idea, please visit our
                        {" "}
                        <Link href="https://github.com/czp3009/SpaceEngineers-ServerMonitor" target="_blank">
                            code repository
                        </Link>
                        {" "}
                        and feel free to create an issue.
                    </Typography>
                </Grid>
            </Container>
        </Box>
    )
}
