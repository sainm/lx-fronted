<template>
  <div class="assessment-container">
    <!-- 加载中 -->
    <div v-if="loading" class="loading-wrapper">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>正在加载题目...</p>
    </div>

    <!-- 答题主体 -->
    <div v-else-if="questions.length > 0" class="assessment-wrapper">
      <!-- 顶部进度条 -->
      <div class="assessment-header">
        <div class="header-info">
          <h2 class="assessment-title">{{ assessmentInfo.planName }}</h2>
          <div class="header-meta">
            <span class="scale-info">
              <el-icon><Document /></el-icon>
              {{ assessmentInfo.scaleName }} - {{ assessmentInfo.versionName }}
            </span>
            <span class="time-info">
              <el-icon><Clock /></el-icon>
              已用时: {{ formatTime(elapsedTime) }}
            </span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-info">
            <span>答题进度: {{ currentIndex + 1 }} / {{ questions.length }}</span>
            <span>{{ progressPercentage }}%</span>
          </div>
          <el-progress :percentage="progressPercentage" :color="progressColor" :show-text="false" />
        </div>
      </div>

      <!-- 题目内容卡片 -->
      <el-card class="question-card" shadow="always">
        <template #header>
          <div class="card-header">
            <span class="question-number">第 {{ currentIndex + 1 }} 题</span>
            <el-tag v-if="currentQuestion.dimensionName" type="info" size="small">
              {{ currentQuestion.dimensionName }}
            </el-tag>
          </div>
        </template>

        <!-- 题目文本 -->
        <div class="question-content">
          <div class="question-text">{{ currentQuestion.questionText }}</div>
        </div>

        <!-- 选项 -->
        <div class="options-wrapper">
          <!-- 单选题 -->
          <el-radio-group
            v-if="
              currentQuestion.questionType === 'single' || currentQuestion.questionType === 'likert'
            "
            v-model="currentAnswer.optionId"
            class="option-group"
            @change="handleAnswerChange"
          >
            <el-radio
              v-for="option in currentQuestion.options"
              :key="option.id"
              :value="option.id"
              class="option-item"
              border
            >
              <span class="option-key">{{ option.optionKey }}</span>
              <span class="option-text">{{ option.optionText }}</span>
            </el-radio>
          </el-radio-group>

          <!-- 多选题 -->
          <el-checkbox-group
            v-else-if="currentQuestion.questionType === 'multiple'"
            v-model="currentAnswer.optionIds"
            class="option-group"
            @change="handleAnswerChange"
          >
            <el-checkbox
              v-for="option in currentQuestion.options"
              :key="option.id"
              :value="option.id"
              class="option-item"
              border
            >
              <span class="option-key">{{ option.optionKey }}</span>
              <span class="option-text">{{ option.optionText }}</span>
            </el-checkbox>
          </el-checkbox-group>

          <!-- 主观题 -->
          <el-input
            v-else
            v-model="currentAnswer.answerText"
            type="textarea"
            :rows="6"
            placeholder="请输入您的答案..."
            class="text-answer-input"
            @input="handleAnswerChange"
          />
        </div>

        <!-- 答题提示 -->
        <div v-if="!isAnswered" class="answer-tip">
          <el-icon><InfoFilled /></el-icon>
          请选择或填写您的答案
        </div>
      </el-card>

      <!-- 底部导航 -->
      <div class="assessment-footer">
        <div class="nav-buttons">
          <el-button size="large" :disabled="currentIndex === 0" @click="handlePrevious">
            <el-icon><ArrowLeft /></el-icon>
            上一题
          </el-button>

          <el-button
            v-if="currentIndex < questions.length - 1"
            type="primary"
            size="large"
            :disabled="!isAnswered"
            @click="handleNext"
          >
            下一题
            <el-icon><ArrowRight /></el-icon>
          </el-button>

          <el-button
            v-else
            type="success"
            size="large"
            :disabled="!isAnswered"
            @click="handleSubmit"
          >
            <el-icon><Check /></el-icon>
            提交测评
          </el-button>
        </div>

        <!-- 题目导航 -->
        <div class="question-nav">
          <div class="nav-title">题目导航</div>
          <div class="nav-grid">
            <div
              v-for="(q, index) in questions"
              :key="q.id"
              class="nav-item"
              :class="{
                active: index === currentIndex,
                answered: answers[index]?.isAnswered,
              }"
              @click="handleJumpTo(index)"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无题目 -->
    <el-empty v-else description="暂无题目" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "Assessment" });

import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import QuestionAPI, { type QuestionDetailVO } from "@/api/psy/question-api";
import { type UserAnswerForm } from "@/api/psy/user-answer-api";
import AssessmentRecordAPI from "@/api/psy/assessment-record-api";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Loading,
  Document,
  Clock,
  InfoFilled,
  ArrowLeft,
  ArrowRight,
  Check,
} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

// 页面参数
const assignmentId = ref<number>();
const planId = ref<number>();
const versionId = ref<number>();
const recordId = ref<number>();

