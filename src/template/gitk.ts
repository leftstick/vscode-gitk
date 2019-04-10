import * as vscode from 'vscode'
import * as path from 'path'
import * as t from 'lodash.template'

import { Commit } from '../models/commit'
import { Detail } from '../models/detail'

const compiled = t(
  `
  <html>
      <link rel="stylesheet" href="${assetPath('css', 'gitk.css')}" >
      <body style="font-family: <%= obj.fontFamily %>;">
          <div class="container">
              <div class="commits" tabindex="0">
                  <% for (let c of obj.commits) { %>
                      <a class="commit" data-hash="<%= c.hash %>">
                          <div class="hash"><%= c.hash %></div>
                          <div class="message"><%= c.message %></div>
                          <div class="author"><%= c.author %></div>
                          <div class="date"><%= c.date %></div>
                      </a>
                  <% } %>
              </div>
              <div class="detail" />
          </div>
          <script src="${assetPath('js', 'util.js')}"></script>
          <script src="${assetPath('js', 'takefocus.js')}"></script>
          <script src="${assetPath('js', 'messageReceiver.js')}"></script>
          <script src="${assetPath('js', 'selectHandler.js')}"></script>
          <script src="${assetPath('js', 'defaultSelection.js')}"></script>
          <script src="${assetPath('js', 'copyHash.js')}"></script>
          <script src="${assetPath('js', 'keyboard.js')}"></script>
      </body>
  </html>
`,
  { variable: 'obj' }
)

export function gitkHTML(commits: Array<Commit>, config: vscode.WorkspaceConfiguration) {
  return compiled({
    commits,
    fontFamily: config.fontFamily
  })
}

function assetPath(...args: string[]) {
  return vscode.Uri.file(path.join(__dirname, '..', '..', '..', 'assets', ...args)).with({
    scheme: 'vscode-resource'
  })
}
