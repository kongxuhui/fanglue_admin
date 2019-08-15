<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="商户类型" value="bizInfoType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryType === 'bizInfoType'">
                <el-select v-model="queryContent">
                    <el-option :label="value.bizInfoType" :value="key" :key="key" v-for="(value, key) in userList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else>
                <el-input v-model="queryContent" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleAdd">新增商户类型</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userList" border>
            <el-table-column label="商户类型" prop="bizInfoType"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div><el-button size="mini" type="text" @click="handleEdit(scope.row)">设置权限</el-button></div>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :visible.sync="dialogFormVisible">
            <el-tree
            :data="options"
            show-checkbox
            default-expand-all
            node-key="value"
            ref="tree"
            highlight-current
            :props="defaultProps"
            >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
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
import { DEPARTMENT, POST,MERCHANT_TYPE } from '@/utils/constant'


export default {
    data() {
        return {
            meId:'',
            DEPARTMENT,
            POST,
            options: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            merchant: {
            }, 
            userList: [
                {i: '1',bizInfoType: '托运方'},
                {i: '2',bizInfoType: '承运方'},
                {i: '3',bizInfoType: '经营方'},
                {i: '4',bizInfoType: '服务方'},            
            ],
            state: '',
            bizInfoType: '',
            dialogFormVisible: false,
            depName: '',
            workPostName: '',
            curRow: null,
            curSelection: [],
            queryType: 'bizInfoType',
            order: {
                individualMember: this.$store.state.user.userInfo.userName,
                transType: '1',
            },
            transCode: 'MFUN01',
            imgUrl: [],
            funType: '',
            nodes:[],
        }
    },
    methods: {
        handleClick(data,checked, node) {
            this.i++;
            if(this.i%2==0){
                if(checked){
                    this.$refs.treeForm.setCheckedNodes([]);
                    this.$refs.treeForm.setCheckedNodes([data]);
                    //交叉点击节点
                }else{
                    this.$refs.treeForm.setCheckedNodes([]);
                    //点击已经选中的节点，置空
                }
            }
        },
        queryCallBack(data) {
            // this.userList = data.functionList || [];
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
                transCode: 'MFUN02',
                funType: 'findAll',
                businessinfType: row.i,
            }).then(data => {
                if(data.code == '000000'){
                    this.nodes = data.functionBusinessinfList;
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
                    })                        
                }else{
                    this.nodes = [];
                }
            })
            this.$http.post({
                transCode: 'MFUN01',
                funType: 'findAll',
            }).then((data) => {
                this.options_1 = data.functionList;
                var list = (this.options_1).map( (dep) => {
                    return {value: (dep.funId).toString() ,label: dep.funName,rootId: dep.parentId}
                })
                this.options = this.$http.setTreeData(list);         
                this.merchant = data.function;
                this.dialogFormVisible = true;
                this.bizInfoType = row.i;
                setTimeout(() => this.$refs.tree.setCheckedNodes(this.nodes), 200);
            })
        },
        handleSubmit() {
            this.nodes = this.$refs.tree.getCheckedNodes(false,true);
            // this.nodes = this.$http.getAllPermission(this.nodes);
            console.log(this.nodes);
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
            this.nodes.splice(0,this.nodes.length/2)
            this.$http.post({
                transCode: 'MFUN02',
                funType: 'add',
                businessinfType: this.bizInfoType,
                functionBusinessinfs: JSON.stringify(this.nodes),
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
    }
}
</script>
