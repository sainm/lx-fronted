<template>
  <div class="app-container h-full flex flex-1 flex-col">
    <!-- 搜索 -->
    <page-search
      ref="searchRef"
      :search-config="searchConfig"
      @query-click="handleQueryClick"
      @reset-click="handleResetClick"
    >
      <template #questionType="scope">
        <Dict v-model="scope.formData[scope.prop]" code="question_type" v-bind="scope.attrs" />
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
      <template #questionType="scope">
        <DictLabel v-model="scope.row[scope.prop]" code="question_type" />
      </template>
    </page-content>

    <!-- 新增 -->
    <page-modal ref="addModalRef" :modal-config="addModalConfig" @submit-click="handleSubmitClick">
      <template #questionType="scope">
        <Dict v-model="scope.formData[scope.prop]" code="question_type" v-bind="scope.attrs" />
      </template>
    </page-modal>

    <!-- 编辑 -->
    <page-modal
      ref="editModalRef"
      :modal-config="editModalConfig"
      @submit-click="handleSubmitClick"
    >
      <template #questionType="scope">
        <Dict v-model="scope.formData[scope.prop]" code="question_type" v-bind="scope.attrs" />
      </template>
    </page-modal>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "Question" });

import QuestionAPI, { QuestionForm, QuestionPageQuery } from "@/api/psy/question-api";
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
  permPrefix: "psy:question",
  formItems: [
    {
      type: "input",
      label: "",
      prop: "id",
      attrs: {
        placeholder: "",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "所属量表ID",
      prop: "scaleId",
      attrs: {
        placeholder: "所属量表ID",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "所属维度ID",
      prop: "dimensionId",
      attrs: {
        placeholder: "所属维度ID",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "题目内容",
      prop: "questionText",
      attrs: {
        placeholder: "题目内容",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "custom",
      slotName: "questionType",
      label: "题目类型: single/multiple/likert",
      prop: "questionType",
      attrs: {
        placeholder: "题目类型: single/multiple/likert",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "题目顺序",
      prop: "orderNo",
      attrs: {
        placeholder: "题目顺序",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<QuestionPageQuery> = reactive({
  // 权限前缀
  permPrefix: "psy:question",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: QuestionAPI.getPage,
  // 删除接口
  deleteAction: QuestionAPI.deleteByIds,
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
    { label: "所属维度ID", prop: "dimensionId" },
    { label: "题目内容", prop: "questionText" },
    {
      label: "题目类型: single/multiple/likert",
      prop: "questionType",
      templet: "custom",
      slotName: "questionType",
    },
    { label: "题目顺序", prop: "orderNo" },
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
const addModalConfig: IModalConfig<QuestionForm> = reactive({
  // 权限前缀
  permPrefix: "psy:question",
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
      label: "",
      prop: "id",
    },
    {
      type: "input",
      attrs: {
        placeholder: "所属量表ID",
      },
      label: "所属量表ID",
      prop: "scaleId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "所属维度ID",
      },
      label: "所属维度ID",
      prop: "dimensionId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "题目内容",
      },
      rules: [{ required: true, message: "题目内容不能为空", trigger: "blur" }],
      label: "题目内容",
      prop: "questionText",
    },
    {
      type: "custom",
      label: "题目类型: single/multiple/likert",
      prop: "questionType",
      slotName: "questionType",
      attrs: {
        placeholder: "题目类型: single/multiple/likert",
        style: { width: "100%" },
      },
      rules: [
        { required: true, message: "题目类型: single/multiple/likert不能为空", trigger: "change" },
      ],
    },
    {
      type: "input",
      attrs: {
        placeholder: "题目顺序",
      },
      label: "题目顺序",
      prop: "orderNo",
    },
  ],
  // 提交函数
  formAction: (data: QuestionForm) => {
    if (data.id) {
      // 编辑
      return QuestionAPI.update(data.id as string, data);
    } else {
      // 新增
      return QuestionAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<QuestionForm> = reactive({
  permPrefix: "psy:question",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return QuestionAPI.update(data.id as string, data);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await QuestionAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
