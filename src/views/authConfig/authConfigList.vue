<template>
    <div class="main">
        <el-button type="primary" @click="dialogFormVisible = true">新增</el-button>
        <el-table class="mt10" :data="userList" stripe border>
            <el-table-column prop="name" label="商户类型"></el-table-column>
            <el-table-column prop="phone" label="功能名称"></el-table-column>
            <el-table-column prop="email" label="显示名称"></el-table-column>
            <el-table-column prop="nickname" label="上级功能"></el-table-column>
            <el-table-column prop="" label="功能编码"></el-table-column>
            <el-table-column prop="type" label="页面url"></el-table-column>
            <el-table-column prop="time" label="排序号"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
        </el-table>
        <el-row class="mt10" v-if="userList.length">
            <el-col class="text-right"><el-pagination class="inline-block" background layout="prev, pager, next" :page-count="10" @current-change="handleCurrentChange"></el-pagination></el-col>
        </el-row> 
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="config" label-width="80px">
                <el-form-item label="商户类型">
                    <el-select v-model="config.type">
                        <el-option label="认证状态" value="state"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级功能">
                    <el-select v-model="config.function">
                        <el-option label="认证状态" value="state"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="功能名称">
                    <el-input v-model="config.name"></el-input>
                </el-form-item>
                <el-form-item label="显示功能">
                    <el-input v-model="config.show"></el-input>
                </el-form-item>
                <el-form-item label="功能编码">
                    <el-input v-model="config.code"></el-input>
                </el-form-item>
                <el-form-item label="页面url">
                    <el-input v-model="config.url"></el-input>
                </el-form-item>
                <el-form-item label="排序号">
                    <el-input v-model="config.order"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog> 
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogFormVisible: false,
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
            config: {
                type: '',
                function: '',
                name: '',
                show: '',
                code: '',
                url: '',
                order: '',
            }
        }
    },
    methods: {
        handleNew() {
            console.log(this.query.condition)
        },
        handleState(index, type) {
            console.log(this.userList[index].id)
        },
        handleCurrentChange(page) {
            console.log(page)
        },
        handleBatch() {

        },
        handleSelectionChange(selection) {
            this.curSelection = selection;
        },
        handleSubmit() {

        }
    }
}
</script>
