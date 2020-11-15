import StateService from '../state/StateService';
import HeaderManager from './HeaderManager';
import ComponentsManager from './ComponentsManager';

export default class UIManager {
    private _headerManager: HeaderManager;
    private _componentsManager: ComponentsManager;

    constructor(configService: StateService) {
        this._headerManager = new HeaderManager(configService);
        this._componentsManager = new ComponentsManager(configService);

        this._headerManager.bindEvents();
        this._componentsManager.bindEvents();
    };

    public update = () => {
        this._componentsManager.createStructure();
        this._headerManager.updateInterface();
    };
}
