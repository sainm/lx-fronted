import request from "@/utils/request";

const WARNING_BASE_URL = "/api/v1/warning";

const WarningAPI = {
  /** 获取测评预警记录分页数据 */
  getPage(queryParams?: WarningPageQuery) {
    return request<any, PageResult<WarningPageVO[]>>({
      url: `${WARNING_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 获取测评预警记录表单数据
   *
   * @param id 测评预警记录ID
   * @returns 测评预警记录表单数据
   */
  getFormData(id: number) {
    return request<any, WarningForm>({
      url: `${WARNING_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   *  添加测评预警记录
   *
   *  @param data 测评预警记录表单数据
   */
  create(data: WarningForm) {
    return request({
      url: `${WARNING_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 更新测评预警记录
   *
   * @param id 测评预警记录ID
   * @param data 测评预警记录表单数据
   */
  update(id: string, data: WarningForm) {
    return request({
      url: `${WARNING_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 批量删除测评预警记录，多个以英文逗号(,)分割
   *
   * @param ids 测评预警记录ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${WARNING_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default WarningAPI;

/** 测评预警记录分页查询参数 */
export interface WarningPageQuery extends PageQuery {}

/** 测评预警记录表单对象 */
export interface WarningForm {
  /** 预警ID */
  id?: number;
  /** 用户ID */
  userId?: number;
  /** 关联测评记录ID */
  recordId?: number;
  /** 预警类型（如高危、异常、极端答题） */
  warningType?: string;
  /** 预警等级：1一般 2严重 3紧急 */
  level?: number;
  /** 触发规则标识（如规则编号） */
  triggerRule?: string;
  /** 详细说明 */
  description?: string;
  /** 是否已处理：0未处理 1已处理 */
  isResolved?: number;
  /** 处理人ID */
  handlerId?: number;
  /** 处理时间 */
  handleTime?: Date;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}

/** 测评预警记录分页对象 */
export interface WarningPageVO {
  /** 预警ID */
  id?: number;
  /** 用户ID */
  userId?: number;
  /** 关联测评记录ID */
  recordId?: number;
  /** 预警类型（如高危、异常、极端答题） */
  warningType?: string;
  /** 预警等级：1一般 2严重 3紧急 */
  level?: number;
  /** 触发规则标识（如规则编号） */
  triggerRule?: string;
  /** 详细说明 */
  description?: string;
  /** 是否已处理：0未处理 1已处理 */
  isResolved?: number;
  /** 处理人ID */
  handlerId?: number;
  /** 处理时间 */
  handleTime?: Date;
  /** 创建人 */
  createBy?: number;
  /** 最后修改人 */
  updateBy?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 更新时间 */
  updateTime?: Date;
}
