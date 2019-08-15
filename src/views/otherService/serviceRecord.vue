<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="订单号" value="orderNo"></el-option>
                    <el-option label="托运方" value="shipper"></el-option>
                    <el-option label="服务项目名" value="serviceProject"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryType === 'serviceProject'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in SERVICE_PROJECT"></el-option>
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
            <el-table-column prop="orderDateStr" label="下单时间"></el-table-column>
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <el-table-column prop="goodsName" label="托运货物"></el-table-column>
            <el-table-column prop="recordNo" label="记录编号"></el-table-column>
            <el-table-column prop="occurrenceTimeStr" label="发生日期"></el-table-column>
            <el-table-column prop="serviceProjectStr" label="服务项目名">
            </el-table-column>
            <el-table-column prop="recordContent" label="服务内容"></el-table-column>           
            <el-table-column prop="serviceProcessOption" label="项目进程环节"></el-table-column>
            <el-table-column prop="serviceProcessStateStr" label="项目进程状态"></el-table-column>
            <el-table-column prop="projectCostAmount" label="项目费用金额">
                <template slot-scope="scope">{{scope.row.projectCostAmount}}元</template>
            </el-table-column>            
            <el-table-column prop="handler" label="经手人"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column label="单据扫描件">
                <template slot-scope="scope">
                    <img :src="$ossUrl+item" alt="" v-for="item in scope.row.scans.split(';')">
                </template>
            </el-table-column>
            <el-table-column prop="creater" label="创建人"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
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
import { SERVICE_PROJECT, PROJECT_PROCESS_STATE } from '@/utils/constant'

export default {
    data() {
        return {
            queryType: 'orderNo',
            SERVICE_PROJECT, 
            PROJECT_PROCESS_STATE,
            dataList: [],
            transCode: 'TOTS02',
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.otherServeRecordList || [];
        },
        handleChange(val) {
            if (this.queryType === 'serviceProject') {
                this.queryContent = '1';
            } else {
                this.queryContent = '';
            }
        },
        handleDelete(row) {
            if(row.projectId){
                this.$http.post({
                    transCode: 'TOTS02',
                    funType: 'findUpdateFlag',
                    id: row.projectId,
                }).then((data) => {
                    if(data.flag){
                        this.$http.post({
                            transCode: 'TOTS02',
                            funType: 'findDetail',
                            id: row.projectId,
                        }).then((data) => {
                            this.$confirm('您确认要删除此条记录吗？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'info'
                        }).then(() => {
                            this.$http.post({
                                transCode: 'TOTS02',
                                funType: 'delete',
                                ids: row.projectId,
                            }).then(data => {
                                this.getData();
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                            })
                        })
                        })
                    }else{
                        this.$message({
                            message: '该记录暂不可删除',
                            type: 'warning'
                        });
                    }
                })
            }
        }
    },
    created() {
        let userInfo = this.$store.state.user.userInfo
        this.userId = userInfo.userId;
        this.username = userInfo.userName;
        this.getData()
    }
}
</script>
