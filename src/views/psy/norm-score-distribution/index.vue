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
defineOptions({ name: "NormScoreDistribution" });

import NormScoreDistributionAPI, {
  NormScoreDistributionForm,
  NormScoreDistributionPageQuery,
} from "@/api/psy/norm-score-distribution-api";
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
  permPrefix: "psy:norm-score-distribution",
  formItems: [],
});

// 列表配置
const contentConfig: IContentConfig<NormScoreDistributionPageQuery> = reactive({
  // 权限前缀
  permPrefix: "psy:norm-score-distribution",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: NormScoreDistributionAPI.getPage,
  // 删除接口
  deleteAction: NormScoreDistributionAPI.deleteByIds,
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
    { label: "常模分布ID", prop: "id" },
    { label: "常模样本ID", prop: "sampleId" },
    { label: "维度ID（如有分维度常模）", prop: "dimensionId" },
    { label: "原始分", prop: "rawScore" },
    { label: "百分位（0~100）", prop: "percentile" },
    { label: "T分（均值50，标准差10）", prop: "tScore" },
    { label: "Z分（均值0，标准差1）", prop: "zScore" },
    { label: "九分位（1~9）", prop: "stanine" },
    { label: "备注（如转换公式或来源）", prop: "description" },
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
const addModalConfig: IModalConfig<NormScoreDistributionForm> = reactive({
  // 权限前缀
  permPrefix: "psy:norm-score-distribution",
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
        placeholder: "常模分布ID",
      },
      label: "常模分布ID",
      prop: "id",
    },
    {
      type: "input",
      attrs: {
        placeholder: "常模样本ID",
      },
      rules: [{ required: true, message: "常模样本ID不能为空", trigger: "blur" }],
      label: "常模样本ID",
      prop: "sampleId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "维度ID（如有分维度常模）",
      },
      rules: [{ required: true, message: "维度ID（如有分维度常模）不能为空", trigger: "blur" }],
      label: "维度ID（如有分维度常模）",
      prop: "dimensionId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "原始分",
      },
      rules: [{ required: true, message: "原始分不能为空", trigger: "blur" }],
      label: "原始分",
      prop: "rawScore",
    },
    {
      type: "input",
      attrs: {
        placeholder: "百分位（0~100）",
      },
      label: "百分位（0~100）",
      prop: "percentile",
    },
    {
      type: "input",
      attrs: {
        placeholder: "T分（均值50，标准差10）",
      },
      label: "T分（均值50，标准差10）",
      prop: "tScore",
    },
    {
      type: "input",
      attrs: {
        placeholder: "Z分（均值0，标准差1）",
      },
      label: "Z分（均值0，标准差1）",
      prop: "zScore",
    },
    {
      type: "input",
      attrs: {
        placeholder: "九分位（1~9）",
      },
      label: "九分位（1~9）",
      prop: "stanine",
    },
    {
      type: "input",
      attrs: {
        placeholder: "备注（如转换公式或来源）",
      },
      label: "备注（如转换公式或来源）",
      prop: "description",
    },
  ],
  // 提交函数
  formAction: (data: NormScoreDistributionForm) => {
    if (data.id) {
      // 编辑
      return NormScoreDistributionAPI.update(data.id as string, data);
    } else {
      // 新增
      return NormScoreDistributionAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<NormScoreDistributionForm> = reactive({
  permPrefix: "psy:norm-score-distribution",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return NormScoreDistributionAPI.update(data.id as string, data);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await NormScoreDistributionAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
