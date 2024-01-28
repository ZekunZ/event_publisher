<script setup>
import { ref } from "vue";
import useUserInfoStore from "@/stores/userInfo.js";
import { Plus, Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { userUploadAvatarService } from "@/api/user";
import { useTokenStore } from "@/stores/token.js";

const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const imgUrl = ref(userInfoStore.userInfo.userPic);
const uploadRef = ref();

/* const changeAvatar = (uploadFile) => {
  // based on FileReader read the image file and preview it(base64)
  const reader = new FileReader();
  reader.readAsDataURL(uploadFile.raw);
  reader.onload = () => {
    imgUrl.value = reader.result;
  };
}; */

const uploadSuccess = (result) => {
  imgUrl.value = result.data;
};

const onUpdateAvatar = async () => {
  let result = await userUploadAvatarService(imgUrl.value);
  ElMessage({
    type: "success",
    message: result.message || "Successfully change your avatar",
  });
  userInfoStore.userInfo.userPic = imgUrl.value;
};
</script>

<template>
  <page-container title="Change Avatar">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      action="/api/upload"
      name="file"
      :headers="{ Authorization: tokenStore.token }"
      :show-file-list="false"
      :auto-upload="true"
      :on-success="uploadSuccess"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <br />
    <el-button
      size="large"
      type="primary"
      :icon="Plus"
      @click="uploadRef.$el.querySelector('input').click()"
      >Select an image</el-button
    >
    <el-button
      size="large"
      type="success"
      :icon="Upload"
      @click="onUpdateAvatar"
      >Upload Avatar</el-button
    >
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
