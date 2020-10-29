import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('shuffle-ext.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from shuffle-ext!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
