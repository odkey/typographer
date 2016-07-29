/// <reference path='./requires.ts' />
/// <reference path='./base_browser_window.ts' />
/// <reference path='./base_application.ts' />

/// <reference path='./inspector_window.ts' />
/// <reference path='./preview_window.ts' />

import bApp = base_app;
import bWin = base_window;
import mainWin = inspector_window;
import previewWin = preview_window;

var app: Electron.App = electron.app;

class Application extends bApp.BaseApplication {
  inspectorWindow: inspector_window.InspectorWindow  = undefined;
  inspectorWindowOptions: Electron.BrowserWindowOptions = {};
  inspectorWindowUrl: string = `file://${ __dirname }/web/inspector.html`;
  previewWindow: preview_window.PreviewWindow = undefined;
  previewWindowOptions: Electron.BrowserWindowOptions = {};
  previewWindowUrl: string = `file://${ __dirname }/web/preview.html`;

  constructor(protected app: Electron.App, appName?: string) {
    super(app, appName);
  }

  onReady() {
    super.onReady();
    // Init browser windows - main
    this.inspectorWindowOptions = {
      width: 500, height: 800, x: 0, y: 0, transparent: false,
      webPreferences: { nodeIntegration: false }
    };
    this.inspectorWindow =
      new inspector_window.InspectorWindow(this.inspectorWindowOptions,
                                           this.inspectorWindowUrl);
    // Init browser windows - preview
    this.previewWindowOptions = {
      width: 800, height: 1200, x: 500, y: 0, transparent: false,
      webPreferences: { nodeIntegration: false }
    };
    this.previewWindow =
      new previewWin.PreviewWindow(this.previewWindowOptions,
                                   this.previewWindowUrl);
  }

  private loadHTML() {

  }
}

var application: Application = new Application(app, 'YourTypes');
