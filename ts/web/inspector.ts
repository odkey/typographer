/// <reference path="./requires.ts"/>

// ts/web/main.ts
// Coded by Yota Odaka
var $loadButton: JQuery = $('.load-html>button');
$loadButton.click(function(event) {
  console.log(event);
  console.log('clicked: ' + this);
});
