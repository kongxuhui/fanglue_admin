<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="订单号" value="orderNo"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="queryContent" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="text" @click="handleEdit()">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="dataList" border>
            <!-- <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="订单号">
                            <span>{{ props.row.orderNo }}</span>
                        </el-form-item>
                        <el-form-item label="订单名称">
                            <span>{{ props.row.orderName }}</span>
                        </el-form-item>
                        <el-form-item label="托运方">
                            <span>{{ props.row.shipper }}</span>
                        </el-form-item>
                        <el-form-item label="订单日期">
                            <span>{{ props.row.orderDateStr }}</span>
                        </el-form-item>
                        <el-form-item label="接单员">
                            <span>{{ props.row.individualMember }}</span>
                        </el-form-item>
                        <el-form-item label="运程数">
                            <span>{{ props.row.transNUM }}</span>
                        </el-form-item>
                        <el-form-item label="运输工具">
                            <span>{{ props.row.shippingType }}</span>
                        </el-form-item>
                        <el-form-item label="出发地">
                            <span>{{ props.row.departurePlace }}</span>
                        </el-form-item>
                        <el-form-item label="到达地">
                            <span>{{ props.row.destination }}</span>
                        </el-form-item>
                        <el-form-item label="班次名">
                            <span>{{ props.row.flightsOrTrain }}</span>
                        </el-form-item>
                        <el-form-item label="发出日期">
                            <span>{{ props.row.planArrivalDateStr }}</span>
                        </el-form-item>
                        <el-form-item label="到达日期">
                            <span>{{ props.row.planArrivalDateStr }}</span>
                        </el-form-item>
                        <el-form-item label="运输数量">
                            <span>{{ props.row.transQuantity }}</span>
                        </el-form-item>
                        <el-form-item label="承运方">
                            <span>{{ props.row.carrier }}</span>
                        </el-form-item>
                        <el-form-item label="联系人">
                            <span>{{ props.row.carrierContacts }}</span>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <span>{{ props.row.carrierTel }}</span>
                        </el-form-item>
                        <el-form-item label="备注">
                            <span>{{ props.row.remarks }}</span>
                        </el-form-item>
                        <el-form-item label="提单号">
                            <span>{{ props.row.ordinalNO }}</span>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <span>{{ new Date(props.row.createTime).Format('yyyy-MM-dd') }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column> -->
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <!-- <el-table-column prop="shipper" label="托运方"></el-table-column> -->
            <el-table-column prop="transNUM" label="运程数名称"></el-table-column>
            <el-table-column prop="shippingType" label="运输方式"></el-table-column>
            <el-table-column prop="flightsOrTrain" label="班次名"></el-table-column>
            <el-table-column prop="departurePlace" label="出发地"></el-table-column>
            <el-table-column prop="destination" label="到达地"></el-table-column>
            <el-table-column prop="planSendDateStr" label="发出日期"></el-table-column>
            <el-table-column prop="planArrivalDateStr" label="到达日期"></el-table-column>
            <el-table-column prop="transQuantity" label="运输数量"></el-table-column>
            <el-table-column prop="carrier" label="分承运方"></el-table-column>
            <el-table-column prop="carrierContacts" label="联系人"></el-table-column>
            <el-table-column prop="carrierTel" label="联系电话"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="sortNo" label="排序号"></el-table-column>
            <el-table-column prop="transStateStr" label="运输状态"></el-table-column>
            <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="primary" @click="handleNew(scope.row,'edit')">新增分承运记录</el-button> -->
                    <div>
                        <el-button size="mini" type="text" @click="handleEdit(scope.row,'edit')">修改</el-button>  
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


        <el-dialog :visible.sync="dialogVisible">
            <el-form :model="transModel" ref="transRef" label-width="100px">
                <el-card>
                <div slot="header">
                    <span>所属计划编号</span>
                    <el-select v-if="flag" v-model="transModel.planId">
                        <el-option :label="item.orderNo" :value="item.planId" :key="key" v-for="(item, key) in transportplanList"></el-option>
                    </el-select>
                </div>
                <!-- <el-button type="text" @click="deleteDetail(index,'carry')" v-show="transModel.carrys.length > 1">删除</el-button> -->
                <el-row>
                    <el-col :span="12">
                    <el-form-item label="运程数名称" prop="transNUM" :rules="{required: true, message: '请输入运程数', trigger: 'blur'}">
                            <el-input v-model.trim="transModel.transNUM"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="运输方式" prop="shippingType" :rules="{required: true, message: '请输入运输工具', trigger: 'blur'}">
                            <el-input v-model.trim="transModel.shippingType"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                        
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出发地" prop="departurePlace" :rules="{required: true, message: '请输入出发地', trigger: 'blur'}">
                            <el-input v-model.trim="transModel.departurePlace"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="到达地" prop="destination" :rules="{required: true, message: '请输入到达地', trigger: 'blur'}">
                            <el-input v-model.trim="transModel.destination"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="班次名" prop="flightsOrTrain" :rules="{required: true, message: '请输入班次名', trigger: 'blur'}">
                            <el-input v-model.trim="transModel.flightsOrTrain"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="运输状态" prop="transState" :rules="{required: true, message: '请选择运输状态', trigger: 'blur'}">
                            <el-select v-model="transModel.transState" disabled>
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in TRANSPORT_STATE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>    
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发出日期" prop="planSendDateStr" :rules="{required: true, message: '请选择发出日期', trigger: 'blur'}">
                            <el-date-picker type="date" v-model="transModel.planSendDateStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="到达日期" prop="planArrivalDateStr" :rules="{required: true, message: '请选择到达日期', trigger: 'blur'}">
                            <el-date-picker type="date" v-model="transModel.planArrivalDateStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>                   
                </el-row>    
                <el-row>                  
                    <el-col :span="12">
                        <el-form-item label="运输数量" prop="transQuantity">
                            <el-input v-model="transModel.transQuantity"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item label="承运方" prop="carrier" :rules="{required: true, message: '请输入承运方', trigger: 'blur'}">
                            <el-input v-model.trim="transModel.carrier"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>          
                <el-row>                   
                    <el-col :span="12">
                        <el-form-item label="联系电话"prop="carrierTel" :rules="{required: true, message: '请输入联系电话', trigger: 'blur'}">
                            <el-input v-model.trim="transModel.carrierTel"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="carrierContacts" :rules="{required: true, message: '请输入联系人', trigger: 'blur'}">
                            <el-input v-model.trim="transModel.carrierContacts"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>    
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="提单号" prop="ordinalNO" :rules="{required: true, message: '请选择提单号', trigger: 'blur'}">
                            <el-input v-model.trim="transModel.ordinalNO"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="sortNo">
                            <el-input v-model="transModel.sortNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="transModel.remarks"></el-input>
                </el-form-item>
                </el-card>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit_1">确 定</el-button>
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
    width: 33.33%;
}
</style>
<script>
import { TRANSPORT_STATE, TRANSPORT_OPTION } from '@/utils/constant'

