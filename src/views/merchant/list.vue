<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="商户号" value="businessNO"></el-option>
                    <el-option label="商户简称" value="bizInfoAbbreviation"></el-option>
                    <el-option label="商户类型" value="bizInfoType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryType === 'bizInfoType'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in MERCHANT_TYPE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else>
                <el-input v-model="queryContent" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="userList" border @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column label="商户类型">
                <template slot-scope="scope">{{MERCHANT_TYPE[scope.row.bizInfoType]}}</template>
            </el-table-column>
            <el-table-column label="组织类型">
                <template slot-scope="scope">{{ORGANIZ_TYPE[scope.row.orgType]}}</template>
            </el-table-column>
            <el-table-column prop="businessNO" label="商户号"></el-table-column>
            <el-table-column prop="bizInfoAbbreviation" label="商户简称"></el-table-column>
            <el-table-column prop="bizInfoName" label="商户全名"></el-table-column>
            <el-table-column label="注册时间">
                <template slot-scope="scope">{{new Date(scope.row.registerTime || Date.now()).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <!-- <el-table-column prop="userName" label="用户名"></el-table-column> -->
            <el-table-column label="状态">
                <template slot-scope="scope">{{MERCHANT_STATE[scope.row.state]}}</template>
            </el-table-column>
            <el-table-column label="创建类型">
                <template slot-scope="scope">{{CREATE_TYPE[scope.row.createType]}}</template>
            </el-table-column>
            <el-table-column prop="contacts" label="联系人"></el-table-column>
            <el-table-column prop="contactTel" label="联系电话"></el-table-column>
            <el-table-column prop="enterpriseName" label="企业全名"></el-table-column>
            <el-table-column prop="bizlicenseNum" label="营业执照号"></el-table-column>
            <el-table-column prop="legalRepresentative" label="法定代表人"></el-table-column>
            <el-table-column prop="officeAddr" label="公司地址"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <div v-if="flag_1"><el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button></div>
                    <div v-if="scope.row.state == 2 && flag_2"><el-button size="mini" type="text" @click="handleState(scope.row, 1)">启用</el-button></div>
                    <div v-if="scope.row.state == 1 && flag_2"><el-button size="mini" type="text" @click="handleState(scope.row, 2)">停用</el-button></div>
                    <div v-if="scope.row.createType == 2 && flag_3"><el-button size="mini" type="text" @click="handleDelet(scope.$index,scope.row, 3)">删除</el-button></div>
                    <div v-if="scope.row.state == 1 && flag_4"><el-button size="mini" type="text" @click="handleOrder(scope.row)">创建订单</el-button></div>
                    <div v-if="scope.row.state == 1 && flag_5"><el-button size="mini" type="text" @click="handleContract(scope.row)">创建合同</el-button></div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right mt10" v-if="userList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog :visible.sync="dialogFormVisible_1">
            <el-form :model="merchant" ref="merchant" :rules="rules"  label-width="80px">
                <el-form-item label="商户类型" prop="bizInfoType">
                    <el-select v-model="merchant.bizInfoType">
                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in MERCHANT_TYPE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商户名称" prop="bizInfoName">
                    <el-input v-model.trim="merchant.bizInfoName"></el-input>
                </el-form-item>
                <el-form-item label="商户简称" prop="bizInfoAbbreviation">
                    <el-input v-model.trim="merchant.bizInfoAbbreviation"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contacts">
                    <el-input v-model="merchant.contacts"></el-input>
                </el-form-item>
                <el-form-item label="联系手机号" prop="contactTel">
                    <el-input v-model="merchant.contactTel"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="merchant.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible_1 = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogFormVisible">
            <el-form label-width="80px">
                <el-form-item label="商户简称">
                    <el-input v-model="bizInfoAbbreviation"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="orderVisible">
            <el-form :model="order" ref="order" :rules="orderRules" label-width="110px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合同名">
                            <el-select v-model="contractIndex" @change="handleContractChange">
                                <el-option :label="item.contractTitle" :value="index" :key="index" v-for="(item, index) in contractList"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="区域类型">
                            <el-select v-model="order.areaType">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in ZONE_TYPE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="订单名称">
                            <el-input v-model="order.orderName"></el-input>
                        </el-form-item>
                    </el-col> -->
                </el-row> 
                <el-row>                   
                    <!-- <el-col :span="12">
                        <el-form-item label="订单总额">
                            <el-input v-model="order.orderTotal">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col> -->                    
                </el-row>
                <el-row>                  
                    <el-col :span="12">
                        <el-form-item label="运输方式">
                            <el-select v-model="order.transType">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in TRANS_TYPE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="托运方">
                            <el-input v-model="order.shipper" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="始发地" prop="originatingPlace">
                            <el-input v-model="order.originatingPlace"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="目的地" prop="destination">
                            <el-input v-model="order.destination"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                               
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="货物名" prop="goodsName">
                            <el-input v-model="order.goodsName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="货物重量">
                            <el-input v-model="order.goodsWeight" prop="goodsWeight">
                                <template slot="append">吨</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="货物体积">
                            <el-input v-model="order.goodsVolume">
                                <template slot="append">m³</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="货物件数">
                            <el-input v-model="order.goodsSum">
                                <template slot="append">件</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收货人" prop="consignee">
                            <el-input v-model="order.consignee"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收货电话" prop="consigneeTel">
                            <el-input v-model="order.consigneeTel"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收货地址" prop="receivingAddr">
                            <el-input v-model="order.receivingAddr"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划收货时间" prop="receivingTime">
                            <el-date-picker type="date" v-model="order.receivingTime" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发货人" prop="consignor">
                            <el-input v-model="order.consignor"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发货电话" prop="consignorTel">
                            <el-input v-model="order.consignorTel"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="发货地址" prop="shippingAddr">
                            <el-input v-model="order.shippingAddr"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>              
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="接单员">
                            <el-input v-model="order.individualMember" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="order.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="orderVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleNewOrder">新建</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="contractVisible" :rules="contractRules">
            <el-form :model="contract" ref="contract" :rules="contractRules" label-width="110px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户名">
                            <el-input v-model="contract.customer" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组织类型">
                            <el-select v-model="contract.orgType" disabled>
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in ORGANIZ_TYPE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合同编号" prop="contractNO">
                            <el-input v-model="contract.contractNO"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同标题" prop="contractTitle">
                            <el-input v-model="contract.contractTitle"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                   
                    <el-col :span="12">
                        <el-form-item label="合同价格类型">
                            <el-select v-model="contract.contractPriceType">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in CONTRACT_PRICE_TYPE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同金额">
                            <el-input v-model="contract.contractPrice">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                   
                    <el-col :span="12">
                        <el-form-item label="合同状态">
                            <el-select v-model="contract.contractState">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in CONTRACT_STATE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>   
                    <el-col :span="12">
                        <el-form-item label="签约日期">
                            <el-date-picker type="date" placeholder="选择日期" v-model="contract.signingDateStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>                
                </el-row>               
                <el-row>                   
                    <el-col :span="12">
                        <el-form-item label="履行开始日期">
                            <el-date-picker type="date" placeholder="选择日期" v-model="contract.startDateStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="履行结束日期">
                            <el-date-picker type="date" placeholder="选择日期" v-model="contract.endDateStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="我方签约人">
                            <el-input v-model="contract.ourSignatory"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户方签约人">
                            <el-input v-model="contract.otherPartySignatory"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="付款方式">
                            <el-select v-model="contract.paymentMethod">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in PAYMENT"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结算周期">
                            <el-select v-model="contract.paymentTermType">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in paymentTermType"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>                
                <el-row>                  
                    <el-col :span="12">
                        <el-form-item label="负责员工" prop="personLiable">
                            <el-input v-model="contract.personLiable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="contract.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>  
                <el-form-item label="上传合同附件">
                    <el-upload
                        action="/bank/dis/upload.action"
                        list-type="picture-card"
                        :on-success="uploadSuccess"
                        :on-remove="uploadRemove"
                        :data="uploadData"
                        :file-list="fileList"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>                                               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="contractVisible = false">取消</el-button>
                <el-button type="primary" @click="handleNewContract">新建</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { MERCHANT_TYPE, ORGANIZ_TYPE, MERCHANT_STATE, CREATE_TYPE, TRANS_TYPE, CONTRACT_STATE, CONTRACT_TYPE, CONTRACT_PRICE_TYPE, PAYMENT, ZONE_TYPE } from '@/utils/constant'
import { getHandle } from '@/utils/http'


export default {
    data() {
        return {
            flag_1: false,
            flag_2: false,
            flag_3: false,
            flag_4: false,
            flag_5: false,           
            MERCHANT_TYPE:{
                1: '托运方',
                2: '承运方',
                3: '服务方'
            },
            ORGANIZ_TYPE,
            MERCHANT_STATE,
            CREATE_TYPE,
            TRANS_TYPE,
            CONTRACT_STATE: {
                1: '未开始',
                2: '执行中'
            },
            merchant: {
                bizInfoType: '2',
                bizInfoName: '',
                bizInfoAbbreviation: '',
                // contactsTel: '',
                // contacts: '',
                // remark:'',
                userName: ''
            },
            CONTRACT_TYPE,
            PAYMENT,
            ZONE_TYPE,
            CONTRACT_PRICE_TYPE,
            userList: [],
            dialogFormVisible: false,
            dialogFormVisible_1: false,
            bizInfoAbbreviation: '',
            curRow: null,
            curSelection: [],
            queryType: 'businessNO',
            orderVisible: false,
            order: {
                individualMember: this.$store.state.user.userInfo.userName,
                transType: '1',
            },
            contract: {
                contractType: '1',
                orgType: '2',
                paymentMethod: '1',
                contractState: '1',
                contractPriceType: '1',
                contractNO: ''
            },
            paymentTermType: {
                1: '1333付款',
                2: '3331付款',
                3: '145付款',
            },
            contractVisible: false,
            transCode: 'MBUS01',
            uploadData: {
                userId: this.$store.state.user.userInfo.userId,
                uploadType: 'contract',
                type: 'add',
                picturesKey: ''
            },
            imgUrl: [],
            contractList: [],
            contractIndex: 0,
            fileList: [],
            contractRules: {
                contractNO: [
                    { required: true, message: '请输入合同编号', trigger: 'blur' }
                ],
                contractTitle: [
                    { required: true, message: '请输入合同标题', trigger: 'blur' }
                ],
                personLiable: [
                    { required: true, message: '请输入负责员工', trigger: 'blur' }
                ]
            },
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
            },
            orderRules: {
                originatingPlace: [
                    { required: true, message: '请输入始发地', trigger: 'blur' }
                ],
                destination: [
                    { required: true, message: '请输入目的地', trigger: 'blur' }
                ],
                goodsName: [
                    { required: true, message: '请输入货物名', trigger: 'blur' }
                ],
                goodsWeight: [
                    { required: true, message: '请输入货物重量', trigger: 'blur' }
                ],
                consignee: [
                    { required: true, message: '请输入收货人', trigger: 'blur' }
                ],
                consigneeTel: [
                    { required: true, message: '请输入收货电话', trigger: 'blur' }
                ],
                receivingAddr: [
                    { required: true, message: '请输入收货地址', trigger: 'blur' }
                ],
                receivingTime: [
                    { required: true, message: '请输入计划收货时间', trigger: 'blur' }
                ],
                consignor: [
                    { required: true, message: '请输入发货人', trigger: 'blur' }
                ],
                consignorTel: [
                    { required: true, message: '请输入发货电话', trigger: 'blur' }
                ],
                shippingAddr: [
                    { required: true, message: '请输入发货地址', trigger: 'blur' }
                ],
                // remarks: [
                //     { required: true, message: '请输入备注', trigger: 'blur' }
                // ]
            }
        }
    },
    methods: {
        queryCallBack(data) {
            this.userList = data.businessinfList || [];
        },
        handleChange(val) {
            if (this.queryType === 'bizInfoType') {
                this.queryContent = '1';
            } else {
                this.queryContent = '';
            }
        },
        handleEdit(row) {
            if(row.createType === '2'){
                this.$http.post({
                    transCode: 'MBUS01',
                    funType: 'findDetail',
                    id: row.bizInfoId
                }).then(data => {
                    this.dialogFormVisible_1 = true;
                    this.curRow = data.businessinf;
                    this.merchant.bizInfoType = this.curRow.bizInfoType;
                    this.merchant.bizInfoName = this.curRow.bizInfoName;
                    this.merchant.bizInfoAbbreviation = this.curRow.bizInfoAbbreviation;
                    this.merchant.contacts = this.curRow.contacts;
                    this.merchant.contactTel = this.curRow.contactTel;
                    this.merchant.remark = this.curRow.remark;   
                    this.id = this.curRow.bizInfoId;
                })           
            }else{
                this.dialogFormVisible = true;
                this.bizInfoAbbreviation = row.bizInfoAbbreviation;
                this.curRow = row;
            }
        },
        handleState(row, state) {
            this.$http.post({
                transCode: 'MBUS01',
                funType: 'update',
                state: state,
                id: row.bizInfoId
            }).then(data => {
                if (data.code == '000000') {
                    row.state = state;
                } else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
            })
        },
        handleDelet(index,row){
            this.$confirm('您确认要删除此商户吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
            }).then(() => {
                this.$http.post({
                    transCode: 'MBUS01',
                    funType: 'delete',
                    ids: row.bizInfoId
                }).then(data => {
                    if (data.code === '000000') {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.message
                        });
                    }
                })
            })
        },
        handleSubmit() {
            if(this.curRow.createType === '2'){
                this.$refs.merchant.validate(valid => {
                    if (valid) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$http.post({
                            transCode: 'MBUS01',
                            funType: 'update',
                            id: this.curRow.bizInfoId,
                            bizInfoAbbreviation: this.bizInfoAbbreviation,
                            ...this.merchant
                        }).then(data => {
                            this.dialogFormVisible_1 = false;
                            if (data.code == '000000') {
                                this.getData();
                                // this.messageTip(data);
                                // this.curRow.bizInfoAbbreviation = this.bizInfoAbbreviation;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: data.message
                                });
                            }
                        })
                    }
                })
            }else{
                this.$http.post({
                    transCode: 'MBUS01',
                    funType: 'update',
                    id: this.curRow.bizInfoId,
                    bizInfoAbbreviation: this.bizInfoAbbreviation
                }).then(data => {
                    this.dialogFormVisible = false;
                    if (data.code == '000000') {
                    this.curRow.bizInfoAbbreviation = this.bizInfoAbbreviation;
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.message
                        });
                    }
                })
            }            
        },
        handleSelectionChange(selection) {
            this.curSelection = selection;
        },
        handleOrder(row) {   
            this.getContract(row.bizInfoId).then(data => {
                console.log(data)
                if (data.length) {
                    this.curRow = row;
                    this.orderVisible = true;
                    this.order.shipper = row.bizInfoName;
                    this.order.shipperId = row.bizInfoId;
                    let contranct = this.contractList[this.contractIndex];
                    this.order.correspondingContractTitle = contranct.contractTitle;
                    this.order.correspondingContract = contranct.contractId;
                } else {
                    this.$message({
                        type: 'error',
                        message: '请先创建合同'
                    })
                }
            })
        },
        handleNewOrder() {
            this.$refs.order.validate(valid => {
                if (valid) {
                    this.orderVisible = false;
                    this.$http.post({
                        transCode: 'OORD01',
                        funType: 'add',
                        individualMemberId: this.$store.state.user.userInfo.userId,
                        ...this.order
                    }).then(data => {
                        this.messageTip(data)
                    })
                }
            })           
        },
        handleContract(row) {
            this.curRow = row;
            this.contractVisible = true;
            this.contract.customer = row.bizInfoName || 'admin';
            this.contract.orgType = row.orgType;
        },
        handleNewContract() {
            this.$refs.contract.validate(valid => {
                if (valid) {
                    this.contractVisible = false;
                    this.$http.post({
                        transCode: 'OCON01',
                        funType: 'add',
                        bizInfoId: this.curRow.bizInfoId,
                        contractTextAnnex: this.imgUrl.join(';'),
                        ...this.contract
                    }).then(data => {
                        this.messageTip(data);
                    })
                }
            })           
        },
        uploadSuccess(res, file, fileList) {
            this.imgUrl.push(res)
        },
        uploadRemove(file,fileList) {
            this.imgUrl = fileList.map(item => item.response)
        },
        getContract(bizInfoId) {
            return this.$http.post({
                transCode: 'OCON01',
                funType: 'findAll',
                contractStateList: '1,2',
                bizInfoId
            }).then(data => {
                this.contractList = data.contractList || []
                return this.contractList
            })
        },
        handleContractChange(index) {
            let contranct = this.contractList[index]
            this.order.correspondingContractTitle = contranct.contractTitle;
            this.order.correspondingContract = contranct.contractId;
        }
    },
    created() {
        getHandle().indexOf('修改') != -1 ? this.flag_1 = 'true' : '';
        getHandle().indexOf('停用') != -1 || getHandle().indexOf('启用') != -1 ? this.flag_2 = 'true' : '';
        getHandle().indexOf('删除') != -1 ? this.flag_3 = 'true' : '';
        getHandle().indexOf('创建订单') != -1 ? this.flag_4 = 'true' : '';
        getHandle().indexOf('创建合同') != -1 ? this.flag_5 = 'true' : '';        
        this.getData();
    }
}
</script>
