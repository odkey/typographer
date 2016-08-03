/// <reference path='../requires.ts' />
/// <reference path='./requires.ts' />
/// <reference path='../ipc_messages.ts' />

// ts/web/inspector.ts
// Coded by Yota Odaka

var thisInspector: Inspector;
class Inspector {
  ipc: Electron.IpcRenderer = electron.ipcRenderer;
  webviewHTML: HTMLDocument = undefined;
  constructor() {
    thisInspector = this;
    this.addURLSendEvent();
    this.addShowDevToolRequestEvent();
    this.addSelectDestinationEvent();
    this.addExportHTMLRequestEvent();
    this.addWebviewHTMLRequestEvent();

    this.setAcceptedAsyncMessageReaction();
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
  private setAcceptedSyncMessageReaction() {
    console.log('Accepted synchronous message');
  }
  private setAcceptedAsyncMessageReaction() {
    this.ipc.on(MainToInspectorAsyncReplyForReturningWebviewHTML,
                this.acceptAsyncReplyForReturningWebviewHTML);
  }
  private acceptAsyncReplyForReturningWebviewHTML(
      event: Electron.IpcRendererEvent, ...args: string[]) {
    let parser: DOMParser = new DOMParser();
    thisInspector.webviewHTML =
      parser.parseFromString(args[0].toString(), "text/html");
    console.log('Accepted Webview HTML src -', thisInspector.webviewHTML);
    thisInspector.showWebviewHTML();
  }
  private showWebviewHTML() {
    console.log('Show webview DOM - ', thisInspector.webviewHTML);
    let $domTreeField: JQuery = $('div.dom-tree-view');
    let domTree: string = undefined;
    let firstNodes: NodeList = thisInspector.webviewHTML.childNodes;
    thisInspector.appendItemToDOMTreeView(thisInspector.webviewHTML, 0);
  }
  private appendItemToDOMTreeView(node: Node, depth: number) {
    if (node.nodeType == Node.ELEMENT_NODE) {
      // Create the item
      let element: string = `<div class="text-node node-depth-${ depth }">`;
      element += `${ depth }&nbsp;${ node.nodeName }&nbsp;${ node }`;
      element += `</div>`;
      $('div.dom-tree-view').append(element);
    }
    else if (node.nodeType == Node.TEXT_NODE) {
      console.log(node.textContent);
      if (node.textContent  ) {
        console.log(node.textContent);
      $('div.dom-tree-view')
        .append(`<div style="margin-left:${ depth*15 }px;">${ node.textContent }</div>`);
      }
    }
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        thisInspector.appendItemToDOMTreeView(node.childNodes[i], depth+1);
      }
    }
  }
}

 var inspector: Inspector = new Inspector();
