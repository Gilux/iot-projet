Vue.component("potentiometer", {
  template: "#tpl-potentiometer",
  data() {
    return {
      title: "Potentiometer",
      value: 0,
      history: []
    };
  },
  mounted() {
    this.$on("SERVER_RESPONSE", data => this.onServerResponse(data));
  },
  computed: {
    scaledValue() {
      return Math.round((this.value/255)*10000)/100
    }
  },
  methods: {
    onServerResponse(data) {
      this.value = data.data.value;
      this.history.push(data.data.value)
      this.generateSparkline()
    },
    generateSparkline() {
      let $footer = this.$el.querySelector(".card-footer");
      let $svg = this.$el.querySelector(".sparkline");
      $svg.setAttribute("width", $footer.clientWidth);
      sparkline.sparkline($svg, this.history.slice(-100), {});
    }
  }
});