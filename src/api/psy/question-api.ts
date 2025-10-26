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

  /**
   * 获取量表版本的所有题目列表（用于答题）
   *
   * @param versionId 量表版本ID
   * @returns 题目列表
   */
  getQuestionsByVersion(versionId: number) {
    return request<any, QuestionDetailVO[]>({
      url: `${QUESTION_BASE_URL}/version/${versionId}`,
      method: "get",
    });
  },
};

export default QuestionAPI;

/** 题目分页查询参数 */
export interface QuestionPageQuery extends PageQuery {
  id?: number;
  /** 所属量表ID */
  scaleId?: number;
  /** 版本ID */
  versionId?: number;
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
  /** 版本ID */
  versionId?: number;
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
  /** 版本ID */
  versionId?: number;
  /** 所属维度ID */
  dimensionId?: number;
  /** 题目内容 */
  questionText?: string;
  /** 题目类型: single/multiple/likert */
  questionType?: string;
  /** 题目顺序 */
  orderNo?: number;
}

/** 题目详情对象（包含选项） */
export interface QuestionDetailVO {
  id?: number;
  /** 所属量表ID */
  scaleId?: number;
  /** 版本ID */
  versionId?: number;
  /** 所属维度ID */
  dimensionId?: number;
  /** 维度名称 */
  dimensionName?: string;
  /** 题目内容 */
  questionText?: string;
  /** 题目类型: single/multiple/likert */
  questionType?: string;
  /** 题目顺序 */
  orderNo?: number;
  /** 选项列表 */
  options?: QuestionOption[];
}

/** 题目选项 */
export interface QuestionOption {
  /** 选项ID */
  id?: number;
  /** 选项标识（A/B/C/D等） */
  optionKey?: string;
  /** 选项文本 */
  optionText?: string;
  /** 选项分值 */
  score?: number;
  /** 排序 */
  orderNo?: number;
}
