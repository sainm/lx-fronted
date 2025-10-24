import request from "@/utils/request";

const QUESTIONWEIGHT_BASE_URL = "/api/v1/question-weight";

const QuestionWeightAPI = {
  /** 获取计分规则题目权重分页数据 */
  getPage(queryParams?: QuestionWeightPageQuery) {
    return request<any, PageResult<QuestionWeightPageVO[]>>({
      url: `${QUESTIONWEIGHT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取计分规则题目权重表单数据
   *
   * @param id 计分规则题目权重ID
   * @returns 计分规则题目权重表单数据
   */
  getFormData(id: number) {
    return request<any, QuestionWeightForm>({
      url: `${QUESTIONWEIGHT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加计分规则题目权重
   *
   *  @param data 计分规则题目权重表单数据
   */
  create(data: QuestionWeightForm) {
    return request({
      url: `${QUESTIONWEIGHT_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新计分规则题目权重
   *
   * @param id 计分规则题目权重ID
   * @param data 计分规则题目权重表单数据
   */
  update(id: string, data: QuestionWeightForm) {
    return request({
      url: `${QUESTIONWEIGHT_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除计分规则题目权重，多个以英文逗号(,)分割
   *
   * @param ids 计分规则题目权重ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${QUESTIONWEIGHT_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default QuestionWeightAPI;

/** 计分规则题目权重分页查询参数 */
export interface QuestionWeightPageQuery extends PageQuery {}

/** 计分规则题目权重表单对象 */
export interface QuestionWeightForm {
  id?: number;
  /** 所属计分规则ID */
  ruleId?: number;
  /** 题目ID */
  questionId?: number;
  /** 题目权重 */
  weight?: number;
  /** 创建人ID */
  createBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新人ID */
  updateBy?: number;
  /** 更新时间 */
  updateTime?: Date;
  /** 是否删除（0: 未删除, 1: 已删除） */
  isDeleted?: number;
}

/** 计分规则题目权重分页对象 */
export interface QuestionWeightPageVO {
  id?: number;
  /** 所属计分规则ID */
  ruleId?: number;
  /** 题目ID */
  questionId?: number;
  /** 题目权重 */
  weight?: number;
  /** 创建人ID */
  createBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新人ID */
  updateBy?: number;
  /** 更新时间 */
  updateTime?: Date;
  /** 是否删除（0: 未删除, 1: 已删除） */
  isDeleted?: number;
}
