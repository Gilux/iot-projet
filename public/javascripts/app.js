document.addEventListener("DOMContentLoaded", () => {
  window.app = new Vue({
    el: "#app",
    data: {
      title: "My Arduino Dashboard",
      arduino_logs: [

      ]
    },
    mounted() {
      this.socket = io()
      this.socket.on("SERVER_TO_FRONT", (data) => {
        this.$refs[data.component].$emit("SERVER_RESPONSE", data)
      });

      this.$on("LED_SWITCH", () => {
        this.socket.emit("FRONT_TO_SERVER", {component: "led", data: "switch"});
      })

      this.$on("SCREEN_CHANGE", (text) => {
        this.socket.emit("FRONT_TO_SERVER", {component: "screen", data: text});
      })

      this.$on("REQUEST", (data) => {
        this.socket.emit("FRONT_TO_SERVER", {component: data.component});
      })
    },
    methods: {
      onBtnClick() {
        this.arduino_logs = []
      },
      
    }
  })
})