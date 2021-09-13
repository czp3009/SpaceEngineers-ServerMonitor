import {Box, Typography} from "@material-ui/core";
import React from "react";
import BorderLinearProgress from "./BorderLinearProgress";

const unitTable = {
    ns: {
        lowerBound: 0,
        upperBound: 0.001,
        multiple: 1000 * 1000,
        fractionDigits: 0
    },
    us: {
        lowerBound: 0.001,
        upperBound: 1,
        multiple: 1000,
        fractionDigits: 0,
        display: "μs"
    },
    ms: {
        lowerBound: 1,
        upperBound: 1000,
        multiple: 1,
        fractionDigits: 0
    },
    s: {
        lowerBound: 1000,
        upperBound: Number.MAX_VALUE,
        multiple: 0.001,
        fractionDigits: 2
    }
}

export default function ({result, progress, totalMainThreadTimePerTick, unit}) {
    if (progress == null) {
        if (totalMainThreadTimePerTick == null) {
            progress = 0
        } else {
            progress = result.mainThreadTimePerTick / totalMainThreadTimePerTick * 100
        }
    }
    const owner = result.factionName != null ? `[${result.factionName}]` : "" + result.playerDisplayName

    //format time
    //mainThreadTimePerTick is in ms
    let time = result.mainThreadTimePerTick
    let timeUnit = "ms"
    let unitDefinition = unitTable[timeUnit]
    if (unit === "auto") {
        for (const [key, value] of Object.entries(unitTable)) {
            if (time >= value.lowerBound && time < value.upperBound) {
                timeUnit = key
                unitDefinition = unitTable[key]
                break
            }
        }
    } else {
        unitDefinition = unitTable[unit]
    }
    time = (time * unitDefinition.multiple).toFixed(unitDefinition.fractionDigits)
    timeUnit = unitDefinition.display ?? unit

    return (
        <Box display="flex" flexDirection="column" paddingY={1}>
            <Typography>
                {result.entityDisplayName}({owner})
            </Typography>
            <Box display="flex" alignItems="center">
                <Box flex="auto" mr={1}>
                    <BorderLinearProgress variant="determinate" value={progress}/>
                </Box>
                <Box>
                    <Typography color="textSecondary">
                        {time}{timeUnit}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
