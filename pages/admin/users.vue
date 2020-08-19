<template>
  <div>
    <FirstMenu :activeIndex="activeIndex" />

    <div class="container" v-loading="loading_whole">
      <div class="filters">
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
        <div v-if="this.$store.state.auth.user === 'admin'">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="openCreateUserDialog"
            >Create User</el-button
          >
        </div>
      </div>

      <el-table :data="users_raw" style="width: 100%" border>
        <el-table-column
          prop="full_name"
          label="FULL NAME"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <i class="el-icon-user"></i>
            <span style="margin-left: 10px">{{ scope.row.full_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="EMAIL" align="center" sortable>
          <template slot-scope="scope">
            <i class="el-icon-message"></i>
            <span style="margin-left: 10px">{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="ROLE" align="center" sortable>
          <template slot-scope="scope">
            <i class="el-icon-paperclip"></i>
            <span style="margin-left: 10px">{{
              scope.row.role_description
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="ACTION" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="openDialog(scope.row.id)"
            >
              Edit
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
      title="Edit User"
      :visible.sync="userEditDialog"
      width="30%"
      v-loading="loader"
    >
      <el-form ref="userForm" :model="userForm">
        <el-form-item label="First Name">
          <el-input v-model="userForm.first_name"></el-input>
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input v-model="userForm.last_name"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input type="email" v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            type="password"
            v-model="userForm.password"
            placeholder="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userEditDialog = false">Cancel</el-button>
        <el-button type="primary" @click="editUser">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Create User"
      :visible.sync="createUserDialog"
      width="30%"
      v-loading="loader"
    >
      <el-form ref="userForm" :model="userForm">
        <el-form-item label="First Name">
          <el-input
            v-model="userForm.first_name"
            placeholder="first name"
          ></el-input>
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input
            v-model="userForm.last_name"
            placeholder="last name"
          ></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input
            type="email"
            v-model="userForm.email"
            placeholder="email"
          ></el-input>
        </el-form-item>
        <el-form-item label="User Role">
          <el-select
            style="width: 100%"
            v-model="userForm.role_id"
            placeholder="please select user role"
          >
            <el-option label="System Administrator" value="1"></el-option>
            <el-option label="Project Manager" value="2"></el-option>
            <el-option label="Development Team" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            type="password"
            v-model="userForm.password"
            placeholder="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createUserDialog = false">Cancel</el-button>
        <el-button type="primary" @click="createUser">Create</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FirstMenu from "../../components/FirstMenu";
export default {
  name: "Users",
  components: {
    FirstMenu
  },
  head() {
    return {
      title: "FlexiPMS" + " ~ " + "Users"
    };
  },

  data() {
    return {
      loader: false,
      loading_whole: false,
      search_data: "",
      createUserDialog: false,
      activeIndex: "2-1",
      userForm: {
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role_id: "",
        id: ""
      },
      userEditDialog: false
    };
  },

  async asyncData({ $axios }) {
    const raw = await $axios.$get("/api/users");
    let users_raw = [];
    users_raw = raw.data.data;
    return { users_raw, raw };
  },
  methods: {
    async handleCurrentChange(val) {
      let raw = await this.$axios.$get(`api/users?page=${val}`);
      let users = [];
      users = raw.data.data;
      this.raw = raw;
      this.users_raw = users;
    },
    async openDialog(id) {
      const raw = await this.$axios.$get(`/api/users/${id}`);
      let user = raw.data;

      this.userForm.email = user.email;
      this.userForm.first_name = user.first_name;
      this.userForm.id = user.id;
      this.userForm.last_name = user.last_name;
      this.userEditDialog = true;
    },
    async editUser() {
      this.loader = true;
      try {
        const res = await this.$axios.$post("/api/users/update", {
          id: this.userForm.id,
          email: this.userForm.email,
          password: this.userForm.password,
          last_name: this.userForm.last_name,
          first_name: this.userForm.first_name
        });

        let users_raw = [];
        users_raw = res.data.data;

        this.users_raw = users_raw;
        this.raw = res;

        this.userForm.email = "";
        this.userForm.password = "";
        this.userForm.first_name = "";
        this.userForm.id = "";
        this.userForm.last_name = "";
        this.$notify({
          title: "Success",
          message: `User succeesfully updated`
        });
        this.loader = false;
        this.userEditDialog = false;
      } catch (err) {
        this.userForm.email = "";
        this.userForm.password = "";
        this.userForm.first_name = "";
        this.userForm.id = "";
        this.userForm.last_name = "";
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
        console.log(err);
        this.userEditDialog = false;
      }
    },

    openCreateUserDialog() {
      this.createUserDialog = true;
    },

    async createUser() {
      this.loader = true;
      try {
        let res = await this.$axios.$post("/api/auth/register", {
          role_id: this.userForm.role_id,
          email: this.userForm.email,
          password: this.userForm.password,
          last_name: this.userForm.last_name,
          first_name: this.userForm.first_name
        });
        this.$notify({
          title: "Success",
          message: `User succeesfully created`
        });
        this.userForm.email = "";
        this.userForm.password = "";
        this.userForm.first_name = "";
        this.userForm.role_id = "";
        this.userForm.last_name = "";

        let users_raw = [];
        users_raw = res.data.data;

        this.users_raw = users_raw;
        this.raw = res;
        this.loader = false;
        this.createUserDialog = false;
      } catch (error) {
        console.log(error);
        this.userForm.email = "";
        this.userForm.password = "";
        this.userForm.first_name = "";
        this.userForm.role_id = "";
        this.userForm.last_name = "";
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
        this.createUserDialog = false;
      }
    },

    async searchData() {
      try {
        this.loading_whole = true;
        let res = await this.$axios.$post("/api/search/user", {
          search_data: this.search_data
        });

        let users_raw = [];
        users_raw = res.data.data;

        this.users_raw = users_raw;
        this.raw = res;
        this.search_data = "";
        this.loading_whole = false;
      } catch (error) {
        console.log(error);
        this.search_data = "";
        this.loading_whole = false;
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
