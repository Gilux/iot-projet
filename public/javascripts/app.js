document.addEventListener("DOMContentLoaded", () => {
  window.app = new Vue({
    el: "#app",
    data: {
      title: "My Arduino Dashboard",
      arduino_logs: [

      ]
    },
    mounted() {
      var socket = io()
      socket.on("SERVER_TO_FRONT", (data) => {
        this.arduino_logs.push(data)
      });
    },
    methods: {
      onBtnClick() {
        this.arduino_logs = []
      }
    }
  })
})