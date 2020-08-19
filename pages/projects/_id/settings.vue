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
          activeName="fourth"
          :id="this.$store.state.project.projectId"
        />
      </div>

      <div class="top-header">
        <div>
          <h4 style="font-weight:normal; font-size:17px">
            {{ this.$store.state.project.projectRaw.project_name }}
          </h4>
        </div>
        <div>
          <el-tag type="primary" effect="plain"
            >Status:
            {{ this.$store.state.project.projectRaw.status.name }}</el-tag
          >
          <el-tag type="primary" effect="plain"
            >Due Date:
            {{ this.$store.state.project.projectRaw.due_date }}</el-tag
          >
        </div>
      </div>
      <el-divider></el-divider>

      <div class="body">
        <div class="desc">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
              <template slot="title">
                <h3>About</h3>
                <span style="padding-left: 0.2em"
                  ><i class="header-icon el-icon-info"></i
                ></span>
              </template>
              <div>
                <h4 style="font-weight:normal;">
                  {{ this.$store.state.project.projectRaw.description }}
                </h4>
              </div>
              <div></div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="members">
          <div class="top-head">
            <div>
              <h4 style="font-size: 14.5px">
                Members
                <span style="padding-left: 0.2em"
                  ><i class="header-icon el-icon-user-solid"></i
                ></span>
              </h4>
            </div>
            <div
              v-if="
                this.$store.state.auth.user === 'admin' ||
                  this.$store.state.auth.user === 'project_manager'
              "
            >
              <el-button @click="addMember"
                ><span><i class="el-icon-edit"></i></span> Add Member</el-button
              >
            </div>
          </div>
          <el-table
            style="width: 100%; margin-top:2em"
            border
            :data="this.$store.state.project.Users"
          >
            <el-table-column prop="full_name" label="Name" align="center">
            </el-table-column>
            <el-table-column prop="role" label="Role" align="center">
            </el-table-column>
            <el-table-column prop="user_id" label="Action" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  class="danger"
                  size="small"
                  @click="viewItem(scope.row.id)"
                >
                  Remove
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      title="Add Member"
      :visible.sync="openDialogMember"
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
        <el-button @click="openDialogMember = false">Cancel</el-button>
        <el-button type="primary" @click="addMemberPost">Add</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FirstMenu from "../../../components/FirstMenu";
import ProjectTabs from "../../../components/ProjectTabs";
export default {
  name: "Settings",
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
      activeIndex: "4",
      header: "Project Name",
      activeNames: ["1"],
      openDialogMember: false,
      options: [],
      value: ""
    };
  },
  async fetch({ store, params, $axios }) {
    let { data } = await $axios.$get(`api/projects/${params.id}`);
    store.commit("project/setProject", data);
  },
  async fetch({ store, params, $axios }) {
    let { data } = await $axios.$get(`api/utilities/members/${params.id}`);
    store.commit("project/setUsers", data);
    // console.log(data);
  },
  methods: {
    goBack() {
      this.$router.push("/projects");
    },

    handleChange(val) {
      console.log(val);
    },

    async addMember() {
      let res = await this.$axios.$get(
        `api/utilities/users/${this.$store.state.project.projectId}`
      );

      this.options = res;

      this.openDialogMember = true;
    },
    async addMemberPost() {
      this.loader = true;
      try {
        let res = await this.$axios.$post("api/projects/members", {
          user_id: this.value,
          project_id: this.$store.state.project.projectId
        });
        this.$store.commit("project/setAllUsersAdd", res);
        this.value = "";
        this.$notify({
          title: "Success",
          message: "Member Successfully Added"
        });
        this.loader = false;
        this.openDialogMember = false;
      } catch (err) {
        console.log(err);
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
        this.openDialogMember = false;
      }
    },
    async viewItem(id) {
      try {
        let data = await this.$axios.$post(`api/projects/members/${id}`);
        this.$notify({
          title: "Success",
          message: "Member Successfully Deleted"
        });
        this.$store.commit("project/setUsers", data);
      } catch (err) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: red" },
            "Error Occured. Please Try Again"
          )
        });

        console.log(err);
      }
    }
  },
  head() {
    return {
      title: this.$store.state.project.projectRaw.project_name + " ~  Settings"
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

.top-header {
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.members {
  margin-top: 2em;
}

.top-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.danger {
  color: #f56c6c;
}
</style>
