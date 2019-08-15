<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="付款编号" value="payNo"></el-option>
                    <el-option label="托运方" value="shipper"></el-option>
                    <el-option label="订单号" value="orderNo"></el-option>
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
            <el-table-column prop="payNo" label="付款编号"></el-table-column>            
            <el-table-column prop="payDateStr" label="付款日期"></el-table-column>
            <el-table-column prop="payMoney" label="付款总额"></el-table-column>
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <!-- <el-table-column prop="payTimes" label="付款期次"></el-table-column> -->
            <el-table-column label="支付方式">
                <template slot-scope="scope">{{PAYMENT[scope.row.payMode]}}</template>
            </el-table-column>
            <el-table-column label="付款类型">
                <template slot-scope="scope">{{GATHER_TYPE[scope.row.payType]}}</template>
            </el-table-column>
            <el-table-column prop="creater" label="经手人"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column prop="orderDateStr" label="下单日期"></el-table-column>
            <el-table-column prop="goodsName" label="货物名称"></el-table-column>
            <el-table-column prop="leftMoney" label="订单应付款"></el-table-column>
            <el-table-column prop="money" label="本单分配款"></el-table-column>
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
            queryType: 'payNo',
            PAYMENT,
            GATHER_TYPE,
            dataList: [],
            transCode: 'OREA07'
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.collectionRecordDtlList || [];
        }
    },
    created() {
        this.getData();
    }
}
</script>
