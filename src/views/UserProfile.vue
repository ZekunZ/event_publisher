<script setup>
import useUserInfoStore from "@/stores/userInfo.js";
import { ref } from "vue";
import { userUpdateInfoService } from "@/api/user";
import { ElMessage } from "element-plus";

const userInfoStore = useUserInfoStore();

const userInfo = ref({ ...userInfoStore.userInfo });

const rules = {
  nickname: [
    { required: true, message: "Please enter nickname", trigger: "blur" },
    {
      pattern: /^\S{1,10}$/,
      message: "Nick name must be 1-10 characters",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "Please enter email", trigger: "blur" },
    { type: "email", message: "Email is not valid", trigger: "blur" },
  ],
};

const formRef = ref();
const submitForm = async () => {
  await formRef.value.validate();
  await userUpdateInfoService(userInfo.value);
  ElMessage.success("Update successfully");
  userInfoStore.setUserInfo(userInfo.value);
};
</script>

<template>
  <page-container title="User Profile">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="userInfo"
          :rules="rules"
          ref="formRef"
          label-width="120px"
          size="large"
        >
          <el-form-item label="Username">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="User Nickname" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">Submit</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
