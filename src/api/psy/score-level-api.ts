import request from "@/utils/request";

const SCORELEVEL_BASE_URL = "/api/v1/score-level";

const ScoreLevelAPI = {
  /** 获取分数区间对应等级描述分页数据 */
  getPage(queryParams?: ScoreLevelPageQuery) {
    return request<any, PageResult<ScoreLevelPageVO[]>>({
      url: `${SCORELEVEL_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取分数区间对应等级描述表单数据
   *
   * @param id 分数区间对应等级描述ID
   * @returns 分数区间对应等级描述表单数据
   */
  getFormData(id: number) {
    return request<any, ScoreLevelForm>({
      url: `${SCORELEVEL_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加分数区间对应等级描述
   *
   *  @param data 分数区间对应等级描述表单数据
   */
  create(data: ScoreLevelForm) {
    return request({
      url: `${SCORELEVEL_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新分数区间对应等级描述
   *
   * @param id 分数区间对应等级描述ID
   * @param data 分数区间对应等级描述表单数据
   */
  update(id: string, data: ScoreLevelForm) {
    return request({
      url: `${SCORELEVEL_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除分数区间对应等级描述，多个以英文逗号(,)分割
   *
   * @param ids 分数区间对应等级描述ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${SCORELEVEL_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default ScoreLevelAPI;

/** 分数区间对应等级描述分页查询参数 */
export interface ScoreLevelPageQuery extends PageQuery {}

/** 分数区间对应等级描述表单对象 */
export interface ScoreLevelForm {
  /** 分数下限 */
  minScore?: number;
  /** 分数上限 */
  maxScore?: number;
  /** 等级名称，如低、中、高 */
  levelName?: string;
  /** 等级说明 */
  description?: string;
}

/** 分数区间对应等级描述分页对象 */
export interface ScoreLevelPageVO {
  id?: number;
  /** 所属计分规则ID */
  ruleId?: number;
  /** 分数下限 */
  minScore?: number;
  /** 分数上限 */
  maxScore?: number;
  /** 等级名称，如低、中、高 */
  levelName?: string;
  /** 等级说明 */
  description?: string;
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
