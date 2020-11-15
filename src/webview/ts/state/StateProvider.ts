import VscApi from '../utils/VscApi';
import MessageManager from '../MessageManager';
import { State } from '../../../shared/Types';
import { ShuffleStateRestoreMessage, ConfigRequestMessage, ConfigResponseMessage, Message, Messages } from '../../../shared/Messages';

type OnChangeCallback = (config: State) => void;

export default class StateProvider {
    private readonly _onChangeListener: OnChangeCallback;

    constructor(onChange: OnChangeCallback) {
        this._onChangeListener = onChange;
        MessageManager.on(Messages.CONFIG_RESPONSE, this.receiveConfig);
        MessageManager.on(Messages.SHUFFLE_STATE_RESTORE, this._restoreState);
    }

    load = () => {
        const state = VscApi.getState() as State;
        if (!this._hasConfig(state)) {
            this._requestForConfig(state);
            return;
        }

        this._onChangeListener(state);
    };

    private _restoreState = (message: Message) => {
        const { state } = message as ShuffleStateRestoreMessage;
        VscApi.setState(state, false);
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

        VscApi.setState(state);
        this._onChangeListener(state);
    };
}
