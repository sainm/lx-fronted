import request from "@/utils/request";

const USERANSWER_BASE_URL = "/api/v1/user-answer";

const UserAnswerAPI = {
  /** 获取用户答题记录分页数据 */
  getPage(queryParams?: UserAnswerPageQuery) {
    return request<any, PageResult<UserAnswerPageVO[]>>({
      url: `${USERANSWER_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取用户答题记录表单数据
   *
   * @param id 用户答题记录ID
   * @returns 用户答题记录表单数据
   */
  getFormData(id: number) {
    return request<any, UserAnswerForm>({
      url: `${USERANSWER_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加用户答题记录
   *
   *  @param data 用户答题记录表单数据
   */
  create(data: UserAnswerForm) {
    return request({
      url: `${USERANSWER_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新用户答题记录
   *
   * @param id 用户答题记录ID
   * @param data 用户答题记录表单数据
   */
  update(id: string, data: UserAnswerForm) {
    return request({
      url: `${USERANSWER_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除用户答题记录，多个以英文逗号(,)分割
   *
   * @param ids 用户答题记录ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${USERANSWER_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default UserAnswerAPI;

/** 用户答题记录分页查询参数 */
export interface UserAnswerPageQuery extends PageQuery {}

/** 用户答题记录表单对象 */
export interface UserAnswerForm {
  /** 答题记录ID */
  id?: number;
  /** 测评记录ID */
  recordId?: number;
  /** 题目ID */
  questionId?: number;
  /** 选项ID（如为选择题） */
  optionId?: number;
  /** 主观题答案文本 */
  answerText?: string;
  /** 得分（按题计算） */
  score?: number;
  /** 作答耗时（秒） */
  timeSpent?: number;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 答题时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}

/** 用户答题记录分页对象 */
export interface UserAnswerPageVO {
  /** 答题记录ID */
  id?: number;
  /** 测评记录ID */
  recordId?: number;
  /** 题目ID */
  questionId?: number;
  /** 选项ID（如为选择题） */
  optionId?: number;
  /** 主观题答案文本 */
  answerText?: string;
  /** 得分（按题计算） */
  score?: number;
  /** 作答耗时（秒） */
  timeSpent?: number;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 答题时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}
