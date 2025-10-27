import request from "@/utils/request";

const SCALEVERSION_BASE_URL = "/api/v1/scale-version";

const ScaleVersionAPI = {
  /** 获取量版本分页数据 */
  getPage(queryParams?: ScaleVersionPageQuery) {
    return request<any, PageResult<ScaleVersionPageVO[]>>({
      url: `${SCALEVERSION_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取量版本表单数据
   *
   * @param id 量版本ID
   * @returns 量版本表单数据
   */
  getFormData(id: number) {
    return request<any, ScaleVersionForm>({
      url: `${SCALEVERSION_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加量版本
   *
   *  @param data 量版本表单数据
   */
  create(data: ScaleVersionForm) {
    return request({
      url: `${SCALEVERSION_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新量版本
   *
   * @param id 量版本ID
   * @param data 量版本表单数据
   */
  update(id: string, data: ScaleVersionForm) {
    return request({
      url: `${SCALEVERSION_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除量版本，多个以英文逗号(,)分割
   *
   * @param ids 量版本ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${SCALEVERSION_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default ScaleVersionAPI;

/** 量版本分页查询参数 */
export interface ScaleVersionPageQuery extends PageQuery {
  /** 版本名称，如v1.0 */
  versionName?: string;
}

/** 量版本分页对象 */
export interface ScaleVersionPageVO {
  /** 量版本ID */
  id?: number;
  /** 所属量表ID */
  scaleId?: number;
  /** 所属量表名称 */
  scaleName?: string;
  /** 版本名称，如v1.0 */
  versionName?: string;
  /** 版本说明 */
  description?: string;
  /** 是否启用 */
  isActive?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}

/** 量版本表单对象 */
export interface ScaleVersionForm {
  /** 量版本ID */
  id?: number;
  /** 所属量表ID */
  scaleId?: number;
  /** 版本名称，如v1.0 */
  versionName?: string;
  /** 版本说明 */
  description?: string;
  /** 是否启用 */
  isActive?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新人ID */
  updateBy?: number;
  /** 更新时间 */
  updateTime?: Date;
}
