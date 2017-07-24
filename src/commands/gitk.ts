import * as vscode from 'vscode';

import { GitkViewProvider, GITKURI } from '../gitkViewProvider';


export function registryGitk(context: vscode.ExtensionContext): vscode.Disposable {

    let provider;
    let registration;

    const gitk = vscode.commands.registerCommand('extension.gitk', (fileUri?: vscode.Uri) => {
        if (!provider) {
            provider = new GitkViewProvider();
            const refresh = vscode.commands.registerCommand('extension.refreshgitk', (uri: string, commit: string) => {
                provider.updateDetail(GITKURI, commit, uri);
            });
            context.subscriptions.push(refresh);
        }
        if (!registration) {
            registration = vscode.workspace.registerTextDocumentContentProvider('gitk', provider);
            context.subscriptions.push(registration);
        }

        if ((!fileUri || !fileUri.fsPath) && (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document)) {
            vscode.window.showWarningMessage('You have to select a document for gitk');
            return;
        }

        const fileName = (fileUri && fileUri.fsPath) || (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.fileName);
        let config = vscode.workspace.getConfiguration('gitk');

        vscode.workspace.onDidChangeConfiguration(() => {
            config = vscode.workspace.getConfiguration('gitk');
            provider.updateConfig(GITKURI, config);
        }, this, context.subscriptions);

        if (vscode.workspace.textDocuments.some(t => t.fileName === '/gitk')) {
            return provider
                .updateCommits(GITKURI, config, fileName)
                .catch(err => {
                    vscode.window.showErrorMessage(err);
                });
        }

        vscode.commands.executeCommand('vscode.previewHtml', GITKURI, vscode.ViewColumn.One, 'Gitk')
            .then(success => {
                return provider
                    .updateCommits(GITKURI, config, fileName)
                    .then(() => {
                        vscode.window.setStatusBarMessage('Double click on commit for copying hash into clipboard', 5000);
                    })
                    .catch(err => {
                        vscode.window.showErrorMessage(err);
                    });
            }, reason => {
                vscode.window.showErrorMessage(reason);
            });

    });

    return gitk;
}
