import Constant from "../Constant";

export interface ServerBasicInfo {
    messageOfToday: string,
    isReady: boolean,
    players?: number,
    sessionName?: string,
    thirdPartyPluginSupport: {
        lagGridBroadcasterPlugin: boolean
    }
}

export default class {
    static getBasicInfo(abortSignal?: AbortSignal, middleware?: (Response)=>Response): Promise<ServerBasicInfo> {
        return fetch(`${Constant.baseUrl}/basicInfo`, {
            signal: abortSignal
        }).then(it => middleware?.(it) ?? it).then(it => it.json())
    }
}
