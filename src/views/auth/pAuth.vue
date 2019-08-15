<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="认证状态" value="auditStatus"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in AUTH_STATE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userList" stripe border>
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="userName" label="用户名"></el-table-column>
            <el-table-column prop="applyNo" label="认证申请编号"></el-table-column>
            <el-table-column label="申请时间">
                <template slot-scope="scope">{{ scope.row.applyTime && new Date(scope.row.applyTime).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <el-table-column prop="realName" label="真实姓名"></el-table-column>
            <el-table-column prop="cardNo" label="身份证号"></el-table-column>
            <el-table-column prop="cardValidStart" label="有效期起"></el-table-column>
            <el-table-column prop="cardValidEnd" label="有效期止"></el-table-column>
            <el-table-column label="长期">
                <template slot-scope="scope">{{scope.row.longTerm == 1 ? '是' : '否'}}</template>
            </el-table-column>
            <el-table-column label="身份证图片" width="170">
                <template slot-scope="scope">
                    <img :src="scope.row.cardImgUpUrl" class="img" alt="">
                    <img :src="scope.row.cardImgDownUrl" class="img" alt="">
                </template>
            </el-table-column>
            <el-table-column label="认证状态">
                <template slot-scope="scope">{{AUTH_STATE[scope.row.auditStatus]}}</template>
            </el-table-column>
            <el-table-column label="审核时间">
                <template slot-scope="scope">{{scope.row.auditTime && new Date(scope.row.auditTime).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <el-table-column prop="auditUser" label="审核人"></el-table-column>
            <el-table-column prop="auditExplain" label="审核意见"></el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                    <!-- <div><el-button size="mini" @click="handleClick(scope.row, 'check')">查看证件</el-button></div> -->
                    <div class="mt10" v-if="scope.row.auditStatus == 1 && flag_1">
                        <el-button size="mini" type="success" @click="handleClick(scope.row, 'audit')">审核</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-row class="mt10" v-if="userList.length">
            <el-col :span="6">
                <el-button size="mini" type="success" @click="handleBatch('pass')" :disabled="curSelection.length === 0">批量通过</el-button>
                <el-button size="mini" type="danger" @click="handleBatch('reject')" :disabled="curSelection.length === 0">批量驳回</el-button>
            </el-col>
            <el-col class="text-right" :span="18">
                <el-pagination class="inline-block" background layout="prev, pager, next" :total="totalPage" @current-change="">
            </el-pagination></el-col>
        </el-row> -->
        <div class="text-right mt10" v-if="userList.length">
            <el-pagination background layout="prev, pager, next" :total="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>
        <el-dialog :visible.sync="dialogVisible">
            <div class="img" style="padding-right:10px;">
                <img :src="frontSrc" alt="">
            </div>
            <div class="img">
                <img :src="backSrc" alt="">
            </div>
        </el-dialog>
        <el-dialog :visible.sync="auditVisible">
            <el-form label-width="80px" :model="auth" ref="ruleForm" :rules="rules">
                <el-form-item label="审核意见" prop="auditExplain">
                    <el-input type="textarea" v-model.trim="auth.auditExplain"></el-input>
                </el-form-item>
                <el-form-item label="商户类型">
                    <el-select v-model="bizInfoType">
                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in bizInfo"></el-option>
                    </el-select>
                </el-form-item>                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="success" @click="handleState(2)">通过</el-button>
                <el-button size="mini" type="danger" @click="handleState(3)">驳回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.img{
    display: inline-block;
    font-size: 0;
    width: 70px;
    text-align: center;
    vertical-align: middle;
}
</style>


<script>
import { AUTH_STATE } from '@/utils/constant'

export default {
    data() {
        return {
            flag_1: false,
            queryType: 'auditStatus',
            queryContent: '1',
            AUTH_STATE,
            userList: [],
            curSelection: [],
            frontSrc: '',
            backSrc: '',
            dialogVisible: false,
            auditVisible: false,
            auth: {
                auditExplain: ''
            },
            curRow: '',
            rules: {
                auditExplain: [
                    { required: true, message: '请输入审核意见', trigger: 'blur' },
                ]
            },
            transCode: 'MCER01',
            initCondition: {
                applyType: 1
            },
            bizInfo: {
                1: '托运方',
                2: '承运方',
                3: '经营方'
            },
            bizInfoType: '1'
        }
    },
    methods: {
        queryCallBack(data) {
            this.userList = data.certificationList || [];
        },
        handleState(state) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.auditVisible = false;
                    this.$http.post({
                        transCode: 'MCER01',
                        funType: 'auditCertification',
                        id: this.curRow.id,
                        auditStatus: state,
                        auditExplain: this.auth.auditExplain,
                        auditUser: this.$store.state.user.userInfo.userName,
                        bizInfoType: this.bizInfoType
                    }).then(data => {                       
                        if (data.code == '000000') {
                            this.getData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: data.message
                            });
                        }
                    })
                }
            })           
        },
        handleClick(row, type) {
            if (type === 'check') {
                this.frontSrc = row.cardImgUpUrl;
                this.backSrc = row.cardImgDownUrl;
                this.dialogVisible = true;
            } else {
                this.auditVisible = true;
                this.curRow = row;
            }
        },
    },
    created() {
        getHandle().indexOf('审核') != -1 ? this.flag_1 = 'true' : '';        
        this.getData()
    }
}
</script>
