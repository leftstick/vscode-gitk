import * as vscode from 'vscode';

import { Commit } from './commit';
import { Detail } from './detail';
import { log, detail, colorfullDetail } from './gitLogResolver';

export const GITKURI = vscode.Uri.parse('gitk://sourcecontrol/gitk');


export class GitkProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private _targetDocumentFilePath: string;
    private _commits: Array<Commit>;
    private _detail: Detail;

    public provideTextDocumentContent(uri: vscode.Uri): string {

        if (!this._commits && !this._detail) {
            return '';
        }

        const commitsHtml = this._commits.map((c, i) => {
            const selectClass = c.hash === (this._detail && this._detail.hash) ? 'selected' : '';
            return `
            <a class="commit ${selectClass}" href="${encodeURI('command:extension.refreshgitk?' + JSON.stringify([this._targetDocumentFilePath, c.hash]))}">
                <div class="hash">${c.hash}</div>
                <div class="message">${c.message}</div>
                <div class="author">${c.author}</div>
                <div class="date">${c.date}</div>
            </a>`;
        })
            .join('');

        return `
        <html>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: monospace;
            }
            html, body {
                width: 100%;
                max-width: 100%;
                height: 100%;
                max-height: 100%;
            }
            .container {
                display: flex;
                flex-direction: column;
                width: 100%;
                max-width: 100%;
                height: 100%;
                max-height: 100%;
                flex-grow: 0;
            }
            .commits {
                display: flex;
                flex-direction: column;
                height: 300px;
                min-height: 300px;
                flex-shrink: 0;
                border-bottom: 1px solid #fff;
                overflow-y: auto;
            }
            .detail {
                overflow: auto;
                flex-grow: 0;
            }

            .commit {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin-top: 3px;
                margin-bottom: 3px;
                cursor: pointer;
                flex-shrink: 0;
                text-decoration: none;
                color: #fff;
            }
            .commit:focus {
                outline: none;
            }

            .commit.selected {
                font-weight: bold;
                color: #80da51;
            }

            .commit > div {
                margin-left: 5px;
                margin-right: 5px;
            }

            .commit .hash {
                width: 80px;
                flex-shrink: 0;
            }

            .commit .message {
                flex: 2;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .commit .date {
                width: 200px;
                text-align: right;
                flex-shrink: 0;
            }
        </style>
        <body>
            <div class="container">
                <div class="commits">
                    ${commitsHtml}
                </div>
                <div class="detail" data-hash="${(this._detail && this._detail.hash) || ''}">
                    ${(this._detail && this._detail.content) || ''}
                </div>
            </div>
        </body>
        <script>

            if (document.querySelector('.commit.selected')) {
                document.querySelector('.commits').scrollTop = +localStorage.getItem('pos');
                localStorage.setItem('pos', 0);
            }

            document.querySelector('.commits').addEventListener('click', () => {
                localStorage.setItem('pos', document.querySelector('.commits').scrollTop);
            }, false);

        </script>
        </html>
            `;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public async updateCommits(uri: vscode.Uri, targetDocumentFilePath: string) {
        this._targetDocumentFilePath = targetDocumentFilePath;
        this._detail = null;

        const cwd = vscode.workspace.rootPath;

        this._commits = await log(targetDocumentFilePath, cwd);

        this._onDidChange.fire(uri);
    }

    public async updateDetail(uri: vscode.Uri, targetDocumentFilePath: string, commit: string) {
        this._targetDocumentFilePath = targetDocumentFilePath;

        const cwd = vscode.workspace.rootPath;

        this._detail = await detail(targetDocumentFilePath, commit, cwd);

        this._onDidChange.fire(uri);
    }
}