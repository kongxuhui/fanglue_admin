<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="订单号" value="orderNo"></el-option>
                    <el-option label="托运方" value="shipper"></el-option>
                    <el-option label="服务项目名" value="serviceProject"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryType === 'serviceProject'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in SERVICE_PROJECT"></el-option>
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
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column prop="orderDateStr" label="下单时间"></el-table-column>
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <el-table-column prop="goodsName" label="托运货物"></el-table-column>
            <el-table-column prop="serviceProject" label="服务项目名">
            </el-table-column>
            <el-table-column prop="serviceContent" label="服务内容"></el-table-column>
            <el-table-column prop="planDateStartStr" label="计划开始日期"></el-table-column>
            <el-table-column prop="planDateEndStr" label="计划结束日期"></el-table-column>
            <el-table-column prop="projectId" label="项目编号"></el-table-column>
            <el-table-column prop="serviceProcessOption" label="进程环节"></el-table-column>          
            <el-table-column prop="serviceProcessStateStr" label="进程状态"></el-table-column>          
            <el-table-column prop="sortNo" label="排序号"></el-table-column>          
            <el-table-column prop="creater" label="创建人"></el-table-column>
            <!-- <el-table-column prop="updater" label="更新人"></el-table-column> -->
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div v-if="flag_1">
                        <el-button size="mini" type="text" @click="handleNew(scope.row)">新增服务记录</el-button>
                    </div>
                    <div v-if="flag_2">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
                    </div>
                    <div v-if="flag_3">
                        <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>                    
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :visible.sync="serviceVisible">
            <el-form :model="append" ref="append" label-width="110px">
                <el-row>
                    <el-col :span="12">
                       <el-form-item label="订单编号">
                            <el-input v-model="curRow.orderNo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="托运货物">
                            <el-input v-model="curRow.goodsName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="服务项目名">
                            <el-input v-model="curRow.serviceProject" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="服务内容">
                            <el-input v-model="append.serviceContent"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发生日期" prop="occurrenceTimeStr" :rules="{required: true, message: '请选择发生日期', trigger: 'blur'}">
                            <el-date-picker type="date" v-model="append.occurrenceTimeStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目进程环节" prop="serviceProcessOption" :rules="{required: true, message: '请输入项目进程环节', trigger: 'blur'}">
                            <el-input v-model="append.serviceProcessOption"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                             
                <el-row>                   
                    <el-col :span="12">
                        <el-form-item label="项目进程状态">
                            <el-select v-model="append.serviceProcessState">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in PROJECT_PROCESS_STATE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>  
                    <el-col :span="12">
                        <el-form-item label="项目费用">
                            <el-input v-model="append.projectCostAmount">
                                <template slot="append">元</template></el-input>
                            </el-input>
                        </el-form-item>
                    </el-col>                 
                </el-row> 
                <el-row>                   
                    <el-col :span="12">
                        <el-form-item label="经手人">
                            <el-input v-model="append.handler"></el-input>
                        </el-form-item>
                    </el-col>  
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="append.remarks"></el-input>
                        </el-form-item>  
                    </el-col>                 
                </el-row>                            
                <el-form-item label="上传单据扫描件">
                    <el-upload
                        action="/bank/dis/upload.action"
                        list-type="picture-card"
                        :on-success="uploadSuccess"
                        :on-remove="uploadRemove"
                        :data="uploadData"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>                   
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="serviceVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddRecord">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="editVisible">
            <el-form :model="append" ref="serviceRef" label-width="100px">
                <el-row>
                    <el-col :span="12">
                       <el-form-item label="订单编号">
                            <el-input v-model="append.orderNo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="托运货物">
                            <el-input v-model="append.goodsName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="服务项目名" prop="serviceProject" :rules="{required: true, message: '请输入服务项目名', trigger: 'blur'}">
                            <el-input v-model.trim="append.serviceProject"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="服务内容">
                            <el-input v-model="append.serviceContent"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="计划开始时间">
                            <el-date-picker type="date" v-model="append.planDateStartStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划结束时间">
                            <el-date-picker type="date" v-model="append.planDateEndStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>                             
                <el-row>
                    <!-- <el-col :span="12">
                        <el-form-item label="项目进程环节">
                            <el-input v-model="append.serviceProcessOption"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="项目进程状态">
                            <el-select v-model="append.serviceProcessState">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in PROJECT_PROCESS_STATE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="12">
                        <el-form-item label="排序号">
                            <el-input v-model="append.sortNo"></el-input>
                        </el-form-item>
                    </el-col>                  
                </el-row>                              
                <!-- <el-form-item label="备注">
                    <el-input type="textarea" v-model="append.remark"></el-input>
                </el-form-item>                         -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="serviceVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitService">确 定</el-button>
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
import { SERVICE_PROJECT } from '@/utils/constant'
import { getHandle } from '@/utils/http'

