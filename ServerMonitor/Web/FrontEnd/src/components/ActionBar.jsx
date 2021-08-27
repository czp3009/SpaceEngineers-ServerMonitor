import React from "react";
import {Box, makeStyles, Theme, Toolbar, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    children: {
        "& button": {
            whiteSpace: "nowrap",
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

    const childElements = []
    const childToEndElements = []
    React.Children.forEach(children, (child) => {
        if (child.props["flexEnd"] === true) {
            childToEndElements.push(child)
        } else {
            childElements.push(child)
        }
    })

    return (
        <Box borderBottom="2px solid rgba(0, 0, 0, 0.12)">
            <Toolbar variant="dense">
                <Box display="flex" borderRight="1px solid rgba(0, 0, 0, 0.12)">
                    <Box mr={4} display="flex" alignItems="center">
                        {icon}
                        <Box ml={2}>
                            <Typography variant="h6" noWrap>{title}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" alignItems="center">
                    <Box ml={2} mr={6}>
                        <Typography variant="h6" noWrap>{subTitle}</Typography>
                    </Box>
                </Box>
                <Box className={classes.children} display="flex" flex="auto" alignItems="center">
                    <Box display="flex" flex="auto" alignItems="center">
                        {childElements}
                    </Box>
                    {
                        childToEndElements.length !== 0 &&
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                            {childToEndElements}
                        </Box>
                    }
                </Box>
            </Toolbar>
        </Box>
    )
}
