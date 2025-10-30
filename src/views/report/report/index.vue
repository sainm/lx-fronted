<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item class="search-buttons">
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-10px">
        <el-button
          v-hasPerm="['psy:report:add']"
          type="success"
          icon="plus"
          @click="handleOpenDialog()"
        >
          新增
        </el-button>
        <el-button
          v-hasPerm="['psy:report:delete']"
          type="danger"
          :disabled="removeIds.length === 0"
          icon="delete"
          @click="handleDelete()"
        >
          删除
        </el-button>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" :index="indexMethod" />
        <el-table-column key="id" label="报告ID" prop="id" min-width="150" align="center" />
        <el-table-column
          key="recordId"
          label="测评记录ID"
          prop="recordId"
          min-width="150"
          align="center"
        />
        <el-table-column key="userId" label="用户ID" prop="userId" min-width="150" align="center" />
        <el-table-column
          key="scaleId"
          label="量表ID"
          prop="scaleId"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="totalScore"
          label="总分"
          prop="totalScore"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="resultLevel"
          label="结果等级（如低、中、高风险）"
          prop="resultLevel"
          min-width="150"
          align="center"
        />
        <!-- <el-table-column
          key="resultJson"
          label="结果详情（维度分数、解释说明等）"
          prop="resultJson"
          min-width="150"
          align="center"
        /> -->
        <el-table-column
          key="suggestion"
          label="系统建议或干预建议"
          prop="suggestion"
          min-width="150"
          align="center"
        />
        <!-- <el-table-column
          key="createBy"
          label="创建人"
          prop="createBy"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="updateBy"
          label="最后修改人"
          prop="updateBy"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="createTime"
          label="生成时间"
          prop="createTime"
          min-width="150"
          align="center"
        />
        <el-table-column
          key="updateTime"
          label="更新时间"
          prop="updateTime"
          min-width="150"
          align="center"
        /> -->
        <el-table-column fixed="right" label="操作" width="280">
          <template #default="scope">
            <el-button
              type="info"
              size="small"
              link
              icon="view"
              @click="handleViewDetail(scope.row.id)"
            >
              详细
            </el-button>
            <el-button
              v-hasPerm="['psy:report:edit']"
              type="primary"
              size="small"
              link
              icon="edit"
              @click="handleOpenDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPerm="['psy:report:delete']"
              type="danger"
              size="small"
              link
              icon="delete"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery()"
      />
    </el-card>

    <!-- 测评报告表单弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="报告ID" prop="id">
          <el-input v-model="formData.id" placeholder="报告ID" />
        </el-form-item>

        <el-form-item label="测评记录ID" prop="recordId">
          <el-input v-model="formData.recordId" placeholder="测评记录ID" />
        </el-form-item>

        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formData.userId" placeholder="用户ID" />
        </el-form-item>

        <el-form-item label="量表ID" prop="scaleId">
          <el-input v-model="formData.scaleId" placeholder="量表ID" />
        </el-form-item>

        <el-form-item label="总分" prop="totalScore">
          <el-input v-model="formData.totalScore" placeholder="总分" />
        </el-form-item>

        <el-form-item label="结果等级（如低、中、高风险）" prop="resultLevel">
          <el-input v-model="formData.resultLevel" placeholder="结果等级（如低、中、高风险）" />
        </el-form-item>

        <!-- <el-form-item label="结果详情（维度分数、解释说明等）" prop="resultJson">
          <el-input v-model="formData.resultJson" placeholder="结果详情（维度分数、解释说明等）" />
        </el-form-item> -->

        <el-form-item label="系统建议或干预建议" prop="suggestion">
          <el-input v-model="formData.suggestion" placeholder="系统建议或干预建议" />
        </el-form-item>

        <el-form-item label="创建人" prop="createBy">
          <el-input v-model="formData.createBy" placeholder="创建人" />
        </el-form-item>

        <el-form-item label="最后修改人" prop="updateBy">
          <el-input v-model="formData.updateBy" placeholder="最后修改人" />
        </el-form-item>

        <el-form-item label="生成时间" prop="createTime">
          <el-date-picker
            v-model="formData.createTime"
            type="datetime"
            placeholder="生成时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="更新时间" prop="updateTime">
          <el-date-picker
            v-model="formData.updateTime"
            type="datetime"
            placeholder="更新时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit()">确定</el-button>
          <el-button @click="handleCloseDialog()">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 报告详细信息弹窗 -->
    <el-dialog v-model="detailDialog.visible" title="报告详细信息" width="800px">
      <el-descriptions v-loading="detailDialog.loading" :column="2" border>
        <el-descriptions-item label="报告ID">{{ detailData.id || "-" }}</el-descriptions-item>
        <el-descriptions-item label="测评记录ID">
          {{ detailData.recordId || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detailData.userId || "-" }}</el-descriptions-item>
        <el-descriptions-item label="量表ID">{{ detailData.scaleId || "-" }}</el-descriptions-item>
        <el-descriptions-item label="总分">{{ detailData.totalScore || "-" }}</el-descriptions-item>
        <el-descriptions-item label="结果等级">
          {{ detailData.resultLevel || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="系统建议或干预建议" :span="2">
          {{ detailData.suggestion || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ detailData.createBy || "-" }}</el-descriptions-item>
        <el-descriptions-item label="最后修改人">
          {{ detailData.updateBy || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="生成时间">
          {{ detailData.createTime ? formatDateTime(detailData.createTime) : "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ detailData.updateTime ? formatDateTime(detailData.updateTime) : "-" }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="success" @click="handleGenerateReport">生成报告</el-button>
          <el-button type="primary" @click="detailDialog.visible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 正式心理评测报告弹窗 -->
    <el-dialog
      v-model="reportDialog.visible"
      title="心理评测报告"
      width="900px"
      class="report-dialog"
      @close="handleCloseReportDialog"
    >
      <div id="report-content" v-loading="reportDialog.loading" class="report-content">
        <!-- 报告头部 -->
        <div class="report-header">
          <h1 class="report-title">心理评测报告</h1>
          <div class="report-subtitle">Psychological Assessment Report</div>
        </div>

        <!-- 基本信息 -->
        <div class="report-section">
          <h2 class="section-title">一、基本信息</h2>
          <el-descriptions :column="2" border class="report-descriptions">
            <el-descriptions-item label="报告编号">
              {{ reportDetailData.id || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="测评记录ID">
              {{ reportDetailData.recordId || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="用户ID">
              {{ reportDetailData.userId || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="用户姓名">
              {{ reportDetailData.userName || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="量表名称">
              {{ reportDetailData.scaleName || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="版本名称">
              {{ reportDetailData.versionName || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="报告生成时间" :span="2">
              {{ reportDetailData.createTime ? formatDateTime(reportDetailData.createTime) : "-" }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 测评结果 -->
        <div class="report-section">
          <h2 class="section-title">二、测评结果</h2>
          <el-descriptions :column="2" border class="report-descriptions">
            <el-descriptions-item label="总分">
              <span class="score-value">{{ reportDetailData.totalScore || 0 }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="总题数">
              {{ reportDetailData.totalQuestions || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="完成率">
              <el-progress
                :percentage="reportDetailData.completionRate || 0"
                :format="(percentage) => `${percentage}%`"
              />
            </el-descriptions-item>
            <el-descriptions-item label="答题时长">
              {{ formatDuration(reportDetailData.durationSecond) }}
            </el-descriptions-item>
            <el-descriptions-item label="结果等级" :span="2">
              <el-tag
                :type="(getLevelTagType(reportDetailData.resultLevel) || 'info') as any"
                size="large"
                class="level-tag"
              >
                {{ reportDetailData.resultLevel || "-" }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 维度得分 -->
        <div
          v-if="reportDetailData.dimensionScores && reportDetailData.dimensionScores.length > 0"
          class="report-section"
        >
          <h2 class="section-title">三、维度得分分析</h2>
          <el-table
            :data="reportDetailData.dimensionScores"
            border
            class="dimension-table"
            style="width: 100%"
          >
            <el-table-column prop="dimensionName" label="维度名称" align="center" width="150" />
            <el-table-column prop="score" label="得分" align="center" width="100" />
            <el-table-column prop="maxScore" label="满分" align="center" width="100" />
            <el-table-column label="得分率" align="center" width="150">
              <template #default="scope">
                <el-progress
                  :percentage="scope.row.scoreRate || 0"
                  :format="(percentage) => `${percentage}%`"
                />
              </template>
            </el-table-column>
            <el-table-column prop="level" label="等级" align="center" width="100">
              <template #default="scope">
                <el-tag :type="(getLevelTagType(scope.row.level) || 'info') as any" size="small">
                  {{ scope.row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="说明" align="left" min-width="200" />
          </el-table>
        </div>

        <!-- 评估建议 -->
        <div class="report-section">
          <h2 class="section-title">四、评估建议</h2>
          <div class="suggestion-content">
            <p v-if="reportDetailData.suggestion">{{ reportDetailData.suggestion }}</p>
            <p v-else class="text-muted">暂无评估建议</p>
          </div>
        </div>

        <!-- 报告说明 -->
        <div class="report-footer">
          <p class="footer-note">本报告仅作为参考，如需专业心理辅导，请咨询专业心理医生。</p>
          <p class="footer-date">
            报告生成时间：
            {{ reportDetailData.createTime ? formatDateTime(reportDetailData.createTime) : "-" }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handlePrintReport">打印报告</el-button>
          <el-button type="success" @click="handleExportPDF">导出PDF</el-button>
          <el-button @click="reportDialog.visible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Report",
  inheritAttrs: false,
});

import ReportAPI, {
  ReportPageVO,
  ReportForm,
  ReportPageQuery,
  ReportDetailVO,
} from "@/api/report/report-api";

const queryFormRef = ref();
const dataFormRef = ref();

const loading = ref(false);
const removeIds = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<ReportPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 测评报告表格数据
const pageData = ref<ReportPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

// 详细信息弹窗
const detailDialog = reactive({
  visible: false,
  loading: false,
});

// 测评报告表单数据
const formData = reactive<ReportForm>({});

// 报告详细信息数据
const detailData = reactive<ReportForm>({});

// 正式报告弹窗
const reportDialog = reactive({
  visible: false,
  loading: false,
});

// 报告详细数据（用于正式报告）
const reportDetailData = reactive<ReportDetailVO>({});

// 测评报告表单校验规则
const rules = reactive({
  id: [{ required: true, message: "请输入报告ID", trigger: "blur" }],
  recordId: [{ required: true, message: "请输入测评记录ID", trigger: "blur" }],
  userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
  scaleId: [{ required: true, message: "请输入量表ID", trigger: "blur" }],
});

/** 查询测评报告 */
function handleQuery() {
  loading.value = true;
  ReportAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置测评报告查询 */
function handleResetQuery() {
  queryFormRef.value!.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 序号计算方法 */
function indexMethod(index: number) {
  return (queryParams.pageNum - 1) * queryParams.pageSize + index + 1;
}

/** 打开测评报告弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改测评报告";
    ReportAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增测评报告";
  }
}

/** 提交测评报告表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        ReportAPI.update(String(id), formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        ReportAPI.create(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭测评报告弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = undefined;
}

/** 删除测评报告 */
function handleDelete(id?: number) {
  const ids = [id || removeIds.value].join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      ReportAPI.deleteByIds(ids)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

/** 查看报告详细信息 */
function handleViewDetail(id: number) {
  detailDialog.visible = true;
  detailDialog.loading = true;
  // 清空之前的数据
  Object.keys(detailData).forEach((key) => {
    delete detailData[key as keyof ReportForm];
  });
  ReportAPI.getFormData(id)
    .then((data) => {
      Object.assign(detailData, data);
    })
    .catch(() => {
      ElMessage.error("获取报告详细信息失败");
    })
    .finally(() => {
      detailDialog.loading = false;
    });
}

/** 格式化日期时间 */
function formatDateTime(date: Date | string | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/** 格式化时长（秒转分钟） */
function formatDuration(seconds: number | undefined): string {
  if (!seconds && seconds !== 0) return "-";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
}

/** 获取等级标签类型 */
function getLevelTagType(level: string | undefined): string {
  if (!level) return "";
  const levelLower = level.toLowerCase();
  if (levelLower.includes("低") || levelLower.includes("正常")) {
    return "success";
  } else if (levelLower.includes("中")) {
    return "warning";
  } else if (levelLower.includes("高") || levelLower.includes("严重")) {
    return "danger";
  }
  return "";
}

/** 生成正式报告 */
function handleGenerateReport() {
  if (!detailData.id) {
    ElMessage.warning("报告ID不存在");
    return;
  }

  // 如果有recordId，优先使用getByRecordId获取更详细的数据
  if (detailData.recordId) {
    reportDialog.loading = true;
    reportDialog.visible = true;
    ReportAPI.getByRecordId(detailData.recordId)
      .then((data) => {
        Object.keys(reportDetailData).forEach((key) => {
          delete reportDetailData[key as keyof ReportDetailVO];
        });
        Object.assign(reportDetailData, data);
      })
      .catch(() => {
        ElMessage.error("获取详细报告数据失败，使用基本信息");
        // 如果失败，使用基本信息
        Object.keys(reportDetailData).forEach((key) => {
          delete reportDetailData[key as keyof ReportDetailVO];
        });
        Object.assign(reportDetailData, detailData);
      })
      .finally(() => {
        reportDialog.loading = false;
      });
  } else {
    // 如果没有recordId，使用基本信息
    reportDialog.visible = true;
    Object.keys(reportDetailData).forEach((key) => {
      delete reportDetailData[key as keyof ReportDetailVO];
    });
    Object.assign(reportDetailData, detailData);
  }
}

/** 关闭报告对话框 */
function handleCloseReportDialog() {
  reportDialog.visible = false;
  Object.keys(reportDetailData).forEach((key) => {
    delete reportDetailData[key as keyof ReportDetailVO];
  });
}

/** 打印报告 */
function handlePrintReport() {
  const printContent = document.getElementById("report-content");
  if (!printContent) {
    ElMessage.error("报告内容不存在");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    ElMessage.error("无法打开打印窗口，请检查浏览器弹窗设置");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>心理评测报告</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: "Microsoft YaHei", "SimSun", Arial, sans-serif;
          padding: 40px;
          line-height: 1.6;
          color: #333;
        }
        .report-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #409eff;
        }
        .report-title {
          font-size: 28px;
          font-weight: bold;
          color: #409eff;
          margin-bottom: 10px;
        }
        .report-subtitle {
          font-size: 16px;
          color: #909399;
          font-style: italic;
        }
        .report-section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 15px;
          padding-left: 10px;
          border-left: 4px solid #409eff;
        }
        .report-footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #dcdfe6;
          text-align: center;
          color: #909399;
          font-size: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        table th,
        table td {
          border: 1px solid #dcdfe6;
          padding: 8px;
          text-align: left;
        }
        table th {
          background-color: #f5f7fa;
          font-weight: bold;
          text-align: center;
        }
        .score-value {
          font-size: 24px;
          font-weight: bold;
          color: #409eff;
        }
        .suggestion-content {
          padding: 15px;
          background-color: #f5f7fa;
          border-radius: 4px;
          line-height: 1.8;
        }
        @media print {
          body {
            padding: 20px;
          }
          .report-header {
            page-break-after: avoid;
          }
          .report-section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${printContent.innerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

/** 导出PDF（使用浏览器打印功能） */
function handleExportPDF() {
  ElMessage.info("正在准备PDF导出，请在弹出的打印窗口中选择'另存为PDF'");
  handlePrintReport();
}

onMounted(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
.report-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.report-content {
  font-family: "Microsoft YaHei", "SimSun", Arial, sans-serif;
  line-height: 1.6;
  color: #303133;

  .report-header {
    padding-bottom: 20px;
    margin-bottom: 40px;
    text-align: center;
    border-bottom: 3px solid #409eff;

    .report-title {
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: bold;
      color: #409eff;
    }

    .report-subtitle {
      font-size: 16px;
      font-style: italic;
      color: #909399;
    }
  }

  .report-section {
    margin-bottom: 30px;

    .section-title {
      padding-left: 10px;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      border-left: 4px solid #409eff;
    }
  }

  .report-descriptions {
    :deep(.el-descriptions__label) {
      width: 120px;
      font-weight: 500;
    }
  }

  .score-value {
    font-size: 24px;
    font-weight: bold;
    color: #409eff;
  }

  .level-tag {
    padding: 4px 12px;
    font-size: 14px;
  }

  .dimension-table {
    margin-top: 15px;
  }

  .suggestion-content {
    min-height: 80px;
    padding: 15px;
    line-height: 1.8;
    background-color: #f5f7fa;
    border-radius: 4px;

    p {
      margin: 0;
      color: #606266;
    }

    .text-muted {
      font-style: italic;
      color: #909399;
    }
  }

  .report-footer {
    padding-top: 20px;
    margin-top: 50px;
    text-align: center;
    border-top: 1px solid #dcdfe6;

    .footer-note {
      margin-bottom: 10px;
      font-size: 12px;
      color: #909399;
    }

    .footer-date {
      font-size: 12px;
      color: #909399;
    }
  }
}

@media print {
  .report-content {
    .report-header {
      page-break-after: avoid;
    }

    .report-section {
      page-break-inside: avoid;
    }
  }
}
</style>
