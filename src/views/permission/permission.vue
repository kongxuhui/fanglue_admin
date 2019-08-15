<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="权限名称" value="funName"></el-option>
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
            <el-form-item v-if="flag_3">
                <el-button type="primary" @click="handleAdd">新增功能</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userList" border @selection-change="handleSelectionChange" @current-change="toggleRowExpansion">

            <el-table-column type="expand" prop="childFunction">
                <template slot-scope="props">
                    <el-table :data="props.row.childFunction" border @selection-change="handleSelectionChange" :show-header="false" @current-change="toggleRowExpansion">

                        <el-table-column type="expand" prop="childFunction">
                            <template slot-scope="props">
                                <el-table :data="props.row.childFunction" border @selection-change="handleSelectionChange" :show-header="false" @current-change="toggleRowExpansion">

                                    <el-table-column prop="funName" label="功能名称"></el-table-column>
                                    <!-- <el-table-column prop="funName" label="显示功能"></el-table-column> -->
                                    <el-table-column prop="parentName" label="上级功能"></el-table-column>
                                    <el-table-column prop="funCode" label="功能编码"></el-table-column>
                                    <el-table-column prop="funcUrl" label="页面url"></el-table-column> 
                                    <el-table-column prop="sortCode" label="排序号" sortable></el-table-column>          
                                    <el-table-column prop="isDisabled" label="状态">
                                        <template slot-scope="scope">{{user_STATE[scope.row.isDisabled]}}</template>
                                    </el-table-column>         
                                    <el-table-column label="操作" width="100">
                                        <template slot-scope="scope">
                                            <div v-if="flag_1"><el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button></div>
                                            <div v-if="flag_2"><el-button size="mini" type="text" @click="handleDelet(scope.$index,scope.row, 3)">删除</el-button></div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>

                        <el-table-column prop="funName" label="功能名称"></el-table-column>
                        <!-- <el-table-column prop="funName" label="显示功能"></el-table-column> -->
                        <el-table-column prop="parentName" label="上级功能"></el-table-column>
                        <el-table-column prop="funCode" label="功能编码"></el-table-column>
                        <el-table-column prop="funcUrl" label="页面url"></el-table-column> 
                        <el-table-column prop="sortCode" label="排序号" sortable></el-table-column>          
                        <el-table-column label="状态" prop="isDisabled">
                            <template slot-scope="scope">{{user_STATE[scope.row.isDisabled]}}</template>
                        </el-table-column>         
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <div v-if="flag_1"><el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button></div>
                                <div v-if="flag_2"><el-button size="mini" type="text" @click="handleDelet(scope.$index,scope.row, 3)">删除</el-button></div>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>

            <el-table-column prop="funName" label="功能名称"></el-table-column>
            <!-- <el-table-column prop="funName" label="显示功能"></el-table-column> -->
            <el-table-column prop="parentName" label="上级功能"></el-table-column>
            <el-table-column prop="funCode" label="功能编码"></el-table-column>
            <el-table-column prop="funcUrl" label="页面url"></el-table-column> 
            <el-table-column prop="sortCode" label="排序号" sortable></el-table-column>          
            <el-table-column label="状态" prop="isDisabled">
                <template slot-scope="scope">{{user_STATE[scope.row.isDisabled]}}</template>
            </el-table-column>         
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div v-if="flag_1"><el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button></div>
                    <div v-if="flag_2"><el-button size="mini" type="text" @click="handleDelet(scope.$index,scope.row, 3)">删除</el-button></div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right mt10" v-if="userList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="merchant" ref="merchant" :rules="rules" label-width="150px">
                <el-form-item label="功能名称" prop="funName">
                    <el-input v-model.trim="merchant.funName"></el-input>
                </el-form-item>
                <!-- <el-form-item label="显示名称" prop="funName_1">
                    <el-input v-model.trim="merchant.funName"></el-input>
                </el-form-item> -->
                <div class="el-form-item is-required">
                    <span class="dep_select el-form-item__label">上级功能</span>
                    <el-cascader
                        :options="options"
                        filterable
                        change-on-select
                        v-model="selectedOptions3"
                        @change="handleItemChange"
                    ></el-cascader>
                </div>
                <el-form-item label="功能编码" prop="funCode">
                    <el-input v-model.trim="merchant.funCode"></el-input>
                </el-form-item>
                <el-form-item label="页面url" prop="funcUrl">
                    <el-input v-model.trim="merchant.funcUrl"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="isDisabled">
                    <el-select v-model="merchant.isDisabled" placeholder="请选择状态">
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
    .el-tree .el-tree-node__children .el-tree-node .el-tree-node__children .el-tree-node .el-tree-node__children .el-tree-node  {
        display: inline-block;
    }
