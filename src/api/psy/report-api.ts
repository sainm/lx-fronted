import request from "@/utils/request";

const REPORT_BASE_URL = "/api/v1/report";

const ReportAPI = {
  /** 获取测评报告分页数据 */
  getPage(queryParams?: ReportPageQuery) {
    return request<any, PageResult<ReportPageVO[]>>({
      url: `${REPORT_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取测评报告表单数据
   *
   * @param id 测评报告ID
   * @returns 测评报告表单数据
   */
  getFormData(id: number) {
    return request<any, ReportForm>({
      url: `${REPORT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加测评报告
   *
   *  @param data 测评报告表单数据
   */
  create(data: ReportForm) {
    return request({
      url: `${REPORT_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新测评报告
   *
   * @param id 测评报告ID
   * @param data 测评报告表单数据
   */
  update(id: string, data: ReportForm) {
    return request({
      url: `${REPORT_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除测评报告，多个以英文逗号(,)分割
   *
   * @param ids 测评报告ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${REPORT_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default ReportAPI;

/** 测评报告分页查询参数 */
export interface ReportPageQuery extends PageQuery {}

/** 测评报告表单对象 */
export interface ReportForm {
  /** 报告ID */
  id?: number;
  /** 测评记录ID */
  recordId?: number;
  /** 用户ID */
  userId?: number;
  /** 量表ID */
  scaleId?: number;
  /** 总分 */
  totalScore?: number;
  /** 结果等级（如低、中、高风险） */
  resultLevel?: string;
  /** 结果详情（维度分数、解释说明等） */
  resultJson?: string;
  /** 系统建议或干预建议 */
  suggestion?: string;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 生成时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}

/** 测评报告分页对象 */
export interface ReportPageVO {
  /** 报告ID */
  id?: number;
  /** 测评记录ID */
  recordId?: number;
  /** 用户ID */
  userId?: number;
  /** 量表ID */
  scaleId?: number;
  /** 总分 */
  totalScore?: number;
  /** 结果等级（如低、中、高风险） */
  resultLevel?: string;
  /** 结果详情（维度分数、解释说明等） */
  resultJson?: string;
  /** 系统建议或干预建议 */
  suggestion?: string;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 生成时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}
