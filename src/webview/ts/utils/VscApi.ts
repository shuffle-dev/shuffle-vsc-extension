import { Message } from "../../../shared/Messages";
import { State, PartialState } from "../StateProvider";

declare global {
    interface Window {
        vscApi: {
            getState: () => any;
            setState: (state: any) => void;
            postMessage: (message: any) => void;
        }
    }
}

export default class VscApi {
    private static isInitialized = false;

    private static init = () => {
        // @ts-ignore
        window.vscApi = acquireVsCodeApi();
        VscApi.isInitialized = true;
    };

    private static getApi = () => {
        if (!VscApi.isInitialized) {
            VscApi.init();
        }
        return window.vscApi;
    };

    static postMessage = (message: Message) => {
        VscApi.getApi().postMessage(message);
    };

    static getState = (): State | undefined => {
        return VscApi.getApi().getState();
    };

    static setState = (state: State) => {
        VscApi.getApi().setState(state);
    };

    static changeState = (state: PartialState) => {
        const currentState = VscApi.getState();
        if (currentState === undefined) {
            return;
        }
        Object.keys(state).forEach(key => state[key] === undefined && delete state[key]);
        VscApi.setState({
            ...currentState,
            ...state
        });
    };
}
