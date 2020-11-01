import MessageManager from './MessageManager';
import ConfigService from './ConfigService';
import UIManager from "./UIManager";

const messageManager = new MessageManager();
const configService = new ConfigService();
const uiManager = new UIManager(configService);

configService.addListener(uiManager.createStructure);
messageManager.addListener('config:res', configService.receiveConfig);

configService.loadConfig();
