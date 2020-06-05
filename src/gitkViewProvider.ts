import * as vscode from 'vscode'
import { Detail } from './models/detail'
import { detail, log } from './services/gitLogResolver'
import { gitkHTML } from './template'

export class GitkContentProvider {
  private _targetDocumentFilePath: string
  private _config: vscode.WorkspaceConfiguration

  public setConfig(_config: vscode.WorkspaceConfiguration): void {
    this._config = _config
  }

  public setTargetDocumentFilePath(_targetDocumentFilePath: string): void {
    this._targetDocumentFilePath = _targetDocumentFilePath
  }

  public async getInitHtml(webview: vscode.Webview): Promise<string> {
    const cwd = vscode.workspace.workspaceFolders[0]
    const commits = await log(cwd.uri.fsPath, this._targetDocumentFilePath)
    return gitkHTML(commits, this._config, webview)
  }

  public async getDetail(commit: string): Promise<Detail> {
    const cwd = vscode.workspace.workspaceFolders[0]
    return detail(cwd.uri.fsPath, commit, this._targetDocumentFilePath)
  }
}
