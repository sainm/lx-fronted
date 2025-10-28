<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="任务分配ID" prop="assignmentId">
          <el-input
            v-model="queryParams.assignmentId"
            placeholder="任务分配ID"
            clearable
            @keyup.enter="handleQuery()"
          />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="用户ID"
            clearable
            @keyup.enter="handleQuery()"
          />
        </el-form-item>
        <el-form-item label="量表ID" prop="scaleId">
          <el-input
            v-model="queryParams.scaleId"
            placeholder="量表ID"
            clearable
            @keyup.enter="handleQuery()"
          />
        </el-form-item>
        <el-form-item class="search-buttons">
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button
          v-hasPerm="['psy:assessment-record:add']"
          type="success"
          icon="plus"
          @click="handleOpenDialog()"
        >
          新增
        </el-button>
        <el-button
          v-hasPerm="['psy:assessment-record:delete']"
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
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column key="id" label="测评记录ID" prop="id" min-width="150" align="center" />
        <el-table-column
          key="assignmentId"
          label="任务分配ID"
          prop="assignmentId"
          min-width="150"
          align="center"
        />
        <el-table-column key="userId" label="用户ID" prop="userId" min-width="150" align="center" />
        <el-table-column
          key="scaleId"
          label="量表ID"
          prop="scaleId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="versionId"
          label="量表版本ID"
          prop="versionId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="startTime"
          label="答题开始时间"
          prop="startTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="finishTime"
          label="答题完成时间"
          prop="finishTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="totalScore"
          label="总得分"
          prop="totalScore"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="completionRate"
          label="完成率"
          prop="completionRate"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="status"
          label="状态：0未完成 1已完成 2中断"
          prop="status"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="durationSecond"
          label="作答时长（秒）"
          prop="durationSecond"
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
          label="创建时间"
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
              v-hasPerm="['psy:assessment-record:edit']"
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleOpenDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPerm="['psy:assessment-record:delete']"
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

    <!-- 测评记录表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="测评记录ID" prop="id">
          <el-input v-model="formData.id" placeholder="测评记录ID" />
        </el-form-item>

        <el-form-item label="任务分配ID" prop="assignmentId">
          <el-input v-model="formData.assignmentId" placeholder="任务分配ID" />
        </el-form-item>

        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formData.userId" placeholder="用户ID" />
        </el-form-item>

        <el-form-item label="量表ID" prop="scaleId">
          <el-input v-model="formData.scaleId" placeholder="量表ID" />
        </el-form-item>

        <el-form-item label="量表版本ID" prop="versionId">
          <el-input v-model="formData.versionId" placeholder="量表版本ID" />
        </el-form-item>

        <el-form-item label="答题开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="答题开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="答题完成时间" prop="finishTime">
          <el-date-picker
            v-model="formData.finishTime"
            type="datetime"
            placeholder="答题完成时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="总得分" prop="totalScore">
          <el-input v-model="formData.totalScore" placeholder="总得分" />
        </el-form-item>

        <el-form-item label="完成率" prop="completionRate">
          <el-input v-model="formData.completionRate" placeholder="完成率" />
        </el-form-item>

        <el-form-item label="状态：0未完成 1已完成 2中断" prop="status">
          <el-input v-model="formData.status" placeholder="状态：0未完成 1已完成 2中断" />
        </el-form-item>

        <el-form-item label="作答时长（秒）" prop="durationSecond">
          <el-input v-model="formData.durationSecond" placeholder="作答时长（秒）" />
        </el-form-item>

        <el-form-item label="创建人" prop="createBy">
          <el-input v-model="formData.createBy" placeholder="创建人" />
        </el-form-item>

        <el-form-item label="最后修改人" prop="updateBy">
          <el-input v-model="formData.updateBy" placeholder="最后修改人" />
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="formData.createTime"
            type="datetime"
            placeholder="创建时间"
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
  name: "AssessmentRecord",
  inheritAttrs: false,
});

import AssessmentRecordAPI, {
  AssessmentRecordPageVO,
  AssessmentRecordForm,
  AssessmentRecordPageQuery,
} from "@/api/psy/assessment-record-api";

const queryFormRef = ref();
const dataFormRef = ref();

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<AssessmentRecordPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 测评记录表格数据
const pageData = ref<AssessmentRecordPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 测评记录表单数据
const formData = reactive<AssessmentRecordForm>({});

// 测评记录表单校验规则
const rules = reactive({
  id: [{ required: true, message: "请输入测评记录ID", trigger: "blur" }],
  assignmentId: [{ required: true, message: "请输入任务分配ID", trigger: "blur" }],
  userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
  scaleId: [{ required: true, message: "请输入量表ID", trigger: "blur" }],
});

/** 查询测评记录 */
function handleQuery() {
  loading.value = true;
  AssessmentRecordAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置测评记录查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开测评记录弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改测评记录";
    AssessmentRecordAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增测评记录";
  }
}

/** 提交测评记录表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        AssessmentRecordAPI.update(String(id), formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        AssessmentRecordAPI.create(formData)
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

/** 关闭测评记录弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除测评记录 */
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
      AssessmentRecordAPI.deleteByIds(ids)
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
