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
          activeName="third"
          :id="this.$store.state.project.projectId"
        />
      </div>

      <div class="empty" v-if="sprintActive === false">
        <div>
          <span class="lg-1"><i class="el-icon-warning-outline"></i></span>
          <p class="lg-2">No Active Sprint Found</p>
        </div>
      </div>
      <!--
      <div class="top" v-if="sprintActive">
        <div>
          <h3>SPRINT 1</h3>
        </div>
        <div>
          <strong>Start Date</strong>: <small>2020-10-21</small> |
          <strong>End Date</strong>: <small>2020-12-21</small>
        </div>
      </div> -->

      <div class="board" v-if="sprintActive">
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix info">
              <span><i class="el-icon-s-order"></i></span>
              <span>TODO</span>
            </div>
            <div>
              <div class="scroll">
                <draggable
                  v-model="sprintData1"
                  :options="{ group: 'people' }"
                  style="min-height: 50vh"
                  @change="update()"
                >
                  <el-card
                    class="mb"
                    shadow="always"
                    v-for="l in sprintData1"
                    :key="l.id"
                  >
                    <div class="title">
                      <div>
                        <h5>{{ l.title }}</h5>
                      </div>
                      <div class="chat-left">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="View task"
                          placement="top-start"
                        >
                          <nuxt-link
                            :to="
                              '/projects/' + l.project_id + '/backlogs/' + l.id
                            "
                          >
                            <span><i class="el-icon-view"></i></span>
                          </nuxt-link>
                        </el-tooltip>

                        <div class="chat">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="Task comments"
                            placement="top-start"
                          >
                            <i
                              class="el-icon-chat-line-round chat-icon info"
                              @click="openChat(l.id, l.title)"
                            ></i>
                          </el-tooltip>
                        </div>
                      </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="bottom">
                      <div class="b-left">
                        <div>
                          <el-tag type="info" effect="plain"
                            ><span> <i class="el-icon-watch"></i></span>
                            Duration: {{ l.end_date }}</el-tag
                          >
                          <el-tag :type="checkPriority(l.priority)"
                            ><span>
                              <i class="el-icon-c-scale-to-original"></i
                            ></span>
                            Priority: {{ l.priority }}</el-tag
                          >
                          <el-tag type="info" effect="plain"
                            ><span> <i class="el-icon-date"></i></span>
                            {{ l.start_date }}</el-tag
                          >
                        </div>
                      </div>
                      <!-- <div class="b-right">
                        <el-avatar class="bg-info" size="small">
                          EK
                        </el-avatar>
                        <el-avatar class="bg-info" size="small">
                          NG
                        </el-avatar>
                      </div> -->
                    </div>
                  </el-card>
                </draggable>
              </div>
            </div>
          </el-card>
        </div>
        <div>
          <el-card class="box-card ">
            <div slot="header" class="clearfix primary-color">
              <span><i class="el-icon-loading"></i></span>
              <span>IN PROGRESS</span>
            </div>
            <div>
              <div class="scroll">
                <draggable
                  v-model="sprintData2"
                  :options="{ group: 'people' }"
                  style="min-height: 50vh"
                  @change="update()"
                >
                  <el-card
                    class="mb"
                    shadow="always"
                    v-for="l in sprintData2"
                    :key="l.id"
                  >
                    <div class="title">
                      <div>
                        <h5>{{ l.title }}</h5>
                      </div>
                      <div class="chat-left">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="View task"
                          placement="top-start"
                        >
                          <nuxt-link
                            :to="
                              '/projects/' + l.project_id + '/backlogs/' + l.id
                            "
                          >
                            <span><i class="el-icon-view"></i></span>
                          </nuxt-link>
                        </el-tooltip>

                        <div class="chat">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="Task comments"
                            placement="top-start"
                          >
                            <i
                              class="el-icon-chat-line-round chat-icon info"
                              @click="openChat(l.id, l.title)"
                            ></i>
                          </el-tooltip>
                        </div>
                      </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="bottom">
                      <div class="b-left">
                        <div>
                          <el-tag type="info" effect="plain"
                            ><span> <i class="el-icon-watch"></i></span>
                            Duration: {{ l.end_date }}</el-tag
                          >
                          <el-tag :type="checkPriority(l.priority)"
                            ><span>
                              <i class="el-icon-c-scale-to-original"></i
                            ></span>
                            Priority: {{ l.priority }}</el-tag
                          >
                          <el-tag type="info" effect="plain"
                            ><span> <i class="el-icon-date"></i></span>
                            {{ l.start_date }}</el-tag
                          >
                        </div>
                      </div>
                      <!-- <div class="b-right">
                        <el-avatar class="bg-info" size="small">
                          EK
                        </el-avatar>
                        <el-avatar class="bg-info" size="small">
                          NG
                        </el-avatar>
                      </div> -->
                    </div>
                  </el-card>
                </draggable>
              </div>
            </div>
          </el-card>
        </div>
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix  warning">
              <span><i class="el-icon-set-up"></i></span>
              <span>TESTING</span>
            </div>
            <div>
              <div class="scroll">
                <draggable
                  v-model="sprintData3"
                  :options="{ group: 'people' }"
                  style="min-height: 50vh"
                  @change="update()"
                >
                  <el-card
                    class="mb"
                    shadow="always"
                    v-for="l in sprintData3"
                    :key="l.id"
                  >
                    <div class="title">
                      <div>
                        <h5>{{ l.title }}</h5>
                      </div>
                      <div class="chat-left">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="View task"
                          placement="top-start"
                        >
                          <nuxt-link
                            :to="
                              '/projects/' + l.project_id + '/backlogs/' + l.id
                            "
                          >
                            <span><i class="el-icon-view"></i></span>
                          </nuxt-link>
                        </el-tooltip>

                        <div class="chat">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="Task comments"
                            placement="top-start"
                          >
                            <i
                              class="el-icon-chat-line-round chat-icon info"
                              @click="openChat(l.id, l.title)"
                            ></i>
                          </el-tooltip>
                        </div>
                      </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="bottom">
                      <div class="b-left">
                        <div>
                          <el-tag type="info" effect="plain"
                            ><span> <i class="el-icon-watch"></i></span>
                            Duration: {{ l.end_date }}</el-tag
                          >
                          <el-tag :type="checkPriority(l.priority)"
                            ><span>
                              <i class="el-icon-c-scale-to-original"></i
                            ></span>
                            Priority: {{ l.priority }}</el-tag
                          >
                          <el-tag type="info" effect="plain"
                            ><span> <i class="el-icon-date"></i></span>
                            {{ l.start_date }}</el-tag
                          >
                        </div>
                      </div>
                      <!-- <div class="b-right">
                        <el-avatar class="bg-info" size="small">
                          EK
                        </el-avatar>
                        <el-avatar class="bg-info" size="small">
                          NG
                        </el-avatar>
                      </div> -->
                    </div>
                  </el-card>
                </draggable>
              </div>
            </div>
          </el-card>
        </div>
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix success">
              <span><i class="el-icon-finished"></i></span>
              <span>COMPLETED</span>
            </div>
            <div>
              <div class="scroll">
                <draggable
                  v-model="sprintData4"
                  :options="{ group: 'people' }"
                  style="min-height: 50vh"
                  @change="update()"
                >
                  <el-card
                    class="mb"
                    shadow="always"
                    v-for="l in sprintData4"
                    :key="l.id"
                  >
                    <div class="title">
                      <div>
                        <h5>{{ l.title }}</h5>
                      </div>
                      <div class="chat-left">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="View task"
                          placement="top-start"
                        >
                          <nuxt-link
                            :to="
                              '/projects/' + l.project_id + '/backlogs/' + l.id
                            "
                          >
                            <span><i class="el-icon-view"></i></span>
                          </nuxt-link>
                        </el-tooltip>

                        <div class="chat">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="Task comments"
                            placement="top-start"
                          >
                            <i
                              class="el-icon-chat-line-round chat-icon info"
                              @click="openChat(l.id, l.title)"
                            ></i>
                          </el-tooltip>
                        </div>
                      </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="bottom">
                      <div class="b-left">
                        <div>
                          <el-tag type="info" effect="plain"
                            ><span> <i class="el-icon-watch"></i></span>
                            Duration: {{ l.end_date }}</el-tag
                          >
                          <el-tag :type="checkPriority(l.priority)"
                            ><span>
                              <i class="el-icon-c-scale-to-original"></i
                            ></span>
                            Priority: {{ l.priority }}</el-tag
                          >
                          <el-tag type="info" effect="plain"
                            ><span> <i class="el-icon-date"></i></span>
                            {{ l.start_date }}</el-tag
                          >
                        </div>
                      </div>
                      <!-- <div class="b-right">
                        <el-avatar class="bg-info" size="small">
                          EK
                        </el-avatar>
                        <el-avatar class="bg-info" size="small">
                          NG
                        </el-avatar>
                      </div> -->
                    </div>
                  </el-card>
                </draggable>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="closeDrawer"
    >
      <div class="comments_container" v-loading="loader">
        <div class="comment_title">
          <h3 style="font-weight:200">
            <span><i class="el-icon-chat-line-square"></i></span>
            {{ title }} Comments
          </h3>
        </div>
        <div class="comments">
          <div class="comment">
            <div class="chat_layer" v-for="c in comments" :key="c.id">
              <el-divider></el-divider>
              <div class="flex-chat">
                <div>
                  <el-avatar class="primary"> {{ c.initials }} </el-avatar>
                </div>
                <div>
                  <div class="name">
                    <h5>{{ c.author }}</h5>
                  </div>
                  <div class="comment-body">
                    {{ c.comment }}
                  </div>
                  <div class="timer">
                    <span><i class="el-icon-time"></i></span> {{ c.time_date }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="message">
          <el-form ref="form" :model="form">
            <el-form-item>
              <el-input
                style="width:420px !important"
                type="textarea"
                v-model="form.comment"
                placeholder="Add comment"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="mt-4">
            <el-button type="primary" @click="addComment">Comment</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import FirstMenu from "../../../components/FirstMenu";
import ProjectTabs from "../../../components/ProjectTabs";
import draggable from "vuedraggable";
export default {
  name: "Sprint",
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },
  components: {
    FirstMenu,
    ProjectTabs,
    draggable
  },

  data() {
    return {
      form: {
        comment: "",
        id: ""
      },
      comments: [],
      activeIndex: "4",
      loader: false,
      drawer: false,
      direction: "rtl",
      header: "Project Name",
      title: "Task",
      sprintActive: true,
      sprintData1: this.$store.state.project.backlogsRaw,
      sprintData2: this.$store.state.project.backlogsRawProgress,
      sprintData3: this.$store.state.project.backlogsRawTesting,
      sprintData4: this.$store.state.project.backlogsRawCompleted
    };
  },

  async fetch({ store, params, $axios }) {
    let { data } = await $axios.$get(`api/utilities/backlogs/${params.id}`);
    let pending = [];
    let progress = [];
    let testing = [];
    let completed = [];

    pending = data.filter(function(state) {
      return state.status == "Pending";
    });

    progress = data.filter(function(state) {
      return state.status == "In Progress";
    });

    testing = data.filter(function(state) {
      return state.status == "Testing";
    });

    completed = data.filter(function(state) {
      return state.status == "Completed";
    });

    store.commit("project/setBacklogs", pending);
    store.commit("project/setBacklogsProgress", progress);
    store.commit("project/setBacklogsTesting", testing);
    store.commit("project/setBacklogsCompleted", completed);
  },

  computed: {
    pending() {
      let data = this.$store.state.project.backlogsRaw;

      return data;
    }
  },
  methods: {
    goBack() {
      this.$router.push("/projects");
    },
    checkPriority(item) {
      if (item == "Low") {
        return "primary";
      } else if (item == "High") {
        return "danger";
      } else {
        return "success";
      }
    },
    async update() {
      try {
        let data = await this.$axios.$post("api/utilities/backlog/update", {
          pending: this.sprintData1,
          progress: this.sprintData2,
          testing: this.sprintData3,
          completed: this.sprintData4
        });
      } catch (error) {
        console.log(error);
      }
    },
    async openChat(id, title) {
      this.drawer = true;
      this.title = title;
      this.form.id = id;
      this.loader = true;

      let res = await this.$axios.$get(`/api/comments/${id}`);

      this.loader = false;
      this.comments = res;
    },
    closeDrawer(done) {
      done();
    },

    async addComment() {
      this.loader = true;
      try {
        let res = await this.$axios.$post(`/api/comments/${this.form.id}`, {
          // backlog_id: this.form.id,
          comment: this.form.comment
        });
        this.comments = res;
        this.loader = false;

        this.form.comment = "";
      } catch (error) {
        console.log(error);

        this.form.comment = "";
        this.loader = false;
      }
    }
  },
  head() {
    return {
      title:
        this.$store.state.project.projectRaw.project_name + " ~  Sprint Board"
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
}

.mt {
  padding-top: 0.1em;
}

.board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 75vh;
  grid-gap: 1em;
}

.box-card {
  height: 100%;
}

.top {
  margin: 1em 0;
}

.success {
  color: #67c23a !important;
}

.warning {
  color: #e6a23c !important;
}

.primary-color {
  color: #409eff !important;
}

.info {
  color: #909399 !important;
}

.bg-info {
  background-color: #409eff !important;
}

.danger {
  color: #f56c6c !important;
}

.bottom {
  display: flex;
  justify-content: space-between;
}

.title {
  display: flex;
  justify-content: space-between;
}

.title a {
  text-decoration: none;
  color: #f56c6c;
}

.empty {
  display: flex;
  flex-direction: column;
  height: 60vh;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.lg-2 {
  font-size: 2em;
  font-weight: lighter;
  color: #909399;
}
.lg-1 {
  font-size: 1.7em;
  color: #909399;
}

.scroll {
  overflow-x: auto;
  height: 64vh;
}

.mb {
  margin-bottom: 0.5em;
}

.chat-left {
  display: flex;
  flex-direction: row;
}

.chat {
  margin-left: 1em;
}

.chat-icon {
  cursor: pointer;
}

.comments_container {
  margin: 0 1em;
}

.comment_title {
  color: #303133;
  /* margin-bottom: 0.5em; */
}

.comments {
  min-height: calc(100vh - 20vh);
}

.flex-chat {
  display: grid;
  grid-template-columns: 0.4fr 3fr;
  width: 90%;
  margin: 0 2em;
}

.name {
  margin-bottom: 0.3em;
}

.comment-body {
  color: #303133;
  font-weight: 300;
  font-size: 15px;
  line-height: 1.5;
}

.primary {
  background: #409eff;
  color: #fff;
}

.timer {
  margin-top: 0.6em;
  font-size: 14px;
}

.message {
  display: flex;
  /* height: 100%; */
  align-items: center;
  justify-content: space-between;
}

.mt-4 {
  margin-bottom: 1em;
}

.comment {
  height: 67vh;
  overflow-x: auto;
  margin-bottom: 1em;
}
</style>
