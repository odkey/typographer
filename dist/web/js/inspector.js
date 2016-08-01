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
var InspectorToMainAsyncRequestToAnalysePreview = 'InspectorToMain.AsyncRequest.AnalysePreview';
var InspectorToMainAsyncRequestToExportModifiedHTML = 'InspectorToMain.AsyncRequest.ExportingModifiedHTML';
/// <reference path='../requires.ts' />
/// <reference path='./requires.ts' />
/// <reference path='../ipc_messages.ts' />
// ts/web/inspector.ts
// Coded by Yota Odaka
var Inspector = (function () {
    function Inspector() {
        this.ipc = electron.ipcRenderer;
        this.addURLSendEvent();
        this.addAnalyseRequestEvent();
        this.addExportHTMLRequestEvent();
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
    Inspector.prototype.addAnalyseRequestEvent = function () {
        var _this = this;
        var $button = $('input#analyse');
        $button.click(function (event) {
            _this.ipc.send(InspectorToMainAsyncRequestToAnalysePreview, '');
            console.log('Send analyse preview request to main process');
        });
    };
    Inspector.prototype.addExportHTMLRequestEvent = function () {
        var _this = this;
        var $button = $('input#export');
        $button.click(function (event) {
            _this.ipc.send(InspectorToMainAsyncRequestToExportModifiedHTML, '');
            console.log('Export modified HTML request to main process');
        });
    };
    Inspector.prototype.acceptSyncMessage = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log('Accepted synchronous message');
        console.log("event: " + event);
        console.log("args: " + args);
    };
    Inspector.prototype.acceptAsyncMessage = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log('Accepted asynchronous message');
        console.log("evnet:", event);
        console.log("args: " + args);
    };
    return Inspector;
}());
var inspector = new Inspector();
