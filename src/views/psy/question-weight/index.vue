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
defineOptions({ name: "QuestionWeight" });

import QuestionWeightAPI, {
  QuestionWeightForm,
  QuestionWeightPageQuery,
} from "@/api/psy/question-weight-api";
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
  permPrefix: "psy:question-weight",
  formItems: [],
});

// 列表配置
const contentConfig: IContentConfig<QuestionWeightPageQuery> = reactive({
  // 权限前缀
  permPrefix: "psy:question-weight",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: QuestionWeightAPI.getPage,
  // 删除接口
  deleteAction: QuestionWeightAPI.deleteByIds,
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
    { label: "所属计分规则ID", prop: "ruleId" },
    { label: "题目ID", prop: "questionId" },
    { label: "题目权重", prop: "weight" },
    { label: "创建人ID", prop: "createBy" },
    { label: "创建时间", prop: "createTime" },
    { label: "更新人ID", prop: "updateBy" },
    { label: "更新时间", prop: "updateTime" },
    { label: "是否删除（0: 未删除, 1: 已删除）", prop: "isDeleted" },
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
const addModalConfig: IModalConfig<QuestionWeightForm> = reactive({
  // 权限前缀
  permPrefix: "psy:question-weight",
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
        placeholder: "所属计分规则ID",
      },
      label: "所属计分规则ID",
      prop: "ruleId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "题目ID",
      },
      label: "题目ID",
      prop: "questionId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "题目权重",
      },
      rules: [{ required: true, message: "题目权重不能为空", trigger: "blur" }],
      label: "题目权重",
      prop: "weight",
    },
    {
      type: "input",
      attrs: {
        placeholder: "创建人ID",
      },
      label: "创建人ID",
      prop: "createBy",
    },
    {
      type: "input",
      attrs: {
        placeholder: "创建时间",
      },
      label: "创建时间",
      prop: "createTime",
    },
    {
      type: "input",
      attrs: {
        placeholder: "更新人ID",
      },
      label: "更新人ID",
      prop: "updateBy",
    },
    {
      type: "input",
      attrs: {
        placeholder: "更新时间",
      },
      label: "更新时间",
      prop: "updateTime",
    },
    {
      type: "input",
      attrs: {
        placeholder: "是否删除（0: 未删除, 1: 已删除）",
      },
      label: "是否删除（0: 未删除, 1: 已删除）",
      prop: "isDeleted",
    },
  ],
  // 提交函数
  formAction: (data: QuestionWeightForm) => {
    if (data.id) {
      // 编辑
      return QuestionWeightAPI.update(data.id as string, data);
    } else {
      // 新增
      return QuestionWeightAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<QuestionWeightForm> = reactive({
  permPrefix: "psy:question-weight",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return QuestionWeightAPI.update(data.id as string, data);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await QuestionWeightAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
