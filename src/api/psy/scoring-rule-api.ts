import request from "@/utils/request";

const SCORINGRULE_BASE_URL = "/api/v1/scoring-rule";

const ScoringRuleAPI = {
  /** 获取计分规则主（维度）分页数据 */
  getPage(queryParams?: ScoringRulePageQuery) {
    return request<any, PageResult<ScoringRulePageVO[]>>({
      url: `${SCORINGRULE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取计分规则主（维度）表单数据
   *
   * @param id 计分规则主（维度）ID
   * @returns 计分规则主（维度）表单数据
   */
  getFormData(id: number) {
    return request<any, ScoringRuleForm>({
      url: `${SCORINGRULE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加计分规则主（维度）
   *
   *  @param data 计分规则主（维度）表单数据
   */
  create(data: ScoringRuleForm) {
    return request({
      url: `${SCORINGRULE_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新计分规则主（维度）
   *
   * @param id 计分规则主（维度）ID
   * @param data 计分规则主（维度）表单数据
   */
  update(id: string, data: ScoringRuleForm) {
    return request({
      url: `${SCORINGRULE_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除计分规则主（维度），多个以英文逗号(,)分割
   *
   * @param ids 计分规则主（维度）ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${SCORINGRULE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default ScoringRuleAPI;

/** 计分规则主（维度）分页查询参数 */
export interface ScoringRulePageQuery extends PageQuery {}

/** 计分规则主（维度）表单对象 */
export interface ScoringRuleForm {
  /** 计分说明 */
  description?: string;
  /** 创建人ID */
  createBy?: number;
}

/** 计分规则主（维度）分页对象 */
export interface ScoringRulePageVO {
  /** 计分说明 */
  description?: string;
  /** 创建人ID */
  createBy?: number;
}
