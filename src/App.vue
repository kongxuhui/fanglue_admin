<template>
  	<div id="app">
    	<el-container id="container" v-if="isLogin">
			<el-aside width="250px">
				<el-menu active-text-color="#fff" router :default-active="defaultActive">
					<el-submenu :index='String(key)' :key='key' v-for="(value, key) in perArr.functions">
        				<template slot="title">
							<span>{{value.funName}}</span>						
						</template>						
						<el-menu-item :index="value_1.funcUrl" :key='key_1' v-for="(value_1, key_1) in value.childFunction">{{value_1.funName}}</el-menu-item>						
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-container>
				<el-header id="header">
					<el-dropdown @command="handleCommand" class="pull-right">
						<span class="el-dropdown-link">
							{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="exit">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-header>
				<el-main><router-view/></el-main>
			</el-container>
		</el-container>   	
		<router-view v-else></router-view>
  	</div>
</template>

<style lang="scss">
	@import './assets/css/normalize.css';	
	*,
	*:before,
	*:after {
		box-sizing: inherit;
	}
	html {
		box-sizing: border-box;
		font: 14px/1.5 Arial,Helvetica,sans-serif;
		height: 100%;
	}
	body {
		height: 100%;
		-webkit-font-smoothing: antialiased; 
	}
	p{
		margin: 10px 0;
	}
	img{
		max-width: 100%;
	}
	a{
		text-decoration: none;
		color: inherit;
	}
	ul{
		padding: 0;
		margin: 0;
		list-style: none;
	}
	dd{
		margin: 0;
	}
	textarea{
		resize: none;
		border: none;
		width: 100%;
		outline: none;
	}
	.inline-block{
		display: inline-block;
	}
	.text-right{
		text-align: right;
	}
	.text-center{
		text-align: center;
	}
	.mt10{
		margin-top: 10px;
	}
	.pull-right{
		float: right;
	}
	.bg-white{
		background-color: #fff;
	}
	.gap-tb{
		padding: 10px 0;
	}
	#app,#container{
		height: 100%;
	}
	#header{
		padding-top: 20px;
		border-bottom: 1px solid #ddd;
	}
</style>

<style>
	.main{
		background-color: #fff;
		padding: 10px;
	}
	.el-main{
		background: #f2f2f2;
		padding: 10px;
	}
	.el-aside{
		box-shadow: 2px 0 6px rgba(0,21,41,.35);
		background: #001529  !important;
	}
	.el-menu{
		height: 100%;
		background-color: #001529 !important;
		border: none;
	}
	.el-submenu .el-menu-item{
		padding: 0;
	}
	.el-menu a{
		display: block;
		padding-left: 40px;
	}
	.el-submenu__title,.el-menu-item{
		color: #c0c4cc !important;
	}
	.el-menu-item:hover,.el-submenu__title:hover,.el-submenu__title:hover i{
		background-color: #001529  !important;
		color: #fff  !important;
	}
	.el-menu-item.is-active {
		background-color: #1890ff  !important;
		color: #fff  !important;
	}
	.el-submenu.is-active .el-submenu__title,.el-submenu.is-active i{
		color: #fff  !important;
	}
	.el-dropdown-link{
		cursor: pointer;
	}
	.line{
		text-align: center;
	}
</style>

<script>
import Cookies from 'js-cookie'
export default {
	data() {
		return {
			username: '',
			perArr: {},
			isLogin_1: true,
		}
	},
	methods: {
		handleCommand(command) {
			this.$store.commit('logout');
			this.$router.push({
				name: 'login'
			})
		}
	},
	computed: {
		isLogin() {
			
			let userInfo = this.$store.state.user.userInfo;
			this.username = userInfo.userName;
			if (userInfo.userId) {
				this.perArr = JSON.parse(sessionStorage.getItem("roles"))[0] || '{}';
				return true;
			} else {			
				return false;
			}
					
		},
		defaultActive() {
			return this.$route.path === '/' ? '/employee' : this.$route.path;		
		}
	}
}
</script>
