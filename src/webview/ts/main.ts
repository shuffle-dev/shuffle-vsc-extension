import MessageManager from './MessageManager';
import StateService from './StateService';
import UIManager from './ui/UIManager';
import StateProvider from './StateProvider';

MessageManager.init();

const stateProvider = new StateProvider((config) => {
    const stateService = new StateService(config);
    const uiManager = new UIManager(stateService);
});

stateProvider.load();