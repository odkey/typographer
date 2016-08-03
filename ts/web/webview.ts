/// <reference path='../../typings/globals/github-electron/index.d.ts' />
/// <reference path='../../typings/globals/jquery/index.d.ts' />

/// <reference path='../ipc_messages.ts' />
var electron = require('electron');

// Remove following // on .js
// window.addEventListener('load', () => {
  // window.$ = window.jQuery = require('jquery');
// });

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
    this.ipc.on(PreviewToWebviewAsyncRequestToAddSpanTag,
                this.acceptAddSpanTagRequestEvent);
  }
  private acceptReturnWebviewHTMLRequestEvent(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    let html: any = document.documentElement.outerHTML;
    console.log(`Accept request - ${ PreviewToWebviewAsyncRequestToReturnWebviewHTML }`);
    thisWebview.ipc
      .send(WebviewToMainAsyncReplyForReturningWebviewHTML, html);
  }
  private acceptAddSpanTagRequestEvent(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    console.log(`Accept request - ${ PreviewToWebviewAsyncRequestToAddSpanTag }`);
    let $e: any = $($.parseHTML(args[0])[0]);
    let text: string = $e.text();
    let tag: string = $e[0].tagName;
    let $element: any = $('body').find(`${tag}:contains('${text}')`);
    let charArray: string[] = text.split('');
    let charArrayWithSpan: string[] = [];
    $.each(charArray, (i, e) => {
      charArrayWithSpan[i] = `<span style="letter-spacing: ${ 1 }em;">${ e }</span>`;
      // console.log(i, charArrayWithSpan[i]);
    });
    $element.text('').append(charArrayWithSpan.join(''));
    // console.log('join: ', charArrayWithSpan.join(''));
  }
}

var webview: Webview = new Webview();
