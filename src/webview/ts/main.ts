import MessageManager from './MessageManager';
import StateService from './state/StateService';
import StateProvider from './state/StateProvider';
import UIManager from './ui/UIManager';
import { initialState } from '../../shared/InitialState';

MessageManager.init();
const stateService = new StateService(initialState);
const uiManager = new UIManager(stateService);

const stateProvider = new StateProvider((state) => {
    stateService.setState(state);
    uiManager.update();
});

console.log('Webview ready!');