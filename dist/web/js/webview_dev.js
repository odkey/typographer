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
/// <reference path='../../typings/globals/github-electron/index.d.ts' />
/// <reference path='../../typings/globals/jquery/index.d.ts' />
/// <reference path='../ipc_messages.ts' />
var electron = require('electron');
// Remove following // on .js
// window.addEventListener('load', () => {
// window.$ = window.jQuery = require('jquery');
// });
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
        this.ipc.on(PreviewToWebviewAsyncRequestToAddSpanTag, this.acceptAddSpanTagRequestEvent);
    }
    Webview.prototype.acceptReturnWebviewHTMLRequestEvent = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var html = document.documentElement.outerHTML;
        console.log("Accept request - " + PreviewToWebviewAsyncRequestToReturnWebviewHTML);
        thisWebview.ipc
            .send(WebviewToMainAsyncReplyForReturningWebviewHTML, html);
    };
    Webview.prototype.acceptAddSpanTagRequestEvent = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log("Accept request - " + PreviewToWebviewAsyncRequestToAddSpanTag);
        var $e = $($.parseHTML(args[0])[0]);
        var text = $e.text();
        var tag = $e[0].tagName;
        var $element = $('body').find(tag + ":contains('" + text + "')");
        var charArray = text.split('');
        var charArrayWithSpan = [];
        $.each(charArray, function (i, e) {
            charArrayWithSpan[i] = "<span style=\"letter-spacing: " + 1 + "em;\">" + e + "</span>";
            // console.log(i, charArrayWithSpan[i]);
        });
        $element.text('').append(charArrayWithSpan.join(''));
        // console.log('join: ', charArrayWithSpan.join(''));
    };
    return Webview;
}());
var webview = new Webview();
