/// <reference path="./requires.ts"/>
/// <reference path='./base_browser_window.ts' />

module base_app {

import bWin = base_window;

export interface CertificateObject {
  data: Buffer,
  issueName: string
}

export interface RequestObject {
  method: string,
  url: string,
  referrer: string
}

export interface AuthInfoObject {
  isProxy: boolean,
  scheme: string,
  host: string,
  port: number,
  realm: string
}

export class BaseApplication {
  mainWindow: bWin.BaseBrowserWindow = undefined;
  appName: string = 'ElectronApp';
  windowOptions: Electron.BrowserWindowOptions = {
    width: 800,
    height: 400,
    minWidth: 500,
    minHeight: 200,
    acceptFirstMouse: true,
    titleBarStyle: 'default'
  };
  startUrl: string = 'file://' + __dirname + '/index.html';

  constructor(protected app: Electron.App,
              windowOptions?: Electron.BrowserWindowOptions,
              url?: string, appName?: string) {
    this.appName = appName;
    if (windowOptions !== undefined) {
      this.windowOptions = windowOptions;
    }
    if (url !== undefined) {
      this.startUrl = url;
    }
    this.app.on('will-finish-launching',
                () => { this.onWillFinishLaunching(); });
    this.app.on('ready',
                () => { this.onReady(); });
    this.app.on('window-all-closed',
                () => { this.onWindowAllClosed(); });
    this.app.on('before-quit',
                (event: string) => { this.onBeforeQuit(event); });
    this.app.on('will-quit',
                (event: string) => { this.onWillQuit(event); });
    this.app.on('quit',
                (event: string, exitCode: number) => {
                  this.onQuit(event, exitCode)});
    this.app.on('browser-window-blur',
                (event: string, window: Electron.BrowserWindow) => {
                  this.onBrowserWindowBlur(event, window); });
    this.app.on('browser-window-focus',
                (event: string, window: Electron.BrowserWindow) => {
                  this.onBrowserWindowFocus(event, window); });
    this.app.on('browser-window-created',
                (event: string, window: Electron.BrowserWindow) => {
                  this.onBrowserWindowCreated(event, window); });
    this.app.on('certificate-error',
                (event: string,
                 webContents: Electron.WebContents,
                 url: string,
                 error: string,
                 certificate: CertificateObject,
                 callback: (verifyCertificate: boolean) => void) => {
                   this.onCertificateError(event, webContents,
                                           url, error,
                                           certificate, callback); });
    this.app.on('select-client-certificate',
                (event: string,
                 webContents: Electron.WebContents,
                 url: string,
                 certificateList: CertificateObject[],
                 callback: (certificate: CertificateObject) => void) => {
                   this.onSelectClientCertificate(event, webContents, url,
                                                  certificateList, callback); });
    this.app.on('login',
                (event: string,
                 webContents: Electron.WebContents,
                 request: RequestObject,
                 authInfo: AuthInfoObject,
                 callback: (username: string) => void) => {
                   this.onLogin(event, webContents, request,
                                authInfo, callback); });
    this.app.on('gpu-process-crashed',
                () => { this.onGpuProcessCrashed(); });
    // OS X only
    this.app.on('open-file',
                (event: string, path: string) => {
                  this.onOpenFile(event, path); });
    this.app.on('open-url',
                (event: string, url: string) => {
                  this.onOpenURL(event, url); });
    this.app.on('activate',
                (event: string, hasVisibleWindows: boolean) => {
                  this.onActivate(event, hasVisibleWindows); });
  }

  onWindowAllClosed() {
    if (process.platform != 'darwin') {
      this.app.quit();
    }
  }

  onReady() {
    const mythis = this;
    const myBrowserWindowClass = class extends bWin.BaseBrowserWindow {
      onClosed() {
        mythis.mainWindow = undefined;
        super.onClosed();
      }
    };
    this.mainWindow =
      new myBrowserWindowClass(this.windowOptions, this.startUrl);
  }

  onWillFinishLaunching() {}
  onBeforeQuit(event: string) {}
  onWillQuit(event: string) {}
  onQuit(event: string, exitCode: number) {}
  onOpenFile(event: string, path: string) {}
  onOpenURL(event: string, url: string) {}
  onActivate(event: string, hasVisibleWindows: boolean) {}
  onBrowserWindowBlur(event: string, window: Electron.BrowserWindow) {}
  onBrowserWindowFocus(event: string, window: Electron.BrowserWindow) {}
  onBrowserWindowCreated(event: string, window: Electron.BrowserWindow) {}
  onCertificateError(event: string,
                     webContents: Electron.WebContents,
                     url: string,
                     error: string,
                     certificate: CertificateObject,
                     callback: (verifyCertificate: boolean) => void) {}
  onSelectClientCertificate(event: string,
                            webContents: Electron.WebContents,
                            url: string,
                            certificateList: CertificateObject[],
                            callback: (certificate: CertificateObject) => void) {}
  onLogin(event: string,
          webContents: Electron.WebContents,
          request: RequestObject,
          authInfo: AuthInfoObject,
          callback: (username: string) => void) {}
  onGpuProcessCrashed() {}
}

} // module base_app
