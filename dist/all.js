var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='../typings/index.d.ts' />
var electron = require('electron');
var jquery = require('jquery');
/// <reference path="./requires.ts"/>
var base_window;
(function (base_window) {
    var BaseBrowserWindow = (function () {
        function BaseBrowserWindow(options, url) {
            var _this = this;
            this.window = new electron.BrowserWindow(options);
            this.window.loadURL(url);
            this.window.on('closed', function () { _this.onClosed(); });
            this.window.on('close', function (event) { _this.onClose(event); });
            this.window.on('page-title-updateed', function (event) { _this.onPageTitleUpdated(event); });
            this.window.on('unresponsive', function () { _this.onUnresponsive(); });
            this.window.on('responsive', function () { _this.onResponsive(); });
            this.window.on('blur', function () { _this.onBlur(); });
            this.window.on('focus', function () { _this.onFocus(); });
            this.window.on('show', function () { _this.onShow(); });
            this.window.on('hide', function () { _this.onHide(); });
            this.window.on('ready-to-show', function () { _this.onReadyToShow(); });
            this.window.on('maximize', function () { _this.onMaximize(); });
            this.window.on('unmaximize', function () { _this.onUnmaximize(); });
            this.window.on('minimize', function () { _this.onMinimize(); });
            this.window.on('restore', function () { _this.onRestore(); });
            this.window.on('resize', function () { _this.onResize(); });
            this.window.on('move', function () { _this.onMove(); });
            this.window.on('enter-full-screen', function () { _this.onEnterFullScreen(); });
            this.window.on('leave-full-screen', function () { _this.onLeaveFullScreen(); });
            this.window.on('enter-html-full-screen', function () { _this.onEnterHtmlFullScreen(); });
            this.window.on('leave-html-full-screen', function () { _this.onLeaveHtmlFullScreen(); });
            this.window.on('app-command', function (event, cmd) {
                _this.onAppCommand(event, cmd);
            });
            // OS X only
            this.window.on('moved', function () { _this.onMoved(); });
        }
        BaseBrowserWindow.prototype.onClosed = function () { this.window = undefined; };
        BaseBrowserWindow.prototype.onClose = function (event) { };
        BaseBrowserWindow.prototype.onPageTitleUpdated = function (event) { };
        BaseBrowserWindow.prototype.onUnresponsive = function () { };
        BaseBrowserWindow.prototype.onResponsive = function () { };
        BaseBrowserWindow.prototype.onBlur = function () { };
        BaseBrowserWindow.prototype.onFocus = function () { };
        BaseBrowserWindow.prototype.onShow = function () { };
        BaseBrowserWindow.prototype.onHide = function () { };
        BaseBrowserWindow.prototype.onReadyToShow = function () { };
        BaseBrowserWindow.prototype.onMaximize = function () { };
        BaseBrowserWindow.prototype.onUnmaximize = function () { };
        BaseBrowserWindow.prototype.onMinimize = function () { };
        BaseBrowserWindow.prototype.onRestore = function () { };
        BaseBrowserWindow.prototype.onResize = function () { };
        BaseBrowserWindow.prototype.onMove = function () { };
        BaseBrowserWindow.prototype.onMoved = function () { };
        BaseBrowserWindow.prototype.onEnterFullScreen = function () { };
        BaseBrowserWindow.prototype.onLeaveFullScreen = function () { };
        BaseBrowserWindow.prototype.onEnterHtmlFullScreen = function () { };
        BaseBrowserWindow.prototype.onLeaveHtmlFullScreen = function () { };
        BaseBrowserWindow.prototype.onAppCommand = function (event, cmd) { };
        return BaseBrowserWindow;
    }());
    base_window.BaseBrowserWindow = BaseBrowserWindow;
})(base_window || (base_window = {})); // module base_window
/// <reference path="./requires.ts"/>
/// <reference path='./base_browser_window.ts' />
var base_app;
(function (base_app) {
    var BaseApplication = (function () {
        function BaseApplication(app, appName) {
            var _this = this;
            this.app = app;
            this.appName = 'ElectronApp';
            this.appName = appName;
            this.app.on('will-finish-launching', function () { _this.onWillFinishLaunching(); });
            this.app.on('ready', function () { _this.onReady(); });
            this.app.on('window-all-closed', function () { _this.onWindowAllClosed(); });
            this.app.on('before-quit', function (event) { _this.onBeforeQuit(event); });
            this.app.on('will-quit', function (event) { _this.onWillQuit(event); });
            this.app.on('quit', function (event, exitCode) {
                _this.onQuit(event, exitCode);
            });
            this.app.on('browser-window-blur', function (event, window) {
                _this.onBrowserWindowBlur(event, window);
            });
            this.app.on('browser-window-focus', function (event, window) {
                _this.onBrowserWindowFocus(event, window);
            });
            this.app.on('browser-window-created', function (event, window) {
                _this.onBrowserWindowCreated(event, window);
            });
            this.app.on('certificate-error', function (event, webContents, url, error, certificate, callback) {
                _this.onCertificateError(event, webContents, url, error, certificate, callback);
            });
            this.app.on('select-client-certificate', function (event, webContents, url, certificateList, callback) {
                _this.onSelectClientCertificate(event, webContents, url, certificateList, callback);
            });
            this.app.on('login', function (event, webContents, request, authInfo, callback) {
                _this.onLogin(event, webContents, request, authInfo, callback);
            });
            this.app.on('gpu-process-crashed', function () { _this.onGpuProcessCrashed(); });
            // OS X only
            this.app.on('open-file', function (event, path) {
                _this.onOpenFile(event, path);
            });
            this.app.on('open-url', function (event, url) {
                _this.onOpenURL(event, url);
            });
            this.app.on('activate', function (event, hasVisibleWindows) {
                _this.onActivate(event, hasVisibleWindows);
            });
        }
        BaseApplication.prototype.onWindowAllClosed = function () {
            if (process.platform != 'darwin') {
                this.app.quit();
            }
        };
        BaseApplication.prototype.onReady = function () { };
        BaseApplication.prototype.onWillFinishLaunching = function () { };
        BaseApplication.prototype.onBeforeQuit = function (event) { };
        BaseApplication.prototype.onWillQuit = function (event) { };
        BaseApplication.prototype.onQuit = function (event, exitCode) { };
        BaseApplication.prototype.onOpenFile = function (event, path) { };
        BaseApplication.prototype.onOpenURL = function (event, url) { };
        BaseApplication.prototype.onActivate = function (event, hasVisibleWindows) { };
        BaseApplication.prototype.onBrowserWindowBlur = function (event, window) { };
        BaseApplication.prototype.onBrowserWindowFocus = function (event, window) { };
        BaseApplication.prototype.onBrowserWindowCreated = function (event, window) { };
        BaseApplication.prototype.onLogin = function (event, webContents, request, authInfo, callback) { };
        BaseApplication.prototype.onCertificateError = function (event, webContents, url, error, certificate, callback) { };
        BaseApplication.prototype.onSelectClientCertificate = function (event, webContents, url, certificateList, callback) { };
        BaseApplication.prototype.onGpuProcessCrashed = function () { };
        return BaseApplication;
    }());
    base_app.BaseApplication = BaseApplication;
})(base_app || (base_app = {})); // module base_app
/// <reference path='./requires.ts' />
/// <reference path='./base_browser_window.ts' />
var main_window;
(function (main_window) {
    var bWin = base_window;
    var MainWindow = (function (_super) {
        __extends(MainWindow, _super);
        function MainWindow(options, url) {
            _super.call(this, options, url);
        }
        // Accessors
        MainWindow.prototype.setHtml = function (url) {
            this.window.loadURL(url);
        };
        MainWindow.prototype.onShow = function () {
            _super.prototype.onShow.call(this);
            console.log('main window - on show');
        };
        return MainWindow;
    }(bWin.BaseBrowserWindow));
    main_window.MainWindow = MainWindow;
})(main_window || (main_window = {})); // module main_window
/// <reference path="./requires.ts" />
/// <reference path="./base_browser_window.ts" />
var preview_window;
(function (preview_window) {
    var bWin = base_window;
    var PreviewWindow = (function (_super) {
        __extends(PreviewWindow, _super);
        function PreviewWindow(options, url) {
            _super.call(this, options, url);
        }
        return PreviewWindow;
    }(bWin.BaseBrowserWindow));
    preview_window.PreviewWindow = PreviewWindow;
})(preview_window || (preview_window = {})); // module preview_window
/// <reference path='./requires.ts' />
/// <reference path='./base_browser_window.ts' />
/// <reference path='./base_application.ts' />
/// <reference path='./main_window.ts' />
/// <reference path='./preview_window.ts' />
var bApp = base_app;
var bWin = base_window;
var mainWin = main_window;
var previewWin = preview_window;
var app = electron.app;
var Application = (function (_super) {
    __extends(Application, _super);
    function Application(app, appName) {
        _super.call(this, app, appName);
        this.app = app;
        this.mainWindow = undefined;
        this.mainWindowOptions = {};
        this.mainWindowUrl = "file://" + __dirname + "/web/index.html";
        this.previewWindow = undefined;
        this.previewWindowOptions = {};
        this.previewWindowUrl = "file://" + __dirname + "/web/preview.html";
    }
    Application.prototype.onReady = function () {
        _super.prototype.onReady.call(this);
        // Init browser windows - main
        this.mainWindowOptions = {
            width: 500, height: 800, x: 0, y: 0, transparent: false,
            webPreferences: { nodeIntegration: false }
        };
        this.mainWindow =
            new main_window.MainWindow(this.mainWindowOptions, this.mainWindowUrl);
        // Init browser windows - preview
        this.previewWindowOptions = {
            width: 800, height: 1200, x: 500, y: 0, transparent: false,
            webPreferences: { nodeIntegration: false }
        };
        this.previewWindow =
            new previewWin.PreviewWindow(this.previewWindowOptions, this.previewWindowUrl);
    };
    Application.prototype.loadHTML = function () {
    };
    return Application;
}(bApp.BaseApplication));
var application = new Application(app, 'YourTypes');
