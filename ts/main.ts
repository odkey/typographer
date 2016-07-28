/// <reference path='./requires.ts' />
/// <reference path='./base_browser_window.ts' />
/// <reference path='./base_application.ts' />
/// <reference path="./preview_window.ts"/>

import bApp = base_app;
import bWin = base_window;
import previewWindow = preview_window;

var app: Electron.App = electron.app;

const options: Electron.BrowserWindowOptions = {
  width: 500,
  height: 300,
  minWidth: 200,
  minHeight: 150,
  acceptFirstMouse: true,
  titleBarStyle: 'default'
};

const url: string = `file://${ __dirname }/index.html`;

class Application extends bApp.BaseApplication {
  previewWindow: previewWindow.PreviewWindow = undefined;

  constructor(protected app: Electron.App,
              windowOptions?: Electron.BrowserWindowOptions,
              url?: string, appName?: string) {
    super(app, windowOptions, url, appName);
  }

  onReady() {
    super.onReady();
    const previewUrl: string = `file://${ __dirname }/preview.html`
    this.previewWindow = new previewWindow.PreviewWindow({}, previewUrl);
  }
}

var application: Application = new Application(app, options, url, 'YourTypes');
