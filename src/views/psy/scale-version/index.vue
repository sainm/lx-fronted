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

    <!-- 查看维度弹窗 -->
    <el-dialog
      v-model="dimensionDialogVisible"
      :title="`版本维度 - ${currentVersionName}`"
      width="90%"
      top="5vh"
      draggable
      destroy-on-close
    >
      <Dimension
        v-if="dimensionDialogVisible"
        :version-id="currentVersionId"
        :scale-id="currentScaleId"
      />
    </el-dialog>

    <!-- 查看题目弹窗 -->
    <el-dialog
      v-model="questionDialogVisible"
      :title="`版本题目 - ${questionVersionName}`"
      width="90%"
      top="5vh"
      draggable
      destroy-on-close
    >
      <Question
        v-if="questionDialogVisible"
        :version-id="questionVersionId"
        :scale-id="questionScaleId"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "ScaleVersion" });

import ScaleVersionAPI, {
  ScaleVersionForm,
  ScaleVersionPageQuery,
} from "@/api/psy/scale-version-api";
import ScaleAPI from "@/api/psy/scale-api";
import type { IObject, IModalConfig, IContentConfig, ISearchConfig } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";
import Dimension from "@/views/psy/dimension/index.vue";
import Question from "@/views/psy/question/index.vue";

