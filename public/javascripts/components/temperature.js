Vue.component("temperature", {
  template: "#tpl-temperature",
  data() {
    return {
      title: "Temperature",
      value: 0,
      history: []
    };
  },
  mounted() {
    let $footer = this.$el.querySelector(".card-footer");
    let $svg = this.$el.querySelector(".sparkline");
    $svg.setAttribute("width", $footer.clientWidth);
    sparkline.sparkline($svg, [1, 2, 6, 4], {});
    this.$on("SERVER_RESPONSE", data => this.onServerResponse(data));
  },
  methods: {
    onServerResponse(data) {
      this.value = data.data.value;
      this.history.push(data.data.value);
      this.generateSparkline();
    },
    generateSparkline() {
      let $footer = this.$el.querySelector(".card-footer");
      let $svg = this.$el.querySelector(".sparkline");
      $svg.setAttribute("width", $footer.clientWidth);
      sparkline.sparkline($svg, this.history.slice(-100), {});
    }
  }
});