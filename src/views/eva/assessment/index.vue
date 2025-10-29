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
          <h2 class="assessment-title">{{ props.planName }}</h2>
          <div class="header-meta">
            <span class="scale-info">
              <el-icon><Document /></el-icon>
              {{ props.scaleName }} - {{ props.versionName }}
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
          <el-button size="large" @click="handleExit">
            <el-icon><Close /></el-icon>
            退出答题
          </el-button>

          <div class="nav-buttons-center">
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

          <div style="width: 120px"></div>
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

import QuestionAPI, { type QuestionDetailVO } from "@/api/psy/question-api";
import UserAnswerAPI, { type UserAnswerForm } from "@/api/psy/user-answer-api";
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
  Close,
} from "@element-plus/icons-vue";

// 定义 props
interface Props {
  assignmentId?: number;
  planId?: number;
  versionId: number;
  planName?: string;
  scaleName?: string;
  versionName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  planName: "",
  scaleName: "",
  versionName: "",
});

// 定义 emits
const emit = defineEmits<{
  close: [];
  success: [];
}>();

// 页面参数
const recordId = ref<number>();

// 基础数据
const loading = ref(false);
const questions = ref<QuestionDetailVO[]>([]);
const currentIndex = ref(0);
const answers = ref<any[]>([]);
const elapsedTime = ref(0); // 总答题时长（秒）
const questionStartTime = ref<Date>(new Date()); // 当前题目开始时间

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
    console.log("props:", props);

    console.log("参数:");
    console.log("- assignmentId:", props.assignmentId);
    console.log("- planId:", props.planId);
    console.log("- versionId:", props.versionId);
    console.log("- planName:", props.planName);
    console.log("- scaleName:", props.scaleName);
    console.log("- versionName:", props.versionName);

    if (!props.versionId) {
      console.error("❌ 缺少 versionId 参数");
      ElMessage.error("缺少必要参数");
      emit("close");
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

// 题型转换函数
const convertQuestionType = (type: string | undefined): string => {
  const typeMap: Record<string, string> = {
    "1": "single", // 单选
    "2": "multiple", // 多选
    "3": "likert", // 李克特量表
    "4": "text", // 主观题
  };
  return typeMap[type || "1"] || "single";
};

// 生成选项标识 (A, B, C, D...)
const generateOptionKey = (index: number): string => {
  return String.fromCharCode(65 + index); // 65 是 'A' 的 ASCII 码
};

// 加载题目
const loadQuestions = async () => {
  loading.value = true;
  try {
    console.log("正在加载题目，versionId:", props.versionId);
    console.log("API URL: /api/v1/question/version/" + props.versionId);

    const rawQuestions = await QuestionAPI.getQuestionsByVersion(props.versionId);

    console.log("✅ 原始题目数据:", rawQuestions);

    // 转换题目数据格式
    questions.value = rawQuestions.map((q) => ({
      ...q,
      // 转换题型
      questionType: convertQuestionType(q.questionType),
      // 为选项生成 optionKey (A, B, C, D...)
      options: (q.options || []).map((opt, index) => ({
        ...opt,
        optionKey: opt.optionKey || generateOptionKey(index),
      })),
    }));

    console.log("✅ 题目加载成功，数量:", questions.value.length);
    console.log("转换后的题目数据:", questions.value);

    // 初始化答案数组
    answers.value = new Array(questions.value.length).fill(null).map(() => ({
      isAnswered: false,
    }));
    loadCurrentAnswer();
  } catch (error: any) {
    console.error("❌ 加载题目失败:");
    console.error("- 错误对象:", error);
    console.error("- 错误消息:", error.message);
    console.error("- versionId:", props.versionId);

    ElMessage.error(`加载题目失败: ${error.message || "未知错误"}`);
  } finally {
    loading.value = false;
  }
};

// 初始化或加载测评记录
const initOrLoadRecord = async () => {
  try {
    console.log("初始化测评记录, assignmentId:", props.assignmentId);

    if (!props.assignmentId) {
      console.warn("⚠️ 缺少 assignmentId，无法创建测评记录");
      ElMessage.warning("缺少任务信息");
      return;
    }

    // 调用后端接口：获取或创建测评记录
    const record = await AssessmentRecordAPI.getOrCreate(props.assignmentId);

    recordId.value = record.id;

    console.log("✅ 测评记录初始化成功, recordId:", recordId.value);
    console.log("测评记录详情:", record);

    // 如果是继续答题，加载已保存的答案
    if (record.status === 1) {
      console.log("检测到未完成的测评记录，加载已保存的答案...");
      await loadSavedAnswers();
    }
  } catch (error) {
    console.error("❌ 初始化测评记录失败:", error);
    ElMessage.error("初始化测评记录失败");
  }
};

// 加载已保存的答案（继续答题时）
const loadSavedAnswers = async () => {
  try {
    if (!recordId.value) return;

    const savedAnswers = await UserAnswerAPI.getAnswersByRecord(recordId.value);

    console.log("加载到的已保存答案:", savedAnswers);

    // 将已保存的答案映射到 answers 数组
    savedAnswers.forEach((savedAnswer) => {
      const questionIndex = questions.value.findIndex((q) => q.id === savedAnswer.questionId);

      if (questionIndex !== -1) {
        answers.value[questionIndex] = {
          optionId: savedAnswer.optionId,
          answerText: savedAnswer.answerText,
          isAnswered: true,
        };
      }
    });

    console.log(`✅ 已加载 ${savedAnswers.length} 条答案`);
  } catch (error) {
    console.error("❌ 加载已保存答案失败:", error);
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
  // 重置当前题目开始时间
  questionStartTime.value = new Date();
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

// 退出答题
const handleExit = () => {
  emit("close");
};

// 保存当前答案
const saveCurrentAnswer = async () => {
  if (!isAnswered.value) return;

  try {
    const question = currentQuestion.value;
    const answer = currentAnswer.value;

    // 计算当前题目的答题时长
    const timeSpent = Math.floor((Date.now() - questionStartTime.value.getTime()) / 1000);

    const answerData: UserAnswerForm = {
      recordId: recordId.value,
      questionId: question.id,
      optionId: answer.optionId,
      answerText: answer.answerText,
      timeSpent,
    };

    console.log("保存答案到后端:", answerData);

    // 调用API保存答案（每道题答完就保存）
    await UserAnswerAPI.saveAnswer(answerData);

    console.log("✅ 答案保存成功");
  } catch (error) {
    console.error("❌ 保存答案失败:", error);
    ElMessage.warning("答案保存失败，请检查网络连接");
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

    // 保存当前题目的答案（如果有的话）
    await saveCurrentAnswer();

    // 提交测评记录
    await AssessmentRecordAPI.submit(recordId.value!);

    ElMessage.success("提交成功！");

    // 通知父组件提交成功
    setTimeout(() => {
      emit("success");
      emit("close");
    }, 1500);
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("提交失败，请重试");
  } finally {
    loading.value = false;
  }
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
  padding: 20px;
  background: #f5f7fa;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #606266;

  .el-icon {
    margin-bottom: 16px;
    font-size: 48px;
  }

  p {
    font-size: 18px;
  }
}

.assessment-wrapper {
  max-width: 1000px;
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
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .nav-buttons-center {
      display: flex;
      gap: 16px;
    }

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
