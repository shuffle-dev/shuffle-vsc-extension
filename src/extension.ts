import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('shuffle.openWindow', () => {
		vscode.window.showInformationMessage('Creating window...');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
