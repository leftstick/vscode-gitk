import * as vscode from 'vscode'
import * as path from 'path'
import t from 'lodash.template'

import { Commit } from '../models/commit'

const compiled = t(
  `
  <html>
      <link rel="stylesheet" href="${assetPath('css', 'gitk.css')}" >
      <body style="font-family: <%= obj.fontFamily %>;">
          <div class="container">
              <div id="divCommits" class="commits" tabindex="0">
                  <% for (let c of obj.commits) { %>
                      <a class="commit" data-hash="<%= c.hash %>">
                          <div class="hash" <%if(obj.colors.hash){%>style="color:<%=obj.colors.hash%>;" <%}%> ><%= c.hash %></div>
                          <div class="message" <%if(obj.colors.message){%>style="color:<%=obj.colors.message%>;" <%}%> ><%= c.message %></div>
                          <div class="author" <%if(obj.colors.author){%>style="color:<%=obj.colors.author%>;" <%}%> ><%= c.author %></div>
                          <div class="date" <%if(obj.colors.date){%>style="color:<%=obj.colors.date%>;" <%}%> ><%= c.date %></div>
                      </a>
                  <% } %>
              </div>
              <div id="resizer"></div>
              <div class="detail" <%if(obj.colors.defaultDetail){%>style="color:<%=obj.colors.defaultDetail%>;" <%}%> />
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
  const workconfig = vscode.workspace.getConfiguration('gitk')
  const colors = Object.assign({}, workconfig.colors)
  return compiled({
    commits,
    colors,
    fontFamily: config.fontFamily
  })
}

function assetPath(...args: string[]) {
  return vscode.Uri.file(path.join(__dirname, '..', '..', '..', 'assets', ...args)).with({
    scheme: 'vscode-resource'
  })
}
