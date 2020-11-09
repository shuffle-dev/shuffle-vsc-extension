import { Message } from "../../../shared/Messages";

declare global {
    interface Window {
        vscApi: {
            getState: () => any;
            setState: (state: any) => void;
            postMessage: (message: any) => void;
        }
    }
}

class VscApi {
    static isInitialized = false;

    static init = () => {
        // @ts-ignore
        window.vscApi = acquireVsCodeApi();
        VscApi.isInitialized = true;
    };

    static getApi = () => {
        if (!VscApi.isInitialized) {
            VscApi.init();
        }
        return window.vscApi;
    };

    static postMessage = (message: Message) => {
        VscApi.getApi().postMessage(message);
    };
}

export default VscApi.getApi;
export const postMessage = VscApi.postMessage;
