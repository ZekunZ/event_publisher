<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { userUpdatePasswordService } from "@/api/user";
import { useTokenStore } from "@/stores/token.js";
import { useRouter } from "vue-router";
const pwdForm = ref({
  old_pwd: "",
  new_pwd: "",
  re_pwd: "",
});

const tokenStore = useTokenStore();

const checkOldSame = (rule, value, cb) => {
  if (value === pwdForm.value.old_pwd) {
    cb(new Error("Old password should be different from new password!"));
  } else {
    cb();
  }
};

const checkNewSame = (rule, value, cb) => {
  if (value !== pwdForm.value.new_pwd) {
    cb(new Error("Re-entered new password is different from new password!"));
  } else {
    cb();
  }
};
const rules = {
  old_pwd: [
    { required: true, message: "Please enter password", trigger: "blur" },
    {
      pattern: /^\S{6,15}$/,
      message: "Password should be 6-15 characters",
      trigger: "blur",
    },
  ],
  new_pwd: [
    { required: true, message: "Please enter new password", trigger: "blur" },
    {
      pattern: /^\S{6,15}$/,
      message: "Password should be 6-15 characters",
      trigger: "blur",
    },
    { validator: checkOldSame, trigger: "blur" },
  ],
  re_pwd: [
    {
      required: true,
      message: "Please enter new password again",
      trigger: "blur",
    },
    {
      pattern: /^\S{6,15}$/,
      message: "Password should be 6-15 characters",
      trigger: "blur",
    },
    { validator: checkNewSame, trigger: "blur" },
  ],
};

const router = useRouter();
const formRef = ref();

const onSubmit = async () => {
  await formRef.value.validate();
  await userUpdatePasswordService(pwdForm.value);
  ElMessage.success("Password changed!");

  // log out the user
  tokenStore.removeToken();
  router.push("/login");
};

const onReset = () => {
  formRef.value.resetFields();
};
</script>
<template>
  <page-container title="Change Password">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="pwdForm"
          :rules="rules"
          ref="formRef"
          label-width="160px"
          size="large"
        >
          <el-form-item label="Old Password" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="New Password" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="Reenter New Password" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit" type="primary"
              >Change Password</el-button
            >
            <el-button @click="onReset">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
