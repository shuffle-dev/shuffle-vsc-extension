import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import MessageManager from './MessageManager';
import { Messages, ShuffleStateRestoreMessage } from '../shared/Messages';
import { State } from '../shared/Types';

export default class MainPanel {
    public static currentPanel: MainPanel | undefined;
    public static readonly viewType = 'shuffle';

    public readonly panel: vscode.WebviewPanel;
    public readonly context: vscode.ExtensionContext;

    private readonly _messageManager: MessageManager;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
        this.panel = panel;
        this.context = context;
        this._messageManager = new MessageManager(this);

        this._createHtmlView();
        this._onReceiveMessage();
        this._onDispose();
        this._restoreShuffleState(context);
    }

    public static createOrShow(context: vscode.ExtensionContext) {
        const column = vscode.ViewColumn.Beside;

        if (MainPanel.currentPanel) {
            MainPanel.currentPanel.hide();
            return;
        }

        const panelOptions = {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
        };

        const panel = vscode.window.createWebviewPanel(
            MainPanel.viewType, 'Shuffle.dev', column, panelOptions,
        );

        MainPanel.attachCurrentPanel(panel, context);
    }

    public static attachCurrentPanel(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
        MainPanel.currentPanel = new MainPanel(panel, context);
    }

    public hide() {
        MainPanel.currentPanel = undefined;
        this.panel.dispose();
        this._disposables.forEach(item => item.dispose());
    }

    private _restoreShuffleState(context: vscode.ExtensionContext) {
        const state = context.globalState.get('shuffle-state') as State;

        if (state) {
            const message : ShuffleStateRestoreMessage = {
                type: Messages.SHUFFLE_STATE_RESTORE,
                state
            };

            this._messageManager.postMessage(message);
        }
    }

    private _createHtmlView() {
        const webview = this.panel.webview;
        const mediaPath = vscode.Uri.joinPath(this.context.extensionUri,  'media');

        const htmlPath = vscode.Uri.joinPath(mediaPath, 'index.html');
        const scriptPath = vscode.Uri.joinPath(mediaPath, 'main.js');
        const stylePath = vscode.Uri.joinPath(mediaPath, 'main.css');

        const scriptUri = webview.asWebviewUri(scriptPath);
        const styleUri = webview.asWebviewUri(stylePath);
        const htmlContent = readFileSync(htmlPath.fsPath);

        const rand = Math.random();

        this.panel.webview.html = (
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src https: ws:; style-src ${webview.cspSource};
                    img-src ${webview.cspSource} https:; script-src ${webview.cspSource};">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="${styleUri}" rel="stylesheet">
                <title>Shuffle</title>
            </head>
            <body>
                ${htmlContent}
                <script src="${scriptUri}?rand=${rand}"></script>
            </body>
            </html>`
        );
    }

    private _onReceiveMessage() {
        this.panel.webview.onDidReceiveMessage(this._messageManager.receiveMessage, null, this._disposables);
    };

    private _onDispose() {
        const listener = () => {
            MainPanel.currentPanel = undefined;
            this.panel.dispose();
            this._disposables.forEach(item => item.dispose());
        };
    
        this.panel.onDidDispose(listener, null, this._disposables);
    };
}
