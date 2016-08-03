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
var values = { "a": 0.63563216,
    "b": 0.51243424,
    "c": 0.46551725,
    "d": 0.50756097,
    "e": 0.5742435,
    "f": 0.45325205,
    "g": 0.55706394,
    "h": 0.50108695,
    "i": 0.76962024,
    "j": 0.4316921,
    "k": 0.46308893,
    "l": 0.7015404,
    "m": 0.5458583,
    "n": 0.5938783,
    "o": 0.553382,
    "p": 0.5254406,
    "q": 0.51475,
    "r": 0.4784689,
    "s": 0.53940886,
    "t": 0.46450618,
    "u": 0.6117954,
    "v": 0.44093406,
    "w": 0.516727,
    "x": 0.4967857,
    "y": 0.3857177,
    "z": 0.5527409
};
var rates = [
    { "rate": 0.603552448152871, "val": -0.03 },
    { "rate": 0.872603608051288, "val": -0.03 },
    { "rate": 0.898939246449286, "val": -0.03 },
    { "rate": 0.92699716087198, "val": 0 },
    { "rate": 0.933761849861398, "val": -0.07 },
    { "rate": 0.939338207572223, "val": -0.03 },
    { "rate": 1, "val": -0.02 },
    { "rate": 1.06608641729709, "val": -0.07 },
    { "rate": 1.22091450000061, "val": -0.06 },
    { "rate": 1.23624512380008, "val": -0.02 },
    { "rate": 1.29592248108746, "val": -0.05 }
];
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
        var classNames = $e.attr('class').split(' ').join('.');
        console.log('t', classNames);
        var $element = $('body').find(tag + "." + classNames + ":contains('" + text + "')");
        var charArray = text.split('');
        var charArrayWithSpan = [];
        $.each(charArray, function (i, e) {
            var val = 0;
            var ratio = undefined;
            var diff = 99999;
            if (e.match(/[a-z]/) && charArray[i + 1].match(/[a-z]/)) {
                ratio = values[e] / values[charArray[i + 1]];
            }
            for (var i_1 = 0; i_1 < rates.length; i_1++) {
                var d = Math.abs(rates[i_1]["rate"] - ratio);
                if (d < diff) {
                    val = rates[i_1]["val"];
                    diff = d;
                }
            }
            charArrayWithSpan[i] = "<span style=\"letter-spacing: " + val + "em;\">" + e + "</span>";
            // console.log(i, charArrayWithSpan[i]);
        });
        $element.text('').append(charArrayWithSpan.join(''));
        // console.log('join: ', charArrayWithSpan.join(''));
    };
    return Webview;
}());
var webview = new Webview();
