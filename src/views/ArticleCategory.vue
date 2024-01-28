<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";

const categoryList = ref([]);

import {
  articleCategoryListService,
  articleCategoryAddService,
  articleCategoryUpdateService,
  articleCategoryDeleteService,
} from "@/api/article.js";

const articleCategoryList = async () => {
  let result = await articleCategoryListService();
  categoryList.value = result.data;
};
articleCategoryList();

//dialog for adding/editing new category
const dialogVisible = ref(false);

const categoryModel = ref({
  categoryName: "",
  categoryAlias: "",
});

const rules = {
  categoryName: [
    { required: true, message: "Please enter category name", trigger: "blur" },
  ],
  categoryAlias: [
    { required: true, message: "Please enter category alias", trigger: "blur" },
  ],
};

//add category
const addCategory = async () => {
  let result = await articleCategoryAddService(categoryModel.value);
  ElMessage.success(
    result.message ? result.message : "Add category successfully"
  );

  //get category list again
  articleCategoryList();
  dialogVisible.value = false;
  clearData();
};

//title for the dialog
const title = ref("");

//show dialog to edit category
const showDialog = (row) => {
  dialogVisible.value = true;
  title.value = "Edit Category";
  // get category value from the form input
  categoryModel.value.categoryName = row.categoryName;
  categoryModel.value.categoryAlias = row.categoryAlias;
  categoryModel.value.id = row.id;
};

const updateCategory = async () => {
  let result = await articleCategoryUpdateService(categoryModel.value);
  ElMessage.success(result.message ? result.message : "Edit succussfully!");

  articleCategoryList();

  dialogVisible.value = false;
};

const clearData = () => {
  categoryModel.value.categoryName = "";
  categoryModel.value.categoryAlias = "";
};

//delete category
const deleteCategory = (row) => {
  ElMessageBox.confirm(
    "Are you sure you want to delete this category?",
    "Attention",
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      let result = await articleCategoryDeleteService(row.id);
      ElMessage({
        type: "success",
        message: "Delete successfully",
      });
      articleCategoryList();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete cancelled",
      });
    });
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>Category List</span>
        <div class="extra">
          <el-button
            type="primary"
            @click="
              dialogVisible = true;
              title = 'Add Category';
              clearData();
            "
            >Add Category</el-button
          >
        </div>
      </div>
    </template>
    <el-table :data="categoryList" style="width: 100%">
      <el-table-column label="Id" width="100" type="index"> </el-table-column>
      <el-table-column
        label="Category Name"
        prop="categoryName"
      ></el-table-column>
      <el-table-column
        label="Category Aliaas"
        prop="categoryAlias"
      ></el-table-column>
      <el-table-column label="Edit/Delete" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showDialog(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCategory(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No category found" />
      </template>
    </el-table>

    <!-- Dialog for adding category -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form
        :model="categoryModel"
        :rules="rules"
        label-width="120px"
        style="padding-right: 30px"
      >
        <el-form-item label="Category Name" prop="categoryName">
          <el-input
            v-model="categoryModel.categoryName"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="Category Alias" prop="categoryAlias">
          <el-input
            v-model="categoryModel.categoryAlias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="title == 'Add Category' ? addCategory() : updateCategory()"
          >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
