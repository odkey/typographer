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
    this.ipc.on(MainToPreviewAsyncRequestToShowDevTool,
                this.acceptAsyncRequestToShowDevTool);
    this.ipc.on(MainToPreviewAsyncRequestToReturnWebviewHTML,
                this.acceptAsyncRequestToReturnWebviewHTML);
    this.ipc.on(MainToPreviewAsyncRequestToExportModifiedHTML,
                this.acceptAsyncRequestToExportModifiedHTML);
    this.ipc.on(MainToPreviewAsyncRequestToAddSpanTag,
                this.acceptAsyncRequestToAddSpanTag);
  }
  private acceptAsyncRequestToLoadingHTML(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    // thisPreview.updateSubWebview(args[0]);
    // $('#sub-webview').attr('src', args[0]);
  }
  private acceptAsyncRequestToExportModifiedHTML(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    thisPreview.webview.getWebContents().savePage(
      args[0], 'HTMLComplete', (error: any) => {
        if (!error) {
          dialog.showErrorBox('Succeeded',`Saved successfully - ${ args[0] }`);
        }
        else { console.log(`error - ${ error }`); }
      });
  }
  private acceptAsyncRequestToShowDevTool(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    if (!thisPreview.webview.isDevToolsOpened()) {
      thisPreview.webview.openDevTools();
    }
  }
  private acceptAsyncRequestToReturnWebviewHTML(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    console.log(thisPreview.webview.getWebContents());
    thisPreview.webview.getWebContents()
      .send(PreviewToWebviewAsyncRequestToReturnWebviewHTML);
  }
  private acceptAsyncRequestToAddSpanTag(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    thisPreview.webview.getWebContents()
      .send(PreviewToWebviewAsyncRequestToAddSpanTag, args[0]);
  }
  private updateSubWebview(url: string) {
    $('#sub-webview').load(url);
  }
  private onWebviewReady() {
    thisPreview.webview.addEventListener('dom-ready', () => {
      this.addVisitPageEvent();
      this.addWebviewUndoNextButtonEvent();
      this.addWebviewDemoLinkButtonEvent();
    });
  }
  private addVisitPageEvent() {
    let $button: JQuery = $('.control-menu>.url>input.visit-url');
    $button.click((event) => {
      let $url: JQuery = $('.control-menu>.url>input.url-field');
      if ($url.val().indexOf('http://') != 0 &&
          $url.val().indexOf('https://') != 0 &&
          $url.val().indexOf('file://') != 0) {
        thisPreview.webview.loadURL(`http://${ $url.val()}`);
      }
      else {
        this.webview.loadURL($url.val());
      }
    });
    this.modifyURL();
  }
  private modifyURL() {
    let url: string = thisPreview.webview.getURL();
    console.log(`Visit - ${ url }`);
    $('.control-menu>.url>input.url-field').val(url);
  }
  private addWebviewUndoNextButtonEvent() {
    let $undo: JQuery = $('.control-menu>.undo-next>.undo-button');
    let $next: JQuery = $('.control-menu>.undo-next>.next-button');
    $undo.click(() => { thisPreview.webview.goBack(); });
    $next.click(() => { thisPreview.webview.goForward(); });
  }
  private addWebviewDemoLinkButtonEvent() {
    let $link: JQuery =  $('.control-menu>.demo-link>.demo-link-button');
    $link.click(() => {
      thisPreview.webview.loadURL('file:///Users/YotaOdaka/Documents/003_software_engineering/js/typographer/dist/demo_web/index.html');
    });
  }
}

var preview: Preview = new Preview();
