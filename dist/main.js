/// <reference path='./requires.ts' />
/// <reference path='./base_browser_window.ts' />
/// <reference path='./base_application.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var bApp = base_app;
var app = electron.app;
var options = {
    width: 500,
    height: 300,
    minWidth: 200,
    minHeight: 150,
    acceptFirstMouse: true,
    titleBarStyle: 'default'
};
var url = "file://" + __dirname + "/index.html";
var Application = (function (_super) {
    __extends(Application, _super);
    function Application() {
        _super.apply(this, arguments);
    }
    return Application;
}(bApp.BaseApplication));
var application = new Application(app, options, url);
