/// <reference path='./requires.ts' />
/// <reference path="./ipc_messages.ts"/>

/// <reference path='./base_browser_window.ts' />
/// <reference path='./base_application.ts' />

/// <reference path='./inspector_window.ts' />
/// <reference path='./preview_window.ts' />

import bApp = base_app;
import bWin = base_window;
import mainWin = inspector_window;
import previewWin = preview_window;

var app: Electron.App = electron.app;
var thisClass: Application;

class Application extends bApp.BaseApplication {
  inspectorWindow: inspector_window.InspectorWindow  = undefined;
  inspectorWindowOptions: Electron.BrowserWindowOptions = {};
  inspectorWindowUrl: string = `file://${ __dirname }/web/inspector.html`;
  previewWindow: preview_window.PreviewWindow = undefined;
  previewWindowOptions: Electron.BrowserWindowOptions = {};
  previewWindowUrl: string = `file://${ __dirname }/web/preview.html`;

  ipc: Electron.IpcMain = electron.ipcMain;

  constructor(protected app: Electron.App, appName?: string) {
    super(app, appName);
    thisClass = this;
  }
  onReady() {
    super.onReady();
    // Init browser windows - main
    this.inspectorWindowOptions = {
      width: 500, height: 800, x: 0, y: 0, transparent: false,
      webPreferences: { nodeIntegration: true }
    };
    this.inspectorWindow =
      new inspector_window.InspectorWindow(this.inspectorWindowOptions,
                                           this.inspectorWindowUrl);
    // Init browser windows - preview
    this.previewWindowOptions = {
      width: 1200, height: 1200, x: 500, y: 0, transparent: false,
      webPreferences: { nodeIntegration: true }
    };
    this.previewWindow =
      new previewWin.PreviewWindow(this.previewWindowOptions,
                                   this.previewWindowUrl);
    // IPC message
    this.setAcceptedAsyncMessageReaction();
    this.setAcceptedSyncMessageReaction();
  }

  private setAcceptedAsyncMessageReaction() {
    this.ipc.on(InspectorToMainAsyncRequestToSendHTMLNameToPreview,
                this.acceptAsyncRequestToSendHTMLNameToPreview);
    this.ipc.on(PreviewToMainAsyncReplyForLoadingHTML,
                this.acceptAsyncReplyForLoadingHTML);
    this.ipc.on(InspectorToMainAsyncRequestToLoadURL,
                this.acceptAsyncRequestToLoadURL);
    this.ipc.on(InspectorToMainAsyncRequestToExportModifiedHTML,
                this.acceptAsyncRequestToExportModifiedHTML);
    this.ipc.on(InspectorToMainAsyncRequestToShowPreviewDevTool,
                this.acceptAsyncRequestToShowPreviewDevTool);
    this.ipc.on(InspectToMainAsyncRequestToReturnWebviewHTML,
                this.acceptAsyncRequestToReturnWebviewHTML)
  }
  private setAcceptedSyncMessageReaction() {
    // Use no synchronous communication event
  }
  private acceptAsyncRequestToLoadURL(
      event: Electron.IpcMainEvent, ...args: string[]) {
    if (args[0].indexOf('http://') == 0 || args[0].indexOf('https://') == 0 ||
        args[0].indexOf('file://') == 0) {
      thisClass.previewWindowUrl = args[0];
      console.log('Valid input');
    }
    else if (args[0].indexOf('http://') != 0 || args[0].indexOf('https://') != 0) {
      thisClass.previewWindowUrl = `http://${ args[0] }`;
      console.log('Added "http://"');
    }
    else {
      console.log('Illegal input');
      return;
    }
    thisClass.previewWindow.loadURL(thisClass.previewWindowUrl);
    console.log(`accept loading url message - ${ args[0] }`);
  }
  private acceptAsyncRequestToSendHTMLNameToPreview(
      event: Electron.IpcMainEvent, ...args: string[]) {
    thisClass.previewWindow.window.webContents.send(
      MainToPreviewAsyncRequestToLoadHTML, args[0]);
    event.sender.send(
      MainToInspectorAsyncReplyForSendingHTMLNameToPreview,
      'Sent a request to load html to the preview page');
    console.log('Accepted request from Inspector');
  }
  private acceptAsyncReplyForLoadingHTML(
      event: Electron.IpcMainEvent, ...args: string[]) {
    if (args[0] == 'succeeded') {
      console.log('Succeeded loading a html on the preview page');
    }
    else if (args[0] == 'error') {
      console.log('Error loading a html on the preview page');
    }
  }
  private acceptAsyncRequestToShowPreviewDevTool(
      event: Electron.IpcMainEvent, ...args: string[]) {
    thisClass.previewWindow.window.webContents.send(
      MainToPreviewAsyncRequestToShowDevTool, '');
    console.log('Start to analyse');
  }
  private acceptAsyncRequestToReturnWebviewHTML(
      event: Electron.IpcMainEvent, ...args: string[]) {
    thisClass.previewWindow.window.webContents.send(
      MainToPreviewAsyncRequestToReturnWebviewHTML, '');
    console.log('Send a request webview to return the HTML source');
  }
  private acceptAsyncRequestToExportModifiedHTML(
      event: Electron.IpcMainEvent, ...args: string[]) {
    console.log('Export modified HTML');
    thisClass.previewWindow.window.webContents.savePage(
      args[0], 'HTMLComplete', (error) => {
        if (!error) {
          console.log(`Saved successfully - ${ args[0] }`);
        }
        else { console.log(`error - ${ error }`); }
      });
  }
}

var application: Application = new Application(app, 'YourTypes');
