<template>
  <div class="app-container h-full flex flex-1 flex-col">
    <!-- 搜索 -->
    <page-search
      ref="searchRef"
      :search-config="searchConfig"
      @query-click="handleQueryClick"
      @reset-click="handleResetClick"
    >
      <template #applicableGender="scope">
        <Dict v-model="scope.formData[scope.prop]" code="gender" v-bind="scope.attrs" />
      </template>
    </page-search>

    <!-- 列表 -->
    <page-content
      ref="contentRef"
      :content-config="contentConfig"
      @add-click="handleAddClick"
      @export-click="handleExportClick"
      @search-click="handleSearchClick"
      @toolbar-click="handleToolbarClick"
      @operate-click="handleOperateClick"
      @filter-change="handleFilterChange"
    >
      <template #applicableGender="scope">
        <DictLabel v-model="scope.row[scope.prop]" code="gender" />
      </template>
    </page-content>

    <!-- 新增 -->
    <page-modal ref="addModalRef" :modal-config="addModalConfig" @submit-click="handleSubmitClick">
      <template #applicableGender="scope">
        <Dict v-model="scope.formData[scope.prop]" code="gender" v-bind="scope.attrs" />
      </template>
    </page-modal>

    <!-- 编辑 -->
    <page-modal
      ref="editModalRef"
      :modal-config="editModalConfig"
      @submit-click="handleSubmitClick"
    >
      <template #applicableGender="scope">
        <Dict v-model="scope.formData[scope.prop]" code="gender" v-bind="scope.attrs" />
      </template>
    </page-modal>

    <!-- 查看量表版本弹窗 -->
    <el-dialog
      v-model="versionDialogVisible"
      :width="isMaximized ? '100%' : '75%'"
      :top="isMaximized ? '0' : '3vh'"
      :fullscreen="isMaximized"
      draggable
      destroy-on-close
      @closed="isMaximized = false"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <span class="text-base font-medium">量表版本 - {{ currentScaleName }}</span>
          <el-button
            :icon="isMaximized ? 'ScaleToOriginal' : 'FullScreen'"
            :title="isMaximized ? '恢复' : '最大化'"
            circle
            type="primary"
            text
            @click="toggleMaximize"
          />
        </div>
      </template>
      <ScaleVersion v-if="versionDialogVisible" :scale-id="currentScaleId" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "Scale" });

import ScaleAPI, { ScaleForm, ScalePageQuery } from "@/api/psy/scale-api";
import type { IObject, IModalConfig, IContentConfig, ISearchConfig } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";
import ScaleVersion from "@/views/psy/scale-version/index.vue";

// 组合式 CRUD
const {
  searchRef,
  contentRef,
  addModalRef,
  editModalRef,
  handleQueryClick,
  handleResetClick,
  handleAddClick,
  handleEditClick,
  handleSubmitClick,
  handleExportClick,
  handleSearchClick,
  handleFilterChange,
} = usePage();

// 量表版本弹窗控制
const versionDialogVisible = ref(false);
const currentScaleId = ref<number | string | undefined>();
const currentScaleName = ref("");
const isMaximized = ref(false);

