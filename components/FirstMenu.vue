<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
    >
      <el-menu-item>
        <nuxt-link class="link" to="/">
          <img class="logo" src="~/assets/logo.svg" alt="logo" />
        </nuxt-link>
      </el-menu-item>
      <!-- <el-menu-item index="1">
        <nuxt-link class="link" to="/">Overview</nuxt-link>
      </el-menu-item> -->
      <el-menu-item index="4">
        <nuxt-link class="link" to="/projects">Projects</nuxt-link>
      </el-menu-item>
      <el-submenu index="2" v-if="this.$store.state.auth.user === 'admin'">
        <template slot="title">Administration</template>
        <el-menu-item index="2-1" @click="users" style="cursor:pointer">
          Users
        </el-menu-item>
      </el-submenu>
      <!-- <el-menu-item index="3">
        <nuxt-link to="/admin/profile">Profile</nuxt-link>
      </el-menu-item> -->
      <el-menu-item class="force_right" route="/auth/login">
        <el-button
          @click="$auth.logout()"
          class="btn_custom"
          type=""
          icon="el-icon-unlock"
          >Logout</el-button
        >
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "FirstMenu",

  props: {
    activeIndex: ""
  },
  methods: {
    users() {
      this.$router.push("/admin/users");
    }
  }
};
</script>

<style scoped>
img.logo {
  width: 180px;
}

.force_right {
  float: right;
  margin-right: 1em;
}

.el-menu-item {
  cursor: default;
}

.el-menu-item.el-menu-item a {
  color: inherit;
}

a {
  text-decoration: none;
}

.btn_custom {
  border: none;
}

.btn_custom:hover {
  background: none;
  color: #303133;
}
</style>
