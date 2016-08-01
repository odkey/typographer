/// <reference path='../requires.ts' />
/// <reference path='./requires.ts' />
/// <reference path='../ipc_messages.ts' />

// ts/web/inspector.ts
// Coded by Yota Odaka

class Inspector {
  ipc: Electron.IpcRenderer = electron.ipcRenderer;
  constructor() {
    this.addURLSendEvent();
    this.addAnalyseRequestEvent();
    this.addExportHTMLRequestEvent();
  }
  private addURLSendEvent() {
    let $button: JQuery = $('input#send-url');
    $button.click((event) => {
      let $url: string = $('input#url-input').val();
      console.log(`Send URL to main process - ${ $url }`);
      this.ipc.send(InspectorToMainAsyncRequestToLoadURL, $url);
      return 0;
    });
  }
  private addAnalyseRequestEvent() {
    let $button: JQuery = $('input#analyse');
    $button.click((event) => {
      this.ipc.send(InspectorToMainAsyncRequestToAnalysePreview, '');
      console.log('Send analyse preview request to main process');
    });
  }
  private addExportHTMLRequestEvent() {
    let $button: JQuery = $('input#export');
    $button.click((event) => {
      this.ipc.send(InspectorToMainAsyncRequestToExportModifiedHTML, '');
      console.log('Export modified HTML request to main process');
    });
  }
  private acceptSyncMessage(event: Electron.IpcRendererEvent, ...args: string[]) {
    console.log('Accepted synchronous message');
    console.log(`event: ${ event }`);
    console.log(`args: ${ args }`);
  }
  private acceptAsyncMessage(event: Electron.IpcRendererEvent, ...args: string[]) {
    console.log('Accepted asynchronous message');
    console.log(`evnet:`, event);
    console.log(`args: ${ args }`);
  }
}

 var inspector: Inspector = new Inspector();
