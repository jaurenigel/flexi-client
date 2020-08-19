<template>
  <div>
    <FirstMenu :activeIndex="activeIndex" />

    hello
  </div>
</template>

<script>
import FirstMenu from "../components/FirstMenu";
export default {
  middleware: "redirect",
  components: {
    FirstMenu
  },
  head() {
    return {
      title: "FlexiPMS" + " ~ " + "Overview"
    };
  },
  data() {
    return {
      activeIndex: "1"
    };
  }
};
</script>

<style></style>
