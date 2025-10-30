import request from "@/utils/request";

const NORMSAMPLE_BASE_URL = "/api/v1/norm-sample";

const NormSampleAPI = {
  /** 获取量常模样本定义分页数据 */
  getPage(queryParams?: NormSamplePageQuery) {
    return request<any, PageResult<NormSamplePageVO[]>>({
      url: `${NORMSAMPLE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取量常模样本定义表单数据
   *
   * @param id 量常模样本定义ID
   * @returns 量常模样本定义表单数据
   */
  getFormData(id: number) {
    return request<any, NormSampleForm>({
      url: `${NORMSAMPLE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加量常模样本定义
   *
   *  @param data 量常模样本定义表单数据
   */
  create(data: NormSampleForm) {
    return request({
      url: `${NORMSAMPLE_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新量常模样本定义
   *
   * @param id 量常模样本定义ID
   * @param data 量常模样本定义表单数据
   */
  update(id: string, data: NormSampleForm) {
    return request({
      url: `${NORMSAMPLE_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除量常模样本定义，多个以英文逗号(,)分割
   *
   * @param ids 量常模样本定义ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${NORMSAMPLE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default NormSampleAPI;

/** 量常模样本定义分页查询参数 */
export interface NormSamplePageQuery extends PageQuery {}

/** 量常模样本定义表单对象 */
export interface NormSampleForm {
  /** 常模样本ID */
  id?: number;
  /** 所属量表版本ID */
  versionId?: number;
  /** 常模名称（如：大学生样本、青少年女性样本） */
  sampleName?: string;
  /** 性别（male/female/all） */
  gender?: string;
  /** 最小年龄 */
  ageMin?: number;
  /** 最大年龄 */
  ageMax?: number;
  /** 地区（可选） */
  region?: string;
  /** 样本数量 */
  sampleSize?: number;
  /** 样本说明 */
  description?: string;
  createBy?: number;
  updateBy?: number;
  createTime?: Date;
  updateTime?: Date;
}

/** 量常模样本定义分页对象 */
export interface NormSamplePageVO {
  /** 常模样本ID */
  id?: number;
  /** 所属量表版本ID */
  versionId?: number;
  /** 量表版本名称 */
  versionName?: string;
  /** 常模名称（如：大学生样本、青少年女性样本） */
  sampleName?: string;
  /** 性别（male/female/all） */
  gender?: string;
  /** 最小年龄 */
  ageMin?: number;
  /** 最大年龄 */
  ageMax?: number;
  /** 地区（可选） */
  region?: string;
  /** 样本数量 */
  sampleSize?: number;
  /** 样本说明 */
  description?: string;
  createBy?: number;
  updateBy?: number;
  createTime?: Date;
  updateTime?: Date;
}
