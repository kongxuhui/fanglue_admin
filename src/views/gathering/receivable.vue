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
            <el-table-column prop="receivNo" label="单据编号"></el-table-column>
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column prop="orderId" label="订单Id"></el-table-column>
            <el-table-column prop="orderDateStr" label="下单日期"></el-table-column>
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <el-table-column prop="goodsName" label="货物名"></el-table-column>
            <el-table-column prop="creater" label="编制人"></el-table-column>
            <el-table-column prop="roption" label="应收款项"></el-table-column>
            <el-table-column prop="money" label="应收金额">
                <template slot-scope="scope">{{scope.row.money}}元</template>
            </el-table-column>
            <el-table-column prop="planPayTimeStr" label="预计付款时间"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="primary" @click="handleNew(scope.row,'edit')">新增分承运记录</el-button> -->
                    <div>
                        <el-button size="mini" type="text" @click="handleEdit(scope.row,'edit')">修改</el-button>  
                    </div>
                </template>
            </el-table-column>
        </el-table>   

        <div class="text-right mt10" v-if="dataList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>    

        <el-dialog :visible.sync="gatherVisible">
            <el-form :model="gatherModel" ref="gatherRef" label-width="110px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="应收款项" prop="roption" :rules="{required: true, message: '请输入应收款项', trigger: 'blur'}">
                            <el-input v-model.trim="gatherModel.roption"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应收金额" 
                            prop="money" 
                            :rules="[
                                {required: true, message: '请输入应收金额', trigger: 'blur'},
                                { type: 'number', message: '金额必须为数字', trigger: 'blur'}
                            ]">
                            <el-input v-model.number="gatherModel.money">
                                <template slot="append">元</template></el-input>                                
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                                              
                    <el-col :span="12">
                        <el-form-item label="预计付款时间" prop="planPayTimeStr" :rules="{required: true, message: '请选择预计付款时间', trigger: 'blur'}">
                            <el-date-picker type="date" v-model="gatherModel.planPayTimeStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input v-model="gatherModel.remarks"></el-input>
                        </el-form-item>
                    </el-col>                        
                </el-row>                                                                                        
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="gatherVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleGather">确 定</el-button>
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
    width: 50%;
}
</style>
<script>
import { PAYMENT, GATHER_TYPE } from '@/utils/constant'

export default {
    data() {
        return {
            queryType: 'orderNo',
            PAYMENT,
            GATHER_TYPE,
            dataList: [],
            transCode: 'OREA05',
            initCondition: {},
            gatherModel: {},
            gatherVisible: false,
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.receivablesDtlList || [];
        },
        handleEdit(row) {
            if(row.id){
                this.$http.post({
                    transCode: 'OREA05',
                    funType: 'findUpdateFlag',
                    id: row.id,
                }).then((data) => {
                    if(data.flag){
                        this.$http.post({
                            transCode: 'OREA05',
                            funType: 'findDetail',
                            id: row.id,
                        }).then((data) => {
                            console.log(data)
                            this.gatherModel = data.receivablesDtl;
                            this.gatherVisible = true;
                        })
                    }else{
                        this.$message({
                            message: '该应收账款暂不可修改',
                            type: 'warning'
                        });
                    }
                })
                
            }
        },
        handleGather() {
            this.$refs.gatherRef.validate(valid => {
                if (valid) {
                    this.gatherVisible = false;
                    this.$http.post({
                        transCode: 'OREA05',
                        funType: 'update',
                        id: this.gatherModel.id,
                        ...this.gatherModel
                    }).then(data => {
                        if (data.code === '000000') {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.getData();
                        }
                    })
                }
            })
        }
    },
    created() {
        this.initCondition.orderId = this.$route.query.orderId;
        this.getData();
    }
}
</script>
