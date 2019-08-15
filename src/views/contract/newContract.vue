<template>
    <div class="main">
        <el-form :model="order" ref="order" label-width="120px" style="width:600px;">
            <el-form-item label="合同标题">
                <el-input v-model="order.num"></el-input>
            </el-form-item>
            <el-form-item label="客户名">
                <el-input v-model="order.customer"></el-input>
            </el-form-item>
             <el-form-item label="组织类型">
                <el-select v-model="order.orgType">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in ORGANIZ_TYPE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同金额">
                <el-input v-model="order.contractTotal"></el-input>
            </el-form-item>
            <el-form-item label="合同状态">
                 <el-select v-model="order.contractState">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in CONTRACT_STATE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="签约日期">
                <el-date-picker type="date" placeholder="选择日期" v-model="order.signingDate"></el-date-picker>
            </el-form-item>
           <el-form-item label="履行开始日期">
                <el-date-picker type="date" placeholder="选择日期" v-model="order.startDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="履行结束日期">
                <el-date-picker type="date" placeholder="选择日期" v-model="order.endDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="我方签约人">
                <el-input v-model="order.ourSignatory"></el-input>
            </el-form-item>
            <el-form-item label="客户方签约人">
                <el-input v-model="order.otherPartySignatory"></el-input>
            </el-form-item>
            <el-form-item label="合同类型">
                <el-select v-model="order.contractType">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in CONTRACT_TYPE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="付款方式">
                <el-select v-model="order.paymentMethod">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in PAYMENT"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="order.remarks"></el-input>
            </el-form-item>
            <el-form-item label="负责员工">
                <el-input v-model="order.personLiable"></el-input>
            </el-form-item>
            <el-form-item label="上传合同附件">
                <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('order')">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { CONTRACT_STATE, CONTRACT_TYPE, PAYMENT, ORGANIZ_TYPE } from '@/utils/constant'

export default {
    data() {
        return {
            CONTRACT_STATE,
            CONTRACT_TYPE,
            PAYMENT,
            ORGANIZ_TYPE,
            order: {
                type: '',
                organize: '',
                num: '',
                short: '',
                username: '',
                date: '',
                desc: ''
            },
            rules: {
                num: [
                    { required: true, message: '请输入商户号', trigger: 'blur' }
                ],
                short: [
                    { required: true, message: '请输入商户简称', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                date: [
                    { type: 'date', required: true, message: '请输入注册时间', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
