import * as vscode from 'vscode'
import { Detail } from './models/detail'
import { detail, log } from './services/gitLogResolver'
import { gitkRepoHTML } from './template'

export class gitkRepoViewProvider {
  private _pageNum: number
  private _config: vscode.WorkspaceConfiguration

  public setConfig(_config: vscode.WorkspaceConfiguration): void {
    this._config = _config
  }

  public setPageNum(_pageNum: number): void {
    this._pageNum = _pageNum
  }

  public async getInitHtml(webview: vscode.Webview): Promise<string> {
    const cwd = vscode.workspace.workspaceFolders[0]
    const commits = await log(cwd.uri.fsPath)
    return gitkRepoHTML(this._pageNum, commits, this._config, webview)
  }

  public async getDetail(commit: string): Promise<Detail> {
    const cwd = vscode.workspace.workspaceFolders[0]
    return detail(cwd.uri.fsPath, commit)
  }
}
