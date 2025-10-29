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
} from "@/api/psym/assessment-assignment-api";
import AssessmentPlanAPI from "@/api/psym/assessment-plan-api";
import UserAPI from "@/api/system/user-api";
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

// 用户选项列表
const userOptions = ref<{ label: string; value: string }[]>([]);

// 测评计划选项列表
const planOptions = ref<{ label: string; value: number }[]>([]);

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "psym:assessment-assignment",
  formItems: [
    {
      type: "input",
      label: "测评计划ID",
      prop: "planId",
      attrs: {
        placeholder: "测评计划ID",
        clearable: true,
        style: { width: "200px" },
      },
    },
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
      label: "状态",
      prop: "status",
      attrs: {
        placeholder: "",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<AssessmentAssignmentPageQuery> = reactive({
  // 权限前缀
  permPrefix: "psym:assessment-assignment",
  table: {
    border: true,
    highlightCurrentRow: true,
    width: "100%",
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
    { type: "index", label: "序号", width: 60, align: "center" },
    // { label: "任务分配ID", prop: "id" },
    {
      label: "测评计划",
      prop: "planId",
      minWidth: 200,
      formatter: (row: any) => {
        const plan = planOptions.value.find((p) => p.value === row.planId);
        return plan ? plan.label : row.planId;
      },
    },
    {
      label: "用户",
      prop: "userId",
      width: 180,
      formatter: (row: any) => {
        const user = userOptions.value.find((u) => u.value === row.userId);
        return user ? user.label : row.userId || "-";
      },
    },
    { label: "用户组", prop: "groupId", width: 120 },
    {
      label: "分配类型",
      prop: "assignType",
      width: 100,
      align: "center",
      templet: "list",
      selectList: {
        0: "个人",
        1: "组",
      },
    },
    // { label: "答题进度百分比", prop: "progress" },
    {
      label: "状态",
      prop: "status",
      width: 100,
      align: "center",
      templet: "list",
      selectList: {
        0: "未开始",
        1: "进行中",
        2: "已完成",
        3: "已过期",
      },
    },
    { label: "分配人", prop: "assignedByName", width: 120 },
    {
      label: "操作",
      prop: "operation",
      width: 150,
      fixed: "right",
      templet: "tool",
      operat: [
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
const addModalConfig: IModalConfig<AssessmentAssignmentForm> = reactive({
  // 权限前缀
  permPrefix: "psym:assessment-assignment",
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
    //     placeholder: "任务分配ID",
    //   },
    //   label: "任务分配ID",
    //   prop: "id",
    // },
    {
      type: "select",
      attrs: {
        placeholder: "请选择测评计划",
        clearable: true,
        filterable: true,
      },
      label: "测评计划",
      prop: "planId",
      options: planOptions,
    },
    {
      type: "select",
      attrs: {
        placeholder: "请选择用户",
        clearable: true,
        filterable: true,
      },
      label: "用户",
      prop: "userId",
      options: userOptions,
    },
    {
      type: "input",
      attrs: {
        placeholder: "用户组",
      },
      label: "用户组",
      prop: "groupId",
    },
    {
      type: "select",
      attrs: {
        placeholder: "请选择分配类型",
      },
      label: "分配类型",
      prop: "assignType",
      options: [
        { label: "个人", value: 0 },
        { label: "组", value: 1 },
      ],
    },
    // {
    //   type: "input",
    //   attrs: {
    //     placeholder: "答题进度百分比",
    //   },
    //   label: "答题进度百分比",
    //   prop: "progress",
    // },
    {
      type: "select",
      attrs: {
        placeholder: "请选择状态",
      },
      initialValue: 0,
      label: "状态",
      prop: "status",
      options: [
        { label: "未开始", value: 0 },
        { label: "进行中", value: 1 },
        { label: "已完成", value: 2 },
        { label: "已过期", value: 3 },
      ],
    },
    // {
    //   type: "input",
    //   attrs: {
    //     placeholder: "分配人ID",
    //   },
    //   label: "分配人ID",
    //   prop: "assignedBy",
    // },
  ],
  // 提交函数
  formAction: (data: AssessmentAssignmentForm) => {
    if (data.id) {
      // 编辑
      return AssessmentAssignmentAPI.update(String(data.id), data);
    } else {
      // 新增
      return AssessmentAssignmentAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<AssessmentAssignmentForm> = reactive({
  permPrefix: "psym:assessment-assignment",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: any) {
    return AssessmentAssignmentAPI.update(String(data.id), data);
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

// 获取用户列表
const fetchUserList = async () => {
  try {
    const res = await UserAPI.getPage({ pageNum: 1, pageSize: 1000 });
    userOptions.value = res.list.map((item: any) => ({
      label: `${item.nickname || item.username}${item.mobile ? " - " + item.mobile : ""}`,
      value: item.id,
    }));
  } catch (error) {
    console.error("获取用户列表失败:", error);
  }
};

// 获取测评计划列表
const fetchPlanList = async () => {
  try {
    const res = await AssessmentPlanAPI.getPage({ pageNum: 1, pageSize: 1000 });
    planOptions.value = res.list.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error("获取测评计划列表失败:", error);
  }
};

// 组件挂载时先加载测评计划列表
onMounted(async () => {
  // 先加载测评计划列表，确保 parseData 能正确转换数据
  await fetchPlanList();
  fetchUserList();
});
</script>
