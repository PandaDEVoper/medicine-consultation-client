import { AxiosResponse } from "axios";
import tokenServices from "./token-services";

const authFetch = async (
    f: () => Promise<AxiosResponse<any>>
): Promise<AFRes> => {
    try {
        let data = await f().catch((e) => e?.response);

        if (data.status === 403) {
            const uid = localStorage.getItem("uid");

            if (!uid)
                return {
                    status: EAuthFetch.Unauthorized,
                    data: {},
                };

            await tokenServices.generateNewTokens(uid);
            data = await f();

            if (data.status === 403)
                return {
                    status: EAuthFetch.Unauthorized,
                    data: {},
                };
        }

        return {
            status: EAuthFetch.Success,
            data: data.data,
        };
    } catch (e) {
        return {
            status: EAuthFetch.Error,
            data: {},
        };
    }
};

export enum EAuthFetch {
    Success,
    Unauthorized,
    Error,
}

type AFRes = {
    status: EAuthFetch;
    data: any | {};
};

export { authFetch };