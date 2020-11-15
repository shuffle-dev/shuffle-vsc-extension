import VscApi from '../utils/VscApi';
import { Builders, BuilderType } from '../../../shared/Builders';
import MessageManager from '../MessageManager';
import { Config } from '../../../shared/Types';
import { ConfigRequestMessage, ConfigResponseMessage, Message, Messages } from '../../../shared/Messages';

type IState = { [index: string]: any };
export type State = IState & {
    apiKey: string,
    builder: BuilderType,
    category: string,
    config: Config,
};

export type PartialState = {
    [T in keyof State]?: State[T]
};

export default class StateProvider {
    private readonly _onChangeListener: (config: State) => void;

    constructor(onChange: (config: State) => void) {
        this._onChangeListener = onChange;
        MessageManager.on(Messages.CONFIG_RESPONSE, this.receiveConfig);
    }

    load = () => {
        if (!this._hasConfig()) {
            this._requestForConfig();
            return;
        }

        const state = VscApi.getState() as State;
        this._onChangeListener(state);
    };

    private _hasConfig = () => {
        return VscApi.getState() !== undefined;
    };

    private _requestForConfig = () => {
        VscApi.postMessage({
            type: Messages.CONFIG_REQUEST,
            url: Builders.getDefault().url
        } as ConfigRequestMessage);
    };

    private receiveConfig = (message: Message) => {
        const { data } = message as ConfigResponseMessage;
        const currentState = VscApi.getState();

        let state: State;

        if (currentState === undefined) {
            state = {
                config: data,
                apiKey: '',
                category: Object.keys(data)[0],
                builder: Builders.getDefault(),
            };
        } else {
            state = ({
                ...currentState,
                config: data,
            });
        }

        VscApi.setState(state);
        this._onChangeListener(state);
    };
}
