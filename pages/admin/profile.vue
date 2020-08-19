<template>
  <div>
    <FirstMenu :activeIndex="activeIndex" />

    profile
  </div>
</template>

<script>
import FirstMenu from "../../components/FirstMenu";
export default {
  name: "Profile",
  components: {
    FirstMenu
  },
  head() {
    return {
      title: "FlexiPMS" + " ~ " + "Profile"
    };
  },
  data() {
    return {
      activeIndex: "3"
    };
  }
};
</script>

<style></style>
