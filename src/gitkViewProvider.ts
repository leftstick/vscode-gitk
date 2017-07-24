import * as vscode from 'vscode';

import { Commit } from './models/commit';
import { Detail } from './models/detail';
import { log, detail, colorfullDetail } from './services/gitLogResolver';
import { gitkHTML, gitkRepoHTML } from './template';

export const GITKURI = vscode.Uri.parse('gitk://sourcecontrol/gitk');
export const GITKREPOURI = vscode.Uri.parse('gitkrepo://sourcecontrol/gitkrepo');


export class GitkViewProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private _targetDocumentFilePath: string;
    private _commits: Array<Commit>;
    private _detail: Detail;
    private _pageNum: number = 1;
    private _config: vscode.WorkspaceConfiguration;

    public provideTextDocumentContent(uri: vscode.Uri): string {

        if (!this._commits && !this._detail) {
            return '';
        }

        if (!this._targetDocumentFilePath) {
            return gitkRepoHTML(this._pageNum, this._commits, this._detail, this._config);
        }

        return gitkHTML(this._commits, this._detail, this._targetDocumentFilePath, this._config);
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public async updateCommits(uri: vscode.Uri, config: vscode.WorkspaceConfiguration, targetDocumentFilePath?: string) {
        this._targetDocumentFilePath = targetDocumentFilePath;
        this._config = config;
        this._detail = null;

        const cwd = vscode.workspace.rootPath;

        this._commits = await log(cwd, targetDocumentFilePath);

        this._onDidChange.fire(uri);
    }

    public async updateDetail(uri: vscode.Uri, commit: string, targetDocumentFilePath?: string) {
        this._targetDocumentFilePath = targetDocumentFilePath;

        const cwd = vscode.workspace.rootPath;

        this._detail = await detail(cwd, commit, targetDocumentFilePath);

        this._onDidChange.fire(uri);
    }

    public async updatePage(uri: vscode.Uri, pageNum: number) {

        const cwd = vscode.workspace.rootPath;

        this._pageNum = pageNum;

        this._onDidChange.fire(uri);
    }

    public async updateConfig(uri: vscode.Uri, config: vscode.WorkspaceConfiguration) {
        this._config = config;

        this._onDidChange.fire(uri);
    }
}