<template>
  <div>
    <el-tabs v-model="activeLink" :id="id">
      <el-tab-pane label="Overview" name="first"
        ><span slot="label"
          ><i class="el-icon-s-data"></i>
          <nuxt-link :to="'/projects/' + paramId">
            Gannt
          </nuxt-link></span
        ></el-tab-pane
      >
      <el-tab-pane label="Backlogs" name="second"
        ><span slot="label"
          ><i class="el-icon-files"></i>
          <nuxt-link :to="'/projects/' + paramId + '/backlogs'">
            Backlogs
          </nuxt-link></span
        ></el-tab-pane
      >
      <el-tab-pane label="Sprints" name="third"
        ><span slot="label"
          ><i class="el-icon-s-grid"></i>
          <nuxt-link :to="'/projects/' + paramId + '/sprint'">
            Sprint Board
          </nuxt-link></span
        ></el-tab-pane
      >
      <el-tab-pane
        label="Settings"
        name="fourth"
        v-if="
          this.$store.state.auth.user === 'admin' ||
            this.$store.state.auth.user === 'project_manager'
        "
        ><span slot="label"
          ><i class="el-icon-setting"></i>
          <nuxt-link :to="'/projects/' + paramId + '/settings'">
            Settings
          </nuxt-link></span
        ></el-tab-pane
      >
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "ProjectTabs",
  props: {
    activeName: "",
    id: ""
  },
  data() {
    return {};
  },
  computed: {
    activeLink(active) {
      return (active = this.activeName);
    },
    paramId() {
      return this.id;
    }
  },
  methods: {
    handleClick() {
      console.log(123);
    }
  }
};
</script>

<style scoped>
* {
  cursor: default !important;
}
a {
  color: inherit;
  text-decoration: none !important;
  cursor: pointer !important;
}
</style>
