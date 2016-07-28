/// <reference path="./requires.ts" />
/// <reference path="./base_browser_window.ts" />

module preview_window {

import bWin = base_window;

export class PreviewWindow extends bWin.BaseBrowserWindow {
  constructor(options: Electron.BrowserWindowOptions, url: string) {
    super(options, url);
  }
}

} // module preview_window
