import * as vscode from 'vscode';
import * as path from 'path';
import * as t from 'lodash.template';

import { Commit } from '../models/commit';
import { Detail } from '../models/detail';

const SIZE_PER_PAGE = 30;

const compiled = t(`
        <html>
            <link rel="stylesheet" href="${assetPath('css', 'gitk.css')}" >
            <body style="font-family: <%= obj.fontFamily %>;">
                <div class="container">
                    <div class="commits" tabindex="0">
                        <% for (let c of obj.commits) { %>
                            <% const selectClass = c.hash === (obj.detail && obj.detail.hash) ? 'selected' : ''; %>

                            <a class="commit <%= selectClass %>" href="<%= encodeURI('command:extension.refreshgitkrepo?' + JSON.stringify([c.hash])) %>">
                                <div class="hash"><%= c.hash %></div>
                                <div class="message"><%= c.message %></div>
                                <div class="author"><%= c.author %></div>
                                <div class="date"><%= c.date %></div>
                            </a>
                        <% } %>
                    </div>
                    <div class="pagination">
                        <div class="group">
                            <a class="prev <%= obj.pageNum === 1 ? 'disabled' : '' %>" href="<%= encodeURI('command:extension.refreshgitkrepopage?' + JSON.stringify([obj.pageNum - 1])) %>">Prev</a>
                            &nbsp;
                            <a class="next <%= obj.pageNum === obj.totalPageCount ? 'disabled' : '' %>" href="<%= encodeURI('command:extension.refreshgitkrepopage?' + JSON.stringify([obj.pageNum + 1])) %>">Next</a>
                        </div>
                    </div>
                    <div class="detail" data-hash="<%= (obj.detail && obj.detail.hash) || '' %>">
                        <%= (obj.detail && obj.detail.content) || '' %>
                    </div>
                </div>
                <script src="${assetPath('js', 'util.js')}"></script>
                <script src="${assetPath('js', 'takefocus.js')}"></script>
                <script src="${assetPath('js', 'scrollPosition.js')}"></script>
                <script src="${assetPath('js', 'defaultSelection.js')}"></script>
                <script src="${assetPath('js', 'copyHash.js')}"></script>
                <script src="${assetPath('js', 'keyboard.js')}"></script>
            </body>
        </html>
    `, { variable: 'obj' });

export function gitkRepoHTML(pageNum: number = 1, commits: Array<Commit>, detail: Detail, config: vscode.WorkspaceConfiguration) {
    const totalPageCount = Math.ceil(commits.length / SIZE_PER_PAGE);
    const start = (pageNum - 1) * SIZE_PER_PAGE;
    const end = start + SIZE_PER_PAGE;
    return compiled({
        commits: commits.slice(start, end),
        detail,
        fontFamily: config.fontFamily,
        pageNum,
        totalPageCount
    });
}

function assetPath(...args) {
    return vscode.Uri.file(path.join(__dirname, '..', '..', '..', 'assets', ...args)).toString();
}