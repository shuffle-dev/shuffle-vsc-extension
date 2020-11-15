import MessageManager from './MessageManager';
import StateService from './state/StateService';
import StateProvider from './state/StateProvider';
import UIManager from './ui/UIManager';
import { Builders } from "../../shared/Builders";
import { State } from "../../shared/Types";

const initialState: State = {
    apiKey: '',
    builder: Builders.getDefault(),
    category: '',
    config: {}
};

MessageManager.init();
const stateService = new StateService(initialState);
const uiManager = new UIManager(stateService);

const stateProvider = new StateProvider((state) => {
    stateService.setState(state);
    uiManager.update();
});

stateProvider.load();
