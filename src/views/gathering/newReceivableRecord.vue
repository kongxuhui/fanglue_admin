<template>
    <div class="main">
        <el-form ref="gather" :model="gather" :rules="rules" label-width="120px" style="width:800px;">            
            <el-row>
                <el-col :span="12">
                    <el-form-item label="付款日期" prop="payDateStr">
                        <el-date-picker type="date" placeholder="选择日期" v-model="gather.payDateStr"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="付款总额" prop="payMoney">
                        <el-input v-model.number="gather.payMoney"><template slot="append">元</template></el-input>
                    </el-form-item>
                </el-col>
            </el-row>          
            <el-row>
                <el-col :span="12">
                    <el-form-item label="托运方" prop="shipperIndex">
                        <el-select v-model="gather.shipperIndex" @change="handleChange">
                            <el-option :label="item.bizInfoName" :value="index" :key="item.bizInfoId" v-for="(item, index) in recordList"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="付款期次">
                        <el-input v-model="payTimes"></el-input>
                    </el-form-item>
                </el-col>
            </el-row> 
            <el-row>
                <el-col :span="12">
                    <el-form-item label="付款方式" prop="payMode">
                        <el-select v-model="gather.payMode">
                            <el-option :label="value" :value="key" :key="key" v-for="(value, key) in PAYMENT"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="付款类型" prop="payType">
                        <el-select v-model="gather.payType">
                            <el-option :label="value" :value="key" :key="key" v-for="(value, key) in GATHER_TYPE"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>           
            <el-form-item label="经手人">
                <el-input v-model="username" disabled></el-input>
            </el-form-item>           
            <el-form-item label="备注">
                <el-input type="textarea" v-model="remarks"></el-input>
            </el-form-item>
            <el-card style="margin-bottom:10px;" v-for="(item, index) in record" :key="index">
                    <div slot="header">
                        <span>明细表</span>
                        <el-button type="text" @click="addDetail">新增</el-button>
                        <el-button type="text" @click="deleteDetail(index)" v-show="record.length > 1">删除</el-button>
                    </div>
                    <div>                       
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="订单号">
                                    <el-select v-model="item.index" @change="handleOrderChange" @focus="handleOrderFocus(index)">
                                        <el-option :label="order.orderNo" :value="index" :key="index" v-for="(order, index) in orderList"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="下单日期">
                                    <el-input v-model="item.orderDateStr" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row> 
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="货物名称">
                                    <el-input v-model="item.goodsName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="订单应付款">
                                    <el-input v-model.number="item.leftMoney" disabled>
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>                                
                            </el-col>
                        </el-row>      
                        <el-row>                                           
                            <el-col :span="12">
                                <el-form-item label="本单分配款">
                                    <el-input v-model.number="item.money">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>                                              
                    </div>
                </el-card>
            <el-form-item>
                <el-button type="primary" @click="handRecord">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { PAYMENT, GATHER_TYPE } from '@/utils/constant'

export default {
    data() {
        return {
            PAYMENT,
            GATHER_TYPE,
            payTimes: '',           
            remarks: '',
            shipper: '',           
            record: [{disabled: true}],
            recordList: [],
            transCode: 'MBUS01',
            orderList: [],
            curOrder: {},
            curRecordIndex: 0,
            gather: {
                payMoney: '',
                payDateStr: '',
                shipperIndex: '',
                payMode: '1',
                payType: '1',
            },
            rules: {
                payDateStr: [
                    { required: true, message: '请选择付款日期', trigger: 'blur' }
                ],
                payMoney: [
                    { required: true, message: '请输入付款总额', trigger: 'blur' }
                ],
                shipperIndex: [
                    { required: true, message: '请选择托运方', trigger: 'blur' }
                ],
                payMode: [
                    { required: true, message: '请选择付款方式', trigger: 'blur' }
                ],
                payType: [
                    { required: true, message: '请选择付款类型', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        queryCallBack(data) {
            this.recordList = data.businessinfList || [];
        },
        handleChange(val) {
            this.shipper = this.recordList[val];
            this.$http.post({
                transCode: 'OORD01',
                shipperId: this.shipper.bizInfoId,
                funType: 'findAll',
                collectionFlag: 1
            }).then(data => {
                this.orderList = data.orderList || []
            })
        },
        addDetail() {
            this.record.push({disabled: true});
        },
        deleteDetail(index) {
            this.record.splice(index,1);
        },
        handRecord() {
            this.$refs.gather.validate((valid) => {
                if (valid) {
                    let money = 0;
                    this.record.forEach(item => {
                        money += item.money
                    })
                    if (money !== this.gather.payMoney) {
                        return this.$message({
                            type: 'error',
                            message: '付款总额和本单分配款不匹配'
                        })
                    }
                    this.$http.post({
                        transCode: 'OREA06',
                        funType: 'add',
                        shipper: this.shipper.bizInfoName,
                        shipperId: this.shipper.bizInfoId,
                        payDateStr: new Date(this.gather.payDateStr).Format('yyyy-MM-dd'),
                        creater: this.username,
                        createrId: this.userId,
                        payTimes: this.payTimes,
                        payMoney: this.gather.payMoney,
                        payMode: this.gather.payMode,
                        payType: this.gather.payType,
                        remarks: this.remarks,
                        collectionRecordDtls: JSON.stringify(this.record)
                    }).then(data => {
                        this.messageTip(data);
                    })
                }
            })           
        },
        handleOrderChange(index) {
            this.$set(this.record,this.curRecordIndex,{
                orderId: this.orderList[index].orderId,
                orderNo: this.orderList[index].orderNo,
                goodsName: this.orderList[index].goodsName,
                orderDateStr: new Date(this.orderList[index].orderTime).Format('yyyy-MM-dd'),
                goodsName: this.orderList[index].goodsName,
                orderTotal: this.orderList[index].orderTotal,
                index,
                money: '',
                leftMoney: this.orderList[index].orderTotal,
                disabled: false
            })
        },
        handleInput(item,index) {
            this.payMoney = 0;
            if (item.money > item.orderTotal) {
                item.money = item.orderTotal
            }
            item.leftMoney = item.orderTotal - item.money;
            this.record.forEach(item => {
                console.log(this.payMoney,item.money)
                this.payMoney += (item.money - 0)
            })
        },
        handleOrderFocus(index) {
            this.curRecordIndex = index;
        }
    },
    created() {
        let userInfo = this.$store.state.user.userInfo
        this.userId = userInfo.userId;
        this.username = userInfo.userName;
        this.getData({
            bizInfoType: 1,
            state:1
        })
    }
}
</script>
