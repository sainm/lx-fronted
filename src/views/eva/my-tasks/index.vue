<template>
  <div class="app-container">
    <div class="page-header">
      <h2>我的测评任务</h2>
      <p class="subtitle">查看并开始您分配的测评任务</p>
    </div>

    <!-- 搜索筛选 -->
    <el-card shadow="never" class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="任务状态">
          <el-select
            v-model="queryParams.status"
            placeholder="全部状态"
            clearable
            style="width: 150px"
          >
            <el-option label="未开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已完成" :value="2" />
            <el-option label="已过期" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 任务统计卡片 -->
    <div class="stats-container">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card stat-total">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.total }}</div>
                <div class="stat-label">总任务数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card stat-pending">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.pending }}</div>
                <div class="stat-label">待开始</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card stat-progress">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon><EditPen /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.inProgress }}</div>
                <div class="stat-label">进行中</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card stat-completed">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon><SuccessFilled /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.completed }}</div>
                <div class="stat-label">已完成</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 任务列表 -->
    <el-card shadow="never" class="task-list-card">
      <template #header>
        <div class="card-header">
          <span class="title">任务列表</span>
        </div>
      </template>

      <el-table v-loading="loading" :data="taskList" border stripe>
        <el-table-column label="任务编号" prop="id" width="100" align="center" />
        <el-table-column label="测评计划" prop="planName" min-width="180">
          <template #default="{ row }">
            <div class="plan-info">
              <div class="plan-name">{{ row.planName }}</div>
              <div class="plan-desc">{{ row.planDescription }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="量表信息" min-width="150">
          <template #default="{ row }">
            <div class="scale-info">
              <div>{{ row.scaleName }}</div>
              <el-tag size="small" type="info">{{ row.versionName }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间范围" min-width="200">
          <template #default="{ row }">
            <div class="time-range">
              <div>
                <el-icon><Calendar /></el-icon>
                开始: {{ formatDate(row.startTime) }}
              </div>
              <div>
                <el-icon><Calendar /></el-icon>
                结束: {{ formatDate(row.endTime) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="180" align="center">
          <template #default="{ row }">
            <div class="progress-info">
              <el-progress
                :percentage="row.progress || 0"
                :color="getProgressColor(row.progress)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分配人" prop="assignedByName" width="100" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 0 || row.status === 1"
              type="primary"
              link
              size="small"
              @click="handleStartTask(row)"
            >
              {{ row.status === 0 ? "开始答题" : "继续答题" }}
            </el-button>
            <el-button
              v-if="row.status === 2"
              type="success"
              link
              size="small"
              @click="handleViewReport(row)"
            >
              查看报告
            </el-button>
            <el-button type="info" link size="small" @click="handleViewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleQuery"
        @current-change="handleQuery"
      />
    </el-card>

    <!-- 任务详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="任务详情" width="700px" draggable>
      <div v-if="currentTask" class="task-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务编号">{{ currentTask.id }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentTask.status)">
              {{ getStatusText(currentTask.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="测评计划" :span="2">
            {{ currentTask.planName }}
          </el-descriptions-item>
          <el-descriptions-item label="计划说明" :span="2">
            {{ currentTask.planDescription }}
          </el-descriptions-item>
          <el-descriptions-item label="量表名称">
            {{ currentTask.scaleName }}
          </el-descriptions-item>
          <el-descriptions-item label="版本">
            {{ currentTask.versionName }}
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">
            {{ formatDate(currentTask.startTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="结束时间">
            {{ formatDate(currentTask.endTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="答题进度">
            <el-progress :percentage="currentTask.progress || 0" />
          </el-descriptions-item>
          <el-descriptions-item label="分配人">
            {{ currentTask.assignedByName }}
          </el-descriptions-item>
          <el-descriptions-item label="分配时间" :span="2">
            {{ formatDateTime(currentTask.assignedTime) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="currentTask && (currentTask.status === 0 || currentTask.status === 1)"
          type="primary"
          @click="handleStartTask(currentTask)"
        >
          {{ currentTask.status === 0 ? "开始答题" : "继续答题" }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 答题弹窗 -->
    <el-dialog
      v-model="assessmentDialogVisible"
      title="答题"
      width="1200px"
      top="5vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      :before-close="handleBeforeCloseAssessment"
      destroy-on-close
      class="assessment-dialog"
    >
      <Assessment
        v-if="assessmentDialogVisible && assessmentParams.versionId"
        :assignment-id="assessmentParams.assignmentId"
        :plan-id="assessmentParams.planId"
        :version-id="assessmentParams.versionId"
        :plan-name="assessmentParams.planName"
        :scale-name="assessmentParams.scaleName"
        :version-name="assessmentParams.versionName"
        @close="handleAssessmentClose"
        @success="handleAssessmentSuccess"
      />
    </el-dialog>

    <!-- 报告弹窗 -->
    <el-dialog
      v-model="reportDialogVisible"
      title="测评报告"
      width="900px"
      top="5vh"
      destroy-on-close
      class="report-dialog"
    >
      <div v-if="reportLoading" class="report-loading">
        <el-icon class="is-loading loading-icon"><Loading /></el-icon>
        <p>正在加载报告...</p>
      </div>

      <div v-else-if="reportData" class="report-content">
        <!-- 报告头部 -->
        <div class="report-header">
          <h2 class="report-title">{{ reportData.scaleName }} - 测评报告</h2>
          <div class="report-meta">
            <el-tag :type="getReportLevelType(reportData.resultLevel)" size="large">
              {{ reportData.resultLevel || "正常" }}
            </el-tag>
            <span class="report-time">生成时间: {{ formatDateTime(reportData.createTime) }}</span>
          </div>
        </div>

        <!-- 基本信息 -->
        <el-card shadow="never" class="report-card">
          <template #header>
            <span class="card-title">基本信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="测评人">
              {{ reportData.userName }}
            </el-descriptions-item>
            <el-descriptions-item label="量表版本">
              {{ reportData.versionName }}
            </el-descriptions-item>
            <el-descriptions-item label="总分">
              <span class="score-value">{{ reportData.totalScore }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="完成率">
              {{ reportData.completionRate }}%
            </el-descriptions-item>
            <el-descriptions-item label="答题时长">
              {{ formatDuration(reportData.durationSecond) }}
            </el-descriptions-item>
            <el-descriptions-item label="答题数">
              {{ reportData.totalQuestions }} 题
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 维度得分 -->
        <el-card
          v-if="reportData.dimensionScores && reportData.dimensionScores.length > 0"
          shadow="never"
          class="report-card"
        >
          <template #header>
            <span class="card-title">维度得分</span>
          </template>
          <div class="dimension-scores">
            <div
              v-for="dim in reportData.dimensionScores"
              :key="dim.dimensionName"
              class="dimension-item"
            >
              <div class="dimension-header">
                <span class="dimension-name">{{ dim.dimensionName }}</span>
                <el-tag :type="getDimensionLevelType(dim.level)" size="small">
                  {{ dim.level }}
                </el-tag>
              </div>
              <div class="dimension-score">
                <el-progress
                  :percentage="dim.scoreRate"
                  :color="getDimensionColor(dim.scoreRate)"
                  :stroke-width="20"
                >
                  <span class="progress-text">{{ dim.score }} / {{ dim.maxScore }}</span>
                </el-progress>
              </div>
              <div class="dimension-desc">{{ dim.description }}</div>
            </div>
          </div>
        </el-card>

        <!-- 建议 -->
        <el-card v-if="reportData.suggestion" shadow="never" class="report-card">
          <template #header>
            <span class="card-title">专业建议</span>
          </template>
          <div class="suggestion-content">
            {{ reportData.suggestion }}
          </div>
        </el-card>
      </div>

      <el-empty v-else description="暂无报告数据" />

      <template #footer>
        <el-button @click="reportDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handlePrintReport">打印报告</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "MyTasks" });

import AssessmentAssignmentAPI, {
  type MyTaskVO,
  type AssessmentAssignmentPageQuery,
} from "@/api/psym/assessment-assignment-api";
import ReportAPI, { type ReportDetailVO } from "@/api/report/report-api";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Document,
  Clock,
  EditPen,
  SuccessFilled,
  Calendar,
  Loading,
} from "@element-plus/icons-vue";
import Assessment from "@/views/eva/assessment/index.vue";

const queryFormRef = ref();
const loading = ref(false);
const taskList = ref<MyTaskVO[]>([]);
const total = ref(0);
const detailDialogVisible = ref(false);
const currentTask = ref<MyTaskVO | null>(null);

// 答题弹窗相关
const assessmentDialogVisible = ref(false);
const assessmentParams = reactive({
  assignmentId: undefined as number | undefined,
  planId: undefined as number | undefined,
  versionId: undefined as number | undefined,
  planName: "",
  scaleName: "",
  versionName: "",
});

// 报告弹窗相关
const reportDialogVisible = ref(false);
const reportLoading = ref(false);
const reportData = ref<ReportDetailVO | null>(null);

// 查询参数
const queryParams = reactive<AssessmentAssignmentPageQuery>({
  pageNum: 1,
  pageSize: 10,
  status: undefined,
});

// 统计数据
const stats = reactive({
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
});

// 获取任务列表
const getTaskList = async () => {
  loading.value = true;
  try {
    // getMyTasks API 会自动获取当前登录用户的任务，不需要传递 userId
    const res = await AssessmentAssignmentAPI.getMyTasks(queryParams);
    taskList.value = res.list;
    total.value = res.total;

    // 更新统计数据
    updateStats(res.list);
  } catch (error) {
    console.error("获取任务列表失败:", error);
    ElMessage.error("获取任务列表失败");
  } finally {
    loading.value = false;
  }
};

// 更新统计数据
const updateStats = (list: MyTaskVO[]) => {
  stats.total = list.length;
  stats.pending = list.filter((t) => t.status === 0).length;
  stats.inProgress = list.filter((t) => t.status === 1).length;
  stats.completed = list.filter((t) => t.status === 2).length;
};

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getTaskList();
};

// 重置
const handleReset = () => {
  queryFormRef.value?.resetFields();
  queryParams.status = undefined;
  handleQuery();
};

// 开始/继续答题
const handleStartTask = (row: MyTaskVO) => {
  console.log("===== 开始答题 =====");
  console.log("任务信息:", row);
  console.log("versionId 值:", row.versionId);
  console.log("versionId 类型:", typeof row.versionId);
  console.log("完整数据 JSON:", JSON.stringify(row, null, 2));

  // 数据验证
  if (!row.versionId) {
    ElMessage.error("任务数据不完整：缺少版本ID（versionId）");
    console.error("❌ 缺少必要字段 versionId，后端API需要返回完整的任务数据");
    console.error("当前数据:", row);
    return;
  }

  if (!row.planName || !row.scaleName || !row.versionName) {
    ElMessage.warning("任务数据不完整，部分信息可能无法显示");
    console.warn("⚠️ 缺少部分显示字段:", {
      planName: row.planName,
      scaleName: row.scaleName,
      versionName: row.versionName,
    });
  }

  ElMessageBox.confirm(`确定要${row.status === 0 ? "开始" : "继续"}答题吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      // 设置答题参数
      assessmentParams.assignmentId = row.id;
      assessmentParams.planId = row.planId;
      assessmentParams.versionId = row.versionId;
      assessmentParams.planName = row.planName || "";
      assessmentParams.scaleName = row.scaleName || "";
      assessmentParams.versionName = row.versionName || "";

      console.log("打开答题弹窗，参数:", assessmentParams);

      // 关闭详情弹窗，打开答题弹窗
      detailDialogVisible.value = false;
      assessmentDialogVisible.value = true;
    })
    .catch(() => {
      console.log("用户取消答题");
    });
};

// 清空答题参数
const clearAssessmentParams = () => {
  assessmentParams.assignmentId = undefined;
  assessmentParams.planId = undefined;
  assessmentParams.versionId = undefined;
  assessmentParams.planName = "";
  assessmentParams.scaleName = "";
  assessmentParams.versionName = "";
};

// 弹窗关闭前确认（点击右上角X按钮时触发）
const handleBeforeCloseAssessment = (done: () => void) => {
  ElMessageBox.confirm("答题尚未提交，确定要退出吗？", "提示", {
    confirmButtonText: "确定退出",
    cancelButtonText: "继续答题",
    type: "warning",
  })
    .then(() => {
      clearAssessmentParams();
      done(); // 允许关闭
    })
    .catch(() => {
      // 取消关闭，不调用 done()
    });
};

// 答题弹窗关闭（由子组件的"退出答题"按钮触发）
const handleAssessmentClose = () => {
  ElMessageBox.confirm("答题尚未提交，确定要退出吗？", "提示", {
    confirmButtonText: "确定退出",
    cancelButtonText: "继续答题",
    type: "warning",
  })
    .then(() => {
      clearAssessmentParams();
      assessmentDialogVisible.value = false;
    })
    .catch(() => {
      // 用户取消，不关闭弹窗
    });
};

// 答题成功（提交成功后，不需要确认直接关闭）
const handleAssessmentSuccess = () => {
  clearAssessmentParams();
  assessmentDialogVisible.value = false;
  // 刷新任务列表
  getTaskList();
};

// 查看报告
const handleViewReport = async (row: MyTaskVO) => {
  console.log("查看报告，任务信息:", row);

  // 打开弹窗
  reportDialogVisible.value = true;
  reportLoading.value = true;
  reportData.value = null;

  try {
    // TODO: 这里需要根据任务ID获取测评记录ID
    // 暂时假设可以直接用任务ID或者需要先查询测评记录
    // const recordId = await getRecordIdByAssignmentId(row.id);

    // 临时使用任务ID作为recordId（实际需要根据业务调整）
    const recordId = row.id;

    console.log("获取报告，recordId:", recordId);

    const report = await ReportAPI.getByRecordId(recordId!);

    reportData.value = report;

    console.log("✅ 报告加载成功:", report);
  } catch (error: any) {
    console.error("❌ 加载报告失败:", error);
    ElMessage.error(error.message || "加载报告失败");
    reportDialogVisible.value = false;
  } finally {
    reportLoading.value = false;
  }
};

// 打印报告
const handlePrintReport = () => {
  window.print();
};

// 查看详情
const handleViewDetail = (row: MyTaskVO) => {
  currentTask.value = row;
  detailDialogVisible.value = true;
};

// 获取状态文本
const getStatusText = (status: number | undefined) => {
  const statusMap: Record<number, string> = {
    0: "未开始",
    1: "进行中",
    2: "已完成",
    3: "已过期",
  };
  return statusMap[status ?? 0] || "未知";
};

// 获取状态类型
const getStatusType = (status: number | undefined) => {
  const typeMap: Record<number, any> = {
    0: "info",
    1: "warning",
    2: "success",
    3: "danger",
  };
  return typeMap[status ?? 0] || "";
};

// 获取进度颜色
const getProgressColor = (progress: number | undefined) => {
  const p = progress || 0;
  if (p < 30) return "#f56c6c";
  if (p < 70) return "#e6a23c";
  return "#67c23a";
};

// 格式化日期
const formatDate = (date: Date | undefined) => {
  if (!date) return "-";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

// 格式化日期时间
const formatDateTime = (date: Date | undefined) => {
  if (!date) return "-";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(
    2,
    "0"
  )}`;
};

// 格式化时长
const formatDuration = (seconds: number | undefined) => {
  if (!seconds) return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h}小时`);
  if (m > 0) parts.push(`${m}分钟`);
  if (s > 0 || parts.length === 0) parts.push(`${s}秒`);

  return parts.join("");
};

// 获取报告等级类型
const getReportLevelType = (level: string | undefined) => {
  const levelMap: Record<string, any> = {
    正常: "success",
    轻度: "info",
    中度: "warning",
    重度: "danger",
    低风险: "success",
    中风险: "warning",
    高风险: "danger",
  };
  return levelMap[level || "正常"] || "info";
};

// 获取维度等级类型
const getDimensionLevelType = (level: string | undefined) => {
  const levelMap: Record<string, any> = {
    优秀: "success",
    良好: "success",
    正常: "info",
    轻度: "warning",
    中度: "warning",
    重度: "danger",
  };
  return levelMap[level || "正常"] || "info";
};

// 获取维度颜色
const getDimensionColor = (scoreRate: number) => {
  if (scoreRate >= 80) return "#67c23a";
  if (scoreRate >= 60) return "#e6a23c";
  if (scoreRate >= 40) return "#f56c6c";
  return "#909399";
};

// 初始化
onMounted(() => {
  getTaskList();
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .subtitle {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}

.search-card {
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 16px;
  }
}

.stats-container {
  margin-bottom: 16px;

  .stat-card {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
    }

    :deep(.el-card__body) {
      padding: 20px;
    }

    .stat-content {
      display: flex;
      gap: 16px;
      align-items: center;

      .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        font-size: 28px;
        border-radius: 12px;
      }

      .stat-info {
        flex: 1;

        .stat-value {
          margin-bottom: 8px;
          font-size: 32px;
          font-weight: 600;
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }

    &.stat-total {
      .stat-icon {
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .stat-info .stat-value {
        color: #667eea;
      }
    }

    &.stat-pending {
      .stat-icon {
        color: white;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      .stat-info .stat-value {
        color: #f093fb;
      }
    }

    &.stat-progress {
      .stat-icon {
        color: white;
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }

      .stat-info .stat-value {
        color: #fa709a;
      }
    }

    &.stat-completed {
      .stat-icon {
        color: white;
        background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
      }

      .stat-info .stat-value {
        color: #30cfd0;
      }
    }
  }
}

.task-list-card {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .plan-info {
    .plan-name {
      margin-bottom: 4px;
      font-weight: 500;
    }

    .plan-desc {
      font-size: 12px;
      color: #909399;
    }
  }

  .scale-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .time-range {
    font-size: 12px;

    > div {
      display: flex;
      gap: 4px;
      align-items: center;
      margin-bottom: 4px;

      .el-icon {
        font-size: 14px;
      }
    }
  }

  .progress-info {
    padding: 0 10px;
  }

  :deep(.el-pagination) {
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.task-detail {
  :deep(.el-descriptions__label) {
    font-weight: 600;
  }
}

:deep(.assessment-dialog) {
  .el-dialog__body {
    max-height: 75vh;
    padding: 0;
    overflow-y: auto;
  }
}

:deep(.report-dialog) {
  .el-dialog__body {
    max-height: 70vh;
    overflow-y: auto;
  }
}

.report-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #606266;

  .loading-icon {
    margin-bottom: 16px;
    font-size: 48px;
  }

  p {
    font-size: 16px;
  }
}

.report-content {
  .report-header {
    padding-bottom: 20px;
    margin-bottom: 24px;
    border-bottom: 2px solid #e4e7ed;

    .report-title {
      margin: 0 0 12px 0;
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }

    .report-meta {
      display: flex;
      gap: 16px;
      align-items: center;

      .report-time {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .report-card {
    margin-bottom: 20px;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .score-value {
      font-size: 24px;
      font-weight: 700;
      color: #409eff;
    }
  }

  .dimension-scores {
    .dimension-item {
      padding: 16px;
      margin-bottom: 16px;
      background: #f5f7fa;
      border-radius: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .dimension-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;

        .dimension-name {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }

      .dimension-score {
        margin-bottom: 12px;

        .progress-text {
          font-size: 14px;
          font-weight: 600;
        }
      }

      .dimension-desc {
        font-size: 14px;
        line-height: 1.6;
        color: #606266;
      }
    }
  }

  .suggestion-content {
    padding: 16px;
    font-size: 15px;
    line-height: 1.8;
    color: #303133;
    background: #f0f9ff;
    border-left: 4px solid #409eff;
    border-radius: 4px;
  }
}
</style>
