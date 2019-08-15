<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="用户名" value="userName"></el-option>
                    <el-option label="手机号" value="phone"></el-option>
                    <el-option label="认证类型" value="authType"></el-option>
                    <el-option label="状态" value="userStatus"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryType === 'authType'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in AUTH_TYPE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else-if="queryType === 'userStatus'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in USER_STATE"></el-option>
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
            <el-table-column prop="userName" label="用户名"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="weibouid" label="微信id"></el-table-column>
            <el-table-column prop="weChatNickName" label="微信昵称"></el-table-column>
            <el-table-column prop="nickName" label="昵称"></el-table-column>
            <el-table-column prop="" label="用户来源">
                <template slot-scope="scope">{{scope.row.userSource == 1 || scope.row.userSource == '' ? 'APP' : 'PC'}}</template>
            </el-table-column>
            <el-table-column prop="authType" label="认证类型">
                <template slot-scope="scope">{{AUTH_TYPE[scope.row.authType]}}</template>
            </el-table-column>
            <el-table-column label="注册时间">
                 <template slot-scope="scope">{{new Date(scope.row.registerTime).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <el-table-column prop="userStatus" label="状态">
                <template slot-scope="scope">{{USER_STATE[scope.row.userStatus]}}</template>
            </el-table-column>
            <el-table-column prop="userStatus" label="用户级别">
                <template slot-scope="scope">{{USER_TYPE[scope.row.userType]}}</template>
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope" v-if="flag_1">
                    <el-button v-if="scope.row.userStatus != 1" size="mini" type="success" @click="handleState(scope.row, 'open')">启用</el-button>
                    <el-button v-else size="mini" type="danger" @click="handleState(scope.row, 'stop')">停用</el-button>
                </template>
            </el-table-column>
        </el-table>  
        <div class="text-right mt10" v-if="dataList.length">
            <el-pagination background layout="prev, pager, next" :total="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>
    </div>
</template>

<script>
import { AUTH_TYPE, USER_STATE } from '@/utils/constant'
import { getHandle } from '@/utils/http'
export default {
    data() {
        return {
            flag_1: false,
            queryType: 'userName',
            AUTH_TYPE,
            USER_STATE,
            USER_TYPE: {
                0: '系统管理员',
                1: '商户管理员',
                2: '其他用户'
            },
            dataList: [],
            curSelection: [],
            transCode: 'MUSR09'
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.userList || [];
        },
        handleChange(val) {
            if (this.queryType === 'authType' || this.queryType === 'userStatus') {
                this.queryContent = '0';
            } else {
                this.queryContent = '';
            }
        },
        handleState(row, type) {
            if (type === 'open') {
                this.updateState(1,row).then(data => {
                    if (data.code === '000000') {
                        row.userStatus = 1;
                        this.$message({
                            type: 'success',
                            message: '启用成功!'
                        });
                    } else {
                        this.messageTip(data)
                    }
                })
            } else {
                this.$confirm(`确定停用${row.userName}的账户吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.updateState(0,row).then(data => {
                        if (data.code === '000000') {
                            row.userStatus = 0;
                            this.$message({
                                type: 'success',
                                message: '停用成功!'
                            });
                        } else {
                            this.messageTip(data)
                        }
                    })
                });
            }
        },
        updateState(userStatus,row) {
            return this.$http.post({
                transCode: this.transCode,
                funType: 'editUserInfo',
                userStatus,
                userId: row.userId
            })
        }
    },
    created() {
        getHandle().indexOf('停用') != -1 || getHandle().indexOf('启用') != -1 ? this.flag_1 = 'true' : '';
        console.log(this.flag_1)        
        this.getData()
    }
}
</script>
