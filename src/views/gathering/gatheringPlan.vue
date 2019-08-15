<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="合同标题" value="contractTitle"></el-option>
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
            <el-table-column prop="contractTitle" label="合同标题"></el-table-column>
            <el-table-column prop="contractTotal" label="合同总额"></el-table-column>
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <el-table-column prop="individualMember" label="接单员"></el-table-column>
            <el-table-column prop="periodTime" label="期次"></el-table-column>
            <el-table-column prop="plannedReceiptDateStr" label="计划收款日期"></el-table-column>
            <el-table-column prop="proportion" label="占比"></el-table-column>
            <el-table-column prop="amountCollected" label="收款金额"></el-table-column>
            <el-table-column prop="createTimeStr" label="创建时间"></el-table-column>
            <el-table-column prop="overdueState" label="逾期状态">
                <template slot-scope="scope">{{OVERDUE_STATE[scope.row.overdueState]}}</template>
            </el-table-column>
            <el-table-column prop="overdueDays" label="逾期天数"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column label="操作" width="125">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleNew(scope.row)">新增收款记录</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="text-right mt10" v-if="dataList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="append" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合同标题">
                            <el-input v-model="append.contractTitle" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同总额">
                            <el-input v-model="append.contractTotal" disabled></el-input>
                        </el-form-item>
                    </el-col>                   
                </el-row>    
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单名称">
                            <el-select v-model="orderIndex">
                                <el-option :label="item.orderName" :value="index" :key="item.orderId" v-for="(item, index) in orderList"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款日期">
                            <el-date-picker type="date" v-model="append.receiptDateStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收款金额">
                            <el-input v-model="append.amountCollected"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="托运方">
                            <el-input v-model="append.shipper" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                                                               
                <el-row>
                    <el-col :span="12">
                       <el-form-item label="支付方式">
                            <el-select v-model="append.paymentMethod">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in PAYMENT"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款类型">
                            <el-select v-model="append.receivablesType">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in GATHER_TYPE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>    
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收款期次">
                            <el-input v-model="append.receivables" disabled></el-input>
                        </el-form-item>
                    </el-col>
                   <el-col :span="12">
                        <el-form-item label="经手人">
                            <el-input v-model="append.handler" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                        
                <el-form-item label="备注">
                    <el-input v-model="append.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog> 
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
    width: 33.33%;
}
</style>
<script>
import { OVERDUE_STATE, PAYMENT, GATHER_TYPE } from '@/utils/constant'

export default {
    data() {
        return {
            queryType: 'contractTitle',
            OVERDUE_STATE,
            PAYMENT,
            GATHER_TYPE,
            dataList: [],
            dialogFormVisible: false,
            curRow: {},
            activeName: 'all',
            append: {},
            transCode: 'OREA02',
            orderList: [],
            orderIndex: 0
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.receivablesPlanDtlList || [];
        },
        handleSubmit() {
            this.dialogFormVisible = false;
            this.$http.post({
                transCode: 'OREA03',
                funType: 'add',
                orderName: this.orderList[this.orderIndex].orderName,
                orderId: this.orderList[this.orderIndex].orderId,
                ...this.append
            }).then(data => {
                this.messageTip(data);
            })
        },
        handleNew(row) {
            this.dialogFormVisible = true;
            this.curRow = row;
            this.append.contractTitle = row.contractTitle;
            this.append.contractTotal = row.contractTotal;
            this.append.receivables = row.periodTime;
            this.append.receivablesId = row.receivPlanId;
            this.append.receivablesDtlId = row.receivPlandtlId;
            this.append.shipper = row.shipper;
            this.append.shipperId = row.shipperId;
            this.append.handler = this.username;
            this.append.handlerId = this.userId;

            if (this.orderList.length === 0) {
                this.$http.post({
                    transCode: 'OORD01',
                    funType: 'findAll',
                    contractId: row.contractId,
                    pageCount: 100,
                    currentPageNum: 1
                }).then(data => {
                    this.orderList = data.orderList || []
                })
            }
        }
    },
    created() {
        let userInfo = this.$store.state.user.userInfo;
        this.username = userInfo.username;
        this.userId = userInfo.userId;
        this.getData();
    }
}
</script>
