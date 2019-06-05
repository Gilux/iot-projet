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
  },
  potentiometer: {
    obj: null,
    value: 0
  },
  luminosity: {
    obj: null,
    value: 0
  },
  temperature: {
    obj: null,
    value: 0
  }
};


socket.on("SERVER_TO_J5", (data) => {
  console.log("message from the server:", data)

  if(data.component === "led") {
    toggleLed(board_components.led)
    socket.emit("J5_TO_SERVER", { component: "led", data: {
      is_on: board_components.led.is_on
    }})
  }

  if (data.component === "potentiometer") {
    toggleLed(board_components.led)
    socket.emit("J5_TO_SERVER", {
      component: "led", data: {
        is_on: board_components.led.is_on
      }
    })
  }


});

/* Led */
function toggleLed( led ) {
  led.is_on = !led.is_on
  if(led.is_on) {
    return led.obj.on()
  }
  return led.obj.off()
}

/* Potentiometer */



var five = require("johnny-five");
var board = new five.Board({ port: "COM6" });

board.on("ready", function () {
  board_components.led.obj = new five.Led(3)
  // board_components.luminosity.obj = new five.Light("A0");
  // board_components.luminosity.obj.on("change", function() {
  //   socket.emit("J5_TO_SERVER", {
  //     component: "luminosity",
  //     data: {
  //       value: Math.round(this.level*100)
  //     }
  //   });
    
  // });
  board_components.potentiometer.obj = new five.Sensor("A2");
  board_components.potentiometer.obj.scale(0, 255).on("change", function() {
    console.log(this.value)
    socket.emit("J5_TO_SERVER", {
      component: "potentiometer", data: {
        value: Math.round(this.value)
      }
    })
  });
  board_components.temperature.obj = new five.Sensor("A0");
  board_components.temperature.obj.on("change", function() {
    console.log(this.value)
    console.log("temp");
    socket.emit("J5_TO_SERVER", {
      component: "temperature",
      data: {
        value: Math.round(this.value)
      }
    });
  });
  
  console.log("READY !")
});

