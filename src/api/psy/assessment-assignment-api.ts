import request from "@/utils/request";

const ASSESSMENTASSIGNMENT_BASE_URL = "/api/v1/assessment-assignment";

const AssessmentAssignmentAPI = {
  /** 获取测评任务分配分页数据 */
  getPage(queryParams?: AssessmentAssignmentPageQuery) {
    return request<any, PageResult<AssessmentAssignmentPageVO[]>>({
      url: `${ASSESSMENTASSIGNMENT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取测评任务分配表单数据
   *
   * @param id 测评任务分配ID
   * @returns 测评任务分配表单数据
   */
  getFormData(id: number) {
    return request<any, AssessmentAssignmentForm>({
      url: `${ASSESSMENTASSIGNMENT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加测评任务分配
   *
   *  @param data 测评任务分配表单数据
   */
  create(data: AssessmentAssignmentForm) {
    return request({
      url: `${ASSESSMENTASSIGNMENT_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新测评任务分配
   *
   * @param id 测评任务分配ID
   * @param data 测评任务分配表单数据
   */
  update(id: string, data: AssessmentAssignmentForm) {
    return request({
      url: `${ASSESSMENTASSIGNMENT_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除测评任务分配，多个以英文逗号(,)分割
   *
   * @param ids 测评任务分配ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${ASSESSMENTASSIGNMENT_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default AssessmentAssignmentAPI;

/** 测评任务分配分页查询参数 */
export interface AssessmentAssignmentPageQuery extends PageQuery {
  /** 用户ID（单人分配） */
  userId?: number;
  /** 用户组ID（批量分配） */
  groupId?: number;
  /** 分配类型：0个人 1组 */
  assignType?: number;
  /** 状态：0未开始 1进行中 2已完成 3已过期 */
  status?: number;
}

/** 测评任务分配表单对象 */
export interface AssessmentAssignmentForm {
  /** 任务分配ID */
  id?: number;
  /** 测评计划ID */
  planId?: number;
  /** 用户ID（单人分配） */
  userId?: number;
  /** 用户组ID（批量分配） */
  groupId?: number;
  /** 分配类型：0个人 1组 */
  assignType?: number;
  /** 答题进度百分比 */
  progress?: number;
  /** 状态：0未开始 1进行中 2已完成 3已过期 */
  status?: number;
  /** 分配人ID */
  assignedBy?: number;
  /** 创建人 */
  createBy?: number;
}

/** 测评任务分配分页对象 */
export interface AssessmentAssignmentPageVO {
  /** 任务分配ID */
  id?: number;
  /** 测评计划ID */
  planId?: number;
  /** 用户ID（单人分配） */
  userId?: number;
  /** 用户组ID（批量分配） */
  groupId?: number;
  /** 分配类型：0个人 1组 */
  assignType?: number;
  /** 答题进度百分比 */
  progress?: number;
  /** 状态：0未开始 1进行中 2已完成 3已过期 */
  status?: number;
  /** 分配人ID */
  assignedBy?: number;
  /** 创建时间 */
  createTime?: Date;
}
