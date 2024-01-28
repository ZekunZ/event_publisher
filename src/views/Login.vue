<script setup>
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import { userRegisterService, userLoginService } from "@/api/user.js";
import { useTokenStore } from "@/stores/token.js";
import { useRouter } from "vue-router";

const tokenStore = useTokenStore();
const router = useRouter();

const isRegister = ref(false);
const formModel = ref({
  username: "",
  password: "",
  repassword: "",
});

const form = ref(); // Get form values

const rules = {
  username: [
    { required: true, message: "Please enter username", trigger: "blur" },
    {
      min: 5,
      max: 16,
      message: "User name length is from 5 to 16",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Please enter password", trigger: "blur" },
    {
      pattern: /^\S{5,16}$/,
      message: "Password must be 5-16 no empty characters",
      trigger: "blur",
    },
  ],
  repassword: [
    { required: true, message: "Please enter password again", trigger: "blur" },
    {
      pattern: /^\S{5,16}$/,
      message: "Password must be 5-16 no empty characters",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error("Password does not match"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const onsubmit = async () => {
  try {
    await form.value.validate();
    const result = await userRegisterService(formModel.value);
    if (result.code === 0) {
      ElMessage.success("Register successfully!");
      isRegister.value = false;
    } else {
      ElMessage.error(result.message || "Register failed!");
    }
  } catch (error) {
    ElMessage.error(error.message || "Register  failed!");
  }
};

const login = async () => {
  await form.value.validate();
  const result = await userLoginService(formModel.value);
  ElMessage.success("Successfully logged in!");
  tokenStore.setToken(result.data);
  router.push("/");
};

watch(isRegister, () => {
  formModel.value = {
    username: "",
    password: "",
    repassword: "",
  };
});
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>Register</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please enter username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please enter password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please enter password again"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            @click="onsubmit"
            type="primary"
            auto-insert-space
          >
            Register
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← Back
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>Login</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please enter username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please enter password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>Remember me</el-checkbox>
            <el-link type="primary" :underline="false"
              >Forget password？</el-link
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >Login</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            Register →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url("@/assets/logo2.png") no-repeat 60% center / 240px auto,
      url("@/assets/login_bg.jpg") no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
