import request from "@/utils/request";

const ASSESSMENTRECORD_BASE_URL = "/api/v1/assessment-record";

const AssessmentRecordAPI = {
  /** 获取测评记录分页数据 */
  getPage(queryParams?: AssessmentRecordPageQuery) {
    return request<any, PageResult<AssessmentRecordPageVO[]>>({
      url: `${ASSESSMENTRECORD_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取测评记录表单数据
   *
   * @param id 测评记录ID
   * @returns 测评记录表单数据
   */
  getFormData(id: number) {
    return request<any, AssessmentRecordForm>({
      url: `${ASSESSMENTRECORD_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加测评记录
   *
   *  @param data 测评记录表单数据
   */
  create(data: AssessmentRecordForm) {
    return request({
      url: `${ASSESSMENTRECORD_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新测评记录
   *
   * @param id 测评记录ID
   * @param data 测评记录表单数据
   */
  update(id: string, data: AssessmentRecordForm) {
    return request({
      url: `${ASSESSMENTRECORD_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除测评记录，多个以英文逗号(,)分割
   *
   * @param ids 测评记录ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${ASSESSMENTRECORD_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AssessmentRecordAPI;

/** 测评记录分页查询参数 */
export interface AssessmentRecordPageQuery extends PageQuery {
  /** 任务分配ID */
  assignmentId?: number;
  /** 用户ID */
  userId?: number;
  /** 量表ID */
  scaleId?: number;
}

/** 测评记录表单对象 */
export interface AssessmentRecordForm {
  /** 测评记录ID */
  id?: number;
  /** 任务分配ID */
  assignmentId?: number;
  /** 用户ID */
  userId?: number;
  /** 量表ID */
  scaleId?: number;
  /** 量表版本ID */
  versionId?: number;
  /** 答题开始时间 */
  startTime?: Date;
  /** 答题完成时间 */
  finishTime?: Date;
  /** 总得分 */
  totalScore?: number;
  /** 完成率 */
  completionRate?: number;
  /** 状态：0未完成 1已完成 2中断 */
  status?: number;
  /** 作答时长（秒） */
  durationSecond?: number;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}

/** 测评记录分页对象 */
export interface AssessmentRecordPageVO {
  /** 测评记录ID */
  id?: number;
  /** 任务分配ID */
  assignmentId?: number;
  /** 用户ID */
  userId?: number;
  /** 量表ID */
  scaleId?: number;
  /** 量表版本ID */
  versionId?: number;
  /** 答题开始时间 */
  startTime?: Date;
  /** 答题完成时间 */
  finishTime?: Date;
  /** 总得分 */
  totalScore?: number;
  /** 完成率 */
  completionRate?: number;
  /** 状态：0未完成 1已完成 2中断 */
  status?: number;
  /** 作答时长（秒） */
  durationSecond?: number;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}
