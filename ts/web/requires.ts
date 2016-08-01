/// <reference path='../../typings/index.d.ts' />

const remote: Electron.Remote = require('electron').remote;
const dialog: Electron.Dialog = remote.dialog;
const BrowserWindow: typeof Electron.BrowserWindow = remote.BrowserWindow;
const fs: NodeModule = require('fs');
