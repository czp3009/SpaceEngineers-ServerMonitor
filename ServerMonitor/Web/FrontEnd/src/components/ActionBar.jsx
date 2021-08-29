import React, {useEffect, useState} from "react";
import {Box, IconButton, makeStyles, Menu, MenuItem, Theme, Toolbar, Typography} from "@material-ui/core";
import {useInView} from "react-intersection-observer";
import MoreVertIcon from "@material-ui/icons/MoreVert";

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
    const {ref: buttonAreaRef, inView: buttonAreaInView} = useInView({
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
        <Box borderBottom="2px solid rgba(0, 0, 0, 0.12)">
            <Toolbar variant="dense">
                <Box display="flex" alignItems="center" borderRight="1px solid rgba(0, 0, 0, 0.12)">
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
                <Box ref={buttonAreaRef} className={classes.buttonArea} display="flex" flex="auto" alignItems="center"
                     visibility={buttonAreaInView ? "visible" : "hidden"}>
                    <Box display="flex" flex="auto" alignItems="center">
                        {leftButtonAreaElements}
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                        {rightButtonAreaElements}
                    </Box>
                </Box>
                {
                    !buttonAreaInView &&
                    <Box position="absolute" width="100%" display="flex" flex="auto" alignItems="center"
                         paddingRight={{"xs": 3, "sm": 4}}>
                        <Box display="flex" flex="auto" alignItems="center" justifyContent="flex-end">
                            <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
                                <MoreVertIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                }
                <Menu anchorEl={anchorEl} keepMounted open={anchorEl != null}
                      onClose={() => setAnchorEl(null)} onClick={() => setAnchorEl(null)}>
                    {rightButtonAreaElements.slice().reverse().concat(leftButtonAreaElements.slice().reverse()).map(button => {
                        const {children, onClick} = button.props
                        return <MenuItem key={button.key ?? children} onClick={onClick}>{children}</MenuItem>
                    })}
                </Menu>
            </Toolbar>
        </Box>
    )
}
