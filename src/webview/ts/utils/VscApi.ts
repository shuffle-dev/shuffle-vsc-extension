import { Message, Messages, ShuffleStateStoreMessage } from '../../../shared/Messages';
import { PartialState, State  } from '../../../shared/Types';

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

    /**
     * State managment
     */
    static getState = (): State => {
        return VscApi.getApi().getState();
    };

    static setState = (state: State, persistStore: boolean = true) => {
        VscApi.getApi().setState(state);

        if (persistStore) {
            const message : ShuffleStateStoreMessage = {
                type: Messages.SHUFFLE_STATE_STORE,
                state
            };

            VscApi.postMessage(message);
        }
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
