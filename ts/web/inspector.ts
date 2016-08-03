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
      $('div.dom-tree-view').empty();
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
      if ($filepath.val().length == 0) {
        dialog.showErrorBox('Illegal save name', 'Illegal file name was inputted.');
        return;
      }
      else if ($filepath.val().indexOf('.html') != $filepath.val().length -5) {
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
    // let jd: any =0;
    // console.log('Accepted Webview HTML src -', thisInspector.webviewHTML);
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
      let parser: any = new DOMParser();
      // console.log(node.getPrototypeOf());
      // Create the item
      let element: string = `<div class="element-node node-depth-${ depth } drop-shadow">`;
      element += `${ node.nodeName }`;
      element += `</div>`;
      $('div.dom-tree-view').append(element);
    }
    else if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.indexOf('\n') != 0 || true) {
        // console.log($(node.parentElement));
        // thisInspector.webviewHTML.get
        let element: string = `<div class="text-node node-depth-${ depth } drop-shadow`;
        // element += `onclick=\'console.log(\"clicked\");thisInspector.ipc.send(InspectorToMainAsyncRequestToAddSpanTag, element);\'`;
        element += `">`;
        element += `${ node.textContent }`;
        element += `</div>`;
        let $element: any = $($.parseHTML(element));
        console.log(node.parentElement);
        $element.click((event: Event) => {
          console.log('clicked', event);
          thisInspector.ipc
            .send(InspectorToMainAsyncRequestToAddSpanTag,
                  node.parentElement.outerHTML); });

        // console.log('e',node.parentElement.outerHTML);
        $('div.dom-tree-view').append($element);
        // console.log($(element), $('.dom-tree-view'));
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
