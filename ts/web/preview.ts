/// <reference path='./requires.ts' />
/// <reference path='../requires.ts' />
/// <reference path='../ipc_messages.ts' />

// ts/preview.ts
// Coded by Yota Odaka

var thisPreview: Preview;
class Preview {
  ipc: Electron.IpcRenderer = electron.ipcRenderer;
  webview: any ;
  constructor() {
    thisPreview = this;
    this.setAcceptedAsyncMessageReaction();
    this.webview = document.getElementById('webview');
    this.onWebviewReady();
  }
  private setAcceptedAsyncMessageReaction() {
    this.ipc.on(MainToPreviewAsyncRequestToLoadHTML,
                this.acceptAsyncRequestToLoadingHTML);
  }
  private acceptAsyncRequestToLoadingHTML(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    // thisPreview.updateSubWebview(args[0]);
    // $('#sub-webview').attr('src', args[0]);
  }
  private updateSubWebview(url: string) {
    $('#sub-webview').load(url);
  }
  private onWebviewReady() {
    thisPreview.webview.addEventListener('dom-ready', () => {
      this.addVisitPageEvent();
      this.modifyURL();
    });
  }
  private addVisitPageEvent() {
    let $button: JQuery = $('.control-menu>input.visit-url');
    $button.click((event) => {
      let $url: JQuery = $('.control-menu>input.url-field');
      if ($url.val().indexOf('http://') != 0 &&
          $url.val().indexOf('https://') != 0 &&
          $url.val().indexOf('file://') != 0) {
        thisPreview.webview.loadURL(`http://${ $url.val()}`);
      }
      else {
        thisPreview.webview.loadURL($url.val());
      }
    });
  }
  private modifyURL() {
    let $url: string = thisPreview.webview.getURL();
    console.log(`Visit - ${ $url }`);
    $('.control-menu>input.url-field').val($url);
  }
}

var preview: Preview = new Preview();
