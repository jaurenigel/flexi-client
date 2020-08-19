<template>
  <div class="gannt" ref="gantt"></div>
</template>

<script>
export default {
  name: "gantt",
  props: {
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] };
      }
    }
  },

  mounted: function() {
    gantt.config.xml_date = "%Y-%m-%d";

    gantt.init(this.$refs.gantt);
    gantt.parse(this.$props.tasks);
  }
};
</script>

<style scoped>
.gannt {
  height: 80vh !important;
}

.nested_task .gantt_add {
  display: none !important;
}
</style>
