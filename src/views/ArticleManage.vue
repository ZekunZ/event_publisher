<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { ref } from "vue";

import {
  articleCategoryListService,
  articleListService,
  articleAddService,
  articleUpdateService,
  articleDeleteService,
} from "@/api/article.js";

import { useTokenStore } from "@/stores/token.js";
const tokenStore = useTokenStore();

const categoryList = ref([]);

const categoryId = ref("");
const state = ref("");

const articles = ref([]);

const pageNum = ref(1);
const total = ref(20);
const pageSize = ref(3);

const onSizeChange = (size) => {
  pageSize.value = size;
  articleList();
};

const onCurrentChange = (num) => {
  pageNum.value = num;
  articleList();
};

const articleCategoryList = async () => {
  let result = await articleCategoryListService();

  categoryList.value = result.data;
};

//get article list
const articleList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null,
  };
  let result = await articleListService(params);

  //render view using the data from request result
  total.value = result.data.total;
  articles.value = result.data.items;

  //populate categoryName with categoryId
  for (let i = 0; i < articles.value.length; i++) {
    let article = articles.value[i];
    for (let j = 0; j < categoryList.value.length; j++) {
      if (article.categoryId == categoryList.value[j].id) {
        article.categoryName = categoryList.value[j].categoryName;
      }
    }
  }
};

articleCategoryList();
articleList();

//to control if drawer should display or not
const visibleDrawer = ref(false);

const articleModel = ref({
  title: "",
  categoryId: "",
  coverImg: "",
  content: "",
  state: "",
});

const uploadSuccess = (result) => {
  articleModel.value.coverImg = result.data;
};

const title = ref("");

const addArticle = async (clickState) => {
  console.log("Add Article");
  console.log(clickState);
  // set publishing state from clickstate
  articleModel.value.state = clickState;

  let result = await articleAddService(articleModel.value);

  ElMessage.success(result.message ? result.message : "Add Successfully");
  visibleDrawer.value = false;
  articleList();
};

// Edit article
const showEditArticle = (row) => {
  visibleDrawer.value = true;
  title.value = "Edit Article";
  articleModel.value.title = row.title;
  articleModel.value.categoryId = row.categoryId;
  articleModel.value.coverImg = row.coverImg;
  articleModel.value.content = row.content;
  articleModel.value.state = row.state;
  articleModel.value.id = row.id;
};

const editArticle = async (clickState) => {
  // set publishing state from clickstate
  articleModel.value.state = clickState;
  let result = await articleUpdateService(articleModel.value);
  ElMessage.success(result.message ? result.message : "Edit succussfully!");
  articleList();
  visibleDrawer.value = false;
};

const clearData = () => {
  articleModel.value.title = "";
  articleModel.value.categoryId = "";
  articleModel.value.coverImg = "";
  articleModel.value.content = " ";
  articleModel.value.state = "";
};

const deleteArticle = (row) => {
  ElMessageBox.confirm(
    "Are you sure you want to delete this article?",
    "Attention",
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      let result = await articleDeleteService(row.id);
      ElMessage({
        type: "success",
        message: "Delete successfully",
      });
      articleList();
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
        <span>Article Manage</span>
        <div class="extra">
          <el-button
            type="primary"
            @click="
              visibleDrawer = true;
              title = 'Add Article';
              clearData();
            "
            >Add Article</el-button
          >
        </div>
      </div>
    </template>
    <!-- Search form -->
    <el-form inline>
      <el-form-item label="Article Category：">
        <el-select placeholder="Please select" v-model="categoryId">
          <el-option
            v-for="c in categoryList"
            :key="c.id"
            :label="c.categoryName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Pulish State：">
        <el-select placeholder="Please select" v-model="state">
          <el-option label="Published" value="published"></el-option>
          <el-option label="Draft" value="draft"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="articleList">Search</el-button>
        <el-button
          @click="
            categoryId = '';
            state = '';
            articleList();
          "
          >Reset</el-button
        >
      </el-form-item>
    </el-form>
    <!-- Article List -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column
        label="Article title"
        width="400"
        prop="title"
      ></el-table-column>
      <el-table-column label="Category" prop="categoryName"></el-table-column>
      <el-table-column label="Publishing time" prop="createTime">
      </el-table-column>
      <el-table-column label="State" prop="state"></el-table-column>
      <el-table-column label="Edit/Delete" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No article found" />
      </template>
    </el-table>
    <!-- Pagination -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- Drawer -->
    <el-drawer
      v-model="visibleDrawer"
      :title="title"
      direction="rtl"
      size="50%"
    >
      <!-- Article Add Form -->
      <el-form :model="articleModel" label-width="120px">
        <el-form-item label="Article title">
          <el-input
            v-model="articleModel.title"
            placeholder="Please enter the title"
          ></el-input>
        </el-form-item>
        <el-form-item label="Article Category">
          <el-select
            placeholder="Please select"
            v-model="articleModel.categoryId"
          >
            <el-option
              v-for="c in categoryList"
              :key="c.id"
              :label="c.categoryName"
              :value="c.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Article cover">
          <!-- 
                        auto-upload: set if upload automatically true/false
                        action: set api end point
                        name: set upload type
                        headers: set request headers
                        on-success: methods after successfully uploaded
                     -->

          <el-upload
            class="avatar-uploader"
            :auto-upload="true"
            :show-file-list="false"
            action="/api/upload"
            name="file"
            :headers="{ Authorization: tokenStore.token }"
            :on-success="uploadSuccess"
          >
            <img
              v-if="articleModel.coverImg"
              :src="articleModel.coverImg"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="Article Content">
          <div class="editor">
            <quill-editor
              theme="snow"
              v-model:content="articleModel.content"
              contentType="html"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              title == 'Add Article'
                ? addArticle('published')
                : editArticle('published')
            "
            >Publish</el-button
          >
          <el-button
            type="info"
            @click="
              title == 'Add Article'
                ? addArticle('draft')
                : editArticle('draft')
            "
            >Save Draft</el-button
          >
        </el-form-item>
      </el-form>
    </el-drawer>
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

/* drawer styling */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
