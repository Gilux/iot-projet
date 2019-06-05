Vue.component("luminosity", {
  template: "#tpl-luminosity",
  data() {
    return {
      title: "Luminosity"
    };
  },
  mounted() {
    let $footer = this.$el.querySelector(".card-footer");
    let $svg = this.$el.querySelector(".sparkline");
    $svg.setAttribute("width", $footer.clientWidth);
    sparkline.sparkline($svg, [1, 2, 6, 4], {});
  }
});