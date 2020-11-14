import MainPanel from "./MainPanel";
import fetch from "node-fetch";
import * as vscode from "vscode";
import { writeSync as writeSyncToClipboard } from "clipboardy";
import { ConfigReqMessage, ConfigResMessage, Message, Messages, SourceReqMessage } from "../shared/Messages";
import { MessageListener } from "../shared/Types";

export default class MessageManager {
    private readonly mainPanel: MainPanel;
    private readonly _listeners: MessageListener[];

    constructor(mainPanel: MainPanel) {
        this.mainPanel = mainPanel;
        this._listeners = [
            { type: Messages.CONFIG_REQ, fun: this._fetchConfig },
            { type: Messages.SOURCE_REQ, fun: this._copyToClipboard },
        ];
    }

    public receiveMessage = (message: Message) => {
        console.log(message);
        this._listeners
            .filter(({ type }) => message.type === type)
            .forEach(({ fun }) => fun(message));
    };

    public postMessage = (message: Message) => {
        this.mainPanel.panel.webview.postMessage(message);
    };

    private _fetchConfig = (message: Message) => {
        const { url } = message as ConfigReqMessage;

        console.log('AAA' + url);

        fetch(url)
            .then((res) => res.text())
            .then(res => {
                const firstEqualPosition = res.indexOf('=');
                const validJsonConfig = res.substring(firstEqualPosition+1).trim().slice(0, -1) + '\n';
                const jsonConfig = JSON.parse(validJsonConfig);

                this.postMessage({
                    type: Messages.CONFIG_RES,
                    data: jsonConfig
                } as ConfigResMessage);
            })
            .catch(e => {
                vscode.window.showErrorMessage("Shuffle: Cannot fetch config file");
                console.error(e);
            });
    };

    private _copyToClipboard = (message: Message) => {
        const { data } = message as SourceReqMessage;
        writeSyncToClipboard(data);
        vscode.window.showInformationMessage("Copied to clipboard!");
    };
}
