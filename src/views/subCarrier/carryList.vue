<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="订单号" value="orderNo"></el-option>
                    <el-option label="托运方" value="shipper"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryType === 'state'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in PAY_STATE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else>
                <el-input v-model="queryContent" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="dataList" border>
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <el-table-column prop="recordNo" label="分运记录编号"></el-table-column>
            <el-table-column prop="transportTimeStr" label="发生时间"></el-table-column>
            <el-table-column prop="transportStatusStr" label="运输状态"></el-table-column>
            <el-table-column prop="transportOption" label="运输项目">
            </el-table-column>
            <el-table-column prop="currentAddr" label="当前地理位置"></el-table-column>
            <el-table-column prop="exceptionRemark" label="异常事项"></el-table-column>
            <!-- <el-table-column prop="nextNode" label="下一节点"></el-table-column> -->
            <el-table-column prop="creater" label="填写人"></el-table-column>
            <el-table-column prop="createTime" label="填写时间">
                <template slot-scope="scope">{{new Date(scope.row.createTime).Format('yyyy-MM-dd hh:mm:ss')}}</template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div><el-button size="mini" type="text" @click="handleEdit(scope.row)">删除</el-button></div>                    
                </template>
            </el-table-column>
        </el-table>
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
import { TRANSPORT_STATE, TRANSPORT_OPTION } from '@/utils/constant'

export default {
    data() {
        return {
            TRANSPORT_STATE: [
                {
                    name: '运输中',
                    key: 1,
                    disabled: false
                },
                {
                    name: '已到达',
                    key: 2,
                    disabled: false
                },
                {
                    name: '空状态',
                    key: 3,
                    disabled: false
                }
            ],
            queryType: 'orderNo',
            dataList: [],
            dialogFormVisible: false,
            merchant: {
                num: '',
                type: ''
            },
            activeName: 'all',
            append: {},
            transCode: 'TTSP03',
            exceptionStatus: '2',
            curRow: {},
            TRANSPORT_OPTION,
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.transportplanRecordList || [];
        },
        handleEdit(row) {
            this.$confirm('您确认要删除此商户吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.$http.post({
                    transCode: 'TTSP03',
                    funType: 'delete',
                    ids: row.id,
                }).then(data => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getData();
                })
            })
        },
        handleState(row, type) {
           this.curRow = row;
        },
    },
    created() {
        let transportplanId = this.$route.query.planId;
        this.getData({transportplanId});
    }
}
</script>
