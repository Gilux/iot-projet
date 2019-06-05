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
  // setInterval(() => {
  //   socket.emit(
  //     "J5_TO_SERVER",
  //     "Arduino says : " + messages.sort(() => Math.random() - 0.5)[0],
  //     ack => {
  //       process.exit(0);
  //     }
  //   );
  // }, 1000)
  
});

let board_components = {
  led: {
    obj: null,
    is_on: true
  }
}


socket.on("SERVER_TO_J5", (data) => {
  console.log("message from the server:", data)

  if(data.component === "led") {
    toggleLed(board_components.led)
    socket.emit("J5_TO_SERVER", { component: "led", data: {
      is_on: board_components.led.is_on
    }})
  }


});


function toggleLed( led ) {
  led.is_on = !led.is_on
  if(led.is_on) {
    return led.obj.on()
  }
  return led.obj.off()
}


var five = require("johnny-five");
var board = new five.Board({ port: "COM6" });

board.on("ready", function () {
  board_components.led.obj = new five.Led(3)   
  
  console.log("READY !")
});

