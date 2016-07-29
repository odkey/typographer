/// <reference path='../../typings/globals/jquery/index.d.ts'/>
/// <reference path="./requires.ts"/>
// ts/web/main.ts
// Coded by Yota Odaka
var $loadButton = $('.load-html>button');
$loadButton.click(function (event) {
    console.log(event);
    console.log('clicked: ' + this);
});
