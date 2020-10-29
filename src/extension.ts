import * as vscode from 'vscode';


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
		const webview = this._panel.webview;
		const nonce = getNonce();

		this._panel.webview.html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
<!--				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">-->
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Shuffle</title>
			</head>
			<body>
				<iframe src="https://bootstrapshuffle.com/pl" frameborder="0" width="100%" style="min-height: 100vh"></iframe>
<!--				<script nonce="${nonce}" src=""></script>-->
			</body>
			</html>`;
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

export function deactivate() {}
