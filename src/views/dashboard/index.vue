<template>
  <div class="app-container">
    <!-- 普通用户 Dashboard -->
    <div v-if="isNormalUser" class="user-dashboard">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2>欢迎回来，{{ userStore.userInfo.nickname || userStore.userInfo.username }}！</h2>
        <p class="subtitle">今天也要保持良好的心理健康状态哦~</p>
      </div>

      <!-- 任务统计卡片 -->
      <div class="stats-container">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-total">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ userStats.totalTasks }}</div>
                  <div class="stat-label">总任务数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-pending">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><Clock /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ userStats.pendingTasks }}</div>
                  <div class="stat-label">待完成</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-completed">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><CircleCheck /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ userStats.completedTasks }}</div>
                  <div class="stat-label">已完成</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-reports">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><DocumentChecked /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ userStats.totalReports }}</div>
                  <div class="stat-label">测评报告</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 待完成任务列表 -->
      <el-card shadow="never" class="task-card">
        <template #header>
          <div class="card-header">
            <span>待完成的测评任务</span>
            <el-button type="primary" text @click="goToMyTasks">查看全部</el-button>
          </div>
        </template>
        <el-table v-loading="loading" :data="pendingTasks" border stripe style="width: 100%">
          <el-table-column prop="planName" label="测评计划" min-width="150" />
          <el-table-column prop="scaleName" label="量表名称" min-width="120" />
          <el-table-column prop="versionName" label="版本" width="100" />
          <el-table-column label="进度" width="120">
            <template #default="{ row }">
              <el-progress :percentage="row.progress || 0" :stroke-width="8" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleStartTask(row)">
                开始测评
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 最近报告 -->
      <el-card shadow="never" class="report-card">
        <template #header>
          <div class="card-header">
            <span>最近的测评报告</span>
            <el-button type="primary" text @click="goToReports">查看全部</el-button>
          </div>
        </template>
        <el-table v-loading="loading" :data="recentReports" border stripe style="width: 100%">
          <el-table-column prop="scaleName" label="量表名称" min-width="120" />
          <el-table-column prop="totalScore" label="总分" width="100" />
          <el-table-column prop="resultLevel" label="结果等级" width="120">
            <template #default="{ row }">
              <el-tag :type="getLevelTagType(row.resultLevel)">{{ row.resultLevel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="生成时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleViewReport(row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 管理员 Dashboard -->
    <div v-else-if="isAdmin" class="admin-dashboard">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2>系统管理面板</h2>
        <p class="subtitle">
          欢迎，{{ userStore.userInfo.nickname || userStore.userInfo.username }}！
        </p>
      </div>

      <!-- 系统统计 -->
      <div class="stats-container">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-users">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><User /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ adminStats.totalUsers }}</div>
                  <div class="stat-label">用户总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-roles">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><Avatar /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ adminStats.totalRoles }}</div>
                  <div class="stat-label">角色总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-depts">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><OfficeBuilding /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ adminStats.totalDepts }}</div>
                  <div class="stat-label">部门总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-plans">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ adminStats.totalPlans }}</div>
                  <div class="stat-label">测评计划</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 快速入口 -->
      <el-card shadow="never" class="quick-access-card">
        <template #header>
          <span>快速入口</span>
        </template>
        <el-row :gutter="16">
          <el-col :xs="12" :sm="8" :md="6">
            <div class="quick-item" @click="goToPage('/system/user')">
              <el-icon :size="32"><User /></el-icon>
              <span>用户管理</span>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="6">
            <div class="quick-item" @click="goToPage('/system/role')">
              <el-icon :size="32"><Avatar /></el-icon>
              <span>角色管理</span>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="6">
            <div class="quick-item" @click="goToPage('/system/dept')">
              <el-icon :size="32"><OfficeBuilding /></el-icon>
              <span>部门管理</span>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="6">
            <div class="quick-item" @click="goToPage('/system/config')">
              <el-icon :size="32"><Setting /></el-icon>
              <span>系统配置</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 心理医生 Dashboard -->
    <div v-else-if="isDoctor" class="doctor-dashboard">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2>心理医生工作台</h2>
        <p class="subtitle">
          欢迎，{{ userStore.userInfo.nickname || userStore.userInfo.username }}医生！
        </p>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-container">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-plans">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ doctorStats.totalPlans }}</div>
                  <div class="stat-label">测评计划</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-warnings">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><Warning /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ doctorStats.unresolvedWarnings }}</div>
                  <div class="stat-label">未处理预警</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-urgent">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><Bell /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ doctorStats.urgentWarnings }}</div>
                  <div class="stat-label">紧急预警</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-card shadow="hover" class="stat-card stat-reports">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="32"><DocumentChecked /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ doctorStats.totalReports }}</div>
                  <div class="stat-label">测评报告</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 紧急预警列表 -->
      <el-card shadow="never" class="warning-card">
        <template #header>
          <div class="card-header">
            <span>紧急预警</span>
            <el-button type="danger" text @click="goToWarnings">查看全部</el-button>
          </div>
        </template>
        <el-table v-loading="loading" :data="urgentWarnings" border stripe style="width: 100%">
          <el-table-column prop="userId" label="用户ID" width="100" />
          <el-table-column prop="warningType" label="预警类型" width="120" />
          <el-table-column label="预警等级" width="120">
            <template #default="{ row }">
              <el-tag :type="getWarningLevelTagType(row.level)">
                {{ formatLevelText(row.level) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleViewWarning(row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 最近报告 -->
      <el-card shadow="never" class="report-card">
        <template #header>
          <div class="card-header">
            <span>最近的测评报告</span>
            <el-button type="primary" text @click="goToReports">查看全部</el-button>
          </div>
        </template>
        <el-table v-loading="loading" :data="recentReports" border stripe style="width: 100%">
          <el-table-column prop="userId" label="用户ID" width="100" />
          <el-table-column prop="scaleName" label="量表名称" min-width="120" />
          <el-table-column prop="totalScore" label="总分" width="100" />
          <el-table-column prop="resultLevel" label="结果等级" width="120">
            <template #default="{ row }">
              <el-tag :type="getLevelTagType(row.resultLevel)">{{ row.resultLevel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="生成时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleViewReport(row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store";
import { ROLE_ROOT } from "@/constants";
import {
  Document,
  Clock,
  CircleCheck,
  DocumentChecked,
  User,
  Setting,
  Avatar,
  OfficeBuilding,
  Warning,
  Bell,
} from "@element-plus/icons-vue";
import AssessmentAssignmentAPI, { type MyTaskVO } from "@/api/psym/assessment-assignment-api";
import ReportAPI, { type ReportPageVO } from "@/api/report/report-api";
import WarningAPI, { type WarningPageVO } from "@/api/report/warning-api";
import UserAPI from "@/api/system/user-api";
import RoleAPI from "@/api/system/role-api";
import DeptAPI from "@/api/system/dept-api";
import AssessmentPlanAPI from "@/api/psym/assessment-plan-api";

defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

const router = useRouter();
const userStore = useUserStore();

// 加载状态
const loading = ref(false);

// 角色判断
const isAdmin = computed(() => {
  const roles = userStore.userInfo.roles || [];
  return roles.includes(ROLE_ROOT) || roles.some((role) => role.includes("ADMIN"));
});

const isDoctor = computed(() => {
  const roles = userStore.userInfo.roles || [];
  return roles.some((role) => role.includes("DOCTOR") || role.includes("医生"));
});

const isNormalUser = computed(() => {
  return !isAdmin.value && !isDoctor.value;
});

// 普通用户数据
const userStats = ref({
  totalTasks: 0,
  pendingTasks: 0,
  completedTasks: 0,
  totalReports: 0,
});

const pendingTasks = ref<MyTaskVO[]>([]);
const recentReports = ref<ReportPageVO[]>([]);

// 管理员数据
const adminStats = ref({
  totalUsers: 0,
  totalRoles: 0,
  totalDepts: 0,
  totalPlans: 0,
});

// 心理医生数据
const doctorStats = ref({
  totalPlans: 0,
  unresolvedWarnings: 0,
  urgentWarnings: 0,
  totalReports: 0,
});

const urgentWarnings = ref<WarningPageVO[]>([]);

// 加载普通用户数据
async function loadUserData() {
  try {
    loading.value = true;
    // 加载任务统计
    const tasksRes = await AssessmentAssignmentAPI.getMyTasks({ pageNum: 1, pageSize: 100 });
    const tasks = tasksRes.list || [];

    userStats.value.totalTasks = tasks.length;
    userStats.value.pendingTasks = tasks.filter(
      (t: MyTaskVO) => t.status === 0 || t.status === 1
    ).length;
    userStats.value.completedTasks = tasks.filter((t: MyTaskVO) => t.status === 2).length;
    pendingTasks.value = tasks
      .filter((t: MyTaskVO) => t.status === 0 || t.status === 1)
      .slice(0, 5);

    // 加载报告统计
    const reportsRes = await ReportAPI.getPage({ pageNum: 1, pageSize: 10 });
    const reports = reportsRes.list || [];
    userStats.value.totalReports = reportsRes.total || 0;
    recentReports.value = reports.slice(0, 5);
  } catch (error) {
    console.error("加载用户数据失败:", error);
  } finally {
    loading.value = false;
  }
}

// 递归计算部门总数
function countDepts(depts: any[]): number {
  let count = depts.length;
  depts.forEach((dept) => {
    if (dept.children && dept.children.length > 0) {
      count += countDepts(dept.children);
    }
  });
  return count;
}

// 加载管理员数据
async function loadAdminData() {
  try {
    loading.value = true;
    // 这里需要后端提供统计接口，暂时使用分页查询的第一页数据
    const [usersRes, rolesRes, deptsRes, plansRes] = await Promise.all([
      UserAPI.getPage({ pageNum: 1, pageSize: 1 }),
      RoleAPI.getPage({ pageNum: 1, pageSize: 1 }),
      DeptAPI.getList(),
      AssessmentPlanAPI.getPage({ pageNum: 1, pageSize: 1 }),
    ]);

    adminStats.value.totalUsers = usersRes.total || 0;
    adminStats.value.totalRoles = rolesRes.total || 0;
    adminStats.value.totalDepts = countDepts(deptsRes || []);
    adminStats.value.totalPlans = plansRes.total || 0;
  } catch (error) {
    console.error("加载管理员数据失败:", error);
  } finally {
    loading.value = false;
  }
}

// 加载心理医生数据
async function loadDoctorData() {
  try {
    loading.value = true;
    // 加载计划统计
    const plansRes = await AssessmentPlanAPI.getPage({ pageNum: 1, pageSize: 1 });
    doctorStats.value.totalPlans = plansRes.total || 0;

    // 加载预警统计
    const warningsRes = await WarningAPI.getPage({ pageNum: 1, pageSize: 100 });
    const warnings = warningsRes.list || [];
    doctorStats.value.unresolvedWarnings = warnings.filter(
      (w: WarningPageVO) => w.isResolved === 0
    ).length;
    doctorStats.value.urgentWarnings = warnings.filter(
      (w: WarningPageVO) => w.level === 3 && w.isResolved === 0
    ).length;
    urgentWarnings.value = warnings
      .filter((w: WarningPageVO) => w.level === 3 && w.isResolved === 0)
      .slice(0, 5);

    // 加载报告统计
    const reportsRes = await ReportAPI.getPage({ pageNum: 1, pageSize: 1 });
    doctorStats.value.totalReports = reportsRes.total || 0;
    recentReports.value = (reportsRes.list || []).slice(0, 5);
  } catch (error) {
    console.error("加载心理医生数据失败:", error);
  } finally {
    loading.value = false;
  }
}

// 初始化数据
onMounted(() => {
  if (isNormalUser.value) {
    loadUserData();
  } else if (isAdmin.value) {
    loadAdminData();
  } else if (isDoctor.value) {
    loadDoctorData();
  }
});

// 页面跳转
function goToPage(path: string) {
  router.push(path);
}

function goToMyTasks() {
  router.push("/eva/my-tasks");
}

function goToReports() {
  router.push("/report/report");
}

function goToWarnings() {
  router.push("/report/warning");
}

// 处理任务
function handleStartTask(task: MyTaskVO) {
  router.push({
    path: "/eva/assessment",
    query: {
      assignmentId: task.id,
      planId: task.planId,
      versionId: task.versionId,
      planName: task.planName,
      scaleName: task.scaleName,
      versionName: task.versionName,
    },
  });
}

// 查看报告
function handleViewReport(report: ReportPageVO) {
  router.push({
    path: "/report/report",
    query: { id: report.id },
  });
}

// 查看预警
function handleViewWarning(warning: WarningPageVO) {
  router.push({
    path: "/report/warning",
    query: { id: warning.id },
  });
}

// 格式化日期时间
function formatDateTime(date?: Date | string) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString("zh-CN");
}

// 格式化预警等级
function formatLevelText(level?: number) {
  const map: Record<number, string> = {
    1: "一般",
    2: "严重",
    3: "紧急",
  };
  return map[level || 0] || "未知";
}

// 获取预警等级标签类型
function getWarningLevelTagType(level?: number) {
  const map: Record<number, string> = {
    1: "info",
    2: "warning",
    3: "danger",
  };
  return (map[level || 0] || "info") as any;
}

// 获取结果等级标签类型
function getLevelTagType(level?: string) {
  if (!level) return "info";
  if (level.includes("低") || level.includes("正常")) return "success";
  if (level.includes("中")) return "warning";
  if (level.includes("高") || level.includes("危险")) return "danger";
  return "info";
}
</script>

<style lang="scss" scoped>
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

.stats-container {
  margin-bottom: 16px;
}

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

  &.stat-completed {
    .stat-icon {
      color: white;
      background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
    }

    .stat-info .stat-value {
      color: #30cfd0;
    }
  }

  &.stat-reports {
    .stat-icon {
      color: white;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .stat-info .stat-value {
      color: #fa709a;
    }
  }

  &.stat-users {
    .stat-icon {
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-info .stat-value {
      color: #667eea;
    }
  }

  &.stat-roles {
    .stat-icon {
      color: white;
      background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
    }

    .stat-info .stat-value {
      color: #30cfd0;
    }
  }

  &.stat-depts {
    .stat-icon {
      color: white;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .stat-info .stat-value {
      color: #fa709a;
    }
  }

  &.stat-plans {
    .stat-icon {
      color: white;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-info .stat-value {
      color: #f093fb;
    }
  }

  &.stat-warnings {
    .stat-icon {
      color: white;
      background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
    }

    .stat-info .stat-value {
      color: #f5576c;
    }
  }

  &.stat-urgent {
    .stat-icon {
      color: white;
      background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
    }

    .stat-info .stat-value {
      color: #f5576c;
    }
  }
}

// 卡片
.task-card,
.report-card,
.warning-card {
  margin-bottom: 16px;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;

    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

// 快速入口
.quick-access-card {
  margin-bottom: 20px;

  .quick-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 20px;
    color: #606266;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      color: #409eff;
      background-color: #f5f7fa;
      transform: translateY(-3px);
    }

    .el-icon {
      margin-bottom: 10px;
    }

    span {
      font-size: 14px;
    }
  }
}
</style>
