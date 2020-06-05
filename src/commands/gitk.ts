import * as vscode from 'vscode'

import { GitkContentProvider } from '../gitkViewProvider'

export function registryGitk(context: vscode.ExtensionContext): vscode.Disposable {
  let provider: GitkContentProvider = new GitkContentProvider()
  let panel: vscode.WebviewPanel

  let config = vscode.workspace.getConfiguration('gitk')

  vscode.workspace.onDidChangeConfiguration(
    async () => {
      config = vscode.workspace.getConfiguration('gitk')
      provider.setConfig(config)
      const html = await provider.getInitHtml(panel.webview)
      panel.webview.html = html
    },
    this,
    context.subscriptions
  )

  const gitk = vscode.commands.registerCommand('extension.gitk', async (fileUri?: vscode.Uri) => {
    if (
      (!fileUri || !fileUri.fsPath) &&
      (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document)
    ) {
      vscode.window.showWarningMessage('You have to select a document for gitk')
      return
    }

    const fileName =
      (fileUri && fileUri.fsPath) ||
      (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.fileName)

    if (!panel) {
      panel = vscode.window.createWebviewPanel('gitk', 'Gitk', vscode.ViewColumn.One, {
        enableScripts: true,
      })
      // Reset when the current panel is closed
      panel.onDidDispose(
        () => {
          panel = undefined
        },
        null,
        context.subscriptions
      )

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === 'read-detail') {
            const detail = await provider.getDetail(message.payload.hash)
            panel.webview.postMessage({ command: 'see-detail', payload: detail })
          }
          if (message.command === 'hash-copied') {
            vscode.window.setStatusBarMessage(`hash [${message.payload.hash}] was copied`, 3000)
          }
        },
        undefined,
        context.subscriptions
      )
    } else if (!panel.visible) {
      panel.reveal()
    }

    try {
      provider.setConfig(config)
      provider.setTargetDocumentFilePath(fileName)
      const html = await provider.getInitHtml(panel.webview)
      panel.webview.html = html
    } catch (error) {
      vscode.window.showErrorMessage(error)
    }
  })

  return gitk
}
