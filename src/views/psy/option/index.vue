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
defineOptions({ name: "QuestionOption" });

import OptionAPI, { OptionForm, OptionPageQuery } from "@/api/psy/option-api";
import type { IObject, IModalConfig, IContentConfig, ISearchConfig } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";

// 接收父组件传递的 questionId
const props = defineProps<{
  questionId?: number | string;
}>();

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

// 扩展查询参数类型
type OptionPageQueryExtend = OptionPageQuery & {
  questionId?: number | string;
};

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "*:*:*",
  formItems: [
    {
      type: "input",
      label: "选项内容",
      prop: "optionText",
      attrs: {
        placeholder: "请输入选项内容",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<OptionPageQueryExtend> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: (params?: OptionPageQueryExtend) => {
    return OptionAPI.getPage({
      ...params,
      questionId: props.questionId ? Number(props.questionId) : undefined,
    } as any);
  },
  // 删除接口
  deleteAction: OptionAPI.deleteByIds,
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
    { label: "选项内容", prop: "optionText", showOverflowTooltip: true },
    { label: "选项分值", prop: "optionValue", width: 100 },
    { label: "自定义分数", prop: "score", width: 120 },
    { label: "创建时间", prop: "createTime", width: 160 },
    {
      label: "操作",
      prop: "operation",
      width: 180,
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

// 扩展表单类型
type OptionFormExtend = OptionForm & {
  id?: number | string;
  questionId?: number | string;
};

// 新增配置
const addModalConfig: IModalConfig<OptionFormExtend> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
  // 主键
  pk: "id",
  // 弹窗配置
  dialog: {
    title: "新增选项",
    width: 600,
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
        type: "textarea",
        placeholder: "请输入选项内容",
        rows: 3,
      },
      rules: [{ required: true, message: "选项内容不能为空", trigger: "blur" }],
      label: "选项内容",
      prop: "optionText",
    },
    {
      type: "input",
      attrs: {
        placeholder: "请输入选项分值",
        type: "number",
      },
      rules: [{ required: true, message: "选项分值不能为空", trigger: "blur" }],
      label: "选项分值",
      prop: "optionValue",
    },
    {
      type: "input",
      attrs: {
        placeholder: "请输入自定义分数（可选）",
        type: "number",
      },
      label: "自定义分数",
      prop: "score",
    },
  ],
  // 提交函数
  formAction: (data: OptionFormExtend) => {
    // 确保 questionId 存在
    const questionId = data.questionId || props.questionId;
    if (!questionId) {
      ElMessage.error("题目ID不能为空");
      return Promise.reject(new Error("题目ID不能为空"));
    }

    // 构建表单数据
    const formData = {
      ...data,
      questionId: Number(questionId),
      optionValue: Number(data.optionValue),
      score: data.score ? Number(data.score) : undefined,
    };

    if (data.id) {
      // 编辑
      return OptionAPI.update(String(data.id), formData as any);
    } else {
      // 新增
      return OptionAPI.create(formData as any);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<OptionFormExtend> = reactive({
  permPrefix: "*:*:*",
  component: "drawer",
  drawer: {
    title: "编辑选项",
    size: 500,
  },
  pk: "id",
  formAction(data: OptionFormExtend) {
    // 确保 questionId 存在
    const questionId = data.questionId || props.questionId;
    if (!questionId) {
      ElMessage.error("题目ID不能为空");
      return Promise.reject(new Error("题目ID不能为空"));
    }

    const formData = {
      ...data,
      questionId: Number(questionId),
      optionValue: Number(data.optionValue),
      score: data.score ? Number(data.score) : undefined,
    };
    return OptionAPI.update(String(data.id), formData as any);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await OptionAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
