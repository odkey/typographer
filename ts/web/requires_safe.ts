/// <reference path='../../typings/index.d.ts' />

var nodeRequire: NodeRequire = require;
var remote: Electron.Remote = nodeRequire('electron').remote;
var dialog: Electron.Dialog = remote.dialog;
var BrowserWindow: typeof Electron.BrowserWindow = remote.BrowserWindow;
var fs: NodeModule = nodeRequire('fs');
