import request from "@/utils/request";

const NORMSCOREDISTRIBUTION_BASE_URL = "/api/v1/norm-score-distribution";

const NormScoreDistributionAPI = {
  /** 获取常模分数分布分页数据 */
  getPage(queryParams?: NormScoreDistributionPageQuery) {
    return request<any, PageResult<NormScoreDistributionPageVO[]>>({
      url: `${NORMSCOREDISTRIBUTION_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取常模分数分布表单数据
   *
   * @param id 常模分数分布ID
   * @returns 常模分数分布表单数据
   */
  getFormData(id: number) {
    return request<any, NormScoreDistributionForm>({
      url: `${NORMSCOREDISTRIBUTION_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加常模分数分布
   *
   *  @param data 常模分数分布表单数据
   */
  create(data: NormScoreDistributionForm) {
    return request({
      url: `${NORMSCOREDISTRIBUTION_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新常模分数分布
   *
   * @param id 常模分数分布ID
   * @param data 常模分数分布表单数据
   */
  update(id: string, data: NormScoreDistributionForm) {
    return request({
      url: `${NORMSCOREDISTRIBUTION_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除常模分数分布，多个以英文逗号(,)分割
   *
   * @param ids 常模分数分布ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${NORMSCOREDISTRIBUTION_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default NormScoreDistributionAPI;

/** 常模分数分布分页查询参数 */
export interface NormScoreDistributionPageQuery extends PageQuery {}

/** 常模分数分布表单对象 */
export interface NormScoreDistributionForm {
  /** 常模分布ID */
  id?: number;
  /** 常模样本ID */
  sampleId?: number;
  /** 维度ID（如有分维度常模） */
  dimensionId?: number;
  /** 原始分 */
  rawScore?: number;
  /** 百分位（0~100） */
  percentile?: number;
  /** T分（均值50，标准差10） */
  tScore?: number;
  /** Z分（均值0，标准差1） */
  zScore?: number;
  /** 九分位（1~9） */
  stanine?: number;
  /** 备注（如转换公式或来源） */
  description?: string;
}

/** 常模分数分布分页对象 */
export interface NormScoreDistributionPageVO {
  /** 常模分布ID */
  id?: number;
  /** 常模样本ID */
  sampleId?: number;
  /** 维度ID（如有分维度常模） */
  dimensionId?: number;
  /** 原始分 */
  rawScore?: number;
  /** 百分位（0~100） */
  percentile?: number;
  /** T分（均值50，标准差10） */
  tScore?: number;
  /** Z分（均值0，标准差1） */
  zScore?: number;
  /** 九分位（1~9） */
  stanine?: number;
  /** 备注（如转换公式或来源） */
  description?: string;
}
