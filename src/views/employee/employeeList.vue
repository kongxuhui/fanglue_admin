<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="员工姓名" value="empName"></el-option>
                    <!-- <el-option label="员工编号" value="bizInfoAbbreviation"></el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryType === 'bizInfoType'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in MERCHANT_TYPE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else>
                <el-input v-model="queryContent" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
            <el-form-item v-if="flag_1">
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userList" border @selection-change="handleSelectionChange">
            <el-table-column prop="empName" label="员工姓名"></el-table-column>
            <el-table-column prop="userName" label="员工用户名"></el-table-column>
            <el-table-column prop="departmentName" label="所属部门">
            </el-table-column>
            <el-table-column prop="workPostName" label="岗位(角色)">
            </el-table-column>
            <el-table-column prop="phoneNum" label="安全手机号"></el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">{{new Date(scope.row.registerTime || Date.now()).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <el-table-column label="状态" prop="state">
                <template slot-scope="scope">{{user_STATE[scope.row.state]}}</template>
            </el-table-column>
            <el-table-column label="所属商户" prop="businessinfName"></el-table-column>
            <!-- <el-table-column label="备注" prop="businessinfName"></el-table-column> -->
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div><el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button></div>
                    <div v-if="scope.row.state == 2 && flag_2"><el-button size="mini" type="text" @click="handleState(scope.row, 1)">启用</el-button></div>
                    <div v-if="scope.row.state == 1 && flag_2"><el-button size="mini" type="text" @click="handleState(scope.row, 2)">停用</el-button></div>
                    <div v-if="scope.row.createType == 2 && flag_3"><el-button size="mini" type="text" @click="handleDelet(scope.$index,scope.row, 3)">删除</el-button></div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right mt10" v-if="userList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="merchant" ref="merchant" :rules="rules" label-width="150px">
                <!-- <el-col :span="12"> -->
                    <el-form-item label="员工姓名" prop="empName">
                        <el-input v-model.trim="merchant.empName"></el-input>
                    </el-form-item>
                    <el-form-item label="员工用户名" prop="userName">
                        <el-input v-model.trim="merchant.userName"></el-input>
                    </el-form-item>
                <!-- <el-col> -->
                <el-form-item label="所属部门">
                    <el-select v-model="merchant.depId" placeholder="请选择部门">
                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in DEPARTMENT"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="岗位(角色)">
                    <el-select v-model="merchant.wpId" placeholder="请选择岗位(角色)">
                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in POST"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安全手机号" prop="phoneNum">
                    <el-input v-model="merchant.phoneNum"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="loginPwd">
                    <el-input v-model="merchant.loginPwd"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="merchant.state" placeholder="请选择状态)">
                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in user_STATE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属商户" prop="businessinfName">
                    <el-input v-model="merchant.businessinfName"></el-input>
                </el-form-item>
                <!-- <el-form-item label="备注">
                    <el-input type="textarea" v-model="merchant.remark"></el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible_1 = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { DEPARTMENT, POST,user_STATE } from '@/utils/constant'
import { getHandle } from '@/utils/http'

export default {
    data() {
        return {
            flag_1: false,
            flag_2: false,
            flag_3: false,          
            user_STATE,
            DEPARTMENT,
            POST: {},
            merchant: {
                // state: '1',
                userName: ''
            },
            userList: [],
            state: '',
            dialogFormVisible: false,
            curRow: null,
            curSelection: [],
            queryType: 'empName',
            order: {
                individualMember: this.$store.state.user.userInfo.userName,
                transType: '1',
            },
            transCode: 'MEMP01',
            imgUrl: [],
            contractList: [],
            contractIndex: 0,
            fileList: [],
            rules: {
                empName: [
                    { required: true, message: '请输入员工姓名', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入员工用户名', trigger: 'blur' }
                ],
                depId: [
                    { required: true, message: '请选择部门', trigger: 'change' }
                ],
                wpId: [
                    { required: true, message: '请选择岗位', trigger: 'change' }
                ],
                phoneNum: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                loginPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                businessinfName: [
                    { required: true, message: '请输入所属商户', trigger: 'blur' }
                ],
                // remarks: [
                //     { required: true, message: '请输入备注', trigger: 'blur' }
                // ]
            },
            funType: '',
        }
    },
    methods: {
        queryCallBack(data) {
            this.userList = data.employeeList || [];
        },
        handleChange(val) {
            if (this.queryType === 'bizInfoType') {
                this.queryContent = '1';
            } else {
                this.queryContent = '';
            }
        },
        handleEdit(row) {
            this.$http.post({
                transCode: 'MEMP01',
                funType: 'findDetail',
                id: row.empId
            }).then(data => {
                this.merchant = data.employee;
                this.merchant.depId = this.merchant.depId.toString();
                this.merchant.wpId = this.merchant.wpId.toString();
                this.dialogFormVisible = true;
                this.funType = 'update';
            })
        },
        handleState(row, state) {
            this.$http.post({
                transCode: 'MEMP01',
                funType: 'update',
                state: state,
                id: row.empId
            }).then(data => {
                if (data.code == '000000') {
                    row.state = state;
                } else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
            })
        },
        handleDelet(index,row){
            this.$confirm('您确认要删除此商户吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
            }).then(() => {
                this.$http.post({
                    transCode: 'MEMP01',
                    funType: 'delete',
                    ids: row.bizInfoId
                }).then(data => {
                    if (data.code === '000000') {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.message
                        });
                    }
                })
            })
        },
        handleSubmit() {
                this.$refs.merchant.validate(valid => {
                    if (valid) {
                        this.$http.post({
                            transCode: 'MEMP01',
                            funType: this.funType,
                            id: this.merchant.empId,
                            ...this.merchant
                        }).then(data => {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.dialogFormVisible = false;
                            if (data.code == '000000') {
                                this.getData();
                                // this.messageTip(data);
                                // this.curRow.bizInfoAbbreviation = this.bizInfoAbbreviation;
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
        handleSelectionChange(selection) {
            this.curSelection = selection;
        },
        handleAdd() {
            this.dialogFormVisible = true;
            this.funType = 'add';
            this.$http.post({
                transCode: 'MROL01',
                funType: 'findAll',
                businessinfId: this.$store.state.user.userInfo.ownedMerchant,
            }).then((data) => {
                data.roleList.forEach((item) => {
                    let obj1 = {},obj2 = {};
                    obj1[item.roleId] = item.roleName;
                    obj2 = Object.assign(obj1,this.POST);
                    this.POST = Object.assign(obj1,obj2);
                })
                // console.log(this.POST);
            })
        }
    },
    created() {
        getHandle().indexOf('新增') != -1 ? this.flag_1 = 'true' : '';        
        getHandle().indexOf('启用') != -1 ||getHandle().indexOf('停用') != -1 ? this.flag_2 = 'true' : '';
        getHandle().indexOf('删除') != -1 ? this.flag_3 = 'true' : '';                
        this.getData();
    }
}
</script>
