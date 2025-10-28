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
          v-hasPerm="['psy:warning:add']"
          type="success"
          icon="plus"
          @click="handleOpenDialog()"
        >
          新增
        </el-button>
        <el-button
          v-hasPerm="['psy:warning:delete']"
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
        <el-table-column key="id" label="预警ID" prop="id" min-width="150" align="center" />
        <el-table-column key="userId" label="用户ID" prop="userId" min-width="150" align="center" />
        <el-table-column
          key="recordId"
          label="关联测评记录ID"
          prop="recordId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="warningType"
          label="预警类型（如高危、异常、极端答题）"
          prop="warningType"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="level"
          label="预警等级：1一般 2严重 3紧急"
          prop="level"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="triggerRule"
          label="触发规则标识（如规则编号）"
          prop="triggerRule"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="description"
          label="详细说明"
          prop="description"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="isResolved"
          label="是否已处理：0未处理 1已处理"
          prop="isResolved"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="handlerId"
          label="处理人ID"
          prop="handlerId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="handleTime"
          label="处理时间"
          prop="handleTime"
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
              v-hasPerm="['psy:warning:edit']"
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleOpenDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPerm="['psy:warning:delete']"
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

    <!-- 测评预警记录表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="预警ID" prop="id">
          <el-input v-model="formData.id" placeholder="预警ID" />
        </el-form-item>

        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formData.userId" placeholder="用户ID" />
        </el-form-item>

        <el-form-item label="关联测评记录ID" prop="recordId">
          <el-input v-model="formData.recordId" placeholder="关联测评记录ID" />
        </el-form-item>

        <el-form-item label="预警类型（如高危、异常、极端答题）" prop="warningType">
          <el-input
            v-model="formData.warningType"
            placeholder="预警类型（如高危、异常、极端答题）"
          />
        </el-form-item>

        <el-form-item label="预警等级：1一般 2严重 3紧急" prop="level">
          <el-input v-model="formData.level" placeholder="预警等级：1一般 2严重 3紧急" />
        </el-form-item>

        <el-form-item label="触发规则标识（如规则编号）" prop="triggerRule">
          <el-input v-model="formData.triggerRule" placeholder="触发规则标识（如规则编号）" />
        </el-form-item>

        <el-form-item label="详细说明" prop="description">
          <el-input v-model="formData.description" placeholder="详细说明" />
        </el-form-item>

        <el-form-item label="是否已处理：0未处理 1已处理" prop="isResolved">
          <el-input v-model="formData.isResolved" placeholder="是否已处理：0未处理 1已处理" />
        </el-form-item>

        <el-form-item label="处理人ID" prop="handlerId">
          <el-input v-model="formData.handlerId" placeholder="处理人ID" />
        </el-form-item>

        <el-form-item label="处理时间" prop="handleTime">
          <el-date-picker
            v-model="formData.handleTime"
            type="datetime"
            placeholder="处理时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
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
  name: "Warning",
  inheritAttrs: false,
});

import WarningAPI, { WarningPageVO, WarningForm, WarningPageQuery } from "@/api/report/warning-api";

const queryFormRef = ref();
const dataFormRef = ref();

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<WarningPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 测评预警记录表格数据
const pageData = ref<WarningPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 测评预警记录表单数据
const formData = reactive<WarningForm>({});

// 测评预警记录表单校验规则
const rules = reactive({});

/** 查询测评预警记录 */
function handleQuery() {
  loading.value = true;
  WarningAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置测评预警记录查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开测评预警记录弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改测评预警记录";
    WarningAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增测评预警记录";
  }
}

/** 提交测评预警记录表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        WarningAPI.update(String(id), formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        WarningAPI.create(formData)
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

/** 关闭测评预警记录弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除测评预警记录 */
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
      WarningAPI.deleteByIds(ids)
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
