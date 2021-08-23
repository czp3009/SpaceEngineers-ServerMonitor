import Constant from "../Constant";

export interface ServerBasicInfo {
    messageOfToday: string,
    isReady: boolean,
    players?: number,
    sessionName?: string
}

export default class {
    static getBasicInfo(): Promise<ServerBasicInfo> {
        return fetch(`${Constant.baseUrl}/basicInfo`).then(it => it.json())
    }
}
