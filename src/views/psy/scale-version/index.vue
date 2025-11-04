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
    >
      <template #operation="scope">
        <div class="operation-wrap">
          <el-button type="primary" link size="small" @click="onOperationClick('dimension', scope)">
            维度查看
          </el-button>
          <el-button type="warning" link size="small" @click="onOperationClick('question', scope)">
            题目设置
          </el-button>
          <el-dropdown
            trigger="click"
            popper-class="operation-dropdown"
            @command="handleMoreCommand"
          >
            <el-button type="primary" link size="small" class="operation-more">>>></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="{ name: 'scoringRule', scope }">
                  计分规则
                </el-dropdown-item>
                <el-dropdown-item :command="{ name: 'edit', scope }">编辑</el-dropdown-item>
                <el-dropdown-item :command="{ name: 'delete', scope }">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </page-content>

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
      :width="isDimensionMaximized ? '100%' : '75%'"
      :top="isDimensionMaximized ? '0' : '3vh'"
      :fullscreen="isDimensionMaximized"
      draggable
      destroy-on-close
      @closed="isDimensionMaximized = false"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <span class="text-base font-medium">版本维度 - {{ currentVersionName }}</span>
          <el-button
            :title="isDimensionMaximized ? '恢复' : '最大化'"
            circle
            type="primary"
            text
            @click="toggleDimensionMaximize"
          >
            <div :class="`i-svg:${isDimensionMaximized ? 'fullscreen-exit' : 'fullscreen'}`" />
          </el-button>
        </div>
      </template>
      <Dimension
        v-if="dimensionDialogVisible"
        :version-id="currentVersionId"
        :scale-id="currentScaleId"
      />
    </el-dialog>

    <!-- 计分规则弹窗 -->
    <el-dialog
      v-model="scoringRuleDialogVisible"
      :width="isScoringMaximized ? '100%' : '75%'"
      :top="isScoringMaximized ? '0' : '3vh'"
      :fullscreen="isScoringMaximized"
      draggable
      destroy-on-close
      @closed="isScoringMaximized = false"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <span class="text-base font-medium">计分规则 - {{ scoringRuleVersionName }}</span>
          <el-button
            :title="isScoringMaximized ? '恢复' : '最大化'"
            circle
            type="primary"
            text
            @click="toggleScoringMaximize"
          >
            <div :class="`i-svg:${isScoringMaximized ? 'fullscreen-exit' : 'fullscreen'}`" />
          </el-button>
        </div>
      </template>
      <ScoringRule
        v-if="scoringRuleDialogVisible"
        :version-id="scoringRuleVersionId"
        :scale-id="scoringRuleScaleId"
      />
    </el-dialog>

    <!-- 题目设置弹窗 -->
    <el-dialog
      v-model="questionDialogVisible"
      :width="isQuestionMaximized ? '100%' : '90%'"
      :top="isQuestionMaximized ? '0' : '3vh'"
      :fullscreen="isQuestionMaximized"
      draggable
      destroy-on-close
      @closed="isQuestionMaximized = false"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <span class="text-base font-medium">题目设置 - {{ questionVersionName }}</span>
          <el-button
            :title="isQuestionMaximized ? '恢复' : '最大化'"
            circle
            type="primary"
            text
            @click="toggleQuestionMaximize"
          >
            <div :class="`i-svg:${isQuestionMaximized ? 'fullscreen-exit' : 'fullscreen'}`" />
          </el-button>
        </div>
      </template>
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
import ScoringRule from "@/views/psy/scoring-rule/index.vue";
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
const isDimensionMaximized = ref(false);

// 切换维度弹窗最大化状态
const toggleDimensionMaximize = () => {
  isDimensionMaximized.value = !isDimensionMaximized.value;
};

// 计分规则弹窗控制
const scoringRuleDialogVisible = ref(false);
const scoringRuleVersionId = ref<number | string | undefined>();
const scoringRuleScaleId = ref<number | string | undefined>();
const scoringRuleVersionName = ref("");
const isScoringMaximized = ref(false);

// 切换计分规则弹窗最大化状态
const toggleScoringMaximize = () => {
  isScoringMaximized.value = !isScoringMaximized.value;
};

// 题目设置弹窗控制
const questionDialogVisible = ref(false);
const questionVersionId = ref<number | string | undefined>();
const questionScaleId = ref<number | string | undefined>();
const questionVersionName = ref("");
const isQuestionMaximized = ref(false);

// 切换题目设置弹窗最大化状态
const toggleQuestionMaximize = () => {
  isQuestionMaximized.value = !isQuestionMaximized.value;
};

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
    { type: "index", label: "序号", width: 60, align: "center" },
    { label: "所属量表名称", prop: "scaleName", width: 150, showOverflowTooltip: true },
    { label: "版本名称", prop: "versionName", width: 120 },
    { label: "版本说明", prop: "description", showOverflowTooltip: true },
    {
      label: "是否启用",
      prop: "isActive",
      width: 100,
      align: "center",
      templet: "list",
      selectList: {
        0: "禁用",
        1: "启用",
      },
    },
    // { label: "创建时间", prop: "createTime", width: 160, templet: "date" },
    // { label: "更新时间", prop: "updateTime", width: 160, templet: "date" },
    {
      label: "操作",
      prop: "operation",
      width: 260,
      templet: "custom",
      slotName: "operation",
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
  } else if (data.name === "scoringRule") {
    // 打开计分规则弹窗
    scoringRuleVersionId.value = data.row.id;
    scoringRuleScaleId.value = data.row.scaleId;
    scoringRuleVersionName.value = data.row.versionName || "";
    if (!scoringRuleVersionId.value) {
      ElMessage.error("无法获取版本ID");
      return;
    }
    if (!scoringRuleScaleId.value) {
      ElMessage.error("无法获取量表ID");
      return;
    }
    scoringRuleDialogVisible.value = true;
  } else if (data.name === "question") {
    // 打开题目设置弹窗
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

const onOperationClick = (name: string, scope: any) => {
  handleOperateClick({
    name,
    row: scope.row,
    column: scope.column,
    $index: scope.$index,
  });
};

const handleMoreCommand = (command: { name: string; scope: any }) => {
  if (!command || !command.scope) return;
  onOperationClick(command.name, command.scope);
};
</script>

<style scoped lang="scss">
.operation-wrap {
  display: flex;
  gap: 8px;
  align-items: center;
  white-space: nowrap;
}

.operation-more {
  font-weight: 600;
  letter-spacing: 0.06em;
}

:deep(.operation-dropdown) {
  min-width: 120px;
}

:deep(.operation-dropdown .el-dropdown-menu__item) {
  justify-content: flex-start;
  font-size: 13px;
}

.text-danger {
  color: var(--el-color-danger);
}
</style>
