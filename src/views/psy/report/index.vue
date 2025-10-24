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
          v-hasPerm="['psy:report:add']"
          type="success"
          icon="plus"
          @click="handleOpenDialog()"
        >
          新增
        </el-button>
        <el-button
          v-hasPerm="['psy:report:delete']"
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
        <el-table-column key="id" label="报告ID" prop="id" min-width="150" align="center" />
        <el-table-column
          key="recordId"
          label="测评记录ID"
          prop="recordId"
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
          key="totalScore"
          label="总分"
          prop="totalScore"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="resultLevel"
          label="结果等级（如低、中、高风险）"
          prop="resultLevel"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="resultJson"
          label="结果详情（维度分数、解释说明等）"
          prop="resultJson"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="suggestion"
          label="系统建议或干预建议"
          prop="suggestion"
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
          label="生成时间"
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
              v-hasPerm="['psy:report:edit']"
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleOpenDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPerm="['psy:report:delete']"
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

    <!-- 测评报告表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="报告ID" prop="id">
          <el-input v-model="formData.id" placeholder="报告ID" />
        </el-form-item>

        <el-form-item label="测评记录ID" prop="recordId">
          <el-input v-model="formData.recordId" placeholder="测评记录ID" />
        </el-form-item>

        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formData.userId" placeholder="用户ID" />
        </el-form-item>

        <el-form-item label="量表ID" prop="scaleId">
          <el-input v-model="formData.scaleId" placeholder="量表ID" />
        </el-form-item>

        <el-form-item label="总分" prop="totalScore">
          <el-input v-model="formData.totalScore" placeholder="总分" />
        </el-form-item>

        <el-form-item label="结果等级（如低、中、高风险）" prop="resultLevel">
          <el-input v-model="formData.resultLevel" placeholder="结果等级（如低、中、高风险）" />
        </el-form-item>

        <el-form-item label="结果详情（维度分数、解释说明等）" prop="resultJson">
          <el-input v-model="formData.resultJson" placeholder="结果详情（维度分数、解释说明等）" />
        </el-form-item>

        <el-form-item label="系统建议或干预建议" prop="suggestion">
          <el-input v-model="formData.suggestion" placeholder="系统建议或干预建议" />
        </el-form-item>

        <el-form-item label="创建人" prop="createBy">
          <el-input v-model="formData.createBy" placeholder="创建人" />
        </el-form-item>

        <el-form-item label="最后修改人" prop="updateBy">
          <el-input v-model="formData.updateBy" placeholder="最后修改人" />
        </el-form-item>

        <el-form-item label="生成时间" prop="createTime">
          <el-date-picker
            v-model="formData.createTime"
            type="datetime"
            placeholder="生成时间"
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
  name: "Report",
  inheritAttrs: false,
});

import ReportAPI, { ReportPageVO, ReportForm, ReportPageQuery } from "@/api/psy/report-api";

const queryFormRef = ref();
const dataFormRef = ref();

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<ReportPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 测评报告表格数据
const pageData = ref<ReportPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 测评报告表单数据
const formData = reactive<ReportForm>({});

// 测评报告表单校验规则
const rules = reactive({
  id: [{ required: true, message: "请输入报告ID", trigger: "blur" }],
  recordId: [{ required: true, message: "请输入测评记录ID", trigger: "blur" }],
  userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
  scaleId: [{ required: true, message: "请输入量表ID", trigger: "blur" }],
});

/** 查询测评报告 */
function handleQuery() {
  loading.value = true;
  ReportAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置测评报告查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开测评报告弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改测评报告";
    ReportAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增测评报告";
  }
}

/** 提交测评报告表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        ReportAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        ReportAPI.add(formData)
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

/** 关闭测评报告弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除测评报告 */
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
      ReportAPI.deleteByIds(ids)
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
