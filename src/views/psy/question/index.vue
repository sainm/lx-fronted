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

    <!-- 选项管理对话框 -->
    <el-dialog
      v-model="optionDialogVisible"
      :title="`题目选项管理 - ${currentQuestion?.questionText || ''}`"
      width="90%"
      draggable
      destroy-on-close
    >
      <OptionManage :question-id="currentQuestion?.id" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "Question" });

import QuestionAPI, { QuestionForm, QuestionPageQuery } from "@/api/psy/question-api";
import ScaleAPI from "@/api/psy/scale-api";
import ScaleVersionAPI from "@/api/psy/scale-version-api";
import DimensionAPI from "@/api/psy/dimension-api";
import type { IObject, IModalConfig, IContentConfig, ISearchConfig } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";
import OptionManage from "@/views/psy/option/index.vue";

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

// 量表选项列表
const scaleOptions = ref<{ label: string; value: any }[]>([]);
// 版本选项列表
const versionOptions = ref<{ label: string; value: any }[]>([]);
// 维度选项列表
const dimensionOptions = ref<{ label: string; value: any }[]>([]);

// 选项管理对话框状态
const optionDialogVisible = ref(false);
const currentQuestion = ref<any>(null);

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

// 加载维度选项
const loadDimensionOptions = async (versionId: number | string, scaleId?: number | string) => {
  if (!versionId) {
    dimensionOptions.value = [];
    return;
  }
  try {
    const params: any = {
      pageNum: 1,
      pageSize: 1000,
      versionId: Number(versionId),
    };
    if (scaleId) {
      params.scaleId = Number(scaleId);
    }
    const res = await DimensionAPI.getPage(params as any);
    dimensionOptions.value = res.list.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error("加载维度选项失败:", error);
  }
};

// 组件挂载时加载选项
onMounted(() => {
  loadScaleOptions();
  // 如果有 scaleId 和 versionId，则加载对应的选项
  if (props.scaleId) {
    loadVersionOptions(props.scaleId);
  }
  if (props.versionId) {
    loadDimensionOptions(props.versionId, props.scaleId);
  }
});

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "*:*:*",
  formItems: [
    // {
    //   type: "input",
    //   label: "",
    //   prop: "id",
    //   attrs: {
    //     placeholder: "",
    //     clearable: true,
    //     style: { width: "200px" },
    //   },
    // },
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
    { label: "所属量表", prop: "scaleName" },
    { label: "所属版本", prop: "versionName" },
    { label: "所属维度", prop: "dimensionName" },
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
          name: "option",
          text: "选项",
          attrs: { icon: "list", type: "success", link: true, size: "small" },
          perm: "*:*:*",
        },
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
  formItems: computed(() => {
    const items: any[] = [];

    // 只有在没有传入 scaleId 时才显示所属量表选择
    if (!props.scaleId) {
      items.push({
        type: "select",
        label: "所属量表",
        prop: "scaleId",
        rules: [{ required: true, message: "请选择所属量表", trigger: "change" }],
        attrs: {
          placeholder: "请选择所属量表",
          clearable: true,
          style: { width: "100%" },
          onChange: async (val: any) => {
            if (val) {
              await loadVersionOptions(val);
            } else {
              versionOptions.value = [];
              dimensionOptions.value = [];
            }
          },
        },
        options: scaleOptions,
      });
    }

    // 只有在没有传入 versionId 时才显示所属版本选择
    if (!props.versionId) {
      items.push({
        type: "select",
        label: "所属版本",
        prop: "versionId",
        rules: [{ required: true, message: "请选择所属版本", trigger: "change" }],
        attrs: {
          placeholder: "请选择所属版本",
          clearable: true,
          style: { width: "100%" },
          onChange: async (val: any, formData: any) => {
            if (val) {
              const scaleId = formData?.scaleId || props.scaleId;
              await loadDimensionOptions(val, scaleId);
            } else {
              dimensionOptions.value = [];
            }
          },
        },
        options: versionOptions,
      });
    }

    // 维度选择
    items.push({
      type: "select",
      label: "所属维度",
      prop: "dimensionId",
      attrs: {
        placeholder: "请选择所属维度（可选）",
        clearable: true,
        style: { width: "100%" },
      },
      options: dimensionOptions,
    });

    return [
      ...items,
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
          {
            required: true,
            message: "题目类型: single/multiple/likert不能为空",
            trigger: "change",
          },
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
    ];
  }),
  // 提交函数
  formAction: (data: QuestionFormExtend) => {
    // 优先使用表单数据中的值，其次使用props中的值
    const versionId = data.versionId || props.versionId;
    const scaleId = data.scaleId || props.scaleId;

    // 确保 versionId 和 scaleId 存在
    if (!scaleId) {
      ElMessage.error("请选择所属量表");
      return Promise.reject(new Error("所属量表ID不能为空"));
    }
    if (!versionId) {
      ElMessage.error("请选择所属版本");
      return Promise.reject(new Error("版本ID不能为空"));
    }

    // 构建表单数据
    const formData = {
      ...data,
      scaleId: Number(scaleId),
      versionId: Number(versionId),
      dimensionId: data.dimensionId ? Number(data.dimensionId) : undefined,
    };

    if (data.id) {
      // 编辑
      return QuestionAPI.update(String(data.id), formData as any);
    } else {
      // 新增
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

    // 确保 versionId 和 scaleId 存在
    if (!scaleId) {
      ElMessage.error("请选择所属量表");
      return Promise.reject(new Error("所属量表ID不能为空"));
    }
    if (!versionId) {
      ElMessage.error("请选择所属版本");
      return Promise.reject(new Error("版本ID不能为空"));
    }

    const formData = {
      ...data,
      versionId: Number(versionId),
      scaleId: Number(scaleId),
      dimensionId: data.dimensionId ? Number(data.dimensionId) : undefined,
    };
    return QuestionAPI.update(String(data.id), formData as any);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "option") {
    // 打开选项管理对话框
    currentQuestion.value = data.row;
    optionDialogVisible.value = true;
  } else if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await QuestionAPI.getFormData(data.row.id);
    });
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = () => {
  // 工具栏按钮点击处理
};
</script>