// 类型定义
type ScaleVersionFormExtend = ScaleVersionForm & {
  id?: number | string;
  scaleId?: number | string;
};
type ScaleVersionPageQueryExtend = ScaleVersionPageQuery & {
  scaleId?: number | string;
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

// 搜索配置
const searchConfig: ISearchConfig = reactive({
  permPrefix: "psy:scale-version",
  formItems: [
    {
      type: "input",
      label: "版本名称",
      prop: "versionName",
      attrs: {
        placeholder: "请输入版本名称",
        clearable: true,
        style: { width: "200px" },
      },
    },
  ],
});

// 接收父组件传递的 scaleId
const props = defineProps<{
  scaleId?: number | string;
}>();

// 量表选项列表
const scaleOptions = ref<{ label: string; value: any }[]>([]);

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

// 组件挂载时加载量表选项
onMounted(() => {
  loadScaleOptions();
});

// 维度弹窗控制
const dimensionDialogVisible = ref(false);
const currentVersionId = ref<number | string | undefined>();
const currentScaleId = ref<number | string | undefined>();
const currentVersionName = ref("");

// 题目弹窗控制
const questionDialogVisible = ref(false);
const questionVersionId = ref<number | string | undefined>();
const questionScaleId = ref<number | string | undefined>();
const questionVersionName = ref("");

// 列表配置
const contentConfig: IContentConfig<ScaleVersionPageQueryExtend> = reactive({
  // 权限前缀
  permPrefix: "*:*:*",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  // 主键
  pk: "id",
  // 列表查询接口
  indexAction: (params?: ScaleVersionPageQueryExtend) => {
    // 如果传入了 scaleId，则添加到查询参数中
    return ScaleVersionAPI.getPage({
      ...params,
      scaleId: props.scaleId ? Number(props.scaleId) : undefined,
    } as any);
  },
  // 删除接口
  deleteAction: ScaleVersionAPI.deleteByIds,
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
  // 导出配置（可选）
  // exportAction: ScaleVersionAPI.export,
  // 导入配置（可选）
  // importAction: ScaleVersionAPI.import,
  // 表格列配置
  cols: [
    { type: "selection", width: 55, align: "center" },
    { label: "所属量表名称", prop: "scaleName" },
    { label: "版本名称", prop: "versionName" },
    { label: "版本说明", prop: "description" },
    {
      label: "是否启用",
      prop: "isActive",
      templet: "list",
      selectList: {
        0: "禁用",
        1: "启用",
      },
    },
    { label: "创建时间", prop: "createTime", templet: "date" },
    { label: "更新时间", prop: "updateTime", templet: "date" },
    {
      label: "操作",
      prop: "operation",
      width: 380,
      templet: "tool",
      operat: [
        {
          name: "question",
          text: "题目",
          attrs: { icon: "document", type: "primary", link: true, size: "small" },
          perm: "*:*:*",
        },
        {
          name: "dimension",
          text: "维度查看",
          attrs: { icon: "menu", type: "primary", link: true, size: "small" },
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
const addModalConfig: IModalConfig<ScaleVersionFormExtend> = reactive({
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
        },
        options: scaleOptions,
      });
    }

    return [
      ...items,
      {
        type: "input",
        attrs: {
          placeholder: "版本名称，如v1.0",
        },
        rules: [{ required: true, message: "版本名称不能为空", trigger: "blur" }],
        label: "版本名称",
        prop: "versionName",
      },
      {
        type: "input",
        attrs: {
          type: "textarea",
          placeholder: "请输入版本说明",
          rows: 3,
        },
        label: "版本说明",
        prop: "description",
      },
      {
        type: "switch",
        attrs: {
          activeValue: 1,
          inactiveValue: 0,
          activeText: "启用",
          inactiveText: "禁用",
        },
        label: "是否启用",
        prop: "isActive",
        defaultValue: 1, // 默认启用
      },
    ];
  }),
  // 提交函数
  formAction: (data: ScaleVersionFormExtend) => {
    // 优先使用表单数据中的值（用户选择的），其次使用props中的值（父组件传入的）
    const scaleId = data.scaleId || props.scaleId;

    // 确保 scaleId 存在
    if (!scaleId) {
      ElMessage.error("请选择所属量表");
      return Promise.reject(new Error("所属量表ID不能为空"));
    }

    // 构建提交数据
    const formData = {
      ...data,
      scaleId: Number(scaleId),
    };

    if (data.id) {
      // 编辑
      return ScaleVersionAPI.update(String(data.id), formData as any);
    } else {
      // 新增
      return ScaleVersionAPI.create(formData as any);
    }
  },
});

// 编辑配置
const editModalConfig: IModalConfig<ScaleVersionFormExtend> = reactive({
  permPrefix: "*:*:*",
  component: "drawer",
  drawer: {
    title: "编辑",
    size: 500,
  },
  pk: "id",
  formAction(data: ScaleVersionFormExtend) {
    // 优先使用表单数据中的值，其次使用props中的值
    const scaleId = data.scaleId || props.scaleId;

    // 确保 scaleId 存在
    if (!scaleId) {
      ElMessage.error("请选择所属量表");
      return Promise.reject(new Error("所属量表ID不能为空"));
    }

    const formData = {
      ...data,
      scaleId: Number(scaleId),
    };
    return ScaleVersionAPI.update(String(data.id), formData as any);
  },
  formItems: addModalConfig.formItems, // 复用新增的表单项
});

// 处理操作按钮点击
const handleOperateClick = (data: IObject) => {
  if (data.name === "edit") {
    handleEditClick(data.row, async () => {
      return await ScaleVersionAPI.getFormData(data.row.id);
    });
  } else if (data.name === "dimension") {
    // 打开维度弹窗
    currentVersionId.value = data.row.id;
    currentScaleId.value = data.row.scaleId;
    currentVersionName.value = data.row.versionName || "";
    if (!currentVersionId.value) {
      ElMessage.error("无法获取版本ID");
      return;
    }
    if (!currentScaleId.value) {
      ElMessage.error("无法获取量表ID");
      return;
    }
    dimensionDialogVisible.value = true;
  } else if (data.name === "question") {
    // 打开题目弹窗
    questionVersionId.value = data.row.id;
    questionScaleId.value = data.row.scaleId;
    questionVersionName.value = data.row.versionName || "";
    if (!questionVersionId.value) {
      ElMessage.error("无法获取版本ID");
      return;
    }
    if (!questionScaleId.value) {
      ElMessage.error("无法获取量表ID");
      return;
    }
    questionDialogVisible.value = true;
  }
};

// 处理工具栏按钮点击（删除等）
const handleToolbarClick = () => {
  // 工具栏按钮点击处理
};
</script>
