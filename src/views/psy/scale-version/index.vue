<template>
  <div class="app-container h-full flex flex-1 flex-col">
    <!-- 搜索 -->
    <page-search
      ref="searchRef"
      :search-config="searchConfig"
      @query-click="handleQueryClick"
      @reset-click="handleResetClick"
    ></page-search>

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
    ></page-content>

    <!-- 新增 -->
    <page-modal
      ref="addModalRef"
      :modal-config="addModalConfig"
      @submit-click="handleSubmitClick"
    ></page-modal>

    <!-- 编辑 -->
    <page-modal
      ref="editModalRef"
      :modal-config="editModalConfig"
      @submit-click="handleSubmitClick"
    ></page-modal>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "ScaleVersion" });

import ScaleVersionAPI, {
  ScaleVersionForm,
  ScaleVersionPageQuery,
} from "@/api/psy/scale-version-api";
import type { IObject, IModalConfig, IContentConfig, ISearchConfig } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";

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

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "psy:scale-version",
  formItems: [
    {
      type: "input",
      label: "版本名称，如v1.0",
      prop: "versionName",
      attrs: {
        placeholder: "版本名称，如v1.0",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<ScaleVersionPageQuery> = reactive({
  // 权限前缀
  permPrefix: "psy:scale-version",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: ScaleVersionAPI.getPage,
  // 删除接口
  deleteAction: ScaleVersionAPI.deleteByIds,
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
  toolbar: ["add", "delete"],
  defaultToolbar: ["refresh", "filter"],
  // 表格列配置
  cols: [
    { type: "selection", width: 55, align: "center" },
    { label: "", prop: "id" },
    { label: "所属量表ID", prop: "scaleId" },
    { label: "版本名称，如v1.0", prop: "versionName" },
    { label: "", prop: "description" },
    { label: "是否启用", prop: "isActive" },
    { label: "创建人ID", prop: "createBy" },
    { label: "创建时间", prop: "createTime" },
    { label: "更新人ID", prop: "updateBy" },
    { label: "更新时间", prop: "updateTime" },
    {
      label: "操作",
      prop: "operation",
      width: 220,
      templet: "tool",
      operat: ["edit", "delete"],
    },
  ],
});

// 新增配置
const addModalConfig: IModalConfig<ScaleVersionForm> = reactive({
  // 权限前缀
  permPrefix: "psy:scale-version",
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
    {
      type: "input",
      attrs: {
        placeholder: "版本名称，如v1.0",
      },
      rules: [{ required: true, message: "版本名称，如v1.0不能为空", trigger: "blur" }],
      label: "版本名称，如v1.0",
      prop: "versionName",
    },
    {
      type: "input",
      attrs: {
        placeholder: "",
      },
      label: "",
      prop: "description",
    },
    {
      type: "input",
      attrs: {
        placeholder: "是否启用",
      },
      label: "是否启用",
      prop: "isActive",
    },
  ],
  // 提交函数
  formAction: (data: ScaleVersionForm) => {
    if (data.id) {
      // 编辑
      return ScaleVersionAPI.update(data.id as string, data);
    } else {
      // 新增
      return ScaleVersionAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<ScaleVersionForm> = reactive({
  permPrefix: "psy:scale-version",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return ScaleVersionAPI.update(data.id as string, data);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await ScaleVersionAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