export default {
    data() {
        return {
            flag_1: false,   
            flag_2: false,            
            flag_3: false,                                 
            queryType: 'orderNo',
            SERVICE_PROJECT, 
            PROJECT_PROCESS_STATE: {
                1: '未开始',
                2: '进行中',
                3: '已完成',
            },
            editVisible: false,
            dataList: [],
            transCode: 'TOTS01',
            serviceVisible: false,
            append: {
                serviceProcessState: '1',
                serviceProject: '1'
            },
            imgUrl: [],
            curRow: {},
            uploadData: {
                userId: this.$store.state.user.userInfo.userId,
                uploadType: 'contract',
                type: 'add',
                picturesKey: ''
            },
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.otherServeList || [];
        },
        handleChange(val) {
            if (this.queryType === 'serviceProject') {
                this.queryContent = '1';
            } else {
                this.queryContent = '';
            }
        },
        handleEdit(row) {
            if(row.projectId){
                this.$http.post({
                    transCode: 'TOTS01',
                    funType: 'findUpdateFlag',
                    id: row.projectId,
                }).then((data) => {
                    if(data.flag){
                        this.$http.post({
                            transCode: 'TOTS01',
                            funType: 'findDetail',
                            id: row.projectId,
                        }).then((data) => {
                            this.append = data.otherServe;
                            this.editVisible = true;
                        })
                    }else{
                        this.$message({
                            message: '该服务暂不可修改',
                            type: 'warning'
                        });
                    }
                })
            }
        },
        handleSubmitService() {
            this.$refs.serviceRef.validate(valid => {
                if (valid) {
                    this.editVisible = false;
                    this.$http.post({
                        transCode: 'TOTS01',
                        funType: 'update',
                        id: this.append.projectId,
                        orderId: this.append.orderId,
                        goodsName: this.append.goodsName,
                        ...this.append
                    }).then(data => {
                        this.messageTip(data);
                        this.$message({
                            message: '关联成功',
                            type: 'success'
                        });
                    })
                }
            }) 
        },
        handleDelete(row) {
            if(row.projectId){
                this.$http.post({
                    transCode: 'TOTS01',
                    funType: 'findUpdateFlag',
                    id: row.projectId,
                }).then((data) => {
                    if(data.flag){
                        this.$http.post({
                            transCode: 'TOTS01',
                            funType: 'findDetail',
                            id: row.projectId,
                        }).then((data) => {
                            this.$confirm('您确认要删除此项服务吗？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'info'
                        }).then(() => {
                            this.$http.post({
                                transCode: 'TOTS01',
                                funType: 'delete',
                                ids: row.projectId,
                            }).then(data => {
                                this.getData();
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                            })
                        })
                        })
                    }else{
                        this.$message({
                            message: '该服务暂不可删除',
                            type: 'warning'
                        });
                    }
                })
            }
        },
        handleNew(row) {
            this.serviceVisible = true;
            this.curRow = row;
        },
        uploadSuccess(res, file, fileList) {
            this.imgUrl.push(res)
        },
        uploadRemove(file,fileList) {
            this.imgUrl = fileList.map(item => item.response)
        },
        handleAddRecord() {
            this.$refs.append.validate((valid) => {
                if (valid) {
                    this.serviceVisible = false;
                    this.$http.post({
                        transCode: 'TOTS02',
                        funType: 'add',
                        orderId: this.curRow.orderId,
                        goodsName: this.curRow.goodsName,
                        orderDateStr: this.curRow.orderDateStr,
                        shipper: this.curRow.shipper,
                        shipperId: this.curRow.shipperId,
                        creater: this.username,
                        ...this.append,
                        scans: this.imgUrl.join(';'),
                        projectId: this.curRow.projectId
                    }).then(data => {
                        if (data.code === '000000') {
                            this.getData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: data.message
                            })
                        }
                    })
                }
            })            
        }
    },
    created() {
        getHandle().indexOf('新增服务记录') != -1 ? this.flag_1 = 'true' : ''; 
        getHandle().indexOf('修改') != -1 ? this.flag_2 = 'true' : '';        
        getHandle().indexOf('删除') != -1 ? this.flag_3 = 'true' : '';                       
        this.getData()
    }
}
</script>
