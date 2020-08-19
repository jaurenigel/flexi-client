<template>
  <div class="login">
    <div class="form_container" v-loading="loading">
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        @keyup.enter.native="login"
      >
        <div class="logo">
          <img src="~/assets/logo.svg" alt="logo" />
        </div>
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="loginForm.email"
            prefix-icon="el-icon-message"
            placeholder="name@email.com"
          ></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="*****"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent="login">Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  auth: "guest",
  name: "login",
  head() {
    return {
      title: "FlexiPMS" + " ~ " + "Login"
    };
  },
  data() {
    return {
      loading: false,
      loginForm: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          {
            required: true,
            message: "Please email is required",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please password is required",
            trigger: "blur"
          },
          {
            min: 3,
            message: "Length should be 3 or more",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    async login() {
      this.loading = true;
      try {
        let response = await this.$auth.loginWith("local", {
          data: this.loginForm
        });
        this.$router.push("/projects");
        this.loading = false;
      } catch (err) {
        this.$message.error("Oops, email or password is incorrect.");
        console.log(err);
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login {
  height: 100vh;
  background: #c0c4cc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form_container {
  background: #fff;
  height: 53%;
  width: 33%;
  border-radius: 4px;
  border: solid 1px #c7c9cc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 2em;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2em;
}

.logo img {
  width: 100%;
}
</style>
