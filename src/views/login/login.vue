<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <el-card class="login-card">
                <div slot="header">
                    <span>欢迎登录</span>
                </div>
                <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="loginForm.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="name">
                        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSubmit">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<style lang="scss">
.login{
    width: 100%;
    height: 100%;
    background-image: url('https://file.iviewui.com/iview-admin/login_bg.jpg');
    background-size: cover;
    background-position: center;
    position: relative;

    &-con{
        position: absolute;
        right: 160px;
        top: 50%;
        transform: translateY(-60%);
        width: 350px;
        
    }
}
</style>


<script>
import Cookies from 'js-cookie'
export default {
    data() {
        return {
            loginForm: {
                name: '',
                password: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            }
        }
    },
	methods: {
		handleSubmit(command) {
                            console.log(this);

			this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$http.post({
                        source: 1,
                        systemFlag: 1,
                        transCode: 'MUSR01',
                        funType: 'adminLogin',
                        loginName: this.loginForm.name,
                        loginPwd: this.loginForm.password
                    }).then(data => {
                        if (data.code === '000000') {
                            let userInfo = data.userInfo;
                            Cookies.set('userInfo',{
                                userId: userInfo.userId,
                                userName: userInfo.userName,
                                ownedMerchant: userInfo.employee.ownedMerchant
                            });
                            sessionStorage.setItem("roles", JSON.stringify(userInfo.roles));
                            this.$store.commit('login',userInfo);                        
                            this.$router.push({
                                name: 'employee'
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: data.message
                            })
                        }
                    })    
                    // let userInfo =  {userName: this.loginForm.name,userId: 1};
                    // Cookies.set('userInfo',userInfo);
                    // this.$store.commit('login',userInfo);
                    // this.$router.push({
                    //     name: 'home'
                    // })                
                } else {
                    return false;
                }
            });
		}
	}
}
</script>