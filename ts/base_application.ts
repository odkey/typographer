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
  appName: string = 'ElectronApp';

  constructor(protected app: Electron.App, appName?: string) {
    this.appName = appName;
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
  onReady() {}
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
  onLogin(event: string,
          webContents: Electron.WebContents,
          request: RequestObject,
          authInfo: AuthInfoObject,
          callback: (username: string) => void) {}
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

  onGpuProcessCrashed() {}
}

} // module base_app
