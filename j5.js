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
var colors = require("css-color-names");
var socket = io.connect("http://localhost:3000/", {
  reconnection: true
});

socket.on('connect', function () {
  console.log('Socket Connected!');
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

// When the Express server relays a socket from front-end
socket.on("SERVER_TO_J5", (data) => {
  // Toggle LED
  if(data.component === "led") {
    toggleLed(board_components.led)
    socket.emit("J5_TO_SERVER", { component: "led", data: {
      is_on: board_components.led.is_on
    }})
  }

  // Displays the selected text on the LCD screen
  if(data.component === "screen") {
    // Respect the line-breaks
    let str = data.data.split("\n")
    board_components.screen.obj.cursor(0, 0).clear().print(str[0])
    if(str.length >= 2) {
      board_components.screen.obj.cursor(1, 0).print(str[1])
    }
  }

  // Temperature request update
  if (data.component === "temperature") {
    socket.emit("J5_TO_SERVER", {
      component: "temperature",
      data: {
        value: getTemperature(board_components.temperature.obj)
      }
    });
  }

  // Luminosity request update
  if (data.component === "luminosity") {
    socket.emit("J5_TO_SERVER", {
      component: "luminosity",
      data: {
        value: getLuminosity(board_components.luminosity.obj)
      }
    });
  } 
});


var five = require("johnny-five");

try {
  var board = new five.Board({ port: "COM6" });
}
catch(err) {
  console.log(err)
}

board.on("ready", function () {
  console.log("\x1b[46m\x1b[37m", "  BOARD CONNECTING...  ", "\x1b[0m");
})

board.on("ready", function () {
  board_components.led.obj = new five.Led(4)

  board_components.luminosity.obj = new five.Light("A0");

  board_components.potentiometer.obj = new five.Sensor({
    pin: "A2",
    threshold: 3
  });
  
  board_components.potentiometer.obj.scale(0, 255).on("change", function() {
    socket.emit("J5_TO_SERVER", {
      component: "potentiometer", data: {
        value: Math.round(this.value)
      }
    })
  });

  board_components.temperature.obj = new five.Sensor("A1");


  board_components.screen.obj = new five.LCD({
    controller: "JHD1313M1"
  });


  // board_components.screen.obj.useChar("runningB");
  // board_components.screen.obj.clear().print("runningB");
  initLCDChars(board_components.screen.obj)

  board_components.screen.obj.bgColor("moccasin");
  
  console.log("\x1b[42m\x1b[37m", "  BOARD READY !  ","\x1b[0m")
});

/*
*
*
* COMPONENT-SPECIFIC ACTIONS
*
*/

/**
 * Toggles a LED.
 * @param five.Led led The LED object reference 
 */
function toggleLed(led) {
  led.is_on = !led.is_on
  if (led.is_on) {
    return led.obj.on()
  }
  return led.obj.off()
}


/**
 * Gets a temperature
 * @param five.Sensor sensor The Sensor instance reference
 */
function getTemperature(sensor) {
  if(!sensor) return null
  var R = (1023.0 / sensor.raw - 1.0);
  R *= 100000
  return 1.0 / (Math.log(R / 100000.0) / 4275 + 1 / 298.15) - 273.15
}

/**
 * Gets the luminosity
 * @param five.Sensor sensor The Sensor instance reference
 */
function getLuminosity(sensor) {
  if (!sensor) return null
  return sensor.level
}

/**
 * Init LCD special chars
 * @param five.LCD lcd
 */
async function initLCDChars( lcd ) {
  lcd.useChar("duck")


  moveDuck(lcd)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveDuck(lcd) {
  // Sleep in loop
  var direction = 1
  for (let i = 0; i < 16; i += direction) {
    await sleep(1000);
    lcd.clear().cursor(0, i).print(':duck:')
    var o = Math.round, r = Math.random, s = 255;
    lcd.bgColor([o(r() * s), o(r() * s), o(r() * s)])
    if(i === 15 || (i === 0 && direction === -1)) {
      direction *= -1
    }
  }
}
