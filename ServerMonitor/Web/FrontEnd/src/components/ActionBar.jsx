import React, {useEffect, useRef, useState} from "react";
import {Box, IconButton, makeStyles, Menu, MenuItem, Theme, Typography} from "@material-ui/core";
import ToolbarWithBottomBorder from "./ToolbarWithBottomBorder";
import useResizeObserver from "use-resize-observer";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles(() => ({
    buttonArea: {
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
    const [leftElementWrappers, setLeftElementWrappers] = useState([])
    const [rightElementWrappers, setRightElementWrappers] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)
    const [firstTimeRender, setFirstTimeRender] = useState(true)
    const {ref: toolBarRef, width: toolBarWidth} = useResizeObserver()
    const titleRef = useRef()
    const subTitleRef = useRef()
    const moreIconRef = useRef()

    //put button to correct area, this hook should only run once unless children changed
    useEffect(() => {
        const left = []
        const right = []
        React.Children.forEach(children, (child) => {
            const {flexEnd, children, ...props} = child.props
            //can't remove prop using React.cloneElement
            const ref = React.createRef()
            const clonedChild = <child.type {...props} key={child.key ?? children} ref={ref}>{children}</child.type>
            const wrapper = {element: clonedChild, ref, show: true, width: null}
            if (flexEnd !== true) {
                left.push(wrapper)
            } else {
                right.push(wrapper)
            }
        })
        setLeftElementWrappers(left)
        setRightElementWrappers(right)
        setFirstTimeRender(true)
    }, [...React.Children.map(children, child => child.key ?? child.props.children)])

    useEffect(() => {
        if (toolBarWidth == null) return
        const left = leftElementWrappers.map(it => ({...it}))
        const right = rightElementWrappers.map(it => ({...it}))
        if (firstTimeRender) {
            left.concat(right).forEach(it => it.width = it.ref.current.clientWidth)
            setFirstTimeRender(false)
        }
        left.concat(right).forEach(it => it.show = false)
        const buttonAreaWidth = toolBarWidth - (titleRef.current?.clientWidth ?? 0) - (subTitleRef.current?.clientWidth ?? 0) - (moreIconRef.current?.clientWidth ?? 0)
        //calculate with element can show
        const showOrderArray = right.reverse().concat(left)
        let buttonTotalWidth = 0
        for (const [index, element] of showOrderArray.entries()) {
            buttonTotalWidth += element.width
            if (buttonTotalWidth > buttonAreaWidth) {
                //at least one element need to be hidden, but no MoreIcon now
                if (moreIconRef.current == null && index !== 0 && buttonTotalWidth - element.width + 48 > buttonAreaWidth) {
                    showOrderArray[index - 1].show = false
                }
                break
            }
            element.show = true
        }
        setLeftElementWrappers(left)
        setRightElementWrappers(right)
    }, [toolBarWidth, firstTimeRender])

    return (
        <ToolbarWithBottomBorder ref={toolBarRef} variant="dense">
            <Box ref={titleRef} pr={4} display={{"xs": "none", "sm": "flex"}} alignItems="center"
                 borderRight="1px solid rgba(0, 0, 0, 0.12)">
                {icon}
                <Box pl={{"xs": 1, "sm": 2}}>
                    <Typography variant="h6" noWrap>{title}</Typography>
                </Box>
            </Box>
            <Box ref={subTitleRef} pl={{"xs": 0, "sm": 2}} pr={{"xs": 1, "sm": 3}} display="flex" alignItems="center">
                <Typography variant="h6" noWrap>{subTitle}</Typography>
            </Box>
            <Box className={classes.buttonArea} display="flex" flex="auto" alignItems="center">
                <Box display="flex" flex="auto" alignItems="center">
                    {leftElementWrappers.filter(it => it.show).map(it => it.element)}
                </Box>
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                    {
                        leftElementWrappers.concat(rightElementWrappers).some(it => !it.show) &&
                        <IconButton ref={moreIconRef} color="primary"
                                    edge={rightElementWrappers.every(it => !it.show) ? "end" : false}
                                    onClick={event => setAnchorEl(event.currentTarget)}>
                            <MoreVertIcon/>
                        </IconButton>
                    }
                    {rightElementWrappers.filter(it => it.show).map(it => it.element)}
                </Box>
                <Menu anchorOrigin={{vertical: "bottom", horizontal: "center"}} keepMounted transitionDuration={0}
                      anchorEl={anchorEl} open={anchorEl != null} onClose={() => setAnchorEl(null)}
                      getContentAnchorEl={null}
                      onClick={() => setAnchorEl(null)}>
                    {
                        leftElementWrappers.reverse().concat(rightElementWrappers).reverse().filter(it => !it.show).map(({element}) => {
                            const {children, onClick} = element.props
                            return <MenuItem key={element.key ?? children} onClick={onClick}>{children}</MenuItem>
                        })
                    }
                </Menu>
            </Box>
        </ToolbarWithBottomBorder>
    )
}
