<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="部门名称" value="depName"></el-option>
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
            <el-form-item>
                <el-button type="primary" @click="handleAdd">新增部门</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userList" border @selection-change="handleSelectionChange">
            <el-table-column prop="depName" label="部门名称"></el-table-column>
            <el-table-column prop="rootName" label="上级部门"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">{{new Date(scope.row.createTimeStr || Date.now()).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <el-table-column label="状态" prop="state">
                <template slot-scope="scope">{{user_STATE[scope.row.state]}}</template>
            </el-table-column>
            <el-table-column label="排序号" prop="sortCode" sortable></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div><el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button></div>
                    <!-- <div v-if="scope.row.state == 2"><el-button size="mini" type="text" @click="handleState(scope.row, 1)">启用</el-button></div> -->
                    <!-- <div v-if="scope.row.state == 1"><el-button size="mini" type="text" @click="handleState(scope.row, 2)">停用</el-button></div> -->
                    <div v-if="scope.row.createType == 2"><el-button size="mini" type="text" @click="handleDelet(scope.$index,scope.row, 3)">删除</el-button></div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right mt10" v-if="userList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="merchant" ref="merchant" :rules="rules" label-width="150px">
                <div class="el-form-item is-required">
                    <span class="dep_select el-form-item__label">上级部门</span>
                    <el-cascader
                        :options="options"
                        filterable
                        change-on-select
                        v-model="selectedOptions3"
                        @change="handleItemChange"
                    ></el-cascader>
                </div>
                <el-form-item label="部门名称" prop="depName">
                    <el-input v-model.trim="merchant.depName"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="merchant.state" placeholder="请选择状态)">
                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in user_STATE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序号" prop="sortCode">
                    <el-input v-model="merchant.sortCode"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="merchant.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible_1 = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style>
    .dep_select{
        width: 150px;
    }
</style>
<script>
import { DEPARTMENT, POST } from '@/utils/constant'
import Cookies from 'js-cookie'

export default {
    data() {
        return {
            user_STATE: {
                1: '正常',
                2: '停用'
            },
            meId:'',
            DEPARTMENT,
            POST,
            options: [],
            merchant: {
                depName: '',
                state: '1',
                userName: ''
            },
            userList: [],
            state: '',
            dialogFormVisible: false,
            depName: '',
            workPostName: '',
            curRow: null,
            curSelection: [],
            queryType: 'depName',
            order: {
                individualMember: this.$store.state.user.userInfo.userName,
                transType: '1',
            },
            transCode: 'MDEP01',
            imgUrl: [],
            contractList: [],
            contractIndex: 0,
            fileList: [],
            rules: {
                depName: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ],
                rootName: [
                    { required: true, message: '请选择上级部门', trigger: 'change' }
                ],
                sortCode: [
                    { required: true, message: '请输入排序号', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                // businessinfName: [
                //     { required: true, message: '请输入所属商户', trigger: 'blur' }
                // ],
                remark: [
                    { required: false, message: '请输入备注', trigger: 'blur' }
                ]
            },
            funType: '',
            rootName_1: '',
            meIdArr: [],
            selectedOptions3: [],
            userInfo:{},
            userId: '',
        }
    },
    methods: {
        queryCallBack(data) {
            this.userList = data.departmentList || [];
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
                transCode: 'MDEP01',
                funType: 'findDetail',
                id: row.depId,
                
            }).then((data) => {
                this.options_1 = this.userList;
                var list = (this.options_1).map( (dep) => {
                    return {value: (dep.depId).toString() ,label: dep.depName,rootId: dep.rootId}
                })
                function setTreeData(arr) {
                    let map = {}; // 构建map
                    arr.forEach(i => {
                        map[i.value] = i; // 构建以id为键 当前数据为值
                    });

                    let treeData = [];
                    arr.forEach(child => {
                        const mapItem = map[child.rootId]; // 获取当前数据的parentId是否存在map中
                        delete child.rootId;
                        if (mapItem) { // 存在则表示当前数据不是最顶层数据
                            // 注意: 这里的map中的数据是引用了arr的它的指向还是arr, 当mapItem改变时arr也会改变
                            
                            (mapItem.children || ( mapItem.children = [] )).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
                            // this.$set((mapItem.children || ( mapItem.children = [] )), index, child)
                        } else { // 不存在则是组顶层数据
                            treeData.push(child);
                        }
                    });
                    return treeData;
                }                
                this.options = setTreeData(list);             
                this.merchant = data.department;
                this.dialogFormVisible = true;
                this.funType = 'update';
                this.selectedOptions3 = JSON.parse(this.merchant.rootIds);
                this.meIdArr = JSON.parse(this.merchant.rootIds);
            })
        },
        handleState(row, state) {
            this.$http.post({
                transCode: 'MDEP01',
                funType: 'update',
                state: state,
                id: row.depId
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
                    transCode: 'MDEP01',
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
            this.userId = this.$store.state.user.userInfo.userId;
            this.$refs.merchant.validate(valid => {
                if (valid) {
                    console.log(this.selectedOptions3)
                    this.$http.post({
                        transCode: 'MDEP01',
                        funType: this.funType,
                        id: this.merchant.depId,
                        ...this.merchant,
                        rootId: this.meId,
                        rootIds: JSON.stringify(this.selectedOptions3),
                        rootName: this.rootName_1,
                        ownedMerchantId: this.userId,
                    }).then(data => {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        if (data.code == '000000') {
                            this.getData();
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
            this.$http.post({
                transCode: 'MDEP01',
                funType: 'findAll',
            }).then((data) => {
                this.options_1 = data.departmentList;
                var list = (this.options_1).map( (dep) => {
                    return {value: (dep.depId).toString() ,label: dep.depName,rootId: dep.rootId}
                })
                function setTreeData(arr) {
                    let map = {}; // 构建map
                    arr.forEach(i => {
                        map[i.value] = i; // 构建以id为键 当前数据为值
                    });

                    let treeData = [];
                    arr.forEach(child => {
                        const mapItem = map[child.rootId]; // 获取当前数据的parentId是否存在map中
                        delete child.rootId;
                        if (mapItem) { // 存在则表示当前数据不是最顶层数据
                            // 注意: 这里的map中的数据是引用了arr的它的指向还是arr, 当mapItem改变时arr也会改变
                            
                            (mapItem.children || ( mapItem.children = [] )).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
                            // this.$set((mapItem.children || ( mapItem.children = [] )), index, child)
                        } else { // 不存在则是组顶层数据
                            treeData.push(child);
                        }
                    });
                    return treeData;
                }
                this.options = setTreeData(list);
                this.funType = 'add';
            })
        },
        handleItemChange(val) {
            function getCascaderObj(val,opt) {
                return val.map(function (value, index, array) {
                    for (var itm of opt) {
                        if (itm.value == value) { opt = itm.children; return itm; }
                    }
                    return null;
                });
            }
            this.meId = val[val.length - 1];
            this.meIdArr.push(val[val.length - 1]);
            this.rootName_1 = getCascaderObj(val,this.options)[getCascaderObj(val,this.options).length - 1].label;
            
            this.selectedOptions3 = this.selectedOptions3;
            // console.log(this.meIdArr)
            
        },
    },
    created() {
        this.getData();
    }
}
</script>
