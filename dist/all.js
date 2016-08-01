var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='../typings/index.d.ts' />
var electron = require('electron');
var jquery = require('jquery');
// Message channels
var InspectorToMainAsyncRequestToSendHTMLNameToPreview = 'InspectorToMain.AyncRequest.SendHTMLNameToPreview';
var MainToInspectorAsyncReplyForSendingHTMLNameToPreview = 'MainToInspector.AyncReply.SendingHTMLNameToPreview';
var MainToPreviewAsyncRequestToLoadHTML = 'MainToPreview.AsyncRequest.LoadHTML';
var PreviewToMainAsyncReplyForLoadingHTML = 'PreviewToMain.AsyncReply.LoadingHTML';
var InspectorToMainAsyncRequestToLoadURL = 'InspectorToMain.AsyncRequest.LoadingURL';
var InspectorToMainAsyncRequestToAnalysePreview = 'InspectorToMain.AsyncRequest.AnalysePreview';
var InspectorToMainAsyncRequestToExportModifiedHTML = 'InspectorToMain.AsyncRequest.ExportingModifiedHTML';
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
        BaseBrowserWindow.prototype.loadURL = function (url) { this.window.loadURL(url); };
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
var inspector_window;
(function (inspector_window) {
    var bWin = base_window;
    var InspectorWindow = (function (_super) {
        __extends(InspectorWindow, _super);
        function InspectorWindow(options, url) {
            _super.call(this, options, url);
        }
        // Accessors
        InspectorWindow.prototype.setHtml = function (url) {
            this.window.loadURL(url);
        };
        InspectorWindow.prototype.onShow = function () {
            _super.prototype.onShow.call(this);
            console.log('main window - on show');
        };
        return InspectorWindow;
    }(bWin.BaseBrowserWindow));
    inspector_window.InspectorWindow = InspectorWindow;
})(inspector_window || (inspector_window = {})); // module main_window
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
/// <reference path="./ipc_messages.ts"/>
/// <reference path='./base_browser_window.ts' />
/// <reference path='./base_application.ts' />
/// <reference path='./inspector_window.ts' />
/// <reference path='./preview_window.ts' />
var bApp = base_app;
var bWin = base_window;
var mainWin = inspector_window;
var previewWin = preview_window;
var app = electron.app;
var thisClass;
var Application = (function (_super) {
    __extends(Application, _super);
    function Application(app, appName) {
        _super.call(this, app, appName);
        this.app = app;
        this.inspectorWindow = undefined;
        this.inspectorWindowOptions = {};
        this.inspectorWindowUrl = "file://" + __dirname + "/web/inspector.html";
        this.previewWindow = undefined;
        this.previewWindowOptions = {};
        this.previewWindowUrl = "file://" + __dirname + "/web/preview.html";
        this.ipc = electron.ipcMain;
        thisClass = this;
    }
    Application.prototype.onReady = function () {
        _super.prototype.onReady.call(this);
        // Init browser windows - main
        this.inspectorWindowOptions = {
            width: 500, height: 800, x: 0, y: 0, transparent: false,
            webPreferences: { nodeIntegration: true }
        };
        this.inspectorWindow =
            new inspector_window.InspectorWindow(this.inspectorWindowOptions, this.inspectorWindowUrl);
        // Init browser windows - preview
        this.previewWindowOptions = {
            width: 800, height: 1200, x: 500, y: 0, transparent: false,
            webPreferences: { nodeIntegration: false }
        };
        this.previewWindow =
            new previewWin.PreviewWindow(this.previewWindowOptions, this.previewWindowUrl);
        // IPC message
        this.setAcceptedAsyncMessageReaction();
        this.setAcceptedSyncMessageReaction();
    };
    Application.prototype.setAcceptedAsyncMessageReaction = function () {
        this.ipc.on(InspectorToMainAsyncRequestToSendHTMLNameToPreview, this.acceptAsyncRequestToSendHTMLNameToPreview);
        this.ipc.on(PreviewToMainAsyncReplyForLoadingHTML, this.acceptAsyncReplyForLoadingHTML);
        this.ipc.on(InspectorToMainAsyncRequestToLoadURL, this.acceptAsyncRequestToLoadURL);
        this.ipc.on(InspectorToMainAsyncRequestToAnalysePreview, this.acceptAsyncRequestToAnalysePreview);
        this.ipc.on(InspectorToMainAsyncRequestToExportModifiedHTML, this.acceptAsyncRequestToExportModifiedHTML);
    };
    Application.prototype.setAcceptedSyncMessageReaction = function () {
    };
    Application.prototype.acceptAsyncRequestToLoadURL = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args[0].indexOf('http://') == 0 || args[0].indexOf('https://') == 0 ||
            args[0].indexOf('file://') == 0) {
            thisClass.previewWindowUrl = args[0];
            console.log('Valid input');
        }
        else if (args[0].indexOf('http://') != 0 || args[0].indexOf('https://') != 0) {
            thisClass.previewWindowUrl = "http://" + args[0];
            console.log('Added "http://"');
        }
        else {
            console.log('Illegal input');
            return;
        }
        thisClass.previewWindow.loadURL(thisClass.previewWindowUrl);
        console.log("accept loading url message - " + args[0]);
    };
    Application.prototype.acceptAsyncRequestToSendHTMLNameToPreview = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        thisClass.previewWindow.window.webContents.send(MainToPreviewAsyncRequestToLoadHTML, args[0]);
        event.sender.send(MainToInspectorAsyncReplyForSendingHTMLNameToPreview, 'Sent a request to load html to the preview page');
        console.log('Accepted request from Inspector');
    };
    Application.prototype.acceptAsyncReplyForLoadingHTML = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args[0] == 'succeeded') {
            console.log('Succeeded loading a html on the preview page');
        }
        else if (args[0] == 'error') {
            console.log('Error loading a html on the preview page');
        }
    };
    Application.prototype.acceptAsyncRequestToAnalysePreview = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log('Start to analyse');
    };
    Application.prototype.acceptAsyncRequestToExportModifiedHTML = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log('Export modified HTML');
        console.log(thisClass.previewWindow.window.webContents);
    };
    return Application;
}(bApp.BaseApplication));
var application = new Application(app, 'YourTypes');
