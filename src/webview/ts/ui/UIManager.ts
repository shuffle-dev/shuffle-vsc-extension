import StateService from '../StateService';
import HeaderManager from "./HeaderManager";
import ComponentsManager from "./ComponentsManager";

export default class UIManager {
    private static _IS_INITIALIZED = false;

    private _stateService: StateService;
    private _headerManager: HeaderManager;
    private _componentsManager: ComponentsManager;

    constructor(configService: StateService) {
        this._stateService = configService;
        this._headerManager = new HeaderManager(configService);
        this._componentsManager = new ComponentsManager(configService);

        this._runOnce(() => {
            this._headerManager.bindEvents();
            this._componentsManager.bindEvents();
        });

        this._componentsManager.createStructure();
    };

    private _runOnce = (callback: () => void) => {
        if (!UIManager._IS_INITIALIZED) {
            callback();
            UIManager._IS_INITIALIZED = true;
        }
    };
}