</style>
<script>
import { DEPARTMENT, POST } from '@/utils/constant'
import { getHandle } from '@/utils/http'
export default {
    data() {
        return {
            flag_1: false,
            flag_2: false,
            flag_3: true,
            flag_4: false,            
            user_STATE: {
                0: '正常',
                1: '停用'
            },
            meId:'',
            DEPARTMENT,
            POST,
            options: [],
            merchant: {
            },
            userList: [],            
            userList_1: [],
            userList_2: [],
            userList_3: [],            
            state: '',
            dialogFormVisible: false,
            depName: '',
            workPostName: '',
            curRow: null,
            curSelection: [],
            queryType: 'funName',
            order: {
                individualMember: this.$store.state.user.userInfo.userName,
                transType: '1',
            },
            transCode: 'MFUN01',
            imgUrl: [],
            contractList: [],
            contractIndex: 0,
            fileList: [],
            expands: [],
            rules: {
                parentName: [
                    { required: true, message: '请输入上级功能', trigger: 'blur' }
                ],
                funName: [
                    { required: true, message: '请输入功能名称', trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5()]{0,}$/, message: '请填写有效的功能名称', trigger: 'blur' }
                ],
                isDisabled: [
                    { required: true, message: '请选择状态', trigger: 'change' }                   
                ],
                remark: [
                    { required: false, message: '请输入备注', trigger: 'blur' }
                ],
                funCode: [
                    { required: true, message: '请输入功能编码', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9]+$/, message: '请填写有效的功能编码', trigger: 'blur' }                    
                ],
                sortCode: [
                    { required: true, message: '请输入排序号', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9]+$/, message: '请填写有效的排序号', trigger: 'blur' }                    
                ],
                funcUrl: [
                    { message: '请输入页面url', trigger: 'blur' },
                    // { pattern: /[a-zA-z]+:\/\/[^\s]*/, message: '请填写有效的url', trigger: 'blur' }                    
                ]
            },
            curPage: 1,
            totalCount: 0,
            pageNum: 10,
            funType: 'findFunctionsForLevel',
            rootName_1: '',
            meIdArr: [],
            selectedOptions3: [],
        }
    },
    methods: {
        toggleRowExpansion(row){
            this.expands = [];
            this.expands.push(row.id);
        },
        queryCallBack(data) {
            this.userList = data.functionList || [];
            for(var i=0; i<this.userList.length; i++){
                if(JSON.parse(this.userList[i].parentIds).length == 1 ){
                    this.userList_1.push(this.userList[i]);
                }else if(JSON.parse(this.userList[i].parentIds).length == 2){
                    this.userList_2.push(this.userList[i]);                    
                }else if(JSON.parse(this.userList[i].parentIds).length == 3){
                    this.userList_3.push(this.userList[i]);
                }
            }
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
                transCode: 'MFUN01',
                funType: 'findDetail',
                id: row.funId
            }).then((data) => {
                this.options_1 = this.userList;
                var list = (this.options_1).map( (dep) => {
                    return {value: (dep.funId).toString() ,label: dep.funName,rootId: dep.parentId}
                })
                this.options = this.$http.setTreeData(list);         
                this.merchant = data.function;
                this.dialogFormVisible = true;
                this.funType = 'update';
                this.selectedOptions3 = JSON.parse(this.merchant.parentIds);
            })
        },
        handleState(row, state) {
            this.$http.post({
                transCode: 'MFUN01',
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
                    transCode: 'MFUN01',
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
                        transCode: 'MFUN01',
                        funType: this.funType,
                        id: this.merchant.funId,
                        ...this.merchant,
                        parentId: this.meId || 0,
                        parentIds: JSON.stringify(this.selectedOptions3) || [0],
                        parentName: this.rootName_1 || '',
                    }).then(data => {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        if (data.code == '000000') {
                            // this.getData();
                            this.messageTip(data);
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
            this.$http.post({
                transCode: 'MFUN01',
                funType: 'findAll',
            }).then((data) => {
                this.funType = 'add';
                if(data.code == "000000"){
                    this.options_1 = data.functionList;
                    var list = (this.options_1).map( (dep) => {
                        return {value: (dep.funId).toString() ,label: dep.funName,rootId: dep.parentId}
                    })
                    this.options = this.$http.setTreeData(list);
                }
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
        },
    },
    created() {
        getHandle().indexOf('修改') != -1 ? this.flag_1 = 'true' : '';
        getHandle().indexOf('删除') != -1 ? this.flag_2 = 'true' : '';
        // getHandle().indexOf('新增') != -1 ? this.flag_3 = 'true' : '';        
        this.$http.post({
            transCode: this.transCode,
            funType: this.funType,
            id: 0,
            pageCount: this.pageNum,
            currentPageNum: this.curPage,
            ...this.initCondition
        }).then(data => {
            this.totalCount = data.totalCount;
            this.queryCallBack(data);
        })
    }
}
</script>
