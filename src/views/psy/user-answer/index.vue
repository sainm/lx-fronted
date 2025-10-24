<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item class="search-buttons">
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button
          v-hasPerm="['psy:user-answer:add']"
          type="success"
          icon="plus"
          @click="handleOpenDialog()"
        >
          新增
        </el-button>
        <el-button
          v-hasPerm="['psy:user-answer:delete']"
          type="danger"
          :disabled="removeIds.length === 0"
          icon="delete"
          @click="handleDelete()"
        >
          删除
        </el-button>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column key="id" label="答题记录ID" prop="id" min-width="150" align="center" />
        <el-table-column
          key="recordId"
          label="测评记录ID"
          prop="recordId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="questionId"
          label="题目ID"
          prop="questionId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="optionId"
          label="选项ID（如为选择题）"
          prop="optionId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="answerText"
          label="主观题答案文本"
          prop="answerText"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="score"
          label="得分（按题计算）"
          prop="score"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="timeSpent"
          label="作答耗时（秒）"
          prop="timeSpent"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createBy"
          label="创建人"
          prop="createBy"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="updateBy"
          label="最后修改人"
          prop="updateBy"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createTime"
          label="答题时间"
          prop="createTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="updateTime"
          label="更新时间"
          prop="updateTime"
          min-width="150"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['psy:user-answer:edit']"
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleOpenDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPerm="['psy:user-answer:delete']"
              type="danger"
              size="small"
              link
              icon="delete"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery()"
      />
    </el-card>

    <!-- 用户答题记录表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="答题记录ID" prop="id">
          <el-input v-model="formData.id" placeholder="答题记录ID" />
        </el-form-item>

        <el-form-item label="测评记录ID" prop="recordId">
          <el-input v-model="formData.recordId" placeholder="测评记录ID" />
        </el-form-item>

        <el-form-item label="题目ID" prop="questionId">
          <el-input v-model="formData.questionId" placeholder="题目ID" />
        </el-form-item>

        <el-form-item label="选项ID（如为选择题）" prop="optionId">
          <el-input v-model="formData.optionId" placeholder="选项ID（如为选择题）" />
        </el-form-item>

        <el-form-item label="主观题答案文本" prop="answerText">
          <el-input v-model="formData.answerText" placeholder="主观题答案文本" />
        </el-form-item>

        <el-form-item label="得分（按题计算）" prop="score">
          <el-input v-model="formData.score" placeholder="得分（按题计算）" />
        </el-form-item>

        <el-form-item label="作答耗时（秒）" prop="timeSpent">
          <el-input v-model="formData.timeSpent" placeholder="作答耗时（秒）" />
        </el-form-item>

        <el-form-item label="创建人" prop="createBy">
          <el-input v-model="formData.createBy" placeholder="创建人" />
        </el-form-item>

        <el-form-item label="最后修改人" prop="updateBy">
          <el-input v-model="formData.updateBy" placeholder="最后修改人" />
        </el-form-item>

        <el-form-item label="答题时间" prop="createTime">
          <el-date-picker
            v-model="formData.createTime"
            type="datetime"
            placeholder="答题时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="更新时间" prop="updateTime">
          <el-date-picker
            v-model="formData.updateTime"
            type="datetime"
            placeholder="更新时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "UserAnswer",
  inheritAttrs: false,
});

import UserAnswerAPI, {
  UserAnswerPageVO,
  UserAnswerForm,
  UserAnswerPageQuery,
} from "@/api/psy/user-answer-api";

const queryFormRef = ref();
const dataFormRef = ref();

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<UserAnswerPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 用户答题记录表格数据
const pageData = ref<UserAnswerPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 用户答题记录表单数据
const formData = reactive<UserAnswerForm>({});

// 用户答题记录表单校验规则
const rules = reactive({
  id: [{ required: true, message: "请输入答题记录ID", trigger: "blur" }],
  recordId: [{ required: true, message: "请输入测评记录ID", trigger: "blur" }],
  questionId: [{ required: true, message: "请输入题目ID", trigger: "blur" }],
});

/** 查询用户答题记录 */
function handleQuery() {
  loading.value = true;
  UserAnswerAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置用户答题记录查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开用户答题记录弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改用户答题记录";
    UserAnswerAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增用户答题记录";
  }
}

/** 提交用户答题记录表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        UserAnswerAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserAnswerAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭用户答题记录弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除用户答题记录 */
function handleDelete(id?: number) {
  const ids = [id || removeIds.value].join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      UserAnswerAPI.deleteByIds(ids)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>
