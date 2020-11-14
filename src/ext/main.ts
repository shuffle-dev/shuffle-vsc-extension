import * as vscode from 'vscode';
import MainPanel from './MainPanel';
import { ConfigReqMessage, ConfigResMessage, Message, Messages, SourceReqMessage } from '../shared/Messages';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('shuffle.openWindow', () => {
        MainPanel.createOrShow(context);
    });

    context.subscriptions.push(disposable);

    if (vscode.window.registerWebviewPanelSerializer) {
        vscode.window.registerWebviewPanelSerializer(MainPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel) {
                MainPanel.attachCurrentPanel(webviewPanel, context);

                if (MainPanel.currentPanel) {
                    const message = {
                        type: Messages.CONFIG_REQ,
                        url: 'https://tailwind.build/components/js/27db_components.js?v=tailwind-mn20'
                    } as ConfigReqMessage;
    
                    MainPanel.currentPanel.panel.webview.postMessage(message);
                }
            }
        });
    }
}
