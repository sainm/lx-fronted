import request from "@/utils/request";

const QUESTION_BASE_URL = "/api/v1/question";

const QuestionAPI = {
  /** 获取题目分页数据 */
  getPage(queryParams?: QuestionPageQuery) {
    return request<any, PageResult<QuestionPageVO[]>>({
      url: `${QUESTION_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取题目表单数据
   *
   * @param id 题目ID
   * @returns 题目表单数据
   */
  getFormData(id: number) {
    return request<any, QuestionForm>({
      url: `${QUESTION_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加题目
   *
   *  @param data 题目表单数据
   */
  create(data: QuestionForm) {
    return request({
      url: `${QUESTION_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新题目
   *
   * @param id 题目ID
   * @param data 题目表单数据
   */
  update(id: string, data: QuestionForm) {
    return request({
      url: `${QUESTION_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除题目，多个以英文逗号(,)分割
   *
   * @param ids 题目ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${QUESTION_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default QuestionAPI;

/** 题目分页查询参数 */
export interface QuestionPageQuery extends PageQuery {
  id?: number;
  /** 所属量表ID */
  scaleId?: number;
  /** 所属维度ID */
  dimensionId?: number;
  /** 题目内容 */
  questionText?: string;
  /** 题目类型: single/multiple/likert */
  questionType?: string;
  /** 题目顺序 */
  orderNo?: number;
}

/** 题目表单对象 */
export interface QuestionForm {
  id?: number;
  /** 所属量表ID */
  scaleId?: number;
  /** 所属维度ID */
  dimensionId?: number;
  /** 题目内容 */
  questionText?: string;
  /** 题目类型: single/multiple/likert */
  questionType?: string;
  /** 题目顺序 */
  orderNo?: number;
}

/** 题目分页对象 */
export interface QuestionPageVO {
  id?: number;
  /** 所属量表ID */
  scaleId?: number;
  /** 所属维度ID */
  dimensionId?: number;
  /** 题目内容 */
  questionText?: string;
  /** 题目类型: single/multiple/likert */
  questionType?: string;
  /** 题目顺序 */
  orderNo?: number;
}
