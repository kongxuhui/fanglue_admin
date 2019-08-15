// 用户状态
export const USER_STATE = {
    1: '启用',
    0: '停用'
}
export const user_STATE= {
    1: '正常',
    2: '停用'
}
// 部门
export const DEPARTMENT = {
    1: '部门1',
    2: '部门2',
    3: '部门3',
    4: '部门4',
    5: '部门5',
    6: '部门6',
    7: '部门7',
    8: '部门8',
    9: '部门9',
    10: '部门10',
    11: '部门11',    
}

// 岗位
export const POST = {
    1: '岗位1',
    2: '岗位2',
    3: '岗位3',
    4: '岗位4',
    5: '岗位5',
    6: '岗位6',
    7: '岗位7',
    8: '岗位8',
    9: '岗位9',
    10: '岗位10',
    11: '岗位11',    
}

// 组织类型
export const ORGANIZ_TYPE = {
    1: '个人',
    2: '企业'
}

// 认证类型
export const AUTH_TYPE = {
    0: '未认证',
    1: '个人',
    2: '企业'
}

// 认证状态
export const AUTH_STATE = {
    1: '未审核',
    2: '审核通过',
    3: '审核驳回'
}

// 商户类型
export const MERCHANT_TYPE = {
    1: '托运方',
    2: '承运方',
    3: '经营方',
    4: '服务方'
}
// 商户状态
export const MERCHANT_STATE = {
    1: '正常',
    2: '停用'
}
// 商户创建类型
export const CREATE_TYPE = {
    1: '自动',
    2: '手动',
    3: '系统'
}

// 合同状态
export const CONTRACT_STATE = {
    1: '未开始',
    2: '执行中',
    3: '成功结束',
    4: '意外终止'
}
// 合同执行状态
export const CONTRACT_EXEC_STATE = {
    1: '未开始',
    2: '执行中',
    3: '成功结束',
    4: '意外终止'
}
// 合同类型
export const CONTRACT_TYPE = {
    1: '托运合同',
    2: '承运合同',
    3: '成功结束',
    4: '意外终止'
}
// 合同价格类型
export const CONTRACT_PRICE_TYPE = {
    1: '单价合同',
    2: '总价合同',
    3: '框架协议'
}

// 付款方式
export const PAYMENT = {
    1: '支票',
    2: '现金'
}
// 付款状态
export const PAY_STATE = {
    1: '未支付',
    2: '已支付',
    3: '已付请'
}

// 物流状态
export const LOGISTICS_STATE = {
    1: '待发货',
    2: '已发货',
    3: '已收货'
}

// 运输状态
export const TRANSPORT_STATE = {
    1: '未开始',
    2: '装箱',
    3: '在途',
    4: '交付'
}
// 运输工作项
export const TRANSPORT_OPTION = {
    1: '装箱',
    2: '在途',
    3: '交付',
    4: '完成'
}

// 询价、托运
export const FOLLOWUP_STATE = {
    1: '重要',
    2: '普通',
    3: '关闭'
}
export const APPLY_STATE = {
    1: '待处理',
    2: '处理中',
    3: '已处理'
}
export const SOURCE_TYPE = {
    1: '运价查询',
    2: '托运申请'
}
// 运输类型
export const TRANS_TYPE = {
    1: '多式',
    2: '公路',
    3: '铁路',
    4: '海路',
    5: '航空'
}
// 区域类型
export const ZONE_TYPE = {
    1: '国内',
    2: '国外',
}

// 逾期状态
export const OVERDUE_STATE = {
    1: '正常',
    2: '逾期'
}
// 收款类型
export const GATHER_TYPE = {
    1: '正常回款',
    2: '退款',
    3: '订金',
    4: '其他'
}

// 服务项目
export const SERVICE_PROJECT = {
    1: '报关',
    2: '报检',
    3: '保险'
}
// 项目进程状态
export const PROJECT_PROCESS_STATE = {
    1: '未开始',
    2: '进行中',
    3: '已开始'
}