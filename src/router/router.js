const home = import('@/views/consign/priceQuery.vue');
export const routes = [
    {
        path: '/merchantPermission',
        name: 'merchantPermission',
        component: () => import('@/views/permission/merchantPermission.vue')
    },
    {
        path: '/permission',
        name: 'permission',
        component: () => import('@/views/permission/permission.vue')
    },
    {
        path: '/workPost',
        name: 'workPost',
        component: () => import('@/views/workPost/workPost.vue')
    },
    {
        path: '/department',
        name: 'department',
        component: () => import('@/views/department/department.vue')
    },
    {
        path: '/employee',
        name: 'employee',
        component: () => import('@/views/employee/employeeList.vue')
    },
    {
        path: '/consign',
        name: 'consign',
        component: () => import('@/views/consign/consign.vue')
    },
    {
        path: '/consignAll',
        name: 'consignAll',
        component: () => import('@/views/consign/consignAll.vue')
    },
    {
        path: '/priceQuery',
        name: 'priceQuery',
        component: () => import('@/views/consign/priceQuery.vue')
    },
    {
        path: '/priceQueryAll',
        name: 'priceQueryAll',
        component: () => import('@/views/consign/priceQueryAll.vue')
    },
    {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('@/views/userInfo/userInfo.vue')
    },
    {
        path: '/personProfile/userList',
        name: 'userList',
        component: () => import('@/views/personProfile/userList.vue')
    },
    {
        path: '/pAuth',
        name: 'pAuth',
        component: () => import('@/views/auth/pAuth.vue')
    },
    {
        path: '/cAuth',
        name: 'cAuth',
        component: () => import('@/views/auth/cAuth.vue')
    },
    {
        path: '/merchantList',
        name: 'merchantList',
        component: () => import('@/views/merchant/list.vue')
    },
    {
        path: '/newMerchant',
        name: 'newMerchant',
        component: () => import('@/views/merchant/newMerchant.vue')
    },
    {
        path: '/authConfigList',
        name: 'authConfigList',
        component: () => import('@/views/authConfig/authConfigList.vue')
    },
    {
        path: '/newOrder',
        name: 'newOrder',
        component: () => import('@/views/order/newOrder.vue')
    },
    {
        path: '/orderList',
        name: 'orderList',
        component: () => import('@/views/order/orderList.vue')
    },
    {
        path: '/newContract',
        name: 'newContract',
        component: () => import('@/views/contract/newContract.vue')
    },
    {
        path: '/contractList',
        name: 'contractList',
        component: () => import('@/views/contract/contractList.vue')
    },
    {
        path: '/carryList',
        name: 'carryList',
        component: () => import('@/views/subCarrier/carryList.vue')
    },
    {
        path: '/carryPlan',
        name: 'carryPlan',
        component: () => import('@/views/subCarrier/carryPlan.vue')
    },
    {
        path: '/carryPlanDetail',
        name: 'carryPlanDetail',
        component: () => import('@/views/subCarrier/carryPlanDetail.vue')
    },
    {
        path: '/gatheringList',
        name: 'gatheringList',
        component: () => import('@/views/gathering/gatheringList.vue')
    },
    {
        path: '/gatheringPlan',
        name: 'gatheringPlan',
        component: () => import('@/views/gathering/gatheringPlan.vue')
    },
    {
        path: '/receivable',
        name: 'receivable',
        component: () => import('@/views/gathering/receivable.vue')
    },
    {
        path: '/newReceivableRecord',
        name: 'newReceivableRecord',
        component: () => import('@/views/gathering/newReceivableRecord.vue')
    },
    {
        path: '/receivableRecord',
        name: 'receivableRecord',
        component: () => import('@/views/gathering/receivableRecord.vue')
    },
    {
        path: '/otherService',
        name: 'otherService',
        component: () => import('@/views/otherService/otherService.vue')
    },
    {
        path: '/serviceRecord',
        name: 'serviceRecord',
        component: () => import('@/views/otherService/serviceRecord.vue')
    },
    {
        path: '/packInfo',
        name: 'packInfo',
        component: () => import('@/views/otherService/packInfo.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/login.vue')
    },
    {
        path: '/',
        name: 'home',
        component: () => home
    }
]