import React, {useEffect, useRef, useState} from "react";
import {Box, IconButton, makeStyles, Menu, MenuItem, Theme, Typography} from "@material-ui/core";
import {useInView} from "react-intersection-observer";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ToolbarWithBottomBorder from "./ToolbarWithBottomBorder";

const display = {
    true: "flex",
    false: "none"
}

const useStyles = makeStyles((theme: Theme) => ({
    buttonArea: {
        "& button": {
            whiteSpace: "nowrap",
            fontWeight: 550,
            marginRight: theme.spacing(1)
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
    const buttonAreaContainerRef = useRef()
    const {ref: buttonAreaRef, inView: buttonAreaInView} = useInView({
        root: buttonAreaContainerRef.current,
        initialInView: true,
        threshold: 1
    })
    const [leftButtonAreaElements, setLeftButtonAreaElements] = useState([])
    const [rightButtonAreaElements, setRightButtonAreaElements] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)

    //put button to correct area, this hook should only run once
    useEffect(() => {
        const left = []
        const right = []
        React.Children.forEach(children, (child) => {
            if (child == null) return
            const {flexEnd, children, ...props} = child.props
            //can't remove prop using React.cloneElement
            const clonedChild = <child.type {...props} key={child.key ?? children}>{children}</child.type>
            if (flexEnd !== true) {
                left.push(clonedChild)
            } else {
                right.push(clonedChild)
            }
        })
        setLeftButtonAreaElements(left)
        setRightButtonAreaElements(right)
    }, [children])

    return (
        <ToolbarWithBottomBorder variant="dense">
            <Box display={display[buttonAreaInView]} alignItems="center" borderRight="1px solid rgba(0, 0, 0, 0.12)">
                <Box mr={4} display="flex" alignItems="center">
                    {icon}
                    <Box ml={2}>
                        <Typography variant="h6" noWrap>{title}</Typography>
                    </Box>
                </Box>
            </Box>
            <Box display="flex" alignItems="center">
                <Box ml={buttonAreaInView ? 2 : 0} mr={buttonAreaInView ? 6 : 0}>
                    <Typography variant="h6" noWrap>{subTitle}</Typography>
                </Box>
            </Box>
            <Box ref={buttonAreaContainerRef} display="flex" flex="auto" alignItems="center">
                <Box ref={buttonAreaRef} className={classes.buttonArea} display={display[buttonAreaInView]} flex="auto"
                     alignItems="center" overflow="hidden">
                    <Box display="flex" flex="auto" alignItems="center">
                        {leftButtonAreaElements}
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                        {rightButtonAreaElements}
                    </Box>
                </Box>
            </Box>
            <Box display={display[!buttonAreaInView]} flex="auto" alignItems="center" justifyContent="flex-end">
                <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
                    <MoreVertIcon/>
                </IconButton>
            </Box>
            <Menu anchorEl={anchorEl} keepMounted open={anchorEl != null} onClose={() => setAnchorEl(null)}
                  onClick={() => setAnchorEl(null)}>
                {rightButtonAreaElements.slice().reverse().concat(leftButtonAreaElements.slice().reverse()).map(button => {
                    const {children, onClick} = button.props
                    return <MenuItem key={button.key ?? children} onClick={onClick}>{children}</MenuItem>
                })}
            </Menu>
        </ToolbarWithBottomBorder>
    )
}
