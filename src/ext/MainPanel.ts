import * as vscode from "vscode";
import { readFileSync } from "fs";
import MessageManager from "./MessageManager";

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

        this._createPanel();
        this._onReceiveMessage();
        this._onChangeView();
        this._onDispose();
    }

    public static createOrShow(context: vscode.ExtensionContext) {
        const column = vscode.ViewColumn.Beside;

        if (MainPanel.currentPanel) {
            MainPanel.currentPanel.panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            MainPanel.viewType, 'Shuffle', column, {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
            }
        );

        MainPanel.revive(panel, context);
    }

    public static revive(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
        MainPanel.currentPanel = new MainPanel(panel, context);
    }

    private _dispose() {
        MainPanel.currentPanel = undefined;
        this.panel.dispose();
        this._disposables.forEach(item => item.dispose());
    }

    private _onReceiveMessage() {
        this.panel.webview.onDidReceiveMessage(this._messageManager.receiveMessage, null, this._disposables);
    };

    private _onChangeView() {
        const listener = () => {
            if (this.panel.visible) {
                this._createPanel();
            }
        };
        this.panel.onDidChangeViewState(listener, null, this._disposables);
    };

    private _onDispose() {
        this.panel.onDidDispose(() => this._dispose(), null, this._disposables);
    };

    private _createPanel() {
        const webview = this.panel.webview;
        const mediaPath = vscode.Uri.joinPath(this.context.extensionUri,  'media');

        const htmlPath = vscode.Uri.joinPath(mediaPath, 'index.html');
        const scriptPath = vscode.Uri.joinPath(mediaPath, 'main.js');
        const stylePath = vscode.Uri.joinPath(mediaPath, 'main.css');

        const scriptUri = webview.asWebviewUri(scriptPath);
        const styleUri = webview.asWebviewUri(stylePath);
        const htmlContent = readFileSync(htmlPath.fsPath);

        this.panel.webview.html = (
            `<!DOCTYPE html>
		    <html lang="en">
            <head>
                <meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource};
				    img-src ${webview.cspSource} https:; script-src ${webview.cspSource};">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleUri}" rel="stylesheet">
				<title>Shuffle</title>
			</head>
			<body>
			    ${htmlContent}
				<script src="${scriptUri}"></script>
			</body>
			</html>`
        );
    }
}