export default {
    data() {
        return {
            queryType: 'orderNo',
            TRANSPORT_STATE,
            TRANSPORT_OPTION,
            dataList: [],
            planNo: '',
            dialogFormVisible: false,
            planNoList: [],
            dialogVisible: false,
            transCode: 'TTSP02',
            append: {
                creater: this.$store.state.user.userInfo.username,
                createrId: this.$store.state.user.userInfo.userId,
            },
            transModel: {
                transState:'1'
            },
            curRow: {},
            funType: '',
            transportplanList: [],
            flag: 'true',
        }
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.transportplanDtlList || [];
        },
        handleNew(row) {
            this.curRow = row;
            this.dialogFormVisible = true;
        },
        handleEdit(row,type) {
            if(type === 'edit'){
                if(row.transPlandtlId){
                    this.$http.post({
                        transCode: 'TTSP02',
                        funType: 'findUpdateFlag',
                        id: row.transPlandtlId,
                    }).then(data => {
                        if(data.flag){
                            this.$http.post({
                                transCode: 'TTSP02',
                                funType: 'findDetail',
                                id: row.transPlandtlId,
                            }).then(data => {
                                if(this.flag){
                                    this.flag = !this.flag; 
                                } 
                                this.curRow = data.transportplanDtl;
                                this.dialogVisible = true;
                                this.transModel = {...this.curRow};                
                            })
                        }else{
                            this.$message({
                                message: '该计划明细暂不可修改',
                                type: 'warning'
                            });
                        }
                    })
                }
            }else{
                this.flag = 'true';
                this.$http.post({
                    transCode: 'TTSP01',
                    funType: 'findAll',
                }).then(data => {
                    this.transportplanList = data.transportplanList;
                    this.dialogVisible = true;
                })
            }
        },
        handleSubmit_1() {
            this.$refs.transRef.validate(valid => {
                if (valid) {
                    this.dialogVisible = false;
                    if(this.transModel.transPlandtlId){
                        this.funType = 'update';
                    }else{
                        this.funType = 'add';
                    }
                    this.$http.post({
                        transCode: 'TTSP02',
                        funType: this.funType,
                        transPlanId: this.transModel.planId,
                        id: this.transModel.transPlandtlId,
                        originatingPlace: this.transModel.originatingPlace,
                        destination: this.transModel.destination,
                        ...this.transModel
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
            console.log(row)
            if(row.transPlandtlId){
                this.$http.post({
                    transCode: 'TTSP02',
                    funType: 'findUpdateFlag',
                    id: row.transPlandtlId,
                }).then(data => {
                    if(data.flag){
                        this.$confirm('您确认要删除此商户吗？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'info'
                        }).then(() => {
                            this.$http.post({
                                transCode: 'TTSP02',
                                funType: 'delete',
                                ids: row.transPlandtlId,
                            }).then(data => {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getData();
                            })
                        })
                    }else{
                        this.$message({
                            message: '该计划明细暂不可删除',
                            type: 'warning'
                        });
                    }
                })
            }
        },
        handleSubmit() {
            this.dialogFormVisible = false;
            this.append.transportplanId = this.curRow.transPlanId;
            this.append.transportplanDtlId  = this.curRow.transPlandtlId;
            this.$http.post({
                transCode: 'TTSP03',
                funType: 'add',
                ...this.append
            }).then(data => {
                this.messageTip(data);
            })
        },
        addDetail(type) {
            // switch (type) {
            //     case 'carry':
            //         this.transModel.carrys.push({transState:'1'});
            //         break;
            //     case 'gather':
            //         this.gatherModel.gather.push({});
            //         break;
            //     case 'pack':
            //         this.packModel.pack.push({});
            //         break;
            //     default:
            //         break;
            // }
        },
    },
    created() {
        let transportplanId = this.$route.query.planId;
        this.getData({
            transportplanId
        });
    }
}
</script>
