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
defineOptions({ name: "ScoringRule" });

import ScoringRuleAPI, { ScoringRuleForm, ScoringRulePageQuery } from "@/api/psy/scoring-rule-api";
import ScaleAPI from "@/api/psy/scale-api";
import ScaleVersionAPI from "@/api/psy/scale-version-api";
import type { IObject, IModalConfig, IContentConfig, ISearchConfig } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";

// 接收父组件传递的 versionId 和 scaleId
const props = defineProps<{
  versionId?: number | string;
  scaleId?: number | string;
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
type ScoringRulePageQueryExtend = ScoringRulePageQuery & {
  versionId?: number | string;
  scaleId?: number | string;
};

// 量表选项列表
const scaleOptions = ref<{ label: string; value: any }[]>([]);
// 版本选项列表
const versionOptions = ref<{ label: string; value: any }[]>([]);

// 加载量表选项
const loadScaleOptions = async () => {
  try {
    const res = await ScaleAPI.getPage({ pageNum: 1, pageSize: 1000 });
    scaleOptions.value = res.list.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error("加载量表选项失败:", error);
  }
};

// 加载版本选项
const loadVersionOptions = async (scaleId: number | string) => {
  if (!scaleId) {
    versionOptions.value = [];
    return;
  }
  try {
    const res = await ScaleVersionAPI.getPage({
      pageNum: 1,
      pageSize: 1000,
      scaleId: Number(scaleId),
    } as any);
    versionOptions.value = res.list.map((item: any) => ({
      label: item.versionName,
      value: item.id,
    }));
  } catch (error) {
    console.error("加载版本选项失败:", error);
  }
};

// 组件挂载时加载量表选项
onMounted(() => {
  loadScaleOptions();
  // 如果有 scaleId，则加载版本选项
  if (props.scaleId) {
    loadVersionOptions(props.scaleId);
  }
});

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "*:*:*",
  formItems: computed(
    () =>
      [
        {
          type: "select" as const,
          label: "所属量表",
          prop: "scaleId",
          attrs: {
            placeholder: "请选择量表",
            clearable: true,
            style: { width: "200px" },
            onChange: async (val: any) => {
              if (val) {
                await loadVersionOptions(val);
              } else {
                versionOptions.value = [];
              }
            },
          },
          options: scaleOptions,
        },
        {
          type: "select" as const,
          label: "所属版本",
          prop: "versionId",
          attrs: {
            placeholder: "请选择版本",
            clearable: true,
            style: { width: "200px" },
          },
          options: versionOptions,
        },
      ] as any
  ),
});

// 列表配置
const contentConfig: IContentConfig<ScoringRulePageQueryExtend> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: (params?: ScoringRulePageQueryExtend) => {
    // 优先使用搜索表单中的 scaleId 和 versionId，如果没有则使用 props 传入的值
    const finalParams = {
      ...params,
      versionId: params?.versionId
        ? Number(params.versionId)
        : props.versionId
          ? Number(props.versionId)
          : undefined,
      scaleId: params?.scaleId
        ? Number(params.scaleId)
        : props.scaleId
          ? Number(props.scaleId)
          : undefined,
    };
    return ScoringRuleAPI.getPage(finalParams as any);
  },
  // 删除接口
  deleteAction: ScoringRuleAPI.deleteByIds,
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
    { type: "index", label: "序号", width: 60, align: "center" },
    // { label: "所属量表名称", prop: "scaleName", width: 150, showOverflowTooltip: true },
    // { label: "所属版本名称", prop: "versionName", width: 150, showOverflowTooltip: true },
    // { label: "维度名称", prop: "dimensionName", width: 150, showOverflowTooltip: true },
    { label: "规则名称", prop: "ruleName", width: 150, showOverflowTooltip: true },
    { label: "规则类型代码", prop: "ruleCode", width: 150, showOverflowTooltip: true },
    { label: "计分说明", prop: "description", showOverflowTooltip: true },
    // { label: "创建时间", prop: "createTime", width: 160, templet: "date" },
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
type ScoringRuleFormExtend = ScoringRuleForm & {
  id?: number | string;
  versionId?: number | string;
  scaleId?: number | string;
};

// 新增配置
const addModalConfig: IModalConfig<ScoringRuleFormExtend> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
  // 主键
  pk: "id",
  // 弹窗配置
  dialog: {
    title: "新增计分规则",
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
        placeholder: "请输入规则名称",
      },
      label: "规则名称",
      prop: "ruleName",
    },
    {
      type: "input",
      attrs: {
        placeholder: "请输入规则代码",
      },
      label: "规则代码",
      prop: "ruleCode",
    },
    {
      type: "input",
      attrs: {
        type: "textarea",
        placeholder: "请输入计分说明",
        rows: 4,
      },
      label: "计分说明",
      prop: "description",
    },
  ],
  // 提交函数
  formAction: (data: ScoringRuleFormExtend) => {
    // 构建表单数据
    const formData = {
      ...data,
      versionId: props.versionId ? Number(props.versionId) : undefined,
      scaleId: props.scaleId ? Number(props.scaleId) : undefined,
    };

    if (data.id) {
      // 编辑
      return ScoringRuleAPI.update(String(data.id), formData as any);
    } else {
      // 新增
      return ScoringRuleAPI.create(formData as any);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<ScoringRuleFormExtend> = reactive({
  permPrefix: "*:*:*",
  component: "drawer",
  drawer: {
    title: "编辑计分规则",
    size: 500,
  },
  pk: "id",
  formAction(data: ScoringRuleFormExtend) {
    const formData = {
      ...data,
      versionId: props.versionId ? Number(props.versionId) : undefined,
      scaleId: props.scaleId ? Number(props.scaleId) : undefined,
    };
    return ScoringRuleAPI.update(String(data.id), formData as any);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await ScoringRuleAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = (name: string) => {
  console.log(name);
};
</script>
