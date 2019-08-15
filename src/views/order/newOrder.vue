<template>
    <div class="main">
        <el-form :model="order" :rules="rules" ref="order" label-width="80px" style="width:600px;">
            <el-form-item label="订单号" prop="num">
                <el-input v-model="order.num"></el-input>
            </el-form-item>
            <el-form-item label="组织类型">
                <el-select v-model="order.type">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in ORGANIZ_TYPE"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="下单时间" prop="date">
                <el-date-picker type="date" placeholder="选择日期" v-model="order.date"></el-date-picker>
            </el-form-item>
            <el-form-item label="运输类型" prop="short">
                <el-input v-model="order.short"></el-input>
            </el-form-item>
            <el-form-item label="订单总额" prop="username">
                <el-input v-model="order.username"></el-input>
            </el-form-item>
             <el-form-item label="托运方">
                <el-input v-model="order.name"></el-input>
            </el-form-item>
            <el-form-item label="托运路线" prop="short">
                <el-col :span="11"><el-input placeholder="始发地" v-model="order.short"></el-input></el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11"><el-input placeholder="目的地" v-model="order.short"></el-input></el-col>
            </el-form-item>
            <el-form-item label="货物" prop="short">
                <el-col :span="6"><el-input placeholder="货物名" v-model="order.short"></el-input></el-col>
                <el-col class="line" :span="3">-</el-col>
                <el-col :span="6"><el-input placeholder="货物重量" v-model="order.short"></el-input></el-col>
                <el-col class="line" :span="3">-</el-col>
                <el-col :span="6"><el-input placeholder="货物体积" v-model="order.short"></el-input></el-col>               
            </el-form-item>
            <el-form-item label="收货" prop="short">
                <el-col :span="11"><el-input placeholder="收货人" v-model="order.short"></el-input></el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11"><el-input placeholder="联系电话" v-model="order.short"></el-input></el-col>
            </el-form-item>
            <el-form-item label="发货" prop="short">
                <el-col :span="11"><el-input placeholder="发货人" v-model="order.short"></el-input></el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11"><el-input placeholder="联系电话" v-model="order.short"></el-input></el-col>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="order.desc"></el-input>
            </el-form-item>
            <el-form-item label="接单员" prop="username">
                <el-input v-model="order.username"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('order')">新建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { ORGANIZ_TYPE } from '@/utils/constant'

export default {
    data() {
        return {
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
