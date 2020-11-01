import getVscApi from "./utils/getVscApi";

export type Component = {
    id: string,
    preview: string,
    html: string,
    config: object[]
};
type Category = {
    [key: string]: Component[]
};
export type Config = {
    category: string,
    data: Category,
};
type Listener = (config: Config) => void;

export default class ConfigService {
    private _config: Config | null = null;
    private _listeners: Listener[] = [];

    loadConfig = () => {
        if (!this._isAlreadyFetched()) {
            this._reqForConfig();
            return;
        }

        const config = getVscApi().getState();
        this._setConfig(config);
    };

    addListener = (fun: Listener) => {
        this._listeners.push(fun);
    };

    receiveConfig = (message: any) => {
        const data = message.data;
        const category = Object.keys(data)[0];
        const configObj = {
            category: category,
            data: data
        };
        getVscApi().setState(configObj);
        this._setConfig(configObj);
    };

    changeCategory = (category: string) => {
        if(this._config === null) {
            return;
        }

        const data = this._config.data;
        const configObj = {
            category,
            data
        };
        getVscApi().setState(configObj);
        this._setConfig(configObj);
    };

    getComponent = (id: string, category?: string): Component | null => {
        if(this._config === null) {
            return null;
        }

        const findingCategory = category === undefined ? this.getCurrentCategory() : category;
        if (findingCategory === undefined) {
            return null;
        }

        const component = this._config.data[findingCategory].find((elem) => elem.id === id);
        return component ? component : null;
    };

    getCurrentCategory = () => {
        return this._config?.category;
    };

    private _isAlreadyFetched = () => {
        // eslint-disable-next-line eqeqeq
        return getVscApi().getState() != null;
    };

    private _triggerListeners = () => {
        if(this._config === undefined) {
            return;
        }

        this._listeners.map(fun => fun(this._config as Config));
    };

    private _setConfig = (jsonConfig: Config) => {
        this._config = jsonConfig;
        this._triggerListeners();
    };

    private _reqForConfig = () => {
        getVscApi().postMessage({
           type: 'config:req'
       });
    };
}
