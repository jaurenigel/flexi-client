<template>
  <div>
    <FirstMenu :activeIndex="activeIndex" />
    <div class="container" v-loading="loading_whole">
      <div class="top">
        <el-page-header
          @back="goBack"
          :content="this.$store.state.project.projectRaw.project_name"
        >
        </el-page-header>

        <ProjectTabs
          class="mt"
          activeName="second"
          :id="this.$store.state.project.projectId"
        />
      </div>
      <div class="actions">
        <div class="flex">
          <el-input
            placeholder="Search.."
            prefix-icon="el-icon-search"
            class=""
            v-model="search_data"
            @keyup.enter.native="searchData"
          >
          </el-input>
        </div>
        <div
          v-if="
            this.$store.state.auth.user === 'admin' ||
              this.$store.state.auth.user === 'project_manager'
          "
        >
          <el-button type="primary" icon="el-icon-edit" @click="openDialog"
            >New Task</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-edit"
            >Create Sprint</el-button
          > -->
        </div>
      </div>

      <el-table style="width: 100%" border :data="backlog">
        <el-table-column prop="title" label="TITLE" align="center" sortable>
        </el-table-column>
        <el-table-column
          prop="priority"
          label="PRIORITY"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <i :class="priorityIcon(scope.row.priority)"></i>
            <span style="margin-left: 10px">{{ scope.row.priority }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="STATUS" align="center" sortable>
          <template slot-scope="scope">
            <el-tag
              :type="changeStatusColor(scope.row.status)"
              disable-transitions
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="type" label="TYPE" align="center" sortable>
          <template slot-scope="scope">
            <i :class="typeIcon(scope.row.type)"></i>
            <span style="margin-left: 10px">{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="start_date"
          label="START DATE"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <i class="el-icon-date"></i>
            <span style="margin-left: 10px">{{
              checkIfEpmty(scope.row.start_date)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="end_date"
          label="DURATION(HOURS)"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              checkIfEpmty(scope.row.end_date)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="ACTION" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewItem(scope.row.id)">
              View
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="center">
        <el-pagination
          prev-text="Prev"
          next-text="Next"
          background
          layout="prev, pager, next"
          :total="raw.data.total"
          :page-size="raw.data.per_page"
          :current-page.sync="raw.data.current_page"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="Add Task"
      :visible.sync="backloDialog"
      width="40%"
      v-loading="loader"
    >
      <span>
        <el-form :model="backlogForm">
          <el-form-item label="Task Name" prop="title">
            <el-input
              placeholder="task name"
              v-model="backlogForm.title"
            ></el-input>
          </el-form-item>
          <el-form-item label="Type">
            <el-select
              placeholder="please select type"
              style="width:100%"
              v-model="backlogForm.type_id"
            >
              <el-option label="Feature" value="1"></el-option>
              <el-option label="Bug" value="2"></el-option>
              <el-option label="Request" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Priority">
            <el-select
              placeholder="please select priority"
              style="width:100%"
              v-model="backlogForm.priority_id"
            >
              <el-option label="Low" value="1"></el-option>
              <el-option label="Medium" value="2"></el-option>
              <el-option label="High" value="3"></el-option>
            </el-select>
          </el-form-item>
          <!--
          <el-form-item label="Start Date" prop="start_date">
            <el-date-picker
              v-model="backlogForm.start_date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="pick start date"
              style="width:100% !important;"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Duration" prop="duration">
            <el-input
              type="number"
              placeholder="duration in hours e.g 4 hours"
              v-model="backlogForm.duration"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="User Story" prop="story">
            <el-input
              v-model="backlogForm.story"
              type="textarea"
              placeholder="as a -- I want -- so that --"
            ></el-input>
          </el-form-item>
          <el-form-item label="Acceptance Criteria" prop="acceptance_criteria">
            <el-input
              v-model="backlogForm.acceptance_criteria"
              type="textarea"
              placeholder="acceptance criteria"
            ></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backloDialog = false">Cancel</el-button>
        <el-button type="primary" @click="createBacklog">Create</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FirstMenu from "../../../../components/FirstMenu";
import ProjectTabs from "../../../../components/ProjectTabs";
export default {
  name: "Backlogs",
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },
  components: {
    FirstMenu,
    ProjectTabs
  },

  async fetch({ store, params, $axios }) {
    let { data } = await $axios.$get(`api/projects/${params.id}`);
    store.commit("project/setProject", data);
  },

  data() {
    return {
      search_data: "",
      loading_whole: false,
      loader: false,
      activeIndex: "4",
      backloDialog: false,
      projectData: {},
      backlogForm: {
        title: "",
        start_date: "",
        story: "",
        acceptance_criteria: "",
        duration: "",
        priority_id: "",
        type_id: ""
      },
      header: "Project Name",
      value: "",
      options: [
        {
          value: "Completed",
          label: "Completed"
        },
        {
          value: "In Progress",
          label: "In Progress"
        },
        {
          value: "Pending",
          label: "Pending"
        },
        {
          value: "Overdue",
          label: "Overdue"
        }
      ],
      backlogTableData: []
    };
  },

  async asyncData({ $axios, params }) {
    const raw = await $axios.$get(`/api/backlogs/project/${params.id}`);
    let backlog = [];

    backlog = raw.data.data;

    console.log(raw);
    return { backlog, raw };
  },
  methods: {
    goBack() {
      this.$router.push("/projects");
    },
    changeStatusColor(status) {
      if (status === "Pending") {
        return "info";
      } else if (status === "Overdue") {
        return "danger";
      } else if (status === "In Progress") {
        return "primary";
      } else if (status === "Testing") {
        return "warning";
      } else {
        return "success";
      }
    },
    priorityIcon(priority) {
      if (priority === "High") {
        return "el-icon-top";
      } else if (priority === "Low") {
        return "el-icon-bottom";
      } else {
        return "el-icon-right";
      }
    },

    typeIcon(type) {
      if (type === "Feature") {
        return "el-icon-circle-plus-outline";
      } else if (type === "Bug") {
        return "el-icon-warning";
      } else {
        return "el-icon-edit-outline";
      }
    },

    checkIfEpmty(data) {
      if (data === "" || data === null) {
        return "-----------";
      } else {
        return data;
      }
    },
    viewItem(id) {
      this.$store.commit("project/addBacklogId", id);
      this.$router.push(
        `/projects/${this.$store.state.project.projectId}/backlogs/${id}`
      );
    },
    openDialog() {
      this.backloDialog = true;
    },

    async createBacklog() {
      let id = this.$store.state.project.projectId;
      this.loader = true;
      try {
        let response = await this.$axios.$post("api/backlogs", {
          title: this.backlogForm.title,
          story: this.backlogForm.story,
          // duration: this.backlogForm.duration,
          // start_date: this.backlogForm.start_date,
          acceptance_criteria: this.backlogForm.acceptance_criteria,
          type_id: this.backlogForm.type_id,
          priority_id: this.backlogForm.priority_id,
          project_id: id
        });
        // store id
        this.$store.commit("project/addBacklogId", response.data.id);
        // redirect on save
        this.$router.push(`/projects/${id}/backlogs/${response.data.id}`);
        //  notification
        this.$notify({
          title: "Success",
          message: `Project ${response.data.title} succeesfully created`
        });
        // close dialog & clear forms
        this.loader = false;
        this.backloDialog = false;

        this.backlogForm.title = "";
        this.backlogForm.story = "";
        this.backlogForm.duration = "";
        this.backlogForm.acceptance_criteria = "";
        this.backlogForm.type_id = "";
        this.backlogForm.priority_id = "";
        this.backlogForm.start_date = "";
      } catch (err) {
        this.loader = false;
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: red" },
            "Error Occured. Please Try Again"
          )
        });
        this.backloDialog = false;
        this.projectForm.name = "";
        this.projectForm.description = "";
        this.projectForm.due_date = "";
        console.log(err);
      }
    },
    async handleCurrentChange(val) {
      let raw = await this.$axios.$get(
        `/api/backlogs/project/${this.$store.state.project.projectId}?page=${val}`
      );
      let backlog = [];
      backlog = raw.data.data;

      this.raw = raw;
      this.backlog = backlog;
    },

    async searchData() {
      this.loading_whole = true;
      try {
        let raw = await this.$axios.$post("api/search/backlog", {
          id: this.$store.state.project.projectId,
          search_data: this.search_data
        });

        let backlog = [];
        backlog = raw.data.data;

        this.raw = raw;
        this.backlog = backlog;

        this.loading_whole = false;
        this.search_data = "";
      } catch (error) {
        this.loading_whole = false;
        this.search_data = "";
        console.log(error);
      }
    }
  },
  head() {
    return {
      title: this.$store.state.project.projectRaw.project_name + " ~  Backlogs"
    };
  }
};
</script>

<style scoped>
.container {
  margin: 0 2em;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1em;
  margin-bottom: 1em;
}

.mt {
  padding-top: 0.1em;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5em;
}

.flex {
  display: flex;
}

.pl {
  margin-left: 1em;
}

.center {
  display: flex;
  justify-content: center;
  margin-top: 2em;
}
</style>
