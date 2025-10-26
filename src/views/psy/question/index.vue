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

// 类型定义
type QuestionFormExtend = QuestionForm & {
  id?: number | string;
  scaleId?: number | string;
  versionId?: number | string;
};
type QuestionPageQueryExtend = QuestionPageQuery & {
  scaleId?: number | string;
  versionId?: number | string;
};

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

// 接收父组件传递的 versionId 和 scaleId
const props = defineProps<{
  versionId?: number | string;
  scaleId?: number | string;
}>();

// 组件加载时的调试信息
console.log("Question 组件加载，初始 props:", props);

// 监听参数变化
watch(
  () => props.versionId,
  (newVal, oldVal) => {
    console.log("question versionId 变化:", oldVal, "->", newVal);
  },
  { immediate: true }
);

watch(
  () => props.scaleId,
  (newVal, oldVal) => {
    console.log("question scaleId 变化:", oldVal, "->", newVal);
  },
  { immediate: true }
);

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "*:*:*",
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
      label: "所属量表",
      prop: "scaleId",
      attrs: {
        placeholder: "所属量表",
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      label: "所属维度",
      prop: "dimensionId",
      attrs: {
        placeholder: "所属维度",
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
      label: "题目类型",
      prop: "questionType",
      attrs: {
        placeholder: "题目类型",
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
const contentConfig: IContentConfig<QuestionPageQueryExtend> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: (params?: QuestionPageQueryExtend) => {
    return QuestionAPI.getPage({
      ...params,
      versionId: props.versionId ? Number(props.versionId) : undefined,
      scaleId: props.scaleId ? Number(props.scaleId) : undefined,
    } as any);
  },
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
  toolbar: [
    { name: "add", text: "新增", attrs: { icon: "plus", type: "success" }, perm: "*:*:*" },
    { name: "delete", text: "删除", attrs: { icon: "delete", type: "danger" }, perm: "*:*:*" },
  ],
  defaultToolbar: ["refresh", "filter"],
  // 表格列配置
  cols: [
    { type: "selection", width: 55, align: "center" },
    { label: "所属维度", prop: "dimensionId" },
    { label: "题目内容", prop: "questionText" },
    {
      label: "题目类型",
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
const addModalConfig: IModalConfig<QuestionFormExtend> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
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
      attrs: { type: "hidden" },
      label: "",
      prop: "id",
      show: false,
    },
    {
      type: "input",
      attrs: { type: "hidden" },
      label: "",
      prop: "versionId",
      show: false,
      defaultValue: computed(() => (props.versionId ? Number(props.versionId) : undefined)),
    },
    {
      type: "input",
      attrs: { type: "hidden" },
      label: "",
      prop: "scaleId",
      show: false,
      defaultValue: computed(() => (props.scaleId ? Number(props.scaleId) : undefined)),
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
        type: "textarea",
        placeholder: "题目内容",
        rows: 3,
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
  formAction: (data: QuestionFormExtend) => {
    console.log("表单提交开始，原始数据:", data);
    console.log("当前 props:", props);

    // 优先使用表单数据中的值，其次使用props中的值
    const versionId = data.versionId || props.versionId;
    const scaleId = data.scaleId || props.scaleId;

    // 确保 versionId 和 scaleId 存在
    if (!versionId) {
      ElMessage.error("版本ID不能为空");
      console.error("versionId is undefined, data:", data, "props:", props);
      return Promise.reject(new Error("版本ID不能为空"));
    }
    if (!scaleId) {
      ElMessage.error("所属量表ID不能为空");
      console.error("scaleId is undefined, data:", data, "props:", props);
      return Promise.reject(new Error("所属量表ID不能为空"));
    }

    // 添加 versionId 和 scaleId，确保是数字类型
    const formData = {
      ...data,
      versionId: Number(versionId),
      scaleId: Number(scaleId),
    };
    console.log("新增提交数据:", formData);

    if (data.id) {
      // 编辑
      console.log("执行编辑操作");
      return QuestionAPI.update(String(data.id), formData as any);
    } else {
      // 新增
      console.log("执行新增操作");
      return QuestionAPI.create(formData as any);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<QuestionFormExtend> = reactive({
  permPrefix: "*:*:*",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: QuestionFormExtend) {
    // 优先使用表单数据中的值，其次使用props中的值
    const versionId = data.versionId || props.versionId;
    const scaleId = data.scaleId || props.scaleId;

    console.log("编辑提交 - data:", data, "props:", props);

    // 确保 versionId 和 scaleId 存在
    if (!versionId) {
      ElMessage.error("版本ID不能为空");
      console.error("versionId is undefined, data:", data, "props:", props);
      return Promise.reject(new Error("版本ID不能为空"));
    }
    if (!scaleId) {
      ElMessage.error("所属量表ID不能为空");
      console.error("scaleId is undefined, data:", data, "props:", props);
      return Promise.reject(new Error("所属量表ID不能为空"));
    }

    const formData = {
      ...data,
      versionId: Number(versionId),
      scaleId: Number(scaleId),
    };
    console.log("编辑提交数据:", formData);
    return QuestionAPI.update(String(data.id), formData as any);
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
