/// <reference path='../../typings/index.d.ts' />

var remote: Electron.Remote = require('electron').remote;
var dialog: Electron.Dialog = remote.dialog;
var BrowserWindow: typeof Electron.BrowserWindow = remote.BrowserWindow;
var fs: NodeModule = require('fs');
