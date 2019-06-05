Vue.component("led", {
  template: "#tpl-led",
  data() {
    return {
      title: "LED",
      is_on: false
    }
  },
  mounted() {
    this.$on("SERVER_RESPONSE", (data) => this.onServerResponse(data))
  },
  methods: {
    onLedSwitch() {
      // this.on = !this.on
      this.$parent.$emit("LED_SWITCH")
    },
    onServerResponse(data) {
      this.is_on = data.data.is_on
    }
  }
})