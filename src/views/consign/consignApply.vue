<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="申请日期" value="applyTimeStr"></el-option>
                    <el-option label="联系人" value="contacts"></el-option>
                    <el-option label="联系电话" value="contactTel"></el-option>
                    <el-option label="申请状态" value="applyStatus"></el-option>
                    <el-option label="跟进状态" value="followupStatus"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryType === 'applyTimeStr'">
                <el-date-picker type="date" placeholder="选择日期" v-model="queryContent"></el-date-picker>
            </el-form-item>
            <el-form-item v-else-if="queryType === 'applyStatus'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in APPLY_STATE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else-if="queryType === 'followupStatus'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in FOLLOWUP_STATE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else>
                <el-input v-model="queryContent" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
        </el-form>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="我处理" name="my"></el-tab-pane>
        </el-tabs>
        <el-table :data="userList" border>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="单号">
                            <span>{{ props.row.applyNo }}</span>
                        </el-form-item>
                        <el-form-item label="申请时间">
                            <span>{{new Date(props.row.applyTime).Format('yyyy-MM-dd')}}</span>
                        </el-form-item>
                        <el-form-item label="货物名">
                            <span>{{ props.row.productsName }}</span>
                        </el-form-item>
                        <el-form-item label="发货地">
                            <span>{{ props.row.fromPlace }}</span>
                        </el-form-item>
                        <el-form-item label="收货地">
                            <span>{{ props.row.toPlace }}</span>
                        </el-form-item>
                        <el-form-item label="货物重量">
                            <span>{{ props.row.productsVolume }}吨</span>
                        </el-form-item>
                        <el-form-item label="货物体积">
                            <span>{{ props.row.productsVolume }}m³</span>
                        </el-form-item>
                        <el-form-item label="发货日期">
                            <span>{{new Date(props.row.sendDate).Format('yyyy-MM-dd')}}</span>
                        </el-form-item>
                        <el-form-item label="联系人">
                            <span>{{ props.row.contacts }}</span>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <span>{{ props.row.contactTel }}</span>
                        </el-form-item>
                        <el-form-item label="客户名">
                            <span>{{ props.row.custName }}</span>
                        </el-form-item>
                        <el-form-item label="申请状态">
                            <span>{{ APPLY_STATE[props.row.applyStatus] }}</span>
                        </el-form-item>
                        <el-form-item label="申请反馈">
                            <span>{{ props.row.applyFeedback }}</span>
                        </el-form-item>
                        <el-form-item label="跟进状态">
                            <span>{{ FOLLOWUP_STATE[props.row.followupStatus] }}</span>
                        </el-form-item>
                        <el-form-item label="跟进信息">
                            <span>{{ props.row.followupMessage }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="applyNo" label="单号"></el-table-column>
            <el-table-column label="申请时间">
                <template slot-scope="scope">{{new Date(scope.row.applyTime).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <el-table-column prop="fromPlace" label="发货地"></el-table-column>
            <el-table-column prop="toPlace" label="收货地"></el-table-column>
            <el-table-column prop="productsName" label="货物名"></el-table-column>
            <el-table-column label="发货日期">
                <template slot-scope="scope">{{new Date(scope.row.sendDate).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <el-table-column prop="contacts" label="联系人"></el-table-column>
            <el-table-column prop="contactTel" label="联系电话"></el-table-column>
            <el-table-column label="处理状态">
                <template slot-scope="scope">{{APPLY_STATE[scope.row.applyStatus]}}</template>
            </el-table-column>
            <!-- <el-table-column prop="sourceType" label="来源类型">
                <template slot-scope="scope">{{SOURCE_TYPE[scope.row.sourceType]}}</template>
            </el-table-column> -->
            <el-table-column prop="state" label="跟进状态">
                <template slot-scope="scope">{{FOLLOWUP_STATE[scope.row.followupStatus]}}</template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div v-if="userId != scope.row.feedbackUserId"><el-button size="mini" type="success" @click="handleState(scope.row, 'handle')">处理</el-button></div>
                    <template v-else>
                        <div class="mt10"><el-button size="mini" type="primary" @click="handleClick(scope.row, 'feedback')">反馈</el-button></div>
                        <div class="mt10"><el-button size="mini" type="primary" @click="handleClick(scope.row, 'follow')">跟进</el-button></div>
                        <div class="mt10"><el-button size="mini" type="danger" @click="handleState(scope.row, 'cancel')">撤销处理</el-button></div>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right mt10" v-if="userList.length">
            <el-pagination background layout="prev, pager, next" :total="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>
        <el-dialog :visible.sync="feedbackVisible">
            <el-form label-width="80px">
                <el-form-item label="申请状态">
                    <el-select v-model="feedbackState">
                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in APPLY_STATE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请反馈">
                    <el-input v-model="feedback"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="feedbackVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSave('feedback')">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="followVisible">
            <el-form label-width="80px">
                <el-form-item label="跟进状态">
                    <el-select v-model="followState">
                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in FOLLOWUP_STATE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跟进信息">
                    <el-input v-model="followInfo"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="feedbackVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSave('follow')">保存</el-button>
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
import { FOLLOWUP_STATE, APPLY_STATE, SOURCE_TYPE } from '@/utils/constant'
export default {
    data() {
        return {
            queryType: 'applyTimeStr',
            userList: [],
            isDisabled: false,
            activeName: 'all',
            SOURCE_TYPE,
            FOLLOWUP_STATE,
            APPLY_STATE,
            feedbackState: '1',
            feedback: '',
            followState: '1',
            followInfo: '',
            followVisible: false,
            feedbackVisible: false,
            curRow: {}
        }
    },
    methods: {
        handleQuery() {
            this.$http.post({
                transCode: 'TCSA01',
                funType: 'findAll',
                pageCount: this.pageNum,
                currentPageNum: this.curPage,
                [this.queryType]: this.queryContent,
                feedbackUserId: this.activeName === 'all' ? '' : this.userId
            }).then(data => {
                this.userList = data.consignApplyList || [];
                this.totalCount = data.totalCount;
            })
        },
        handleClick(row, type) {
            this.curRow = row;
            if (type === 'feedback') {
                this.feedbackVisible = true;
            } else {
                this.followVisible = true;
            }
        },
        handleSave(type) {
            if (type === 'feedback') {
                this.$http.post({
                    transCode: 'TCSA01',
                    funType: 'update',
                    applyStatus: this.feedbackState,
                    applyFeedback: this.feedback,
                    id: this.curRow.id
                }).then(data => {
                    if (data.code == '000000') {
                        this.feedbackVisible = false;
                        this.curRow.applyStatus = this.feedbackState;
                        this.curRow.applyFeedback = this.feedback;
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.message
                        });
                    }
                })
            } else {               
                this.$http.post({
                    transCode: 'TCSA01',
                    funType: 'update',
                    followupStatus: this.followState,
                    followupMessage: this.followInfo,
                    id: this.curRow.id
                }).then(data => {
                    this.followVisible = false;
                    if (data.code == '000000') {                       
                        this.curRow.followupStatus = this.followState;
                        this.curRow.followupMessage = this.followInfo;
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.message
                        });
                    }                   
                })
            }
        },
        handleState(row, type) {
            if (type === 'handle') {
                this.$confirm('确认您要处理此单业务吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$http.post({
                        transCode: 'TCSA01',
                        funType: 'checkUsed',
                        id: row.id,
                        feedbackUserId: this.userId
                    }).then(data => {
                        if (data.usedFlag == 1) {
                            this.$message({
                                type: 'info',
                                message: '该申请单已被处理'
                            });
                        } else {
                            this.getData();
                        }
                       
                    })                    
                });
            } else {
                this.$http.post({
                    transCode: 'TCSA01',
                    funType: 'revert',
                    id: row.id
                }).then(data => {
                    if (data.code === '000000') {
                        row.feedbackUserId = '';
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.message
                        });
                    }
                })
            }
        },
        handleSubmit() {
            this.curRow.id = this.merchant.num;
            this.curRow.type = this.merchant.type;
            this.dialogFormVisible = false;
        },
        handleTabClick() {
            this.getData();
        },
        getData() {
            this.$http.post({
                transCode: 'TCSA01',
                funType: 'findAll',
                pageCount: this.pageNum,
                currentPageNum: this.curPage,
                feedbackUserId:  this.activeName === 'all' ? '' : this.userId
            }).then(data => {
                this.userList = data.consignApplyList || [];
                this.totalCount = data.totalCount;
            })
        }
    },
    created() {
        this.userId = this.$store.state.user.userInfo.userId || 1;
        this.getData();
    }
}
</script>
