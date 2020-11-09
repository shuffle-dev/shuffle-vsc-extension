import getVscApi from "./utils/getVscApi";
import { Builders, BuilderType } from "../../shared/Builders";
import MessageManager from "./MessageManager";
import { Config } from "../../shared/Types";
import { Messages } from "../../shared/Messages";

export type State = {
    key: string,
    builder: BuilderType,
    category: string,
    config: Config,
};

export default class StateProvider {
    private readonly _onChangeListener: (config: State) => void;

    constructor(onChange: (config: State) => void) {
        this._onChangeListener = onChange;
        MessageManager.on(Messages.CONFIG_RES, this.receiveConfig);
    }

    load = () => {
        if (!this._isAlreadyFetched()) {
            this._reqForConfig();
            return;
        }

        const state = getVscApi().getState();
        this._onChangeListener(state);
    };

    private _isAlreadyFetched = () => {
        return getVscApi().getState() !== undefined;
    };

    private _reqForConfig = () => {
        getVscApi().postMessage({
            type: 'config:req',
            url: Builders.getDefault().url
        });
    };

    private receiveConfig = (message: any) => {
        const config = message.data;
        const key = '';
        const category = Object.keys(config)[0];
        const builder = Builders.getDefault();

        const state: State = {
            builder,
            category,
            config,
            key
        };
        getVscApi().setState(state);
        this._onChangeListener(state);
    };

}
