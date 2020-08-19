<template>
  <div>
    <FirstMenu :activeIndex="activeIndex" />
    <div class="container">
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
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            :to="{
              path: `/projects/${this.$store.state.project.projectId}/backlogs`
            }"
            >Backlogs</el-breadcrumb-item
          >

          <el-breadcrumb-item>{{ backlog.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content">
        <div class="main">
          <div class="top-header">
            <div class="flex_title">
              <h4
                style="font-weight:bold; font-size:17px; text-decoration: underline; text-transform: capitalize"
              >
                {{ backlog.title }}
              </h4>
              <div
                v-if="
                  this.$store.state.auth.user === 'dev_team' ||
                    this.$store.state.auth.user === 'project_manager'
                "
              >
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 1em"
                  plain
                  v-if="backlog.start_date == null"
                  @click="setTimelineDialog"
                  >Set Timeline</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  plain
                  v-else
                  style="margin-left: 1em"
                  @click="editTimelineDialog"
                  >Edit Timeline</el-button
                >
              </div>

              <div v-if="this.$store.state.auth.user === 'admin'">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 1em"
                  plain
                  v-if="backlog.start_date == null"
                  @click="setTimelineDialog"
                  >Set Timeline</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  plain
                  v-else
                  style="margin-left: 1em"
                  @click="editTimelineDialog"
                  >Edit Timeline</el-button
                >
              </div>
            </div>

            <div style="margin-bottom:2em">
              <el-tag type="primary" effect="plain"
                >Type: {{ backlog.type.name }}</el-tag
              >
              <el-tag type="primary" effect="plain"
                >Priority: {{ backlog.priority.name }}</el-tag
              >
              <el-tag type="primary" effect="plain"
                >Status: {{ backlog.status.name }}</el-tag
              >
              <el-tag type="primary" effect="plain"
                >Start: {{ ifEmpty(backlog.start_date) }}</el-tag
              >
              <el-tag type="primary" effect="plain"
                >Duration: {{ ifEmpty(backlog.end_date) }}</el-tag
              >
            </div>
          </div>
          <!-- <el-divider></el-divider> -->
          <div class="">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item name="1">
                <template slot="title">
                  <h3>Title</h3>
                </template>
                <div>
                  <h4 style="font-weight:normal;">
                    {{ ifDataEmpty(backlog.title) }}
                  </h4>
                </div>
                <div></div>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template slot="title">
                  <h3>Story</h3>
                </template>
                <div>
                  <h4 style="font-weight:normal;">
                    {{ ifDataEmpty(backlog.story) }}
                  </h4>
                </div>
                <div></div>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template slot="title">
                  <h3>Acceptance Criteria</h3>
                </template>
                <div>
                  <h4 style="font-weight:normal;">
                    {{ ifDataEmpty(backlog.acceptance_criteria) }}
                  </h4>
                </div>
                <div></div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="assign" style="margin-top:2em">
            <div>
              <h4>Assignees:</h4>
            </div>
            <div
              v-if="
                this.$store.state.auth.user === 'admin' ||
                  this.$store.state.auth.user === 'project_manager'
              "
            >
              <el-button @click="openDialogAssignMember"
                ><span><i class="el-icon-edit"></i></span> Assign
                Member</el-button
              >
            </div>
          </div>
          <div class="body">
            <el-table
              style="width: 100%"
              border
              :data="this.$store.state.project.assignees"
            >
              <el-table-column prop="full_name" label="ASSIGNEE">
              </el-table-column>
              <el-table-column prop="role" label="ROLE" align="center">
              </el-table-column>
              <el-table-column
                prop="role"
                label="ACTION"
                align="center"
                v-if="
                  this.$store.state.auth.user === 'admin' ||
                    this.$store.state.auth.user === 'project_manager'
                "
              >
                <template slot-scope="scope">
                  <el-button
                    @click="removeMember(scope.row.id)"
                    type="danger"
                    plain
                    size="small"
                    class=""
                    ><span><i class="el-icon-delete"></i></span>
                    Remove</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="comment">
          <el-card class="box-card comment-box">
            <div slot="header" class="clearfix">
              <span><i class="el-icon-s-data"></i></span>
              <span>Data</span>
            </div>
            <h4 style="text-align:center; margin-bottom: 1em">Progress</h4>
            <div class="progress">
              <!-- <el-progress
                type="circle"
                :percentage="50"
                status="exception"
              ></el-progress> -->

              <el-progress
                type="circle"
                :percentage="progressFilter(backlog.status.name)"
              ></el-progress>
              <h6 class="mt-1">
                Progress: {{ progressFilter(backlog.status.name) }}%
              </h6>
            </div>
            <h4 style="text-align:center; margin-top: 4em">Milestone</h4>
            <div class="mt-1">
              <el-steps
                :active="milestoneFilter(backlog.status.name)"
                align-center
              >
                <el-step title="M 1" description="Pending"></el-step>
                <el-step title="M 2" description="In Progress"></el-step>
                <el-step title="M 3" description="Testing"></el-step>
                <el-step title="M 4" description="Completed"></el-step>
              </el-steps>
            </div>

            <!-- <h4 style="text-align:center; margin-top: 4em">Timer</h4> -->
            <!-- <div
              class="timer"
              v-if="backlog.start_date != '' || backlog.end_date != ''"
            >
              <el-tag type="danger">D {{ raw_timer.hours }}</el-tag>
              <el-tag type="danger">H</el-tag>
              <el-tag type="danger">M</el-tag>
            </div>
            <div class="timer" v-else>
              <el-tag type="primary">D</el-tag>
              <el-tag type="primary">H</el-tag>
              <el-tag type="primary">M</el-tag>
            </div> -->
          </el-card>
        </div>
      </div>
    </div>
    <el-dialog
      title="Assign Member"
      :visible.sync="dialogAssignMember"
      width="30%"
      v-loading="loader"
    >
      <span>
        <el-select
          v-model="value"
          filterable
          placeholder="Select user"
          style="width:100%"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.full_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignMember = false">Cancel</el-button>
        <el-button type="primary" @click="assignMember">Assign</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Set Timeline"
      :visible.sync="openTimelineDialog1"
      width="30%"
      v-loading="loader"
    >
      <div class="tag_flex">
        <h5>
          <el-tag type="">
            <span><i class="el-icon-date"></i></span> Project DueDate:
            {{ this.$store.state.project.projectRaw.due_date }}
          </el-tag>
        </h5>
        <h5>
          <el-tag type="">
            <span><i class="el-icon-time"></i></span>
            Days Left:
            {{
              dateCalc(this.$store.state.project.projectRaw.due_date)
            }}</el-tag
          >
        </h5>
      </div>
      <el-form style="margin-top:1em" ref="form" :model="form">
        <el-form-item label="Start Date">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="pick a date"
            style="width: 100%;"
            v-model="form.start_date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Duration">
          <el-input
            type="number"
            placeholder="duration in hours"
            v-model="form.duration"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openTimelineDialog1 = false">Cancel</el-button>
        <el-button type="primary" @click="setTimeline">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Edit Timeline"
      :visible.sync="openTimelineDialog2"
      width="30%"
      v-loading="loader"
    >
      <div class="tag_flex">
        <h5>
          <el-tag type="">
            <span><i class="el-icon-date"></i></span> Task Start Date:
            {{ backlog.start_date }}
          </el-tag>
        </h5>
        <h5>
          <el-tag type="">
            <span><i class="el-icon-time"></i></span>
            Duration:
            {{ backlog.end_date }}</el-tag
          >
        </h5>
      </div>
      <el-form style="margin-top:1em" ref="form" :model="form">
        <el-form-item label="Edit Start Date">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="pick a date"
            style="width: 100%;"
            v-model="form.start_date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Set Duration">
          <el-input
            type="number"
            placeholder="duration in hours"
            v-model="form.duration"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openTimelineDialog2 = false">Cancel</el-button>
        <el-button type="primary" @click="editTimeline">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FirstMenu from "../../../../components/FirstMenu";
import ProjectTabs from "../../../../components/ProjectTabs";
export default {
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },
  components: {
    FirstMenu,
    ProjectTabs
  },

  data() {
    return {
      loader: false,
      form: {
        start_date: "",
        duration: ""
      },
      dialogAssignMember: false,
      activeIndex: "4",
      header: "Project Name",
      comment: "",
      activeNames: ["1"],
      options: [],
      value: "",
      days: "",
      hours: "1",
      minutes: "",
      seconds: "",
      distance: "",
      now: "",
      openTimelineDialog1: false,
      openTimelineDialog2: false
    };
  },

  async fetch({ store, params, $axios }) {
    let { data } = await $axios.$get(
      `api/utilities/backlog/assignees/${params.id}`
    );
    store.commit("project/setAssignees", data);
  },

  async asyncData({ $axios, params, store }) {
    const raw = await $axios.$get(`/api/backlogs/${params.id}`);
    let backlog = raw.data;

    let raw_data = [raw.data];

    return { backlog, raw_data };
  },

  computed: {
    raw_timer: function() {
      let item = this.backlog.start_date;
      let countDownDate = new Date(item).getTime();

      let distance;
      let days;
      let hours;
      let minutes;
      let seconds;

      let obj = {};

      let x = setInterval(function() {
        let now = new Date().getTime();

        distance = countDownDate - now;

        days = Math.floor(distance / (1000 * 60 * 60 * 24));
        hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
      }, 1000);

      obj = {
        hours: hours
      };

      return obj;
    }
  },

  methods: {
    timer(item) {},
    goBack() {
      this.$router.push("/projects");
    },
    ifEmpty(item) {
      if (item === "" || item === null) {
        return "---------";
      } else {
        return item;
      }
    },

    ifDataEmpty(item) {
      if (item === "" || item === null) {
        return "No Data";
      } else {
        return item;
      }
    },

    progressFilter(item) {
      if (item === "In Progress") {
        return 35;
      } else if (item === "Testing") {
        return 70;
      } else if (item === "Completed") {
        return 100;
      } else {
        return 0;
      }
    },

    milestoneFilter(item) {
      if (item === "In Progress") {
        return 2;
      } else if (item === "Testing") {
        return 3;
      } else if (item === "Completed") {
        return 4;
      } else {
        return 1;
      }
    },

    async removeMember(id) {
      try {
        let data = await this.$axios.$post(`api/assignees/${id}`);
        this.$store.commit("project/setAssignees", data);
        this.$notify({
          title: "Success",
          message: "Assignee Successfully Deleted"
        });
      } catch (error) {
        console.log(error);
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: red" },
            "Error Occured. Please Try Again!"
          )
        });
      }
    },
    dateCalc(item) {
      // let d = new Date(item);
      // let new_date = new Date();
      // let diff = Math.abs(d - new_date);
      // return Math.round(diff);

      let date2 = new Date(item);
      let date1 = new Date();

      let one_day = 1000 * 60 * 60 * 24; //Get 1 day in milliseconds

      let days = Math.ceil((date2.getTime() - date1.getTime()) / one_day);

      return days;
    },
    handleChange(val) {
      console.log(val);
    },
    async openDialogAssignMember() {
      let res = await this.$axios.$get(
        `api/utilities/project/members/${this.$store.state.project.backlogId}`
      );

      this.options = res;

      this.dialogAssignMember = true;
    },
    async assignMember() {
      this.loader = true;
      try {
        let data = await this.$axios.$post("api/assignees", {
          member_id: this.value,
          backlog_id: this.$store.state.project.backlogId
        });
        this.$store.commit("project/pushAssignees", data);

        this.value = "";
        this.$notify({
          title: "Success",
          message: "Assignee Successfully Added"
        });

        this.dialogAssignMember = false;
        this.loader = false;
      } catch (error) {
        console.log(error);
        const h = this.$createElement;
        this.loader = false;
        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: red" },
            "Error Occured. Please Try Again"
          )
        });
      }
    },

    setTimelineDialog() {
      this.openTimelineDialog1 = true;
    },
    editTimelineDialog() {
      this.openTimelineDialog2 = true;
    },
    async setTimeline() {
      this.loader = true;
      try {
        const raw = await this.$axios.$post("/api/backlogs/update", {
          id: this.backlog.id,
          start_date: this.form.start_date,
          duration: this.form.duration
        });
        let backlog = raw.data;

        let raw_data = [raw.data];

        this.backlog = backlog;
        this.raw_data = raw_data;

        this.$notify({
          title: "Success",
          message: "Timeline Successfully Added"
        });

        this.form.start_date = "";
        this.form.duration = "";
        this.loader = false;
        this.openTimelineDialog1 = false;
      } catch (error) {
        console.log(error);
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: red" },
            "Error Occured. Please Try Again"
          )
        });
        this.loader = false;
        this.openTimelineDialog1 = false;
      }
    },
    async editTimeline() {
      let start_date = "";
      let duration = "";
      if (this.form.start_date === "") {
        start_date = this.backlog.start_date;
      } else {
        start_date = this.form.start_date;
      }

      if (this.form.duration === "") {
        duration = this.backlog.end_date;
      } else {
        duration = this.form.duration;
      }
      this.loader = true;
      try {
        const raw = await this.$axios.$post("/api/backlogs/update", {
          id: this.backlog.id,
          start_date: start_date,
          duration: duration
        });
        let backlog = raw.data;

        let raw_data = [raw.data];

        this.backlog = backlog;
        this.raw_data = raw_data;

        this.$notify({
          title: "Success",
          message: "Timeline Successfully Added"
        });

        this.form.start_date = "";
        this.form.duration = "";
        this.loader = false;
        this.openTimelineDialog2 = false;
      } catch (error) {
        console.log(error);
        this.loader = false;
        this.openTimelineDialog2 = false;
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: red" },
            "Error Occured. Please Try Again"
          )
        });
      }
    }
  },
  head() {
    return {
      title: "Backlog ~ " + this.backlog.title
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

.content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 1em;
}

/* .main {
  background: palevioletred;
} */

.comment {
  height: 77vh;
}

.comment-box {
  height: 100%;
}

.radius-right {
  border-radius: 8px;
  border-bottom-right-radius: 20px;
  margin: 1em 0;
  text-align: left;
}

.radius-left {
  border-radius: 8px;
  border-bottom-left-radius: 20px;
  margin: 1em 0;

  text-align: right;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.bg {
  color: #303133;
  background: #f2f6fc;
  border-radius: 8px;
  padding: 0.5em;
  margin-top: 0.2em;
  font-size: 15px;
  text-align: justify;
}

.display-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.scrollable {
  flex: 1 0 auto;
  overflow-x: auto;
  height: 58vh;
  margin-bottom: 1em;
}

.input {
  flex-shrink: 0;
  margin-top: 1em;
}

.form-flex {
  display: flex;
}

.ml {
  margin-left: 1em;
}

.top-header {
  display: flex;
  justify-content: space-between;
}

.story-text {
  font-weight: 200;
  font-size: 15px;
  margin-top: 1em;
}

.story,
.assign {
  margin-bottom: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assign {
  margin-top: 1em;
}

.pointer {
  cursor: pointer;
}

.progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mt-1 {
  margin-top: 1em;
}

.mt-2 {
  margin-top: 2em;
}

.timer {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 2em;
}

.flex_title {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.tag_flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
