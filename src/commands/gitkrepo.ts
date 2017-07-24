import * as vscode from 'vscode';

import { GitkViewProvider, GITKREPOURI } from '../gitkViewProvider';


export function registryGitkrepo(context: vscode.ExtensionContext): Array<vscode.Disposable> {

    const provider = new GitkViewProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider('gitkrepo', provider);

    const gitkrepo = vscode.commands.registerCommand('extension.gitkrepo', () => {

        let config = vscode.workspace.getConfiguration('gitk');

        vscode.workspace.onDidChangeConfiguration(() => {
            config = vscode.workspace.getConfiguration('gitk');
            provider.updateConfig(GITKREPOURI, config);
        }, this, context.subscriptions);

        if (vscode.workspace.textDocuments.some(t => t.fileName === '/gitkrepo')) {
            return provider
                .updateCommits(GITKREPOURI, config)
                .catch(err => {
                    vscode.window.showErrorMessage(err);
                });
        }

        vscode.commands.executeCommand('vscode.previewHtml', GITKREPOURI, vscode.ViewColumn.One, 'Gitk For Repository')
            .then(success => {
                return provider
                    .updateCommits(GITKREPOURI, config)
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

    const refreshrepo = vscode.commands.registerCommand('extension.refreshgitkrepo', (commit: string) => {
        provider.updateDetail(GITKREPOURI, commit);
    });

    return [gitkrepo, refreshrepo, registration];
}
