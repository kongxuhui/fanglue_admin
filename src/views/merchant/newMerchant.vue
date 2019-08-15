<template>
    <div class="main">
        <el-form :model="merchant" ref="merchant" :rules="rules" label-width="100px" style="width:500px;">
            <el-form-item label="商户类型" prop="bizInfoType">
                <el-select v-model="merchant.bizInfoType">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in MERCHANT_TYPE"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="组织类型">
                <el-select v-model="merchant.orgType">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in ORGANIZ_TYPE"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="商户名称" prop="bizInfoName">
                <el-input v-model.trim="merchant.bizInfoName"></el-input>
            </el-form-item>
            <el-form-item label="商户简称" prop="bizInfoAbbreviation">
                <el-input v-model.trim="merchant.bizInfoAbbreviation"></el-input>
            </el-form-item>
            <!-- <el-form-item label="用户名">
                <el-input v-model="merchant.userName"></el-input>
            </el-form-item> -->
            <el-form-item label="联系人">
                <el-input v-model="merchant.contacts"></el-input>
            </el-form-item>
            <el-form-item label="联系手机号">
                <el-input v-model="merchant.contactTel"></el-input>
            </el-form-item>
            <!-- <el-form-item label="企业全名">
                <el-input v-model="merchant.enterpriseName"></el-input>
            </el-form-item>
            <el-form-item label="营业执照号">
                <el-input v-model="merchant.bizlicenseNum"></el-input>
            </el-form-item>
            <el-form-item label="法定代表人">
                <el-input v-model="merchant.legalRepresentative"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
                <el-input v-model="merchant.officeAddr"></el-input>
            </el-form-item> -->
            <el-form-item label="备注">
                <el-input type="textarea" v-model="merchant.remark"></el-input>
            </el-form-item>
            <!-- <el-form-item label="注册时间" prop="date">
                <el-date-picker type="datetime" placeholder="选择日期" v-model="date"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" :plain="true"  @click="onSubmit('merchant')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { MERCHANT_TYPE, ORGANIZ_TYPE } from '@/utils/constant'
export default {
    data() {
        return {
            MERCHANT_TYPE: {
                1: '托运方',
                2: '承运方',
                3: '服务方'
            },
            ORGANIZ_TYPE,
            merchant: {
                bizInfoType: '2',
                bizInfoName: '',
                bizInfoAbbreviation: '',
                userName: ''
            },
            date: '',
            rules: {
                bizInfoType: [
                    { required: true, message: '商户类型', trigger: 'blur' }
                ],
                bizInfoName: [
                    { required: true, message: '商户名称', trigger: 'blur' }
                ],
                bizInfoAbbreviation: [
                    { required: true, message: '请输入商户简称', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        onSubmit(formName) {
            this.$refs.merchant.validate(valid => {
                if (valid) {
                    this.$message({
                        message: '创建成功',
                        type: 'success'
                    });
                    this.$http.post({
                        transCode: 'MBUS01',
                        funType: 'add',
                        ...this.merchant
                    }).then(data => {
                        // this.messageTip(data);
                    })
                }
            })
            
        }
    }
}
</script>
