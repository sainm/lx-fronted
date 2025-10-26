import request from "@/utils/request";

const ASSESSMENTPLAN_BASE_URL = "/api/v1/assessment-plan";

const AssessmentPlanAPI = {
  /** 获取测评计划分页数据 */
  getPage(queryParams?: AssessmentPlanPageQuery) {
    return request<any, PageResult<AssessmentPlanPageVO[]>>({
      url: `${ASSESSMENTPLAN_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取测评计划表单数据
   *
   * @param id 测评计划ID
   * @returns 测评计划表单数据
   */
  getFormData(id: number) {
    return request<any, AssessmentPlanForm>({
      url: `${ASSESSMENTPLAN_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加测评计划
   *
   *  @param data 测评计划表单数据
   */
  create(data: AssessmentPlanForm) {
    return request({
      url: `${ASSESSMENTPLAN_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新测评计划
   *
   * @param id 测评计划ID
   * @param data 测评计划表单数据
   */
  update(id: string, data: AssessmentPlanForm) {
    return request({
      url: `${ASSESSMENTPLAN_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除测评计划，多个以英文逗号(,)分割
   *
   * @param ids 测评计划ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${ASSESSMENTPLAN_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AssessmentPlanAPI;

/** 测评计划分页查询参数 */
export interface AssessmentPlanPageQuery extends PageQuery {
  /** 测评计划名称 */
  name?: string;
  /** 目标群体（标签或分组描述） */
  targetGroup?: string;
  /** 开始时间 */
  startTime?: [string, string];
  /** 结束时间 */
  endTime?: [string, string];
  /** 状态：1启用 0停用 */
  status?: number;
}

/** 测评计划表单对象 */
export interface AssessmentPlanForm {
  /** 测评计划ID */
  id?: number;
  /** 测评计划名称 */
  name?: string;
  /** 测评计划说明 */
  description?: string;
  /** 量表ID */
  scaleId?: number;
  /** 量表版本ID */
  versionId?: number;
  /** 目标群体（标签或分组描述） */
  targetGroup?: string;
  /** 开始时间 */
  startTime?: Date;
  /** 结束时间 */
  endTime?: Date;
  /** 创建人ID */
  creatorId?: number;
  /** 状态：1启用 0停用 */
  status?: number;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}

/** 测评计划分页对象 */
export interface AssessmentPlanPageVO {
  /** 测评计划ID */
  id?: number;
  /** 测评计划名称 */
  name?: string;
  /** 测评计划说明 */
  description?: string;
  /** 量表ID */
  scaleId?: number;
  /** 量表版本ID */
  versionId?: number;
  /** 目标群体（标签或分组描述） */
  targetGroup?: string;
  /** 开始时间 */
  startTime?: Date;
  /** 结束时间 */
  endTime?: Date;
  /** 创建人ID */
  creatorId?: number;
  /** 状态：1启用 0停用 */
  status?: number;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}
