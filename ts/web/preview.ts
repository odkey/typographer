/// <reference path='./requires.ts' />
/// <reference path='../requires.ts' />
/// <reference path='../ipc_messages.ts' />

// ts/preview.ts
// Coded by Yota Odaka

var thisPreview: Preview;
class Preview {
  ipc: Electron.IpcRenderer = electron.ipcRenderer;
  constructor() {
    thisPreview = this;
    this.setAcceptedAsyncMessageReaction();
  }
  private setAcceptedAsyncMessageReaction() {
    this.ipc.on(MainToPreviewAsyncRequestToLoadHTML,
                this.acceptAsyncRequestToLoadingHTML);
  }
  private acceptAsyncRequestToLoadingHTML(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    // thisPreview.updateSubWebview(args[0]);
    // $('#sub-webview').attr('src', args[0]);
;
  }
  private updateSubWebview(url: string) {
    $('#sub-webview').load(url);
  }
}

var preview: Preview = new Preview();
