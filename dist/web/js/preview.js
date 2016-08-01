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
        this.webview = document.getElementById('webview');
        this.onWebviewReady();
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
    };
    Preview.prototype.updateSubWebview = function (url) {
        $('#sub-webview').load(url);
    };
    Preview.prototype.onWebviewReady = function () {
        var _this = this;
        thisPreview.webview.addEventListener('dom-ready', function () {
            _this.addVisitPageEvent();
            _this.modifyURL();
        });
    };
    Preview.prototype.addVisitPageEvent = function () {
        var $button = $('.control-menu>input.visit-url');
        $button.click(function (event) {
            var $url = $('.control-menu>input.url-field');
            if ($url.val().indexOf('http://') != 0 &&
                $url.val().indexOf('https://') != 0 &&
                $url.val().indexOf('file://') != 0) {
                thisPreview.webview.loadURL("http://" + $url.val());
            }
            else {
                thisPreview.webview.loadURL($url.val());
            }
        });
    };
    Preview.prototype.modifyURL = function () {
        var $url = thisPreview.webview.getURL();
        console.log("Visit - " + $url);
        $('.control-menu>input.url-field').val($url);
    };
    return Preview;
}());
var preview = new Preview();
