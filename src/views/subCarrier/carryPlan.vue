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
            <el-table-column prop="planNo" label="计划编号"></el-table-column>
            <el-table-column label="编制日期">
                <template slot-scope="scope">{{new Date(scope.row.createTime).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column label="订单日期">
                <template slot-scope="scope">{{new Date(scope.row.orderDateStr || Date.now()).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <el-table-column prop="goodsName" label="货物名"></el-table-column>
            <el-table-column prop="originatingPlace" label="总起运地"></el-table-column>
            <el-table-column prop="destination" label="总目的地"></el-table-column>
            <el-table-column prop="creater" label="编制人"></el-table-column>
            <el-table-column prop="totalNumber" label="总运程数"></el-table-column>
            <!-- <el-table-column prop="departurePlace" label="出发地"></el-table-column>
            <el-table-column prop="destination" label="到达地"></el-table-column>
            <el-table-column prop="flightsOrTrain" label="班次名"></el-table-column>
            <el-table-column prop="planArrivalDateStr" label="发出日期"></el-table-column>
            <el-table-column prop="planArrivalDateStr" label="到达日期"></el-table-column>
            <el-table-column prop="transQuantity" label="运输数量"></el-table-column> -->
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div v-if="flag_1"><el-button size="mini" type="text" @click="handleNew(scope.row,'edit')">新增分承运记录</el-button></div>
                    <div v-if="flag_2">
                        <el-button size="mini" type="text">
                            <router-link :to="{name:'carryList',query:{planId:scope.row.planId}}">查看分承运记录</router-link>
                        </el-button>
                    </div>
                    <el-button size="mini" type="text" v-if="flag_3">
                        <router-link :to="{name:'carryPlanDetail',query:{planId:scope.row.planId}}">查看分承运明细</router-link>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="text-right mt10" v-if="dataList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="append" ref="carryRecord" :rules="recordRules" :validate-on-rule-change="false" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发生时间" prop="transportTimeStr">
                            <el-date-picker type="datetime" v-model="append.transportTimeStr" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="运程项目" prop="optionIndex">
                            <el-select v-model="append.optionIndex" @change="handleOptionChange">
                                <el-option :label="item.transNUM" :value="key" :key="key" v-for="(item, key) in TRANSPORT_OPTION"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- <el-col :span="12">
                        <el-form-item label="运程数号">
                            <el-input v-model="append.transportNum"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="运输状态" prop="transportStatus">
                            <el-select v-model="append.transportStatus">
                                <el-option :disabled="item.disabled" :label="item.name" :value="item.key" :key="item.key" v-for="(item, index) in TRANSPORT_STATE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="当前地理位置" prop="currentAddr">
                            <el-input v-model.trim="append.currentAddr"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                              
                <el-row>                    
                    <!-- <el-col :span="12">
                        <el-form-item label="下一节点">
                            <el-input v-model="append.nextNode"></el-input>
                        </el-form-item>
                    </el-col> -->                   
                </el-row>  
                <el-row>                    
                    <el-col :span="12">
                        <el-form-item label="是否异常">
                            <el-radio v-model="exceptionStatus" label="1">是</el-radio>
                            <el-radio v-model="exceptionStatus" label="2">否</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                       <el-form-item label="记录人">
                            <el-input v-model="append.creater" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>   
                <el-form-item label="异常事项" prop="exceptionRemark">
                    <el-input type="textarea" v-model="append.exceptionRemark" :disabled="disabled"></el-input>
                </el-form-item>                    
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="append.remarks"></el-input>
                </el-form-item>                                   
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
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
import { getHandle } from '@/utils/http'

export default {
    data() {
        return {
            flag_1:false,
            flag_2:false,
            flag_3:false,            
            queryType: 'orderNo',
            TRANSPORT_STATE: [
                {
                    name: '运输中',
                    key: 1,
                    disabled: false
                },
                {
                    name: '已到达',
                    key: 2,
                    disabled: false
                },
                {
                    name: '空状态',
                    key: 3,
                    disabled: false
                }
            ],
            TRANSPORT_OPTION: {},
            dataList: [],
            dialogFormVisible: false,
            transCode: 'TTSP01',
            append: {
                creater: this.$store.state.user.userInfo.userName,
                createrId: this.$store.state.user.userInfo.userId,
                transportStatus: '',
                exceptionRemark: ''
            },
            curRow: {},
            exceptionStatus: '2',
        }
    },
    computed: {
        recordRules() {
            return {
                transportTimeStr: [
                    { required: true, message: '请选择发生时间', trigger: 'blur' }
                ],
                optionIndex: [
                    { required: true, message: '请选择远程项目', trigger: 'blur' }
                ],
                transportStatus: [
                    { required: true, message: '请选择运输状态', trigger: 'blur' }
                ],
                currentAddr: [
                    { required: true, message: '请输入地理位置', trigger: 'blur' }
                ],
                exceptionRemark: [
                    { required: this.exceptionStatus == 1 ? true : false, message: '请输入异常事项', trigger: 'blur' }
                ]
            }
        },
        disabled() {
            if (this.exceptionStatus == 2) {
                this.append.exceptionRemark = ''
            }
            return this.exceptionStatus == 1 ? false : true
        },
    },
    methods: {
        queryCallBack(data) {
            this.dataList = data.transportplanList || [];
        },
        handleNew(row) {
            this.curRow = row;
            this.dialogFormVisible = true;
            this.$http.post({
                transCode: 'TTSP02',
                funType: 'findDtlAll',
                orderId: row.orderId
            }).then(data => {
                this.TRANSPORT_OPTION = data.transportplanDtlList;
            })
        },
        handleSubmit() {
            this.$refs.carryRecord.validate((valid) => {
                if (valid) {
                    this.dialogFormVisible = false;
                    this.append.transportplanId = this.curRow.planId;
                    this.append.orderId  = this.curRow.orderId;
                    this.append.shipper  = this.curRow.shipper;
                    this.append.transportOption= this.TRANSPORT_OPTION[this.append.optionIndex].transNUM;
                    this.append.transPlandtlId= this.TRANSPORT_OPTION[this.append.optionIndex].transPlandtlId;
                    this.$http.post({
                        transCode: 'TTSP03',
                        funType: 'add',
                        exceptionStatus: this.exceptionStatus,
                        ...this.append
                    }).then(data => {
                        this.messageTip(data);
                    })
                }
            })           
        },
        handleOptionChange(index) {
            if (index == 0 || index == this.TRANSPORT_OPTION.length - 1) {
                this.TRANSPORT_STATE[0].disabled = true;
                this.TRANSPORT_STATE[1].disabled = true;
                this.TRANSPORT_STATE[2].disabled = false;
                this.append.transportStatus = 3;
            } else {
                this.TRANSPORT_STATE[0].disabled = false;
                this.TRANSPORT_STATE[1].disabled = false;
                this.TRANSPORT_STATE[2].disabled = true;
                this.append.transportStatus = 1;
            }
        }
    },
    created() {
        getHandle().indexOf('新增分承运记录') != -1 ? this.flag_1 = 'true' : '';
        getHandle().indexOf('查看分承运记录') != -1 ? this.flag_2 = 'true' : ''; 
        getHandle().indexOf('查看分承运明细') != -1 ? this.flag_3 = 'true' : '';         
        let orderId = this.$route.query.id;
        this.getData({
            orderId
        });
    }
}
</script>
