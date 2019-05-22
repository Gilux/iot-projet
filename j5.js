/**
 * j5.js
 * 
 * Johnny-five layer of app.
 * 
 * arduino <--> [johnny-five app] <--> Express server <--> VueJS App
 */
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
  var led = new five.Led(7);
  led.blink(50);
});