// 基础数据
const loading = ref(false);
const questions = ref<QuestionDetailVO[]>([]);
const currentIndex = ref(0);
const answers = ref<any[]>([]);
const startTime = ref<Date>(new Date());
const elapsedTime = ref(0);

// 测评信息
const assessmentInfo = reactive({
  planName: "",
  scaleName: "",
  versionName: "",
});

// 当前答案
interface CurrentAnswer {
  optionId?: number;
  optionIds?: number[];
  answerText?: string;
  isAnswered: boolean;
}

const currentAnswer = ref<CurrentAnswer>({
  isAnswered: false,
});

// 计算属性
const currentQuestion = computed(() => questions.value[currentIndex.value] || {});

const progressPercentage = computed(() => {
  if (questions.value.length === 0) return 0;
  const answeredCount = answers.value.filter((a) => a?.isAnswered).length;
  return Math.round((answeredCount / questions.value.length) * 100);
});

const progressColor = computed(() => {
  const p = progressPercentage.value;
  if (p < 30) return "#f56c6c";
  if (p < 70) return "#e6a23c";
  return "#67c23a";
});

const isAnswered = computed(() => currentAnswer.value.isAnswered);

// 初始化
const init = async () => {
  try {
    console.log("===== 答题画面初始化 =====");
    console.log("route.query:", route.query);

    // 获取路由参数
    assignmentId.value = Number(route.query.assignmentId);
    planId.value = Number(route.query.planId);
    versionId.value = Number(route.query.versionId);

    assessmentInfo.planName = route.query.planName as string;
    assessmentInfo.scaleName = route.query.scaleName as string;
    assessmentInfo.versionName = route.query.versionName as string;

    console.log("解析后的参数:");
    console.log("- assignmentId:", assignmentId.value);
    console.log("- planId:", planId.value);
    console.log("- versionId:", versionId.value);
    console.log("- planName:", assessmentInfo.planName);
    console.log("- scaleName:", assessmentInfo.scaleName);
    console.log("- versionName:", assessmentInfo.versionName);

    if (!versionId.value) {
      console.error("❌ 缺少 versionId 参数");
      ElMessage.error("缺少必要参数");
      router.back();
      return;
    }

    console.log("开始加载题目...");
    await loadQuestions();
    console.log(`✅ 题目加载成功，共 ${questions.value.length} 道题`);

    await initOrLoadRecord();
    startTimer();

    console.log("===== 初始化完成 =====");
  } catch (error) {
    console.error("❌ 初始化失败:", error);
    ElMessage.error("初始化失败");
  }
};

// 加载题目
const loadQuestions = async () => {
  loading.value = true;
  try {
    questions.value = await QuestionAPI.getQuestionsByVersion(versionId.value!);
    // 初始化答案数组
    answers.value = new Array(questions.value.length).fill(null).map(() => ({
      isAnswered: false,
    }));
    loadCurrentAnswer();
  } catch (error) {
    console.error("加载题目失败:", error);
    ElMessage.error("加载题目失败");
  } finally {
    loading.value = false;
  }
};

// 初始化或加载测评记录
const initOrLoadRecord = async () => {
  try {
    // TODO: 创建或获取测评记录
    // 如果是继续答题，需要加载已保存的答案
    recordId.value = 1; // 临时
  } catch (error) {
    console.error("初始化测评记录失败:", error);
  }
};

// 加载当前题目的答案
const loadCurrentAnswer = () => {
  const savedAnswer = answers.value[currentIndex.value];
  if (savedAnswer && savedAnswer.isAnswered) {
    currentAnswer.value = { ...savedAnswer };
  } else {
    currentAnswer.value = {
      optionId: undefined,
      optionIds: [],
      answerText: "",
      isAnswered: false,
    };
  }
};

// 处理答案变化
const handleAnswerChange = () => {
  const answer = currentAnswer.value;
  const question = currentQuestion.value;

  if (question.questionType === "single" || question.questionType === "likert") {
    answer.isAnswered = !!answer.optionId;
  } else if (question.questionType === "multiple") {
    answer.isAnswered = !!(answer.optionIds && answer.optionIds.length > 0);
  } else {
    answer.isAnswered = !!answer.answerText && answer.answerText.trim().length > 0;
  }

  // 保存到答案数组
  answers.value[currentIndex.value] = { ...answer };
};

// 上一题
const handlePrevious = () => {
  if (currentIndex.value > 0) {
    saveCurrentAnswer();
    currentIndex.value--;
    loadCurrentAnswer();
  }
};

// 下一题
const handleNext = () => {
  if (currentIndex.value < questions.value.length - 1) {
    saveCurrentAnswer();
    currentIndex.value++;
    loadCurrentAnswer();
  }
};

// 跳转到指定题目
const handleJumpTo = (index: number) => {
  if (index !== currentIndex.value) {
    saveCurrentAnswer();
    currentIndex.value = index;
    loadCurrentAnswer();
  }
};

