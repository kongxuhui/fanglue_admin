<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="岗位(角色)名称" value="workPostName"></el-option>
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
                <el-button type="primary" @click="handleAdd">新增岗位</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userList" border @selection-change="handleSelectionChange">
            <el-table-column prop="roleName" label="岗位(角色)名称"></el-table-column>
            <el-table-column prop="roleExplain" label="岗位描述"></el-table-column>
            <el-table-column prop="remark" label="岗位权限"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div><el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button></div>
                    <div><el-button size="mini" type="text" @click="handleGetPer(scope.row)">查看权限</el-button></div>
                    <div><el-button size="mini" type="text" @click="handleSetPer(scope.row)">设置权限</el-button></div>
                    <div><el-button size="mini" type="text" @click="handleDelet(scope.$index,scope.row, 3)">删除</el-button></div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right mt10" v-if="userList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <!-- 新增岗位 -->
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="roles" ref="roles" :rules="rules" label-width="150px">
                <el-form-item label="岗位(角色)名称" prop="roleName">
                    <el-input v-model.trim="roles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="岗位描述" prop="roleExplain">
                    <el-input type="textarea" v-model="roles.roleExplain"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit_1()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 设置权限 -->
        <el-dialog :visible.sync="permissionVisible">
            <!-- <div> -->
                <el-tree
                :data="options"
                show-checkbox
                default-expand-all
                node-key="value"
                ref="tree"
                highlight-current
                :props="defaultProps">
                </el-tree>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="permissionVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit()">确 定</el-button>
                </div>
            <!-- </div> -->
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
            ownedMerchant: '',
            meId:'',
            DEPARTMENT,
            POST,
            options: [],
            roles: {
                
            },
            userList: [],
            state: '',
            dialogFormVisible: false,
            permissionVisible: false,
            depName: '',
            workPostName: '',
            curRow: null,
            curSelection: [],
            queryType: 'workPostName',
            roleExplain: '',
            roleName: '',
            order: {
                individualMember: this.$store.state.user.userInfo.userName,
                transType: '1',
            },
            transCode: 'MROL01',
            imgUrl: [],
            contractList: [],
            contractIndex: 0,
            fileList: [],
            rules: {
                roleName: [
                    { required: true, message: '请输入岗位名称', trigger: 'blur' }
                ],
                roleExplain: [
                    { required: false, message: '请输入岗位描述', trigger: 'blur' }
                ]
            },
            funType: '',
            rootName_1: '',
            meIdArr: [],
            selectedOptions3: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            adId: '',
            nodes: [],
        }
    },
    methods: {
        queryCallBack(data) {
            this.userList = data.roleList || [];
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
                id: row.depId
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
        handleSetPer(row) {
            this.adId = row.roleId;
            this.$http.post({
                transCode: 'MROL02',
                funType: 'findAll',
                roleId: this.adId,
            }).then(data => {
                if(data.code == '000000'){
                    this.nodes = data.roleFunctionList;
                    this.nodes.forEach(el => {
                        el.label = el.funName;
                        el.value = el.funId;                            
                        delete el.businessinfType;
                        delete el.parentName;
                        delete el.parentIds;
                        delete el.parentId;
                        delete el.id;
                        delete el.parentName;
                        delete el.funId;
                        delete el.funName;
                        delete el.roleId;
                    })                        
                }else{
                    this.nodes = [];
                }
            })
            this.$http.post({
                transCode: 'MFUN02',
                funType: 'findAll',
                businessinfId: '0',
            }).then(data => {
                this.options_1 = data.functionBusinessinfList;
                var list = (this.options_1).map( (dep) => {
                    return {value: dep.funId, label: dep.funName, rootId: dep.parentId}
                })
                this.options = this.$http.setTreeData(list);
                this.permissionVisible = true;
                setTimeout(() => this.$refs.tree.setCheckedNodes(this.nodes), 200);
            })
        },
        handleGetPer(row){

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
            this.nodes = this.$refs.tree.getCheckedNodes();
            this.nodes.forEach(el => {
                delete el.children;
                delete el.label;
                this.options_1.forEach(element => {
                    if(el.value == element.funId){
                        this.nodes.push({'funId': element.funId, 'funName': element.funName, 'parentId': element.parentId, 'parentName': element.parentName, 'parentIds': element.parentIds})
                    }
                })
            })
            this.nodes.forEach((index,ele) => {
                if(ele.value){
                    this.nodes.splice(index,1)
                }
            });
            this.nodes.splice(0,this.nodes.length/2);
            this.$http.post({
                transCode: 'MROL02',
                funType: 'add',
                roleId: this.adId,
                roleFunctions: JSON.stringify(this.nodes),
            }).then(data => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
                this.permissionVisible = false;
                if (data.code == '000000') {
                    this.getData();
                } else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
            })         
        },
        handleSelectionChange(selection) {
            this.curSelection = selection;
        },
        handleSubmit_1() {
            this.$refs.roles.validate(valid => {
                    if (valid) {
                        this.$http.post({
                            transCode: 'MROL01',
                            funType: 'add',
                            businessinfId: this.ownedMerchant,
                            ...this.roles
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
        handleAdd() {
            this.dialogFormVisible = true;
            console.log(this.$store.userInfo);
            this.ownedMerchant = this.$store.state.user.userInfo.ownedMerchant;

            // this.$http.post({
            //     transCode: 'MDEP01',
            //     funType: 'findAll',
            // }).then((data) => {
            //     this.options_1 = data.departmentList;
            //     var list = (this.options_1).map( (dep) => {
            //         return {value: (dep.depId).toString() ,label: dep.depName,rootId: dep.rootId}
            //     })
            //     function setTreeData(arr) {
            //         let map = {}; // 构建map
            //         arr.forEach(i => {
            //             map[i.value] = i; // 构建以id为键 当前数据为值
            //         });

            //         let treeData = [];
            //         arr.forEach(child => {
            //             const mapItem = map[child.rootId]; // 获取当前数据的parentId是否存在map中
            //             delete child.rootId;
            //             if (mapItem) { // 存在则表示当前数据不是最顶层数据
            //                 // 注意: 这里的map中的数据是引用了arr的它的指向还是arr, 当mapItem改变时arr也会改变
                            
            //                 (mapItem.children || ( mapItem.children = [] )).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
            //                 // this.$set((mapItem.children || ( mapItem.children = [] )), index, child)
            //             } else { // 不存在则是组顶层数据
            //                 treeData.push(child);
            //             }
            //         });
            //         return treeData;
            //     }
            //     this.options = setTreeData(list);
            //     this.funType = 'add';
            // })
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
        this.getData();
    }
}
</script>
