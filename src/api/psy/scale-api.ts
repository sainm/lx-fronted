import request from "@/utils/request";

const SCALE_BASE_URL = "/api/v1/scale";

const ScaleAPI = {
  /** 获取量表分页数据 */
  getPage(queryParams?: ScalePageQuery) {
    return request<any, PageResult<ScalePageVO[]>>({
      url: `${SCALE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取量表表单数据
   *
   * @param id 量表ID
   * @returns 量表表单数据
   */
  getFormData(id: number) {
    return request<any, ScaleForm>({
      url: `${SCALE_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加量表
   *
   *  @param data 量表表单数据
   */
  create(data: ScaleForm) {
    return request({
      url: `${SCALE_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新量表
   *
   * @param id 量表ID
   * @param data 量表表单数据
   */
  update(id: string, data: ScaleForm) {
    return request({
      url: `${SCALE_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除量表，多个以英文逗号(,)分割
   *
   * @param ids 量表ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${SCALE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default ScaleAPI;

/** 量表分页查询参数 */
export interface ScalePageQuery extends PageQuery {
  /** 量表名称 */
  name?: string;
  /** 量表唯一编码 */
  code?: string;
  /** 适用性别 M/F/ALL */
  applicableGender?: string;
}

/** 量表表单对象 */
export interface ScaleForm {
  id?: number;
  /** 量表名称 */
  name?: string;
  /** 量表唯一编码 */
  code?: string;
  /** 量表说明 */
  description?: string;
  /** 适用年龄段，如18-65 */
  applicableAge?: string;
  /** 适用性别 M/F/ALL */
  applicableGender?: string;
}

/** 量表分页对象 */
export interface ScalePageVO {
  id?: number;
  /** 量表名称 */
  name?: string;
  /** 量表唯一编码 */
  code?: string;
  /** 量表说明 */
  description?: string;
  /** 适用年龄段，如18-65 */
  applicableAge?: string;
  /** 适用性别 M/F/ALL */
  applicableGender?: string;
}
