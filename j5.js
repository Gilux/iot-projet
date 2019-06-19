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

// var messages = ["Hello !", "I'm an arduino", "Feed me !", "heyyyyyy"]
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
  },
  screen: {
    obj: null,
    value: ""
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

  if(data.component === "screen") {
    let str = data.data.split("\n")
    board_components.screen.obj.cursor(0, 0).clear().print(str[0])

    if(str.length >= 2) {
      board_components.screen.obj.cursor(1, 0).print(str[1])
    }
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
var colors = Object.keys(require("css-color-names"));

console.log(colors);

var board = new five.Board({ port: "COM6" });

board.on("ready", function () {
  board_components.led.obj = new five.Led(4)

  board_components.luminosity.obj = new five.Light("A0");
  board_components.luminosity.obj.on("change", function() {
    socket.emit("J5_TO_SERVER", {
      component: "luminosity",
      data: {
        value: this.level
      }
    });
  });
  board_components.potentiometer.obj = new five.Sensor("A2");
  board_components.potentiometer.obj.scale(0, 255).on("change", function() {
    socket.emit("J5_TO_SERVER", {
      component: "potentiometer", data: {
        value: Math.round(this.value)
      }
    })
  });
  board_components.temperature.obj = new five.Sensor("A1");
  board_components.temperature.obj.on("change", function() {
    var R = (1023.0/this.raw-1.0);
    R *= 100000
    var temperature = 1.0/(Math.log(R/100000.0)/4275+1/298.15)-273.15
    socket.emit("J5_TO_SERVER", {
      component: "temperature",
      data: {
        value: temperature
      }
    });
  });

  board_components.screen.obj = new five.LCD({
    controller: "JHD1313M1"
  });
  board_components.screen.obj.bgColor("moccasin");
  
  console.log("READY !")
});

board.on("exit", () => {
  console.log("exit")
})
