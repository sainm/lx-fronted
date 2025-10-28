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
} from "@/api/psym/assessment-plan-api";
import ScaleAPI from "@/api/psy/scale-api";
import ScaleVersionAPI from "@/api/psy/scale-version-api";
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

// 量表选项列表
const scaleOptions = ref<{ label: string; value: number }[]>([]);
// 量表版本选项列表
const versionOptions = ref<{ label: string; value: number }[]>([]);

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "psym:assessment-plan",
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
      type: "date-picker",
      label: "开始时间",
      prop: "startTime",
      attrs: {
        type: "datetime",
        placeholder: "请选择开始时间",
        clearable: true,
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        style: { width: "220px" },
      },
    },
    {
      type: "date-picker",
      label: "结束时间",
      prop: "endTime",
      attrs: {
        type: "datetime",
        placeholder: "请选择结束时间",
        clearable: true,
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        style: { width: "220px" },
      },
    },
    {
      type: "select",
      label: "状态",
      prop: "status",
      attrs: {
        placeholder: "请选择状态",
        clearable: true,
        style: { width: "150px" },
      },
      options: [
        { label: "启用", value: 1 },
        { label: "停用", value: 0 },
      ],
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<AssessmentPlanPageQuery> = reactive({
  // 权限前缀
  permPrefix: "psym:assessment-plan",
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
    { type: "index", label: "序号", width: 60, align: "center" },
    { label: "计划名称", prop: "name", width: 150, showOverflowTooltip: true },
    { label: "计划说明", prop: "description", showOverflowTooltip: true },
    { label: "量表", prop: "scaleName", width: 150, showOverflowTooltip: true },
    { label: "量表版本", prop: "versionName", width: 120 },
    { label: "目标群体", prop: "targetGroup", width: 150, showOverflowTooltip: true },
    { label: "开始时间", prop: "startTime", width: 160 },
    { label: "结束时间", prop: "endTime", width: 160 },
    {
      label: "状态",
      prop: "status",
      width: 100,
      align: "center",
      templet: "list",
      selectList: {
        0: "停用",
        1: "启用",
      },
    },
    {
      label: "操作",
      prop: "operation",
      width: 150,
      templet: "tool",
      operat: ["edit", "delete"],
    },
  ],
});

// 新增配置
const addModalConfig: IModalConfig<AssessmentPlanForm> = reactive({
  // 权限前缀
  permPrefix: "psym:assessment-plan",
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
    //     placeholder: "测评计划ID",
    //   },
    //   rules: [{ required: true, message: "测评计划ID不能为空", trigger: "blur" }],
    //   label: "测评计划ID",
    //   prop: "id",
    // },
    {
      type: "input",
      attrs: {
        placeholder: "测评计划名称",
      },
      rules: [{ required: true, message: "测评计划名称不能为空", trigger: "blur" }],
      label: "测评计划",
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
      type: "select",
      attrs: {
        placeholder: "请选择量表",
        clearable: true,
        filterable: true,
        onChange: (value: number) => {
          console.log("量表选择变化:", value);
          // 量表改变时，重新加载版本列表
          if (value) {
            fetchVersionList(value);
          } else {
            versionOptions.value = [];
          }
        },
      },
      rules: [{ required: true, message: "请选择量表", trigger: "change" }],
      label: "量表",
      prop: "scaleId",
      options: scaleOptions,
    },
    {
      type: "select",
      attrs: {
        placeholder: "请选择量表版本",
        clearable: true,
        filterable: true,
      },
      label: "量表版本",
      prop: "versionId",
      options: versionOptions,
    },
    {
      type: "input",
      attrs: {
        placeholder: "目标群体（标签或分组描述）",
      },
      label: "目标群体",
      prop: "targetGroup",
    },
    {
      type: "date-picker",
      attrs: {
        type: "datetime",
        placeholder: "请选择开始时间",
        clearable: true,
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        format: "YYYY-MM-DD HH:mm:ss",
      },
      rules: [{ required: true, message: "开始时间不能为空", trigger: "change" }],
      label: "开始时间",
      prop: "startTime",
    },
    {
      type: "date-picker",
      attrs: {
        type: "datetime",
        placeholder: "请选择结束时间",
        clearable: true,
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        format: "YYYY-MM-DD HH:mm:ss",
      },
      label: "结束时间",
      prop: "endTime",
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
      label: "状态",
      prop: "status",
    },
  ],
  // 提交函数
  formAction: (data: AssessmentPlanForm) => {
    if (data.id) {
      // 编辑
      return AssessmentPlanAPI.update(String(data.id), data);
    } else {
      // 新增
      return AssessmentPlanAPI.create(data);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<AssessmentPlanForm> = reactive({
  permPrefix: "psym:assessment-plan",
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
      const formData = await AssessmentPlanAPI.getFormData(data.row.id);
      // 如果有量表ID，加载对应的版本列表
      if (formData.scaleId) {
        await fetchVersionList(formData.scaleId);
      }
      return formData;
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};

// 获取量表列表
const fetchScaleList = async () => {
  try {
    const res = await ScaleAPI.getPage({ pageNum: 1, pageSize: 1000 });
    console.log("量表列表数据:", res);
    scaleOptions.value = res.list.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
    console.log("量表选项:", scaleOptions.value);
  } catch (error) {
    console.error("获取量表列表失败:", error);
  }
};

// 获取指定量表的版本列表
const fetchVersionList = async (scaleId: number) => {
  try {
    console.log("正在获取版本列表，量表ID:", scaleId);
    const res = await ScaleVersionAPI.getPage({
      pageNum: 1,
      pageSize: 1000,
      scaleId,
    });
    console.log("版本列表数据:", res);
    versionOptions.value = res.list.map((item: any) => ({
      label: item.versionName,
      value: item.id,
    }));
    console.log("版本选项:", versionOptions.value);
  } catch (error) {
    console.error("获取版本列表失败:", error);
  }
};

// 组件挂载时获取量表列表
onMounted(() => {
  fetchScaleList();
});
</script>
