/**
 * j5.js
 * 
 * Johnny-five layer of app.
 * Communicates with Arduino, sends and recieves data to Express server
 * via socket.io
 * 
 * Acts as a socket.io client
 * 
 * arduino <--> [johnny-five app] <--> Express server <--> HTML
 */

var io = require('socket.io-client');
var socket = io.connect("http://localhost:3000/", {
  reconnection: true
});

var messages = ["Hello !", "I'm an arduino", "Feed me !", "heyyyyyy"]
socket.on('connect', function () {
  console.log('connected to localhost:3000');
  setInterval(() => {
    socket.emit(
      "J5_TO_SERVER",
      "Arduino says : " + messages.sort(() => Math.random() - 0.5)[0],
      ack => {
        process.exit(0);
      }
    );
  }, 1000)
  socket.on("SERVER_TO_J5", function(data) {
    console.log("message from the server:", data);
    
  });
});

var five = require("johnny-five");
var board = new five.Board({ port: "COM6" });

board.on("ready", function () {
  var led = new five.Led(7);
  led.blink(500);
});
