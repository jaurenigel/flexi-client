<template>
  <div class="container">
    <div v-if="error.statusCode === 404">
      <div class="flex">
        <img src="~/assets/undraw_empty.svg" alt="" />
        <div>
          <h1>Page not found</h1>
          <nuxt-link to="/">
            <el-button class="err404" type="primary" icon="el-icon-back"
              >Back home
            </el-button>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div v-if="error.statusCode === 401">
      <div class="flex">
        <img src="~/assets/undraw_server_down.svg" alt="" />
        <div>
          <h1 style="text-align:center">
            Session Expired <br />
            <span class="h1">Login to continue</span>
          </h1>
          <el-button
            @click="$auth.logout()"
            class="err500"
            type="primary"
            icon="el-icon-unlock"
            >Login
          </el-button>
        </div>
      </div>
    </div>
    <div v-if="error.statusCode === 500">
      <div class="flex">
        <img src="~/assets/bug_fixing.svg" alt="" />
        <div>
          <h1 style="text-align:center">
            Error Occured. <br />
            <span class="h1">Report Issue To The developers</span>
          </h1>
          <el-button
            @click="report(error)"
            class="err500"
            type="primary"
            icon="el-icon-edit-outline"
            >Report
          </el-button>
        </div>
      </div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "default", // you can set a custom layout for the error page

  methods: {
    async report(error) {
      try {
        const res = await this.$axios.$post("/api/errors", {
          message: error.message,
          location: window.location.href
        });
        this.$router.push("/");
        this.$message({
          message: "Report successfully sent.",
          type: "success"
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

h1 {
  font-weight: normal;
  text-transform: uppercase;
  margin-top: 1em;
}

img {
  width: 30%;
}

.flex {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.err500 {
  margin-top: 1em;
  margin-left: 6.9em;
}

.err404 {
  margin-top: 1em;
  margin-left: 5em;
}

.h1 {
  font-size: 0.6em;
  text-transform: capitalize;
}
</style>
