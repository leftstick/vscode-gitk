import * as vscode from 'vscode'
import * as path from 'path'
import t from 'lodash/template'

import { Commit } from '../models/commit'

const SIZE_PER_PAGE = 30

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
            <div class="pagination">
                <div class="group">
                    <a class="prev <%= obj.pageNum === 1 ? 'disabled' : '' %>" >Prev</a>
                    &nbsp;
                    <a class="next <%= obj.pageNum === obj.totalPageCount ? 'disabled' : '' %>" >Next</a>
                </div>
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
        <script >
          const data = {
            pageNum: <%= obj.pageNum %>,
            totalPageCount: <%= obj.totalPageCount %>
          }

          document.querySelector('a.prev').addEventListener('click', e => {
              e.preventDefault()
              e.stopPropagation()

              window.vscode.postMessage({
                command: 'go-prev',
                payload: {
                  pageNum: data.pageNum - 1
                }
              })
          }, false)

          document.querySelector('a.next').addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()

            window.vscode.postMessage({
              command: 'go-next',
              payload: {
                pageNum: data.pageNum + 1
              }
            })
        }, false)

        </script>
    </body>
</html>
    `,
  { variable: 'obj' }
)

export function gitkRepoHTML(
  pageNum: number = 1,
  commits: Array<Commit>,
  config: vscode.WorkspaceConfiguration
) {
  const workconfig = vscode.workspace.getConfiguration('gitk')
  const colors = Object.assign({}, workconfig.colors)
  const totalPageCount = Math.ceil(commits.length / SIZE_PER_PAGE)
  const start = (pageNum - 1) * SIZE_PER_PAGE
  const end = start + SIZE_PER_PAGE
  return compiled({
    commits: commits.slice(start, end),
    fontFamily: config.fontFamily,
    pageNum,
    totalPageCount,
    colors
  })
}

function assetPath(...args: string[]) {
  return vscode.Uri.file(path.join(__dirname, '..', '..', '..', 'assets', ...args)).with({
    scheme: 'vscode-resource'
  })
}
