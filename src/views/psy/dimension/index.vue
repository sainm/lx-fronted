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
defineOptions({ name: "Dimension" });

import DimensionAPI, { DimensionForm, DimensionPageQuery } from "@/api/psy/dimension-api";
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
  permPrefix: "psy:dimension",
  formItems: [
    {
      type: "input",
      label: "维度名称，如焦虑、抑郁",
      prop: "name",
      attrs: {
        placeholder: "维度名称，如焦虑、抑郁",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<DimensionPageQuery> = reactive({
  // 权限前缀
  permPrefix: "psy:dimension",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: DimensionAPI.getPage,
  // 删除接口
  deleteAction: DimensionAPI.deleteByIds,
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
    { label: "维度名称，如焦虑、抑郁", prop: "name" },
    { label: "", prop: "description" },
    { label: "计分规则，如sum/average", prop: "scoreRule" },
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
const addModalConfig: IModalConfig<DimensionForm> = reactive({
  // 权限前缀
  permPrefix: "psy:dimension",
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
        placeholder: "",
      },
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
      label: "",
      prop: "id",
    },
    {
      type: "input",
      attrs: {
        placeholder: "所属量表ID",
      },
      rules: [{ required: true, message: "所属量表ID不能为空", trigger: "blur" }],
      label: "所属量表ID",
      prop: "scaleId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "维度名称，如焦虑、抑郁",
      },
      rules: [{ required: true, message: "维度名称，如焦虑、抑郁不能为空", trigger: "blur" }],
      label: "维度名称，如焦虑、抑郁",
      prop: "name",
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
        placeholder: "计分规则，如sum/average",
      },
      label: "计分规则，如sum/average",
      prop: "scoreRule",
    },
  ],
  // 提交函数
  formAction: (data: DimensionForm) => {
    if (data.id) {
      // 编辑
      return DimensionAPI.update(data.id as string, data);
    } else {
      // 新增
      return DimensionAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<DimensionForm> = reactive({
  permPrefix: "psy:dimension",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return DimensionAPI.update(data.id as string, data);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await DimensionAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
