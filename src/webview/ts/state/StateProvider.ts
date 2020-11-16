import VscApi from '../utils/VscApi';
import MessageManager from '../MessageManager';
import { State } from '../../../shared/Types';
import { ShuffleStateRestoreMessage, ConfigResponseMessage, Message, Messages } from '../../../shared/Messages';

type OnChangeCallback = (config: State) => void;

export default class StateProvider {
    private readonly _onChangeListener: OnChangeCallback;

    constructor(onChange: OnChangeCallback) {
        this._onChangeListener = onChange;
        MessageManager.on(Messages.CONFIG_RESPONSE, this._receivedConfig);
        MessageManager.on(Messages.SHUFFLE_STATE_RESTORE, this._restoreState);
    }

    private _restoreState = (message: Message) => {
        const { state } = message as ShuffleStateRestoreMessage;
        VscApi.setState(state, false);
        this._onChangeListener(state);
    };

    private _receivedConfig = (message: Message) => {
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