// 切换最大化状态
const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;
};

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "psy:scale",
  formItems: [
    {
      type: "input",
      label: "量表名称",
      prop: "name",
      attrs: {
        placeholder: "量表名称",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "编码",
      prop: "code",
      attrs: {
        placeholder: "编码",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "custom",
      slotName: "applicableGender",
      label: "适用性别",
      prop: "applicableGender",
      attrs: {
        placeholder: "适用性别",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<ScalePageQuery> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: ScaleAPI.getPage,
  // 删除接口
  deleteAction: ScaleAPI.deleteByIds,
  // 数据解析函数
  parseData(res: any) {
    return {
      total: res.total,
      list: res.list,
    };
  },
  // 分页配置
  pagination: {
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    pageSize: 20,
    pageSizes: [10, 20, 30, 50],
  },
  // 工具栏配置
  toolbar: [
    { name: "add", text: "新增", attrs: { icon: "plus", type: "success" }, perm: "*:*:*" },
    { name: "delete", text: "删除", attrs: { icon: "delete", type: "danger" }, perm: "*:*:*" },
  ],
  defaultToolbar: ["refresh", "filter"],
  // 表格列配置
  cols: [
    { type: "selection", width: 55, align: "center" },
    { type: "index", label: "序号", width: 60, align: "center" },
    { label: "量表名称", prop: "name", showOverflowTooltip: true },
    { label: "编码", prop: "code", width: 120 },
    { label: "量表说明", prop: "description", showOverflowTooltip: true },
    { label: "适用年龄段", prop: "applicableAge", width: 120 },
    {
      label: "适用性别",
      prop: "applicableGender",
      width: 100,
      templet: "custom",
      slotName: "applicableGender",
    },
    {
      label: "操作",
      prop: "operation",
      width: 280,
      templet: "tool",
      operat: [
        {
          name: "view",
          text: "版本查看",
          attrs: { icon: "view", type: "primary", link: true, size: "small" },
          perm: "*:*:*", // 不需要权限检查
        },
        {
          name: "edit",
          text: "编辑",
          attrs: { icon: "edit", type: "primary", link: true, size: "small" },
          perm: "*:*:*",
        },
        {
          name: "delete",
          text: "删除",
          attrs: { icon: "delete", type: "danger", link: true, size: "small" },
          perm: "*:*:*",
        },
      ],
    },
  ],
});

// 新增配置
const addModalConfig: IModalConfig<ScaleForm> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
  // 主键
  pk: "id",
  // 弹窗配置
  dialog: {
    title: "新增",
    width: 800,
    draggable: true,
  },
  form: {
    labelWidth: 100,
  },
  // 表单项配置
  formItems: [
    // {
    //   type: "input",
    //   attrs: {
    //     placeholder: "",
    //   },
    //   label: "",
    //   prop: "id",
    // },
    {
      type: "input",
      attrs: {
        placeholder: "量表名称",
      },
      rules: [{ required: true, message: "量表名称不能为空", trigger: "blur" }],
      label: "量表名称",
      prop: "name",
    },
    {
      type: "input",
      attrs: {
        placeholder: "编码",
      },
      rules: [{ required: true, message: "量表唯一编码不能为空", trigger: "blur" }],
      label: "编码",
      prop: "code",
    },
    {
      type: "input",
      attrs: {
        placeholder: "说明",
      },
      label: "说明",
      prop: "description",
    },
    {
      type: "input",
      attrs: {
        placeholder: "适用年龄段",
      },
      label: "适用年龄段",
      prop: "applicableAge",
    },
    {
      type: "custom",
      label: "适用性别",
      prop: "applicableGender",
      slotName: "applicableGender",
      attrs: {
        placeholder: "适用性别",
        style: { width: "100%" },
      },
    },
  ],
  // 提交函数
  formAction: (data: ScaleForm) => {
    if (data.id) {
      // 编辑
      return ScaleAPI.update(String(data.id), data);
    } else {
      // 新增
      return ScaleAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<ScaleForm> = reactive({
  permPrefix: "*:*:*",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return ScaleAPI.update(String(data.id), data);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await ScaleAPI.getFormData(data.row.id);
    });
  } else if (data.name === "view") {
    // 打开量表版本弹窗
    console.log("点击查看按钮，完整数据:", data.row);
    currentScaleId.value = data.row.id;
    currentScaleName.value = data.row.name || "";
    console.log(
      "打开版本弹窗, scaleId:",
      currentScaleId.value,
      "scaleName:",
      currentScaleName.value
    );
    if (!currentScaleId.value) {
      ElMessage.error("无法获取量表ID");
      return;
    }
    versionDialogVisible.value = true;
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
