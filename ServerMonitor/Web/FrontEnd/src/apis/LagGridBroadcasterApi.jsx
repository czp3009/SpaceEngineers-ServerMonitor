import Constant from "../Constant";

export interface MeasureResult {
    latestMeasureTime?:Date,
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
    static getLatestMeasureResult(): Promise<MeasureResult> {
        return fetch(`${Constant.baseUrl}/thirdParty/lagGridBroadcaster/latestMeasureResult`)
            .then(it => it.json())
    }
}
