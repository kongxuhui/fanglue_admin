<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="认证状态" value="state"></el-option>
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
        <el-table :data="userList" stripe border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="用户名"></el-table-column>
            <el-table-column prop="phone" label="认证申请编号"></el-table-column>
            <el-table-column prop="email" label="申请时间"></el-table-column>
            <el-table-column prop="nickname" label="企业名称"></el-table-column>
            <el-table-column prop="" label="营业执照编号"></el-table-column>
            <el-table-column prop="type" label="法定代表人"></el-table-column>
            <el-table-column prop="time" label="联系人"></el-table-column>
            <el-table-column prop="state" label="联系电话"></el-table-column>
            <el-table-column prop="state" label="公司地址"></el-table-column>
            <el-table-column prop="state" label="认证状态"></el-table-column>
            <el-table-column prop="state" label="审核时间"></el-table-column>
            <el-table-column prop="state" label="审核人"></el-table-column>
            <el-table-column prop="state" label="审核意见"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div><el-button size="mini" @click="handleState(scope.row, 'open')">查看证件</el-button></div>
                    <div class="mt10"><el-button size="mini" type="success" @click="handleState(scope.row, 'pass')">通过</el-button></div>
                    <div class="mt10"><el-button size="mini" type="danger" @click="handleState(scope.row, 'stop')">驳回</el-button></div>
                </template>
            </el-table-column>
    </el-table>
    <el-row class="mt10" v-if="userList.length">
        <el-col :span="6">
            <el-button size="mini" type="success" @click="handleBatch('pass')" :disabled="curSelection.length === 0">批量通过</el-button>
            <el-button size="mini" type="danger" @click="handleBatch('reject')" :disabled="curSelection.length === 0">批量驳回</el-button>
        </el-col>
        <el-col class="text-right" :span="18"><el-pagination class="inline-block" background layout="prev, pager, next" :page-count="10" @current-change="handleCurrentChange"></el-pagination></el-col>
    </el-row>  
    </div>
</template>

<script>
import { AUTH_STATE } from '@/utils/constant'

export default {
    data() {
        return {
            queryType: 'state',
            AUTH_STATE,
            userList: [
                {
                    name: 'xx',
                    phone: 18734826752,
                    email: '1@qq.com',
                    nickname: '',
                    origin: '手机',
                    type: '个人',
                    time: '2018-1-30',
                    state: '启用',
                    id: 1
                },
                {
                    name: 'xx',
                    phone: 18734826752,
                    email: '1@qq.com',
                    nickname: '',
                    origin: '手机',
                    type: '个人',
                    time: '2018-1-30',
                    state: '启用',
                    id: 2
                }
            ],
            curSelection: []
        }
    },
    methods: {
        handleState(row, type) {
            console.log(row)
        },
        handleCurrentChange(page) {
            console.log(page)
        },
        handleBatch() {

        },
        handleSelectionChange(selection) {
            this.curSelection = selection;
        }
    }
}
</script>
