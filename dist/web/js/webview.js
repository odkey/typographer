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
/// <reference path='../../typings/globals/github-electron/index.d.ts' />
/// <reference path='../ipc_messages.ts' />
var electron = require('electron');
// ts/web/webview.ts
// Coded by Yota Odaka
var thisWebview;
var Webview = (function () {
    function Webview() {
        this.ipc = require('electron').ipcRenderer;
        thisWebview = this;
        console.log('Preview webview');
        // this.ipc.send(WebviewToPreviewAsyncReplyForReturningWebviewHTML, '');
        this.ipc.on(PreviewToWebviewAsyncRequestToReturnWebviewHTML, this.acceptReturnWebviewHTMLRequestEvent);
    }
    Webview.prototype.acceptReturnWebviewHTMLRequestEvent = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var html = document.documentElement.outerHTML;
        console.log("Accept request - ", html);
        thisWebview.ipc
            .send(WebviewToMainAsyncReplyForReturningWebviewHTML, html);
    };
    return Webview;
}());
var webview = new Webview();
