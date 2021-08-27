import Constant from "../Constant";

export interface MeasureResult {
    latestMeasureTime?: Date,
    latestResults?: {
        entityId: number,
        entityDisplayName: string,
        mainThreadTimePerTick: number,
        playerIdentityId: number,
        playerSteamId: number,
        playerDisplayName: string,
        factionId?: number,
        factionName?: string
    }
}

export default class {
    static getLatestMeasureResult(abortSignal?: AbortSignal, middleware?: (Response)=>Response): Promise<MeasureResult> {
        return fetch(`${Constant.baseUrl}/thirdParty/lagGridBroadcaster/latestMeasureResult`, {
            signal: abortSignal
        }).then(it => middleware?.(it) ?? it).then(it => it.json())
    }
}
