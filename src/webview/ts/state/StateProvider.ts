import VscApi from '../utils/VscApi';
import MessageManager from '../MessageManager';
import { State } from '../../../shared/Types';
import { ShuffleStateRestoreMessage, ShuffleStateResponseMessage, ComponentsResponseMessage, Message, Messages } from '../../../shared/Messages';

type OnChangeCallback = (config: State) => void;

export default class StateProvider {
    private readonly _onChangeListener: OnChangeCallback;

    constructor(onChange: OnChangeCallback) {
        this._onChangeListener = onChange;
        MessageManager.on(Messages.COMPONENTS_RESPONSE, this._receivedConfig);
        MessageManager.on(Messages.SHUFFLE_STATE_RESTORE, this._restoreState);
        MessageManager.on(Messages.SHUFFLE_STATE_RESPONSE, this._receivedState);
    }

    private _restoreState = (message: Message) => {
        const { state } = message as ShuffleStateRestoreMessage;
        VscApi.setState(state, false);
        this._onChangeListener(state);
    };

    private _receivedState = (message: Message) => {
        const { serverState } = message as ShuffleStateResponseMessage;

        const currentState = VscApi.getState();

        const state: State = {
            ...currentState,
            editors: serverState.editors,
            mode: serverState.mode,
        };

        this._onChangeListener(state);
    };

    private _receivedConfig = (message: Message) => {
        const { components } = message as ComponentsResponseMessage;

        const currentState = VscApi.getState();
        const category = Object.keys(components).length > 0 ? Object.keys(components)[0] : '';

        const state: State = {
            ...currentState,
            category,
            components
        };

        this._onChangeListener(state);
    };
}
