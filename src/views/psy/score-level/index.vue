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
          v-hasPerm="['psy:score-level:add']"
          type="success"
          icon="plus"
          @click="handleOpenDialog()"
        >
          新增
        </el-button>
        <el-button
          v-hasPerm="['psy:score-level:delete']"
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
        <el-table-column key="id" label="" prop="id" min-width="150" align="center" />
        <el-table-column
          key="ruleId"
          label="所属计分规则ID"
          prop="ruleId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="minScore"
          label="分数下限"
          prop="minScore"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="maxScore"
          label="分数上限"
          prop="maxScore"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="levelName"
          label="等级名称，如低、中、高"
          prop="levelName"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="description"
          label="等级说明"
          prop="description"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createBy"
          label="创建人ID"
          prop="createBy"
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
          key="updateBy"
          label="更新人ID"
          prop="updateBy"
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
        <el-table-column
          key="isDeleted"
          label="是否删除（0: 未删除, 1: 已删除）"
          prop="isDeleted"
          min-width="150"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              v-hasPerm="['psy:score-level:edit']"
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleOpenDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPerm="['psy:score-level:delete']"
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

    <!-- 分数区间对应等级描述表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="分数下限" prop="minScore">
          <el-input v-model="formData.minScore" placeholder="分数下限" />
        </el-form-item>

        <el-form-item label="分数上限" prop="maxScore">
          <el-input v-model="formData.maxScore" placeholder="分数上限" />
        </el-form-item>

        <el-form-item label="等级名称，如低、中、高" prop="levelName">
          <el-input v-model="formData.levelName" placeholder="等级名称，如低、中、高" />
        </el-form-item>

        <el-form-item label="等级说明" prop="description">
          <el-input v-model="formData.description" placeholder="等级说明" />
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
  name: "ScoreLevel",
  inheritAttrs: false,
});

import ScoreLevelAPI, {
  ScoreLevelPageVO,
  ScoreLevelForm,
  ScoreLevelPageQuery,
} from "@/api/psy/score-level-api";

const queryFormRef = ref();
const dataFormRef = ref();

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<ScoreLevelPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 分数区间对应等级描述表格数据
const pageData = ref<ScoreLevelPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 分数区间对应等级描述表单数据
const formData = reactive<ScoreLevelForm & { id?: number }>({});

// 分数区间对应等级描述表单校验规则
const rules = reactive({
  minScore: [{ required: true, message: "请输入分数下限", trigger: "blur" }],
  maxScore: [{ required: true, message: "请输入分数上限", trigger: "blur" }],
  levelName: [{ required: true, message: "请输入等级名称，如低、中、高", trigger: "blur" }],
});

/** 查询分数区间对应等级描述 */
function handleQuery() {
  loading.value = true;
  ScoreLevelAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置分数区间对应等级描述查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 打开分数区间对应等级描述弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改分数区间对应等级描述";
    ScoreLevelAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增分数区间对应等级描述";
  }
}

/** 提交分数区间对应等级描述表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        ScoreLevelAPI.update(String(id), formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        ScoreLevelAPI.create(formData)
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

/** 关闭分数区间对应等级描述弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除分数区间对应等级描述 */
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
      ScoreLevelAPI.deleteByIds(ids)
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
