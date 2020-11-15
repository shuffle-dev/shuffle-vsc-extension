import * as vscode from 'vscode';
import MainPanel from './MainPanel';

export function activate(context: vscode.ExtensionContext) {
    
    let disposable = vscode.commands.registerCommand('shuffle.window', () => {
        if (MainPanel.currentPanel) {
            MainPanel.currentPanel.hide();
        } else {
            MainPanel.createOrShow(context);
        }
    });

    context.subscriptions.push(disposable);

    if (vscode.window.registerWebviewPanelSerializer) {
        vscode.window.registerWebviewPanelSerializer(MainPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel) {
                MainPanel.attachCurrentPanel(webviewPanel, context);
            }
        });
    }
}

console.log('READY ext!');
