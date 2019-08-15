<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="订单号" value="orderNo"></el-option>
                    <el-option label="托运方" value="shipper"></el-option>
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
            <el-table-column prop="orderNo" label="单据编号"></el-table-column>
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column prop="orderId" label="订单Id"></el-table-column>
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <el-table-column prop="goodsName" label="货物名"></el-table-column>
            <el-table-column prop="packingTimeStr" label="装箱时间"></el-table-column>
            <el-table-column prop="specifications" label="箱规格型号"></el-table-column>
            <el-table-column prop="boxNo" label="集中箱编号"></el-table-column>
            <el-table-column prop="goodsContent" label="货物内容"></el-table-column>
            <el-table-column label="货物数量">
                <template slot-scope="scope">{{scope.row.goodsSum}}件</template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div>
                        <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
                    </div>
                    <div>
                        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>                    
                    </div>
                </template>
            </el-table-column>
        </el-table>   

        <div class="text-right mt10" v-if="dataList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog :visible.sync="packVisible">
            <el-form :model="packModel" ref="packRef" label-width="100px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="箱规格型号" prop="specifications" :rules="{required: true, message: '请输入箱规格型号', trigger: 'blur'}">
                                <el-input v-model.trim="packModel.specifications"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="集中箱编号" prop="boxNo" :rules="{required: true, message: '请输入箱规格型号', trigger: 'blur'}">
                                <el-input v-model.trim="packModel.boxNo"></el-input>                                
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>                                              
                        <el-col :span="12">
                            <el-form-item label="货物内容" prop="goodsContent" :rules="{required: true, message: '请输入箱规格型号', trigger: 'blur'}">
                                <el-input v-model.trim="packModel.goodsContent"></el-input> 
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="货物数量" prop="goodsSum" :rules="{required: true, message: '请输入箱规格型号', trigger: 'blur'}">
                                <el-input v-model.trim="packModel.goodsSum"></el-input>
                            </el-form-item>
                        </el-col>                        
                    </el-row>                       
                    <el-form-item label="备注">
                        <el-input v-model="packModel.remarks"></el-input>
                    </el-form-item>                                                                                    
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="packVisible = false">取 消</el-button>
                <el-button type="primary" @click="handlePack">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style>
.table-expand {
    font-size: 0;
}
.table-expand label {
    width: 90px;
    color: #99a9bf;
}
.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
<script>
import { PAYMENT, GATHER_TYPE } from '@/utils/constant'

export default {
    data() {
        return {
            queryType: 'orderNo',
            PAYMENT,
            GATHER_TYPE,
            dataList: [],
            transCode: 'OPAC02',
            initCondition: {},
            packModel: {},
            packVisible: false
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.packinginfoDtlList || [];
        },
        handleEdit(row) {
            if(row.id){
                this.$http.post({
                    transCode: 'OPAC02',
                    funType: 'findDetail',
                    id: row.id,                    
                }).then((data) => {
                    this.packModel = data.packinginfoDtl;
                    this.packVisible = true;
                })
            }
        },
        handlePack() {
            this.$refs.packRef.validate(valid => {
                if (valid) {
                    this.packVisible = false;
                    this.$http.post({
                        transCode: 'OPAC02',
                        funType: 'update',
                        id: this.packModel.id,
                        ...this.packModel
                    }).then(data => {
                        if (data.code === '000000') {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.getData();
                        }
                    })
                }
            }) 
        },
        handleDelete(row) {
            if(row.id){
                this.$http.post({
                    transCode: 'OPAC02',
                    funType: 'findDetail',
                    id: row.id,
                }).then((data) => {
                    this.$confirm('您确认要删除此装箱信息吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$http.post({
                            transCode: 'OPAC02',
                            funType: 'delete',
                            ids: row.id,
                        }).then(data => {
                            this.getData();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        })
                    })
                })
            }
        }
    },
    created() {
        this.initCondition.orderId = this.$route.query.orderId;
        this.getData();
    }
}
</script>
