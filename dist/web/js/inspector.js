/// <reference path='../typings/index.d.ts' />
var electron = require('electron');
var jquery = require('jquery');
/// <reference path='../../typings/index.d.ts' />
var remote = require('electron').remote;
var dialog = remote.dialog;
var BrowserWindow = remote.BrowserWindow;
var fs = require('fs');
// Message channels
var InspectorToMainAsyncRequestToSendHTMLNameToPreview = 'InspectorToMain.AyncRequest.SendHTMLNameToPreview';
var MainToInspectorAsyncReplyForSendingHTMLNameToPreview = 'MainToInspector.AyncReply.SendingHTMLNameToPreview';
var MainToPreviewAsyncRequestToLoadHTML = 'MainToPreview.AsyncRequest.LoadHTML';
var PreviewToMainAsyncReplyForLoadingHTML = 'PreviewToMain.AsyncReply.LoadingHTML';
var InspectorToMainAsyncRequestToLoadURL = 'InspectorToMain.AsyncRequest.LoadingURL';
var InspectorToMainAsyncRequestToAnalysePreview = 'InspectorToMain.AsyncRequest.AnalysingPreview';
var InspectorToMainAsyncRequestToShowPreviewDevTool = 'InspectorToMain.AsyncRequest.ShowingPreviewDevTool';
var InspectorToMainAsyncRequestToExportModifiedHTML = 'InspectorToMain.AsyncRequest.ExportingModifiedHTML';
var MainToPreviewAsyncRequestToShowDevTool = 'MainToPreview.AsyncRequest.ShowingDevTool';
var InspectToMainAsyncRequestToReturnWebviewHTML = 'InspectToMain.AsyncRequest.ReturnWebviewHTML';
var MainToPreviewAsyncRequestToReturnWebviewHTML = 'MainToPreview.AsyncRequest.ReturnWebviewHTML';
var PreviewToWebviewAsyncRequestToReturnWebviewHTML = 'PreviewToWebview.AsyncRequest.ReturningWebviewHTML';
var WebviewToMainAsyncReplyForReturningWebviewHTML = 'WebviewToMain.AsyncReply.ReturningWebviewHTML';
var PreviewToMainAsyncReplyForReturningWebviewHTML = 'PreviewToMain.AsyncReply.ReturningWebviewHTML';
var MainToInspectorAsyncReplyForReturningWebviewHTML = 'MainToInspector.AsyncReply.ReturningWebviewHTML';
/// <reference path='../requires.ts' />
/// <reference path='./requires.ts' />
/// <reference path='../ipc_messages.ts' />
// ts/web/inspector.ts
// Coded by Yota Odaka
var thisInspector;
var Inspector = (function () {
    function Inspector() {
        this.ipc = electron.ipcRenderer;
        this.webviewHTML = undefined;
        thisInspector = this;
        this.addURLSendEvent();
        this.addShowDevToolRequestEvent();
        this.addSelectDestinationEvent();
        this.addExportHTMLRequestEvent();
        this.addWebviewHTMLRequestEvent();
        this.setAcceptedAsyncMessageReaction();
    }
    Inspector.prototype.addURLSendEvent = function () {
        var _this = this;
        var $button = $('input#send-url');
        $button.click(function (event) {
            var $url = $('input#url-input').val();
            console.log("Send URL to main process - " + $url);
            _this.ipc.send(InspectorToMainAsyncRequestToLoadURL, $url);
            return 0;
        });
    };
    Inspector.prototype.addShowDevToolRequestEvent = function () {
        var _this = this;
        var $button = $('input.inspect');
        $button.click(function (event) {
            _this.ipc.send(InspectorToMainAsyncRequestToShowPreviewDevTool, '');
            console.log('Send inspect preview request to main process');
        });
    };
    Inspector.prototype.addWebviewHTMLRequestEvent = function () {
        var _this = this;
        var $button = $('input.analyse');
        $button.click(function (event) {
            _this.ipc.send(InspectToMainAsyncRequestToReturnWebviewHTML, '');
            console.log('Send webview html request to main process');
        });
    };
    Inspector.prototype.addSelectDestinationEvent = function () {
        var $button = $('.export-html>input.destination-select');
        $button.click(function (event) {
            var focusedWindow = BrowserWindow.getFocusedWindow();
            var options = {
                title: 'Select Destination',
                properties: ['openDirectory', 'createDirectory'] };
            dialog.showOpenDialog(focusedWindow, options, function (directories) {
                if (directories.length != 1) {
                    console.log('Illegal input - Select just a directory');
                    return;
                }
                var $destination = $('.export-html>input.export-name');
                $destination.val(directories[0] + "/" + $destination.val());
                console.log('Destination selected');
            });
        });
    };
    Inspector.prototype.addExportHTMLRequestEvent = function () {
        var _this = this;
        var $button = $('.export-html>input.export-trigger');
        $button.click(function (event) {
            var $filepath = $('.export-html>input.export-name');
            if ($filepath.val().indexOf('.html') != $filepath.val().length - 5) {
                $filepath.val($filepath.val() + ".html");
                console.log('Added extension - .html');
            }
            _this.ipc.send(InspectorToMainAsyncRequestToExportModifiedHTML, $filepath.val());
            console.log('Export modified HTML request to main process');
        });
    };
    Inspector.prototype.setAcceptedSyncMessageReaction = function () {
        console.log('Accepted synchronous message');
    };
    Inspector.prototype.setAcceptedAsyncMessageReaction = function () {
        this.ipc.on(MainToInspectorAsyncReplyForReturningWebviewHTML, this.acceptAsyncReplyForReturningWebviewHTML);
    };
    Inspector.prototype.acceptAsyncReplyForReturningWebviewHTML = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var parser = new DOMParser();
        thisInspector.webviewHTML = parser.parseFromString(args[0], "text/html");
        console.log('Accepted Webview HTML src -', thisInspector.webviewHTML);
        thisInspector.showWebviewHTML();
    };
    Inspector.prototype.showWebviewHTML = function () {
        console.log('Show webview DOM - ', thisInspector.webviewHTML);
    };
    return Inspector;
}());
var inspector = new Inspector();
