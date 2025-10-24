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
defineOptions({ name: "AssessmentPlan" });

import AssessmentPlanAPI, {
  AssessmentPlanForm,
  AssessmentPlanPageQuery,
} from "@/api/psy/assessment-plan-api";
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
  permPrefix: "psy:assessment-plan",
  formItems: [
    {
      type: "input",
      label: "测评计划名称",
      prop: "name",
      attrs: {
        placeholder: "测评计划名称",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "目标群体（标签或分组描述）",
      prop: "targetGroup",
      attrs: {
        placeholder: "目标群体（标签或分组描述）",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "开始时间",
      prop: "startTime",
      attrs: {
        placeholder: "开始时间",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "结束时间",
      prop: "endTime",
      attrs: {
        placeholder: "结束时间",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "状态：1启用 0停用",
      prop: "status",
      attrs: {
        placeholder: "状态：1启用 0停用",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<AssessmentPlanPageQuery> = reactive({
  // 权限前缀
  permPrefix: "psy:assessment-plan",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: AssessmentPlanAPI.getPage,
  // 删除接口
  deleteAction: AssessmentPlanAPI.deleteByIds,
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
    { label: "测评计划ID", prop: "id" },
    { label: "测评计划名称", prop: "name" },
    { label: "测评计划说明", prop: "description" },
    { label: "量表ID", prop: "scaleId" },
    { label: "量表版本ID", prop: "versionId" },
    { label: "目标群体（标签或分组描述）", prop: "targetGroup" },
    { label: "开始时间", prop: "startTime" },
    { label: "结束时间", prop: "endTime" },
    { label: "创建人ID", prop: "creatorId" },
    { label: "状态：1启用 0停用", prop: "status" },
    { label: "创建人", prop: "createBy" },
    { label: "最后修改人", prop: "updateBy" },
    { label: "创建时间", prop: "createTime" },
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
const addModalConfig: IModalConfig<AssessmentPlanForm> = reactive({
  // 权限前缀
  permPrefix: "psy:assessment-plan",
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
        placeholder: "测评计划ID",
      },
      rules: [{ required: true, message: "测评计划ID不能为空", trigger: "blur" }],
      label: "测评计划ID",
      prop: "id",
    },
    {
      type: "input",
      attrs: {
        placeholder: "测评计划名称",
      },
      rules: [{ required: true, message: "测评计划名称不能为空", trigger: "blur" }],
      label: "测评计划名称",
      prop: "name",
    },
    {
      type: "input",
      attrs: {
        placeholder: "测评计划说明",
      },
      label: "测评计划说明",
      prop: "description",
    },
    {
      type: "input",
      attrs: {
        placeholder: "量表ID",
      },
      rules: [{ required: true, message: "量表ID不能为空", trigger: "blur" }],
      label: "量表ID",
      prop: "scaleId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "量表版本ID",
      },
      label: "量表版本ID",
      prop: "versionId",
    },
    {
      type: "input",
      attrs: {
        placeholder: "目标群体（标签或分组描述）",
      },
      label: "目标群体（标签或分组描述）",
      prop: "targetGroup",
    },
    {
      type: "input",
      attrs: {
        placeholder: "开始时间",
      },
      rules: [{ required: true, message: "开始时间不能为空", trigger: "blur" }],
      label: "开始时间",
      prop: "startTime",
    },
    {
      type: "input",
      attrs: {
        placeholder: "结束时间",
      },
      label: "结束时间",
      prop: "endTime",
    },
    {
      type: "input",
      attrs: {
        placeholder: "创建人ID",
      },
      rules: [{ required: true, message: "创建人ID不能为空", trigger: "blur" }],
      label: "创建人ID",
      prop: "creatorId",
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
      label: "状态：1启用 0停用",
      prop: "status",
    },
    {
      type: "input",
      attrs: {
        placeholder: "创建人",
      },
      label: "创建人",
      prop: "createBy",
    },
    {
      type: "input",
      attrs: {
        placeholder: "最后修改人",
      },
      label: "最后修改人",
      prop: "updateBy",
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
        placeholder: "更新时间",
      },
      label: "更新时间",
      prop: "updateTime",
    },
  ],
  // 提交函数
  formAction: (data: AssessmentPlanForm) => {
    if (data.id) {
      // 编辑
      return AssessmentPlanAPI.update(data.id as string, data);
    } else {
      // 新增
      return AssessmentPlanAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<AssessmentPlanForm> = reactive({
  permPrefix: "psy:assessment-plan",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return AssessmentPlanAPI.update(data.id as string, data);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await AssessmentPlanAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
