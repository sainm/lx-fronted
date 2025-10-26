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
defineOptions({ name: "Dimension" });

import DimensionAPI, { DimensionForm, DimensionPageQuery } from "@/api/psy/dimension-api";
import type { IObject, IModalConfig, IContentConfig, ISearchConfig } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";

// 类型定义
type DimensionFormExtend = DimensionForm & {
  id?: number | string;
  scaleId?: number | string;
  versionId?: number | string;
};
type DimensionPageQueryExtend = DimensionPageQuery & {
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
console.log("Dimension 组件加载，初始 props:", props);

// 监听参数变化
watch(
  () => props.versionId,
  (newVal, oldVal) => {
    console.log("dimension versionId 变化:", oldVal, "->", newVal);
  },
  { immediate: true }
);

watch(
  () => props.scaleId,
  (newVal, oldVal) => {
    console.log("dimension scaleId 变化:", oldVal, "->", newVal);
  },
  { immediate: true }
);

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "*:*:*",
  formItems: [
    {
      type: "input",
      label: "维度名称",
      prop: "name",
      attrs: {
        placeholder: "请输入维度名称",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 列表配置
const contentConfig: IContentConfig<DimensionPageQueryExtend> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: (params?: DimensionPageQueryExtend) => {
    // 如果传入了 versionId 和 scaleId，则添加到查询参数中
    return DimensionAPI.getPage({
      ...params,
      versionId: props.versionId ? Number(props.versionId) : undefined,
      scaleId: props.scaleId ? Number(props.scaleId) : undefined,
    } as any);
  },
  // 删除接口
  deleteAction: DimensionAPI.deleteByIds,
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
    { label: "维度名称", prop: "name" },
    { label: "维度说明", prop: "description" },
    { label: "计分规则", prop: "scoreRule" },
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
const addModalConfig: IModalConfig<DimensionFormExtend> = reactive({
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
      attrs: {
        type: "hidden",
      },
      label: "",
      prop: "id",
      show: false, // 隐藏该字段
    },
    {
      type: "input",
      attrs: {
        type: "hidden",
      },
      label: "",
      prop: "versionId",
      show: false, // 隐藏该字段
      defaultValue: computed(() => (props.versionId ? Number(props.versionId) : undefined)),
    },
    {
      type: "input",
      attrs: {
        type: "hidden",
      },
      label: "",
      prop: "scaleId",
      show: false, // 隐藏该字段
      defaultValue: computed(() => (props.scaleId ? Number(props.scaleId) : undefined)),
    },
    {
      type: "input",
      attrs: {
        placeholder: "维度名称，如焦虑、抑郁",
      },
      rules: [{ required: true, message: "维度名称不能为空", trigger: "blur" }],
      label: "维度名称",
      prop: "name",
    },
    {
      type: "input",
      attrs: {
        type: "textarea",
        placeholder: "请输入维度说明",
        rows: 3,
      },
      label: "维度说明",
      prop: "description",
    },
    {
      type: "input",
      attrs: {
        placeholder: "计分规则，如sum/average",
      },
      label: "计分规则",
      prop: "scoreRule",
    },
  ],
  // 提交函数
  formAction: (data: DimensionFormExtend) => {
    console.log("表单提交开始，原始数据:", data);
    console.log("当前 props:", props);

    // 优先使用表单数据中的值，其次使用props中的值（null和undefined都要考虑）
    const versionId = data.versionId != null ? data.versionId : props.versionId;
    const scaleId = data.scaleId != null ? data.scaleId : props.scaleId;

    // scaleId 是必需的
    if (!scaleId) {
      ElMessage.error("所属量表ID不能为空");
      console.error("scaleId is undefined, data:", data, "props:", props);
      return Promise.reject(new Error("所属量表ID不能为空"));
    }

    // 构建表单数据
    const formData: any = {
      ...data,
      scaleId: Number(scaleId),
    };

    // versionId 是可选的，如果有值才设置
    if (versionId != null) {
      formData.versionId = Number(versionId);
    }

    console.log("新增/编辑提交数据:", formData);

    if (data.id) {
      // 编辑
      console.log("执行编辑操作");
      return DimensionAPI.update(String(data.id), formData);
    } else {
      // 新增
      console.log("执行新增操作");
      return DimensionAPI.create(formData);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<DimensionFormExtend> = reactive({
  permPrefix: "*:*:*",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: DimensionFormExtend) {
    console.log("编辑提交 - data:", data, "props:", props);

    // 优先使用表单数据中的值，其次使用props中的值（null和undefined都要考虑）
    const versionId = data.versionId != null ? data.versionId : props.versionId;
    const scaleId = data.scaleId != null ? data.scaleId : props.scaleId;

    // scaleId 是必需的
    if (!scaleId) {
      ElMessage.error("所属量表ID不能为空");
      console.error("scaleId is undefined, data:", data, "props:", props);
      return Promise.reject(new Error("所属量表ID不能为空"));
    }

    // 构建表单数据
    const formData: any = {
      ...data,
      scaleId: Number(scaleId),
    };

    // versionId 是可选的，如果有值才设置
    if (versionId != null) {
      formData.versionId = Number(versionId);
    }

    console.log("编辑提交数据:", formData);
    return DimensionAPI.update(String(data.id), formData);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await DimensionAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log("工具栏按钮点击:", name);
};
</script>
