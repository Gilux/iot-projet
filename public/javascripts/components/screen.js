Vue.component("screen", {
  template: "#tpl-screen",
  data() {
    return {
      title: "LCD Screen",
      text: "Hello\nWorld"
    };
  },
  mounted() {
    this.onChange()
  },
  methods: {
    onChange() {
      this.$parent.$emit("SCREEN_CHANGE", this.text)
    }
  }
});