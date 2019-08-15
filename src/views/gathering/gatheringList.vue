<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="订单号" value="orderNo"></el-option>
                    <el-option label="托运方" value="shipper"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="queryContent" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border>
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <el-table-column prop="handler" label="接单员"></el-table-column>
            <el-table-column prop="receivablesId" label="收款编号"></el-table-column>
            <el-table-column prop="receiptDateStr" label="收款日期"></el-table-column>
            <el-table-column prop="amountCollected" label="收款金额"></el-table-column>
            <el-table-column prop="receivables" label="收款期次"></el-table-column>
            <el-table-column prop="paymentMethod" label="支付方式">
                <template slot-scope="scope">{{PAYMENT[scope.row.paymentMethod]}}</template>
            </el-table-column>
            <el-table-column prop="receivablesType" label="收款类型">
                <template slot-scope="scope">{{GATHER_TYPE[scope.row.receivablesType]}}</template>
            </el-table-column>
            <el-table-column prop="handler" label="经手人"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
        </el-table>   

        <div class="text-right mt10" v-if="dataList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>    
    </div>
</template>

<style>
.table-expand {
    font-size: 0;
}
.table-expand label {
    width: 90px;
    color: #99a9bf;
}
.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
<script>
import { PAYMENT, GATHER_TYPE } from '@/utils/constant'

export default {
    data() {
        return {
            queryType: 'orderName',
            PAYMENT,
            GATHER_TYPE,
            dataList: [],
            transCode: 'OREA03'
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.receivablesPlanRecordList || [];
        }
    },
    created() {
        this.getData();
    }
}
</script>
