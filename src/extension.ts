import * as vscode from 'vscode';
import fetch from 'node-fetch';
import {writeSync as writeSyncToClipboard} from 'clipboardy';


export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('shuffle.openWindow', () => {
        ShufflePanel.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(disposable);

    if (vscode.window.registerWebviewPanelSerializer) {
        vscode.window.registerWebviewPanelSerializer(ShufflePanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
                ShufflePanel.revive(webviewPanel, context.extensionUri);
            }
        });
    }
}

class ShufflePanel {
    public static currentPanel: ShufflePanel | undefined;

    public static readonly viewType = 'shuffle';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.ViewColumn.Beside;

        if (ShufflePanel.currentPanel) {
            ShufflePanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            ShufflePanel.viewType, 'Shuffle', column, {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        ShufflePanel.revive(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._panel.title = "Shuffle";
        this._extensionUri = extensionUri;

        this._createPanel();
        this._onReceiveMessage();
        this._onChangeView();
        this._onDispose();
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        ShufflePanel.currentPanel = new ShufflePanel(panel, extensionUri);
    }

    public dispose() {
        ShufflePanel.currentPanel = undefined;
        this._panel.dispose();

        while (this._disposables.length) {
            const elem = this._disposables.pop();
            if (elem) {
                elem.dispose();
            }
        }
    }

    private _createPanel() {
        const nonce = getNonce();

        this._panel.webview.html = this._getHtml(nonce);
    }

    private _getHtml(nonce: string) {
        const webview = this._panel.webview;
        const mediaPath = vscode.Uri.joinPath(this._extensionUri,  'media');

        const scriptPath = vscode.Uri.joinPath(mediaPath, 'main.js');
        const vscStylePath = vscode.Uri.joinPath(mediaPath, 'vscode.css');
        const stylePath = vscode.Uri.joinPath(mediaPath, 'style.css');

        const scriptUri = webview.asWebviewUri(scriptPath);
        const vscStyleUri = webview.asWebviewUri(vscStylePath);
        const styleUri = webview.asWebviewUri(stylePath);

        return (
            `<!DOCTYPE html>
		    <html lang="en">
            <head>
                <meta charset="UTF-8">
                <!--
                    Use a content security policy to only allow loading images from https or from our extension directory,
                    and only allow scripts that have a specific nonce.
                -->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				
			    <link href="${vscStyleUri}" rel="stylesheet">
				<link href="${styleUri}" rel="stylesheet">
				
				<title>Shuffle</title>
			</head>
			<body>
			    <main>
                    <div class="select-container"></div>
                    <div class="components-container"></div>
                </main>
			    <script nonce="${nonce}">
			        window.vscApi = acquireVsCodeApi();
                </script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`
        );
    }

    private _fetchConfig() {
        const CONFIG_URL = 'https://tailwind.build/components/js/27db_components.js?v=mn20';

        fetch(CONFIG_URL)
            .then((res) => res.text())
            .then(res => {
                const firstEqualPosition = res.indexOf('=');
                const validJsonConfig = res.substring(firstEqualPosition+1).trim().slice(0, -1) + '\n';
                const jsonConfig = JSON.parse(validJsonConfig);

                this._panel.webview.postMessage({
                    type: 'config:res',
                    data: jsonConfig
                });
            })
            .catch(e => {
                vscode.window.showErrorMessage("Shuffle: Cannot fetch config file");
                console.error(e);
            });
    }

    private _copyToClipboard(code: string) {
        writeSyncToClipboard(code);
        vscode.window.showInformationMessage("Copied to clipboard!");
    }

    private _onReceiveMessage() {
        this._panel.webview.onDidReceiveMessage((message) => {
            switch (message.type) {
                case 'config:req':
                    this._fetchConfig();
                    break;
                case 'source:req':
                    this._copyToClipboard(message.data);
                    break;
            }
        });
    }

    private _onChangeView() {
        this._panel.onDidChangeViewState(
            e => {
                if (this._panel.visible) {
                    this._createPanel();
                }
            },
            null,
            this._disposables
        );
    }

    private _onDispose() {
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function deactivate() {
}
