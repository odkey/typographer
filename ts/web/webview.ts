/// <reference path='../../typings/globals/github-electron/index.d.ts' />
/// <reference path='../ipc_messages.ts' />
var electron = require('electron');

// ts/web/webview.ts
// Coded by Yota Odaka

var thisWebview: Webview;
class Webview {
  ipc: Electron.IpcRenderer = require('electron').ipcRenderer;
  constructor() {
    thisWebview = this;
    console.log('Preview webview');
    // this.ipc.send(WebviewToPreviewAsyncReplyForReturningWebviewHTML, '');
    this.ipc.on(PreviewToWebviewAsyncRequestToReturnWebviewHTML,
                this.acceptReturnWebviewHTMLRequestEvent);
  }
  private acceptReturnWebviewHTMLRequestEvent(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    let html: any = document.documentElement.outerHTML;
    console.log(`Accept request - `, html);
    thisWebview.ipc
      .send(WebviewToMainAsyncReplyForReturningWebviewHTML, html);
  }
}

var webview: Webview = new Webview();
