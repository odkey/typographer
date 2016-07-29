/// <reference path='./requires.ts' />
/// <reference path='./base_browser_window.ts' />

module main_window {

import bWin = base_window;

export class MainWindow extends bWin.BaseBrowserWindow {
  constructor(options: Electron.BrowserWindowOptions, url: string) {
    super(options, url);
  }
  // Accessors
  setHtml(url: string) {
    this.window.loadURL(url);
  }
  onShow() {
    super.onShow();
    console.log('main window - on show');
  }
}

} // module main_window
