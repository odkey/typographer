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
            $('div.dom-tree-view').empty();
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
            if ($filepath.val().length == 0) {
                dialog.showErrorBox('Illegal save name', 'Illegal file name was inputted.');
                return;
            }
            else if ($filepath.val().indexOf('.html') != $filepath.val().length - 5) {
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
        thisInspector.webviewHTML =
            parser.parseFromString(args[0].toString(), "text/html");
        // let jd: any =0;
        // console.log('Accepted Webview HTML src -', thisInspector.webviewHTML);
        thisInspector.showWebviewHTML();
    };
    Inspector.prototype.showWebviewHTML = function () {
        console.log('Show webview DOM - ', thisInspector.webviewHTML);
        var $domTreeField = $('div.dom-tree-view');
        var domTree = undefined;
        var firstNodes = thisInspector.webviewHTML.childNodes;
        thisInspector.appendItemToDOMTreeView(thisInspector.webviewHTML, 0);
    };
    Inspector.prototype.appendItemToDOMTreeView = function (node, depth) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            var parser = new DOMParser();
            // console.log(node.getPrototypeOf());
            // Create the item
            var element = "<div class=\"element-node node-depth-" + depth + " drop-shadow\">";
            element += "" + node.nodeName;
            element += "</div>";
            $('div.dom-tree-view').append(element);
        }
        else if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.indexOf('\n') != 0) {
                // console.log($(node.parentElement));
                // thisInspector.webviewHTML.get
                var element = "<div class=\"text-node node-depth-" + depth + " drop-shadow";
                // element += `onclick=\'console.log(\"clicked\");thisInspector.ipc.send(InspectorToMainAsyncRequestToAddSpanTag, element);\'`;
                element += "\">";
                element += "" + node.textContent;
                element += "</div>";
                var $element = $($.parseHTML(element));
                console.log(node.parentElement);
                $element.click(function (event) {
                    console.log('clicked', event);
                    thisInspector.ipc
                        .send(InspectorToMainAsyncRequestToAddSpanTag, node.parentElement.outerHTML);
                });
                // console.log('e',node.parentElement.outerHTML);
                $('div.dom-tree-view').append($element);
            }
        }
        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++) {
                thisInspector.appendItemToDOMTreeView(node.childNodes[i], depth + 1);
            }
        }
    };
    return Inspector;
}());
var inspector = new Inspector();
