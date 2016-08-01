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
var InspectorToMainAsyncRequestToAnalysePreview = 'InspectorToMain.AsyncRequest.AnalysePreview';
var InspectorToMainAsyncRequestToExportModifiedHTML = 'InspectorToMain.AsyncRequest.ExportingModifiedHTML';
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
    }
    Preview.prototype.setAcceptedAsyncMessageReaction = function () {
        this.ipc.on(MainToPreviewAsyncRequestToLoadHTML, this.acceptAsyncRequestToLoadingHTML);
    };
    Preview.prototype.acceptAsyncRequestToLoadingHTML = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // thisPreview.updateSubWebview(args[0]);
        // $('#sub-webview').attr('src', args[0]);
        ;
    };
    Preview.prototype.updateSubWebview = function (url) {
        $('#sub-webview').load(url);
    };
    return Preview;
}());
var preview = new Preview();
