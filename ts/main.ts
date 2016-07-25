/// <reference path='./requires.ts' />
/// <reference path='./base_browser_window.ts' />
/// <reference path='./base_application.ts' />

import bApp = base_app;

const app: Electron.App = electron.app;
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

}

var application: Application = new Application(app, options, url);
