import MessageManager from './MessageManager';
import StateService from './state/StateService';
import StateProvider from './state/StateProvider';
import UIManager from './ui/UIManager';

MessageManager.init();

const stateProvider = new StateProvider((config) => {
    const stateService = new StateService(config);
    const uiManager = new UIManager(stateService);
});

stateProvider.load();