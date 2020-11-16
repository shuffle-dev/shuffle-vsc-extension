import StateService from '../state/StateService';
import HeaderManager from './HeaderManager';
import ComponentsManager from './ComponentsManager';

export default class UIManager {
    private _headerManager: HeaderManager;
    private _componentsManager: ComponentsManager;

    constructor(stateService: StateService) {
        this._headerManager = new HeaderManager(stateService);
        this._componentsManager = new ComponentsManager(stateService);

        this._headerManager.bindEvents();
        this._componentsManager.bindEvents();
    };

    public update = () => {
        this._componentsManager.createStructure();
        this._headerManager.updateInterface();
    };
}
