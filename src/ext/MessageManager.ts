import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { writeSync as writeSyncToClipboard } from 'clipboardy';
import MainPanel from './MainPanel';
import {
    ShuffleStateFetchMessage,
    ShuffleStateResponseMessage,
    ShuffleStateStoreMessage,
    ComponentsRequestMessage,
    ComponentsResponseMessage,
    Message,
    Messages,
    ComponentCodeRequestMessage,
    ShowErrorMessage,
    ShowInformationMessage,
} from '../shared/Messages';
import { MessageListener } from '../shared/Types';

export default class MessageManager {
    private readonly mainPanel: MainPanel;
    private readonly _listeners: MessageListener[];

    constructor(mainPanel: MainPanel) {
        this.mainPanel = mainPanel;
        this._listeners = [
            { type: Messages.SHUFFLE_STATE_STORE, callback: this._storeState },
            { type: Messages.SHUFFLE_STATE_FETCH, callback: this._fetchState },
            { type: Messages.COMPONENTS_REQUEST, callback: this._fetchComponents },
            { type: Messages.COMPONENT_CODE_REQUEST, callback: this._copyToClipboard },
            { type: Messages.SHOW_ERROR, callback: this._showError },
            { type: Messages.SHOW_INFORMATION, callback: this._showInformation }
        ];
    }

    public receiveMessage = (message: Message) => {
        this._listeners
            .filter(({ type }) => message.type === type)
            .forEach(({ callback }) => callback(message));
    };

    public postMessage = (message: Message) => {
        this.mainPanel.panel.webview.postMessage(message);
    };

    private _storeState = (message: Message) => {
        const { state } = message as ShuffleStateStoreMessage;
        this.mainPanel.context.globalState.update('shuffle-state', state);
    };

    private _fetchState = (message: Message) => {
        const { apiKey, apiEmail } = message as ShuffleStateFetchMessage;
        const url = `https://shuffle.dev/api/state?api_key=${apiKey}&email=${apiEmail}`;

        fetch(url)
            .then((res) => res.text())
            .then(res => {
                const json = JSON.parse(res);
                
                if (json.editors) {
                    const message : ShuffleStateResponseMessage = {
                        type: Messages.SHUFFLE_STATE_RESPONSE,
                        serverState: json
                    };
    
                    this.postMessage(message);
                }
            })
            .catch(e => {
                vscode.window.showErrorMessage('Shuffle: Cannot fetch the state.');
                console.error(e);
            });
    };

    private _fetchComponents = (message: Message) => {
        const { url } = message as ComponentsRequestMessage;

        fetch(url)
            .then((res) => res.text())
            .then(res => {
                const jsonConfig = JSON.parse(res);

                this.postMessage({
                    type: Messages.COMPONENTS_RESPONSE,
                    components: jsonConfig.components
                } as ComponentsResponseMessage);
            })
            .catch(e => {
                vscode.window.showErrorMessage('Shuffle: Cannot fetch components file.');
                console.error(e);
            });
    };

    private _copyToClipboard = (message: Message) => {
        const { data } = message as ComponentCodeRequestMessage;
        writeSyncToClipboard(data);
        vscode.window.showInformationMessage('Copied to clipboard!');
    };

    private _showError = (message: Message) => {
        const error = message as ShowErrorMessage;
        vscode.window.showErrorMessage(error.message);
    };

    private _showInformation = (message: Message) => {
        const info = message as ShowInformationMessage;
        vscode.window.showInformationMessage(info.message);
    };

}
