import * as vscode from 'vscode';

import { Commit } from './commit';
import { log, detail, colorfullDetail } from './gitLogResolver';

export const GITKURI = vscode.Uri.parse('gitk://sourcecontrol/gitk');


export class GitkProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private _targetDocumentFilePath: string;
    private _commits: Array<Commit>;

    public provideTextDocumentContent(uri: vscode.Uri): string {

        if (!this._commits) {
            return '';
        }

        const commitsHtml = this._commits.map(c => {
            return `
            <div class="commit">
                <div class="hash">${c.hash}</div>
                <div class="message">${c.message}</div>
                <div class="author">${c.author}</div>
                <div class="date">${c.date}</div>
            </div>`;
        })
            .join('');

        return `
        <html>
        <style>
            * {
                font-family: monospace;
            }
            html, body {
                height: 100%;
                max-height: 100%;
            }
            .container {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            .commits {
                display: flex;
                flex-direction: column;
                height: 300px;
                flex-shrink: 0;
                border-bottom: 1px solid #fff;
                overflow: auto;
            }
            .detail {
                overflow: auto;
            }

            .commit {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin-top: 3px;
                margin-bottom: 3px;
                cursor: pointer;
            }

            .commit.selected {
                font-weight: bold;
                color: #80da51;
            }

            .commit > div {
                margin-left: 5px;
                margin-right: 5px;
                flex-shrink: 0;
            }

            .commit .hash {
                width: 60px;
            }

            .commit .message {
                flex-grow: 2;
            }

            .commit .date {
                width: 200px;
                text-align: right;
            }
        </style>
        <body>
            <div class="container">
                <div class="commits">
                    ${commitsHtml}
                </div>
                <div class="detail">
                </div>
            </div>
        </body>
        <script>
            const data = ${JSON.stringify(this._commits)};

            document.querySelector('.commits').addEventListener('click', function(e) {
                const commitNode = getCommit(e.target);
                if (!commitNode) {
                    return;
                }
                const commits = document.querySelectorAll('.commit');
                for(let i = 0; i < commits.length; i++) {
                    commits[i].classList.remove('selected');
                }
                commitNode.classList.add('selected');
                
                const commitData = data.find(c => c.hash === commitNode.querySelector('.hash').innerText);
                document.querySelector('.detail').innerHTML = commitData.detail;
            }, false);

            function getCommit(node) {
                if (node.tagName === 'BODY') {
                    return;
                }
                if (node.classList.contains('commit')) {
                    return node;
                }
                return getCommit(node.parentNode);
            }

            setTimeout(() => {
                document.querySelector('.commit').click();
            });
        </script>
        </html>
            `;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public async update(uri: vscode.Uri, targetDocumentFilePath: string) {
        this._targetDocumentFilePath = targetDocumentFilePath;

        const cwd = vscode.workspace.rootPath;

        this._commits = await log(targetDocumentFilePath, cwd);

        const details = await Promise.all(this._commits.map(c => detail(targetDocumentFilePath, c.hash, cwd)));

        const colorfullDetails = details.map(d => colorfullDetail(d));

        this._commits.forEach((c, i) => {
            c.detail = colorfullDetails[i];
        });

        this._onDidChange.fire(uri);
    }
}