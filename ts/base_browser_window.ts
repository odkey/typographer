/// <reference path="./requires.ts"/>

module base_window {

export class BaseBrowserWindow {
  window: Electron.BrowserWindow;

  constructor(options: Electron.BrowserWindowOptions, url: string) {
    this.window = new electron.BrowserWindow(options);
    this.window.loadURL(url);

    this.window.on('closed', () => { this.onClosed(); });
    this.window.on('close',
                   (event: Event) => { this.onClose(event); });
    this.window.on('page-title-updateed',
                   (event: Event) => { this.onPageTitleUpdated(event); });
    this.window.on('unresponsive', () => { this.onUnresponsive(); });
    this.window.on('responsive', () => { this.onResponsive(); });
    this.window.on('blur', () => { this.onBlur(); });
    this.window.on('focus', () => { this.onFocus(); });
    this.window.on('show', () => { this.onShow(); });
    this.window.on('hide', () => { this.onHide(); });
    this.window.on('ready-to-show', () => { this.onReadyToShow(); });
    this.window.on('maximize', () => { this.onMaximize(); });
    this.window.on('unmaximize', () => { this.onUnmaximize(); });
    this.window.on('minimize', () => { this.onMinimize(); });
    this.window.on('restore', () => { this.onRestore(); });
    this.window.on('resize', () => { this.onResize(); });
    this.window.on('move', () => { this.onMove(); });
    this.window.on('enter-full-screen',
                   () => { this.onEnterFullScreen(); });
    this.window.on('leave-full-screen',
                   () => { this.onLeaveFullScreen(); });
    this.window.on('enter-html-full-screen',
                   () => { this.onEnterHtmlFullScreen(); });
    this.window.on('leave-html-full-screen',
                   () => { this.onLeaveHtmlFullScreen(); });
    this.window.on('app-command',
                   (event: Event, cmd: string) => {
                     this.onAppCommand(event, cmd); });

    // OS X only
    this.window.on('moved', () => { this.onMoved(); });
  }
  loadURL(url: string) { this.window.loadURL(url); }
  onClosed() { this.window = undefined; }
  onClose(event: Event) {}
  onPageTitleUpdated(event: Event) {}
  onUnresponsive() {}
  onResponsive() {}
  onBlur() {}
  onFocus() {}
  onShow() {}
  onHide() {}
  onReadyToShow() {}
  onMaximize() {}
  onUnmaximize() {}
  onMinimize() {}
  onRestore() {}
  onResize() {}
  onMove() {}
  onMoved() {}
  onEnterFullScreen() {}
  onLeaveFullScreen() {}
  onEnterHtmlFullScreen() {}
  onLeaveHtmlFullScreen() {}
  onAppCommand(event: Event, cmd: string) {}
}

} // module base_window