// 保存当前答案
const saveCurrentAnswer = async () => {
  if (!isAnswered.value) return;

  try {
    const question = currentQuestion.value;
    const answer = currentAnswer.value;

    const answerData: UserAnswerForm = {
      recordId: recordId.value,
      questionId: question.id,
      optionId: answer.optionId,
      answerText: answer.answerText,
      timeSpent: Math.floor((Date.now() - startTime.value.getTime()) / 1000),
    };

    // TODO: 调用API保存答案
    // await UserAnswerAPI.saveAnswer(answerData);
    console.log("保存答案:", answerData);
  } catch (error) {
    console.error("保存答案失败:", error);
  }
};

// 提交测评
const handleSubmit = () => {
  const unansweredCount =
    questions.value.length - answers.value.filter((a) => a?.isAnswered).length;

  if (unansweredCount > 0) {
    ElMessageBox.confirm(`还有 ${unansweredCount} 道题未作答，确定要提交吗？`, "提示", {
      confirmButtonText: "确定提交",
      cancelButtonText: "继续答题",
      type: "warning",
    })
      .then(() => {
        submitAssessment();
      })
      .catch(() => {
        // 取消提交
      });
  } else {
    ElMessageBox.confirm("确定要提交测评吗？提交后将无法修改。", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info",
    })
      .then(() => {
        submitAssessment();
      })
      .catch(() => {
        // 取消提交
      });
  }
};

// 执行提交
const submitAssessment = async () => {
  try {
    loading.value = true;

    // 保存所有答案
    await saveAllAnswers();

    // 提交测评记录
    await AssessmentRecordAPI.submit(recordId.value!);

    ElMessage.success("提交成功！");

    // 跳转到结果页或任务列表
    setTimeout(() => {
      router.push("/eva/my-tasks");
    }, 1500);
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("提交失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 保存所有答案
const saveAllAnswers = async () => {
  const answerList: UserAnswerForm[] = [];

  questions.value.forEach((question, index) => {
    const answer = answers.value[index];
    if (answer && answer.isAnswered) {
      answerList.push({
        recordId: recordId.value,
        questionId: question.id,
        optionId: answer.optionId,
        answerText: answer.answerText,
        timeSpent: 0,
      });
    }
  });

  // TODO: 批量保存答案
  // await UserAnswerAPI.batchSaveAnswers(answerList);
  console.log("批量保存答案:", answerList);
};

// 计时器
let timer: any = null;
const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++;
  }, 1000);
};

// 格式化时间
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h}小时`);
  if (m > 0) parts.push(`${m}分`);
  parts.push(`${s}秒`);

  return parts.join("");
};

// 页面离开前确认
onBeforeRouteLeave((to, from, next) => {
  if (loading.value) {
    next();
    return;
  }

  ElMessageBox.confirm("答题尚未提交，确定要离开吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      next();
    })
    .catch(() => {
      next(false);
    });
});

// 初始化和清理
onMounted(() => {
  init();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style lang="scss" scoped>
.assessment-container {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;

  .el-icon {
    margin-bottom: 16px;
    font-size: 48px;
  }

  p {
    font-size: 18px;
  }
}

.assessment-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.assessment-header {
  padding: 24px;
  margin-bottom: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .header-info {
    margin-bottom: 20px;

    .assessment-title {
      margin: 0 0 12px 0;
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }

    .header-meta {
      display: flex;
      gap: 24px;
      font-size: 14px;
      color: #606266;

      span {
        display: flex;
        gap: 6px;
        align-items: center;

        :deep(.el-icon) {
          font-size: 16px;
        }
      }
    }
  }

  .progress-bar {
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #606266;
    }
  }
}

.question-card {
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .question-number {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .question-content {
    margin-bottom: 32px;

    .question-text {
      font-size: 18px;
      line-height: 1.8;
      color: #303133;
      white-space: pre-wrap;
    }
  }

  .options-wrapper {
    .option-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .option-item {
      display: flex;
      align-items: center;
      width: 100%;
      height: auto;
      padding: 16px;
      margin: 0;

      :deep(.el-radio__label),
      :deep(.el-checkbox__label) {
        display: flex;
        flex: 1;
        gap: 12px;
        align-items: center;
        line-height: 1.6;
        white-space: normal;
      }

      .option-key {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        font-size: 14px;
        font-weight: 600;
        color: #606266;
        background: #f5f7fa;
        border-radius: 50%;
      }

      .option-text {
        flex: 1;
        font-size: 16px;
      }

      &:hover {
        border-color: #409eff;
      }
    }

    .text-answer-input {
      margin-top: 16px;
    }
  }

  .answer-tip {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 12px;
    margin-top: 24px;
    font-size: 14px;
    color: #909399;
    background: #f4f4f5;
    border-radius: 6px;

    :deep(.el-icon) {
      font-size: 16px;
    }
  }
}

.assessment-footer {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .nav-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 24px;

    .el-button {
      min-width: 120px;
    }
  }

  .question-nav {
    .nav-title {
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #606266;
    }

    .nav-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
      gap: 8px;

      .nav-item {
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        transition: all 0.3s;

        &:hover {
          color: #409eff;
          border-color: #409eff;
        }

        &.active {
          color: white;
          background: #409eff;
          border-color: #409eff;
        }

        &.answered:not(.active) {
          color: white;
          background: #67c23a;
          border-color: #67c23a;
        }
      }
    }
  }
}
</style>
