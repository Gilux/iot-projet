Vue.component("led", {
  template: "#tpl-led",
  data() {
    return {
      title: "LED",
      on: false
    }
  },
  methods: {
    onLedSwitch() {
      this.on = !this.on
    }
  }
})