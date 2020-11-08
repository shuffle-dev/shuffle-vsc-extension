import getVscApi from "./utils/getVscApi";
import { Builders, BuilderType } from "../../shared/Builders";
import MessageManager from "./MessageManager";
import { Config } from "./StateService";

export type State = {
    key: string,
    builder: BuilderType,
    category: string,
    config: Config,
};

export default class StateProvider {
    private _onChangeListener: (config: State) => void = () => {};

    constructor(onChange: (config: State) => void) {
        MessageManager.on('config:res', this.receiveConfig);
        this._onChangeListener = onChange;
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
        // eslint-disable-next-line eqeqeq
        return getVscApi().getState() != null;
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
