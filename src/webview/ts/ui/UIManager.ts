import StateService from '../state/StateService';
import HeaderManager from './HeaderManager';
import ComponentsManager from './ComponentsManager';

export default class UIManager {
    private static _isInitialized = false;

    private _headerManager: HeaderManager;
    private _componentsManager: ComponentsManager;

    constructor(configService: StateService) {
        this._headerManager = new HeaderManager(configService);
        this._componentsManager = new ComponentsManager(configService);

        this._runOnce(() => {
            this._headerManager.bindEvents();
            this._componentsManager.bindEvents();
        });

        this._componentsManager.createStructure();
    };

    private _runOnce = (callback: () => void) => {
        if (!UIManager._isInitialized) {
            callback();
            UIManager._isInitialized = true;
        }
    };
}
