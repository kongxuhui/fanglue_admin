<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="用户名" value="userName"></el-option>
                    <el-option label="手机号" value="phone"></el-option>
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
            <el-table-column prop="userId" label="用户id"></el-table-column>
            <el-table-column prop="userName" label="用户名"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="userImg" label="头像">
                <template slot-scope="scope"><img :src="scope.row.userImg" alt="" style="width:80px;height:80px;"></template>
            </el-table-column>
            <el-table-column prop="nickName" label="昵称"></el-table-column>
            <el-table-column prop="realName" label="真实姓名"></el-table-column>
            <el-table-column prop="" label="性别">
                <template slot-scope="scope">{{scope.row.sex == 1 ? '男' : '女'}}</template>
            </el-table-column>
            <el-table-column prop="birthday" label="出生日期"></el-table-column>
            <!-- <el-table-column prop="domicile" label="居住地"></el-table-column>
            <el-table-column prop="home" label="家乡"></el-table-column> -->
            <!-- <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleState(scope.$index, 'open')">查看</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div class="text-right mt10" v-if="dataList.length">
            <el-pagination background layout="prev, pager, next" :total="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryType: 'userName',
            dataList: [],
            transCode: 'MUSR09'
        }
    },
    methods: {
       queryCallBack(data) {
            this.dataList = data.userList || [];
        }
    },
    created() {
        this.getData()
    }
}
</script>
