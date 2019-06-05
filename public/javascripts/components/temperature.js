Vue.component("temperature", {
  template: "#tpl-temperature",
  data() {
    return {
      title: "Temperature"
    };
  },
  mounted() {
    let $footer = this.$el.querySelector('.card-footer')
    let $svg = this.$el.querySelector('.sparkline')
    $svg.setAttribute("width", $footer.clientWidth);
    sparkline.sparkline($svg, [1, 2, 6, 4], {});
  }
});