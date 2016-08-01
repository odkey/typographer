/// <reference path='../requires.ts' />
/// <reference path='./requires.ts' />
/// <reference path='../ipc_messages.ts' />

// ts/web/inspector.ts
// Coded by Yota Odaka

class Inspector {
  ipc: Electron.IpcRenderer = electron.ipcRenderer;
  constructor() {
    this.addURLSendEvent();
    this.addShowDevToolRequestEvent();
    this.addSelectDestinationEvent();
    this.addExportHTMLRequestEvent();
    this.addWebviewHTMLRequestEvent();
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
  private addShowDevToolRequestEvent() {
    let $button: JQuery = $('input.inspect');
    $button.click((event) => {
      this.ipc.send(InspectorToMainAsyncRequestToShowPreviewDevTool, '');
      console.log('Send inspect preview request to main process');
    });
  }
  private addWebviewHTMLRequestEvent() {
    let $button: JQuery = $('input.analyse');
    $button.click((event) => {
      this.ipc.send(InspectToMainAsyncRequestToReturnWebviewHTML, '');
      console.log('Send webview html request to main process');
    });
  }
  private addSelectDestinationEvent() {
    let $button: JQuery = $('.export-html>input.destination-select');
    $button.click((event) => {
      let focusedWindow: Electron.BrowserWindow =
        BrowserWindow.getFocusedWindow();
      let options: Electron.OpenDialogOptions = {
        title: 'Select Destination',
        properties: ['openDirectory', 'createDirectory'] };
      dialog.showOpenDialog(focusedWindow, options, (directories: string[]) => {
        if (directories.length != 1) {
          console.log('Illegal input - Select just a directory');
          return;
        }
        let $destination: JQuery = $('.export-html>input.export-name');
        $destination.val(`${ directories[0]}/${$destination.val()}`);
        console.log('Destination selected');
      });
    });
  }
  private addExportHTMLRequestEvent() {
    let $button: JQuery = $('.export-html>input.export-trigger');
    $button.click((event) => {
      let $filepath: JQuery = $('.export-html>input.export-name');
      if ($filepath.val().indexOf('.html') != $filepath.val().length -5) {
        $filepath.val(`${ $filepath.val() }.html`);
        console.log('Added extension - .html');
      }
      this.ipc.send(InspectorToMainAsyncRequestToExportModifiedHTML,
        $filepath.val());
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
