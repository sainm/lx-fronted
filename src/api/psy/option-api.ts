import request from "@/utils/request";

const OPTION_BASE_URL = "/api/v1/option";

const OptionAPI = {
  /** 获取题目选项分页数据 */
  getPage(queryParams?: OptionPageQuery) {
    return request<any, PageResult<OptionPageVO[]>>({
      url: `${OPTION_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取题目选项表单数据
   *
   * @param id 题目选项ID
   * @returns 题目选项表单数据
   */
  getFormData(id: number) {
    return request<any, OptionForm>({
      url: `${OPTION_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加题目选项
   *
   *  @param data 题目选项表单数据
   */
  create(data: OptionForm) {
    return request({
      url: `${OPTION_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新题目选项
   *
   * @param id 题目选项ID
   * @param data 题目选项表单数据
   */
  update(id: string, data: OptionForm) {
    return request({
      url: `${OPTION_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除题目选项，多个以英文逗号(,)分割
   *
   * @param ids 题目选项ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${OPTION_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default OptionAPI;

/** 题目选项分页查询参数 */
export interface OptionPageQuery extends PageQuery {
  /** 所属题目ID */
  questionId?: number;
}

/** 题目选项表单对象 */
export interface OptionForm {
  id?: number;
  /** 所属题目ID */
  questionId?: number;
  /** 选项内容 */
  optionText?: string;
  /** 选项分值 */
  optionValue?: number;
  /** 可自定义分数，支持权重计算 */
  score?: number;
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

/** 题目选项分页对象 */
export interface OptionPageVO {
  id?: number;
  /** 所属题目ID */
  questionId?: number;
  /** 选项内容 */
  optionText?: string;
  /** 选项分值 */
  optionValue?: number;
  /** 可自定义分数，支持权重计算 */
  score?: number;
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
