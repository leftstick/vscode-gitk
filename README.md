# vscode-gitk

[![vscode version][vs-image]][vs-url]
![][install-url]
![][rate-url]
![][license-url]

Show git commit log for selected source code information in an individual view

![](https://raw.githubusercontent.com/leftstick/vscode-gitk/master/images/gitk.gif)

## Install

Launch VS Code Quick Open (`cmd`/`ctrl` + `p`), paste the following command, and press enter.

```
ext install gitk
```

## Usage

I assume you have [git](https://git-scm.com/) installed.

`vscode-gitk` will `log` your selected document, and display log information into a separate view

### Configuration

```javascript
{
    "gitk.fontFamily": "monospace" //font you preferred for the gitk view
}
```

## LICENSE ##

[GPL v3 License](https://raw.githubusercontent.com/leftstick/vscode-gitk/master/LICENSE)


[vs-url]: https://marketplace.visualstudio.com/items?itemName=howardzuo.vscode-gitk
[vs-image]: http://vsmarketplacebadge.apphb.com/version/howardzuo.vscode-gitk.svg
[install-url]: http://vsmarketplacebadge.apphb.com/installs/howardzuo.vscode-gitk.svg
[rate-url]: http://vsmarketplacebadge.apphb.com/rating/howardzuo.vscode-gitk.svg
[license-url]: https://img.shields.io/github/license/leftstick/vscode-gitk.svg