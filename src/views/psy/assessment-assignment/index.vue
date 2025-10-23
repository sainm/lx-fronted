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
defineOptions({ name: "AssessmentAssignment" });

import AssessmentAssignmentAPI, {
  AssessmentAssignmentForm,
  AssessmentAssignmentPageQuery,
} from "@/api/psy/assessment-assignment-api";
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
  permPrefix: "psy:assessment-assignment",
  formItems: [
    {
      type: "input",
      label: "用户ID（单人分配）",
      prop: "userId",
      attrs: {
        placeholder: "用户ID（单人分配）",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "用户组ID（批量分配）",
      prop: "groupId",
      attrs: {
        placeholder: "用户组ID（批量分配）",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "分配类型：0个人 1组",
      prop: "assignType",
      attrs: {
        placeholder: "分配类型：0个人 1组",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "状态：0未开始 1进行中 2已完成 3已过期",
      prop: "status",
      attrs: {
        placeholder: "状态：0未开始 1进行中 2已完成 3已过期",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<AssessmentAssignmentPageQuery> = reactive({
  // 权限前缀
  permPrefix: "psy:assessment-assignment",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: AssessmentAssignmentAPI.getPage,
  // 删除接口
  deleteAction: AssessmentAssignmentAPI.deleteByIds,
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
    { label: "任务分配ID", prop: "id" },
    { label: "测评计划ID", prop: "planId" },
    { label: "用户ID（单人分配）", prop: "userId" },
    { label: "用户组ID（批量分配）", prop: "groupId" },
    { label: "分配类型：0个人 1组", prop: "assignType" },
    { label: "答题进度百分比", prop: "progress" },
    { label: "状态：0未开始 1进行中 2已完成 3已过期", prop: "status" },
    { label: "分配人ID", prop: "assignedBy" },
    { label: "创建时间", prop: "createTime" },
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
const addModalConfig: IModalConfig<AssessmentAssignmentForm> = reactive({
  // 权限前缀
  permPrefix: "psy:assessment-assignment",
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
        placeholder: "任务分配ID",
      },
      label: "任务分配ID",
      prop: "id",
    },
    {
      type: "input",
      attrs: {
        placeholder: "测评计划ID",
      },
      label: "测评计划ID",
      prop: "planId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "用户ID（单人分配）",
      },
      label: "用户ID（单人分配）",
      prop: "userId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "用户组ID（批量分配）",
      },
      label: "用户组ID（批量分配）",
      prop: "groupId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "分配类型：0个人 1组",
      },
      label: "分配类型：0个人 1组",
      prop: "assignType",
    },
    {
      type: "input",
      attrs: {
        placeholder: "答题进度百分比",
      },
      label: "答题进度百分比",
      prop: "progress",
    },
    {
      type: "switch",
      attrs: {
        activeText: "启用",
        inactiveText: "禁用",
        activeValue: 1,
        inactiveValue: 0,
      },
      initialValue: 1,
      label: "状态：0未开始 1进行中 2已完成 3已过期",
      prop: "status",
    },
    {
      type: "input",
      attrs: {
        placeholder: "分配人ID",
      },
      label: "分配人ID",
      prop: "assignedBy",
    },
    {
      type: "input",
      attrs: {
        placeholder: "创建人",
      },
      label: "创建人",
      prop: "createBy",
    },
  ],
  // 提交函数
  formAction: (data: AssessmentAssignmentForm) => {
    if (data.id) {
      // 编辑
      return AssessmentAssignmentAPI.update(data.id as string, data);
    } else {
      // 新增
      return AssessmentAssignmentAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<AssessmentAssignmentForm> = reactive({
  permPrefix: "psy:assessment-assignment",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return AssessmentAssignmentAPI.update(data.id as string, data);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await AssessmentAssignmentAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
