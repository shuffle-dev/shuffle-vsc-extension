import VscApi from '../utils/VscApi';
import { BuilderType } from '../../../shared/Builders';
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

type OnChangeCallback = (config: State) => void;

export default class StateProvider {
    private readonly _onChangeListener: OnChangeCallback;

    constructor(onChange: OnChangeCallback) {
        this._onChangeListener = onChange;
        MessageManager.on(Messages.CONFIG_RESPONSE, this.receiveConfig);
    }

    load = () => {
        const state = VscApi.getState() as State;
        if (!this._hasConfig(state)) {
            this._requestForConfig(state);
            return;
        }

        this._onChangeListener(state);
    };

    private _hasConfig = ({ config }: State) => {
        return !!Object.keys(config).length;
    };

    private _requestForConfig = ({ builder }: State) => {
        VscApi.postMessage({
            type: Messages.CONFIG_REQUEST,
            url: builder.url
        } as ConfigRequestMessage);
    };

    private receiveConfig = (message: Message) => {
        const { data: config } = message as ConfigResponseMessage;
        const currentState = VscApi.getState();

        const state: State = {
            ...currentState,
            category: Object.keys(config)[0],
            config
        };

        this._onChangeListener(state);
    };
}
