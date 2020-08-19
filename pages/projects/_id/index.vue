<template>
  <div>
    <FirstMenu :activeIndex="activeIndex" />
    <div class="top-container">
      <div class="top">
        <el-page-header
          @back="goBack"
          :content="this.$store.state.project.projectRaw.project_name"
        >
        </el-page-header>

        <ProjectTabs
          class="mt"
          activeName="first"
          :id="this.$store.state.project.projectId"
        />
      </div>
    </div>
    <div class="container">
      <gantt class="left-container" :tasks="test"></gantt>
    </div>
  </div>
</template>

<script>
import FirstMenu from "../../../components/FirstMenu";
import ProjectTabs from "../../../components/ProjectTabs";
import Gantt from "../../../components/Gantt";
export default {
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },
  components: {
    FirstMenu,
    ProjectTabs,
    Gantt
  },

  computed: {
    test() {
      gantt.clearAll();
      return this.taskRaw;
    }
  },

  data() {
    return {
      activeIndex: "4",
      header: "Project Name",
      id: "",
      tasks: {
        data: [
          {
            id: 1,
            text: "Task #1",
            start_date: "2020-01-17",
            duration: 3,
            progress: 0.6
          },
          {
            id: 2,
            text: "Task #2",
            start_date: "2020-01-20",
            duration: 0,
            progress: 0.1
          }
        ],
        links: []
      }
    };
  },

  async asyncData({ $axios, params }) {
    const raw = await $axios.$get(`/api/backlogs/project/${params.id}`);
    let backlog = raw.data.data;
    let oneDay = 24 * 60 * 60 * 1000;
    let taskRaw = {
      data: [],
      links: []
    };

    function itemData(item) {
      if (item === "Pending") {
        return 0.1;
      } else if (item === "In Progress") {
        return 0.5;
      } else if (item === "Testing") {
        return 0.7;
      } else {
        return 1;
      }
    }

    backlog.forEach(blog => {
      let obj = {
        id: blog.id,
        text: blog.title,
        start_date: blog.start_date,
        duration: blog.end_date,
        status: blog.status,
        progress: itemData(blog.status)
      };
      taskRaw.data.push(obj);
    });

    taskRaw.data.filter(item => {
      return item.start_date != null && item.start_date != null;
    });
    return { taskRaw };
  },

  methods: {
    goBack() {
      this.$router.push("/projects");
    }
  },

  head() {
    return {
      title: this.$store.state.project.projectRaw.project_name + " ~  Gantt"
    };
  }
};
</script>

<style scoped>
.top-container {
  margin: 0 2em;
  margin-bottom: 1em;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1em;
}

.mt {
  padding-top: 0.1em;
}

.container {
  height: 100%;
  width: 100%;
}
.left-container {
  overflow: hidden;
  position: relative;
  height: 100%;
}

.nested_task .gantt_add {
  display: none !important;
}
</style>
