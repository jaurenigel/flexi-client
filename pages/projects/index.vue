<template>
  <div>
    <FirstMenu :activeIndex="activeIndex" />

    <div class="container" v-loading="loader_whole">
      <div class="header">
        <div class="title">
          <h3>
            <i class="el-icon-s-cooperation"></i>
            Projects
          </h3>
        </div>
        <div class="filters">
          <div class="flex">
            <!-- <el-select v-model="value" placeholder="Sort By" filterable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
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
              >Create Project</el-button
            >
          </div>
        </div>
      </div>
      <el-table :data="projects" style="width: 100%" border>
        <el-table-column
          prop="project_name"
          label="PROJECT"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="project_manager"
          label="PROJECT MANAGER"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <i class="el-icon-user"></i>
            <span style="margin-left: 10px">{{
              scope.row.project_manager
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="due_date"
          label="DUEDATE"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <i class="el-icon-date"></i>
            <span style="margin-left: 10px">{{ scope.row.due_date }}</span>
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
      :title="title"
      :visible.sync="projectDialog"
      width="30%"
      v-loading="loader"
    >
      <span>
        <div class="form_container">
          <el-form :model="projectForm" :rules="rules" ref="projectForm">
            <el-form-item label="Project Name" prop="name">
              <el-input
                placeholder="project name"
                v-model="projectForm.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="Duedate" prop="due_date">
              <el-date-picker
                v-model="projectForm.due_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="pick due date"
                style="width:100% !important;"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="Description" prop="description">
              <el-input
                v-model="projectForm.description"
                type="textarea"
                placeholder="project description"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="projectDialog = false">Cancel</el-button>
        <el-button type="primary" @click="createProject">Create</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FirstMenu from "../../components/FirstMenu";
export default {
  name: "Project",
  components: {
    FirstMenu
  },
  head() {
    return {
      title: "FlexiPMS" + " ~ " + "Projects"
    };
  },
  data() {
    return {
      title: "",
      search_data: "",
      projectForm: {
        name: "",
        due_date: "",
        description: ""
      },
      loader: false,
      loader_whole: false,
      rules: {
        description: [
          {
            required: true,
            message: "Please description is required",
            trigger: "blur"
          }
        ],
        due_date: [
          {
            required: true,
            message: "Please due date is required",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "Please project name is required",
            trigger: "blur"
          },
          {
            min: 3,
            message: "Length should be 3 or more",
            trigger: "blur"
          }
        ]
      },
      projectDialog: false,
      activeIndex: "4",
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
      projectTableData: []
    };
  },
  async asyncData({ $axios }) {
    const raw = await $axios.$get("/api/projects");
    let projects = [];
    projects = raw.data.data;
    return { projects, raw };
  },
  methods: {
    changeStatusColor(status) {
      if (status === "Pending") {
        return "info";
      } else if (status === "Overdue") {
        return "danger";
      } else if (status === "In Progress") {
        return "primary";
      } else {
        return "success";
      }
    },

    async handleCurrentChange(val) {
      let raw = await this.$axios.$get(`api/projects?page=${val}`);
      let projects = [];
      projects = raw.data.data;
      this.raw = raw;
      this.projects = projects;
    },

    openDialog() {
      this.projectDialog = true;
      this.title = "Create Project";
    },

    viewItem(id) {
      this.$store.commit("project/addProjectId", id);
      this.$router.push(`/projects/${id}/backlogs`);
    },

    async createProject() {
      this.loader = true;
      try {
        let response = await this.$axios.$post("api/projects", {
          name: this.projectForm.name,
          description: this.projectForm.description,
          due_date: this.projectForm.due_date
        });

        this.loader = false;
        // store id
        this.$store.commit("project/addProjectId", response.data.id);
        // redirect on save
        this.$router.push(`/projects/${response.data.id}/backlogs`);
        //  notification
        this.$notify({
          title: "Success",
          message: `Project ${response.data.project_name} succeesfully created`
        });
        // close dialog & clear forms
        this.projectDialog = false;
        this.projectForm.name = "";
        this.projectForm.description = "";
        this.projectForm.due_date = "";
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
        this.projectDialog = false;
        this.projectForm.name = "";
        this.projectForm.description = "";
        this.projectForm.due_date = "";
        console.log(err);
      }
    },
    async searchData() {
      this.loader_whole = true;
      try {
        let res = await this.$axios.$post("/api/search/project", {
          search_data: this.search_data
        });
        let projects = [];

        projects = res.data.data;

        this.projects = projects;
        this.raw = res;

        this.loader_whole = false;
        this.search_data = "";
      } catch (error) {
        this.loader_whole = false;
        this.search_data = "";
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin: 2em;
}

.center {
  display: flex;
  justify-content: center;
  margin-top: 2em;
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1em 0;
}

h3 {
  color: #606266;
}

.flex {
  display: flex;
}

.pl {
  margin-left: 1em;
}
</style>
