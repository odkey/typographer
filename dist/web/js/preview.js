/// <reference path='../../typings/index.d.ts' />
var remote = require('electron').remote;
var dialog = remote.dialog;
var BrowserWindow = remote.BrowserWindow;
var fs = require('fs');
/// <reference path='../typings/index.d.ts' />
var electron = require('electron');
var jquery = require('jquery');
// Message channels
var InspectorToMainAsyncRequestToSendHTMLNameToPreview = 'InspectorToMain.AyncRequest.SendHTMLNameToPreview';
var MainToInspectorAsyncReplyForSendingHTMLNameToPreview = 'MainToInspector.AyncReply.SendingHTMLNameToPreview';
var MainToPreviewAsyncRequestToLoadHTML = 'MainToPreview.AsyncRequest.LoadHTML';
var PreviewToMainAsyncReplyForLoadingHTML = 'PreviewToMain.AsyncReply.LoadingHTML';
var InspectorToMainAsyncRequestToLoadURL = 'InspectorToMain.AsyncRequest.LoadingURL';
var InspectorToMainAsyncRequestToAnalysePreview = 'InspectorToMain.AsyncRequest.AnalysingPreview';
var InspectorToMainAsyncRequestToShowPreviewDevTool = 'InspectorToMain.AsyncRequest.ShowingPreviewDevTool';
var InspectorToMainAsyncRequestToExportModifiedHTML = 'InspectorToMain.AsyncRequest.ExportingModifiedHTML';
var MainToPreviewAsyncRequestToExportModifiedHTML = 'MainInspector.AsyncRequest.ExportingModifiedHTML';
var MainToPreviewAsyncRequestToShowDevTool = 'MainToPreview.AsyncRequest.ShowingDevTool';
var InspectToMainAsyncRequestToReturnWebviewHTML = 'InspectToMain.AsyncRequest.ReturnWebviewHTML';
var MainToPreviewAsyncRequestToReturnWebviewHTML = 'MainToPreview.AsyncRequest.ReturnWebviewHTML';
var PreviewToWebviewAsyncRequestToReturnWebviewHTML = 'PreviewToWebview.AsyncRequest.ReturningWebviewHTML';
var WebviewToMainAsyncReplyForReturningWebviewHTML = 'WebviewToMain.AsyncReply.ReturningWebviewHTML';
var PreviewToMainAsyncReplyForReturningWebviewHTML = 'PreviewToMain.AsyncReply.ReturningWebviewHTML';
var MainToInspectorAsyncReplyForReturningWebviewHTML = 'MainToInspector.AsyncReply.ReturningWebviewHTML';
var InspectorToMainAsyncRequestToAddSpanTag = 'InspectorToMain.AsyncRequest.AddingSpanTag';
var MainToPreviewAsyncRequestToAddSpanTag = 'MainToPreview.AsyncRequest.AddingSpanTag';
var PreviewToWebviewAsyncRequestToAddSpanTag = 'PreviewToWebview.AsyncRequest.AddingSpanTag';
/// <reference path='./requires.ts' />
/// <reference path='../requires.ts' />
/// <reference path='../ipc_messages.ts' />
// ts/preview.ts
// Coded by Yota Odaka
var thisPreview;
var Preview = (function () {
    function Preview() {
        this.ipc = electron.ipcRenderer;
        thisPreview = this;
        this.setAcceptedAsyncMessageReaction();
        this.webview = document.getElementById('webview');
        this.onWebviewReady();
    }
    Preview.prototype.setAcceptedAsyncMessageReaction = function () {
        this.ipc.on(MainToPreviewAsyncRequestToLoadHTML, this.acceptAsyncRequestToLoadingHTML);
        this.ipc.on(MainToPreviewAsyncRequestToShowDevTool, this.acceptAsyncRequestToShowDevTool);
        this.ipc.on(MainToPreviewAsyncRequestToReturnWebviewHTML, this.acceptAsyncRequestToReturnWebviewHTML);
        this.ipc.on(MainToPreviewAsyncRequestToExportModifiedHTML, this.acceptAsyncRequestToExportModifiedHTML);
        this.ipc.on(MainToPreviewAsyncRequestToAddSpanTag, this.acceptAsyncRequestToAddSpanTag);
    };
    Preview.prototype.acceptAsyncRequestToLoadingHTML = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // thisPreview.updateSubWebview(args[0]);
        // $('#sub-webview').attr('src', args[0]);
    };
    Preview.prototype.acceptAsyncRequestToExportModifiedHTML = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        thisPreview.webview.getWebContents().savePage(args[0], 'HTMLComplete', function (error) {
            if (!error) {
                dialog.showErrorBox('Succeeded', "Saved successfully - " + args[0]);
            }
            else {
                console.log("error - " + error);
            }
        });
    };
    Preview.prototype.acceptAsyncRequestToShowDevTool = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!thisPreview.webview.isDevToolsOpened()) {
            thisPreview.webview.openDevTools();
        }
    };
    Preview.prototype.acceptAsyncRequestToReturnWebviewHTML = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log(thisPreview.webview.getWebContents());
        thisPreview.webview.getWebContents()
            .send(PreviewToWebviewAsyncRequestToReturnWebviewHTML);
    };
    Preview.prototype.acceptAsyncRequestToAddSpanTag = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        thisPreview.webview.getWebContents()
            .send(PreviewToWebviewAsyncRequestToAddSpanTag, args[0]);
    };
    Preview.prototype.updateSubWebview = function (url) {
        $('#sub-webview').load(url);
    };
    Preview.prototype.onWebviewReady = function () {
        var _this = this;
        thisPreview.webview.addEventListener('dom-ready', function () {
            _this.addVisitPageEvent();
            _this.addWebviewUndoNextButtonEvent();
            _this.addWebviewDemoLinkButtonEvent();
        });
    };
    Preview.prototype.addVisitPageEvent = function () {
        var _this = this;
        var $button = $('.control-menu>.url>input.visit-url');
        $button.click(function (event) {
            var $url = $('.control-menu>.url>input.url-field');
            if ($url.val().indexOf('http://') != 0 &&
                $url.val().indexOf('https://') != 0 &&
                $url.val().indexOf('file://') != 0) {
                thisPreview.webview.loadURL("http://" + $url.val());
            }
            else {
                _this.webview.loadURL($url.val());
            }
        });
        this.modifyURL();
    };
    Preview.prototype.modifyURL = function () {
        var url = thisPreview.webview.getURL();
        console.log("Visit - " + url);
        $('.control-menu>.url>input.url-field').val(url);
    };
    Preview.prototype.addWebviewUndoNextButtonEvent = function () {
        var $undo = $('.control-menu>.undo-next>.undo-button');
        var $next = $('.control-menu>.undo-next>.next-button');
        $undo.click(function () { thisPreview.webview.goBack(); });
        $next.click(function () { thisPreview.webview.goForward(); });
    };
    Preview.prototype.addWebviewDemoLinkButtonEvent = function () {
        var $link = $('.control-menu>.demo-link>.demo-link-button');
        $link.click(function () {
            thisPreview.webview.loadURL('file:///Users/YotaOdaka/Documents/003_software_engineering/js/typographer/dist/demo_web/index.html');
        });
    };
    return Preview;
}());
var preview = new Preview();
