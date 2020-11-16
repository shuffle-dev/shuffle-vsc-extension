import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { writeSync as writeSyncToClipboard } from 'clipboardy';
import MainPanel from './MainPanel';
import {
    ShuffleStateStoreMessage,
    ConfigRequestMessage,
    ConfigResponseMessage,
    Message,
    Messages,
    SourceRequestMessage,
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
            { type: Messages.CONFIG_REQUEST, callback: this._fetchConfig },
            { type: Messages.SOURCE_REQUEST, callback: this._copyToClipboard },
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

    private _fetchConfig = (message: Message) => {
        const { url } = message as ConfigRequestMessage;

        fetch(url)
            .then((res) => res.text())
            .then(res => {
                const firstEqualPosition = res.indexOf('=');
                const validJsonConfig = res.substring(firstEqualPosition+1).trim().slice(0, -1) + '\n';
                const jsonConfig = JSON.parse(validJsonConfig);

                this.postMessage({
                    type: Messages.CONFIG_RESPONSE,
                    data: jsonConfig
                } as ConfigResponseMessage);
            })
            .catch(e => {
                vscode.window.showErrorMessage('Shuffle: Cannot fetch config file');
                console.error(e);
            });
    };

    private _copyToClipboard = (message: Message) => {
        const { data } = message as SourceRequestMessage;
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
