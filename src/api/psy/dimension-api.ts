import request from "@/utils/request";

const DIMENSION_BASE_URL = "/api/v1/dimension";

const DimensionAPI = {
  /** 获取维度分页数据 */
  getPage(queryParams?: DimensionPageQuery) {
    return request<any, PageResult<DimensionPageVO[]>>({
      url: `${DIMENSION_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取维度表单数据
   *
   * @param id 维度ID
   * @returns 维度表单数据
   */
  getFormData(id: number) {
    return request<any, DimensionForm>({
      url: `${DIMENSION_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加维度
   *
   *  @param data 维度表单数据
   */
  create(data: DimensionForm) {
    return request({
      url: `${DIMENSION_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新维度
   *
   * @param id 维度ID
   * @param data 维度表单数据
   */
  update(id: string, data: DimensionForm) {
    return request({
      url: `${DIMENSION_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除维度，多个以英文逗号(,)分割
   *
   * @param ids 维度ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${DIMENSION_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default DimensionAPI;

/** 维度分页查询参数 */
export interface DimensionPageQuery extends PageQuery {
  /** 维度名称，如焦虑、抑郁 */
  name?: string;
}

/** 维度表单对象 */
export interface DimensionForm {
  id?: number;
  /** 所属量表ID */
  scaleId?: number;
  /** 维度名称，如焦虑、抑郁 */
  name?: string;
  description?: string;
  /** 计分规则，如sum/average */
  scoreRule?: string;
}

/** 维度分页对象 */
export interface DimensionPageVO {
  id?: number;
  /** 所属量表ID */
  scaleId?: number;
  /** 维度名称，如焦虑、抑郁 */
  name?: string;
  description?: string;
  /** 计分规则，如sum/average */
  scoreRule?: string;
}
