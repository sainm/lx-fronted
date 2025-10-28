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
    >
      <template #gender="scope">
        <DictLabel v-model="scope.row[scope.prop]" code="gender" />
      </template>
    </page-content>

    <!-- 新增 -->
    <page-modal ref="addModalRef" :modal-config="addModalConfig" @submit-click="handleSubmitClick">
      <template #gender="scope">
        <Dict v-model="scope.formData[scope.prop]" code="gender" v-bind="scope.attrs" />
      </template>
    </page-modal>

    <!-- 编辑 -->
    <page-modal
      ref="editModalRef"
      :modal-config="editModalConfig"
      @submit-click="handleSubmitClick"
    >
      <template #gender="scope">
        <Dict v-model="scope.formData[scope.prop]" code="gender" v-bind="scope.attrs" />
      </template>
    </page-modal>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "NormSample" });

import NormSampleAPI, { NormSampleForm, NormSamplePageQuery } from "@/api/psy/norm-sample-api";
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
  permPrefix: "psy:norm-sample",
  formItems: [],
});

// 列表配置
const contentConfig: IContentConfig<NormSamplePageQuery> = reactive({
  // 权限前缀
  permPrefix: "psy:norm-sample",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: NormSampleAPI.getPage,
  // 删除接口
  deleteAction: NormSampleAPI.deleteByIds,
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
    { type: "index", label: "序号", width: 60, align: "center" },
    { label: "常模样本ID", prop: "id", width: 120 },
    { label: "所属量表版本ID", prop: "versionId", width: 150 },
    {
      label: "常模名称（如：大学生样本、青少年女性样本）",
      prop: "sampleName",
      showOverflowTooltip: true,
    },
    {
      label: "性别（male/female/all）",
      prop: "gender",
      templet: "custom",
      slotName: "gender",
    },
    { label: "最小年龄", prop: "ageMin" },
    { label: "最大年龄", prop: "ageMax" },
    { label: "地区（可选）", prop: "region" },
    { label: "样本数量", prop: "sampleSize" },
    { label: "样本说明", prop: "description" },
    { label: "", prop: "createBy" },
    { label: "", prop: "updateBy" },
    { label: "", prop: "createTime" },
    { label: "", prop: "updateTime" },
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
const addModalConfig: IModalConfig<NormSampleForm> = reactive({
  // 权限前缀
  permPrefix: "psy:norm-sample",
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
        placeholder: "常模样本ID",
      },
      rules: [{ required: true, message: "常模样本ID不能为空", trigger: "blur" }],
      label: "常模样本ID",
      prop: "id",
    },
    {
      type: "input",
      attrs: {
        placeholder: "所属量表版本ID",
      },
      rules: [{ required: true, message: "所属量表版本ID不能为空", trigger: "blur" }],
      label: "所属量表版本ID",
      prop: "versionId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "常模名称（如：大学生样本、青少年女性样本）",
      },
      rules: [
        {
          required: true,
          message: "常模名称（如：大学生样本、青少年女性样本）不能为空",
          trigger: "blur",
        },
      ],
      label: "常模名称（如：大学生样本、青少年女性样本）",
      prop: "sampleName",
    },
    {
      type: "custom",
      label: "性别（male/female/all）",
      prop: "gender",
      slotName: "gender",
      attrs: {
        placeholder: "性别（male/female/all）",
        style: { width: "100%" },
      },
    },
    {
      type: "input",
      attrs: {
        placeholder: "最小年龄",
      },
      label: "最小年龄",
      prop: "ageMin",
    },
    {
      type: "input",
      attrs: {
        placeholder: "最大年龄",
      },
      label: "最大年龄",
      prop: "ageMax",
    },
    {
      type: "input",
      attrs: {
        placeholder: "地区（可选）",
      },
      label: "地区（可选）",
      prop: "region",
    },
    {
      type: "input",
      attrs: {
        placeholder: "样本数量",
      },
      label: "样本数量",
      prop: "sampleSize",
    },
    {
      type: "input",
      attrs: {
        placeholder: "样本说明",
      },
      label: "样本说明",
      prop: "description",
    },
    {
      type: "input",
      attrs: {
        placeholder: "",
      },
      label: "",
      prop: "createBy",
    },
    {
      type: "input",
      attrs: {
        placeholder: "",
      },
      label: "",
      prop: "updateBy",
    },
    {
      type: "input",
      attrs: {
        placeholder: "",
      },
      label: "",
      prop: "createTime",
    },
    {
      type: "input",
      attrs: {
        placeholder: "",
      },
      label: "",
      prop: "updateTime",
    },
  ],
  // 提交函数
  formAction: (data: NormSampleForm) => {
    if (data.id) {
      // 编辑
      return NormSampleAPI.update(String(data.id), data);
    } else {
      // 新增
      return NormSampleAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<NormSampleForm> = reactive({
  permPrefix: "psy:norm-sample",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return NormSampleAPI.update(data.id as string, data);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await NormSampleAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
