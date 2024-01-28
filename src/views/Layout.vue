<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
} from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
import avatar from "@/assets/default.png";
import useUserInfoStore from "@/stores/userInfo.js";
import { useTokenStore } from "@/stores/token.js";
import { userInfoService } from "@/api/user";
import { useRouter } from "vue-router";
const router = useRouter();
const userInfoStore = useUserInfoStore();
const tokenStore = useTokenStore();

const getUserInfo = async () => {
  let userInfo = await userInfoService();
  userInfoStore.setUserInfo(userInfo.data);
};

getUserInfo();

const handleCommand = (key) => {
  if (key === "logout") {
    ElMessageBox.confirm("Are you sure you want to log out？", "Attention", {
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      type: "warning",
    })
      .then(async () => {
        tokenStore.removeToken();
        userInfoStore.removeUserInfo();
        router.push("/login");
        ElMessage({
          type: "success",
          message: "Log out successfully",
        });
      })
      .catch(() => {
        ElMessage({
          type: "warning",
          message: "Log out cancelled",
        });
      });
  } else {
    router.push(`/user/${key}`);
  }
};
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/category">
          <el-icon><Management /></el-icon>
          <span>Article Category</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>Article Management</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>Account Setting</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>Profile</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>Change Avatar</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>Change Password</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          Welcome!
          <strong>{{
            userInfoStore.userInfo.nickname || userInfoStore.userInfo.username
          }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userInfoStore.userInfo.userPic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >Basic Information</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >Change Avatar</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >Change Password</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >Log out</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>Event Publisher ©2024 Created by ZZ</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url("@/assets/logo2.png") no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
