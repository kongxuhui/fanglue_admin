<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType">
                    <el-option label="合同编号" value="contractNO"></el-option>
                    <el-option label="合同标题" value="contractTitle"></el-option>
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
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand" label-width="110px">
                        <el-form-item label="合同编号">
                            <span>{{ props.row.contractNO }}</span>
                        </el-form-item>
                        <el-form-item label="合同标题">
                            <span>{{ props.row.contractTitle }}</span>
                        </el-form-item>
                        <el-form-item label="客户名">
                            <span>{{ props.row.customer }}</span>
                        </el-form-item>
                        <el-form-item label="组织类型">
                            <span>{{ ORGANIZ_TYPE[props.row.orgType] }}</span>
                        </el-form-item>
                        <el-form-item label="合同价格类型">
                            <span>{{ CONTRACT_PRICE_TYPE[props.row.contractPriceType] }}</span>
                        </el-form-item>
                        <el-form-item label="合同单价">
                            <span>{{ props.row.contractPrice }}</span>
                        </el-form-item>
                        <el-form-item label="合同金额">
                            <span>{{ props.row.contractPrice }}元</span>
                        </el-form-item>
                        <el-form-item label="合同状态">
                            <span>{{ CONTRACT_STATE[props.row.contractState] }}</span>
                        </el-form-item>
                        <el-form-item label="签约日期">
                            <span>{{ props.row.signingDateStr }}</span>
                        </el-form-item>
                        <el-form-item label="履行开始日期">
                            <span>{{ props.row.startDateStr }}</span>
                        </el-form-item>
                        <el-form-item label="履行结束日期">
                            <span>{{ props.row.endDateStr }}</span>
                        </el-form-item>
                        <el-form-item label="客户方签约人">
                            <span>{{ props.row.otherPartySignatory }}</span>
                        </el-form-item>
                        <el-form-item label="我方签约人">
                            <span>{{ props.row.ourSignatory }}</span>
                        </el-form-item>
                        <el-form-item label="合同类型">
                            <span>{{ CONTRACT_TYPE[props.row.contractState] }}</span>
                        </el-form-item>
                        <el-form-item label="付款方式">
                            <span>{{ PAYMENT[props.row.contractState] }}</span>
                        </el-form-item>
                        <el-form-item label="备注">
                            <span>{{ props.row.remarks }}</span>
                        </el-form-item>
                        <el-form-item label="负责员工">
                            <span>{{ props.row.personLiable }}</span>
                        </el-form-item>
                        <el-form-item label="合同文本附件">
                            <img :src="$ossUrl+item" alt="" v-for="item in props.row.contractTextAnnex.split(';')">
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="customer" label="客户名"></el-table-column>
            <el-table-column prop="contractNO" label="合同编号"></el-table-column>
            <el-table-column prop="contractTitle" label="合同标题"></el-table-column>
            <el-table-column prop="contractPrice" label="合同金额">
                <template slot-scope="scope">{{scope.row.contractPrice}}元</template>
            </el-table-column>
            <el-table-column prop="contractState" label="合同状态">
                <template slot-scope="scope">{{CONTRACT_STATE[scope.row.contractState]}}</template>
            </el-table-column>
            <el-table-column prop="contractType" label="合同类型">
                <template slot-scope="scope">{{CONTRACT_TYPE[scope.row.contractType]}}</template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="付款方式">
                <template slot-scope="scope">{{PAYMENT[scope.row.paymentMethod]}}</template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope" class="text-center">
                    <div v-if="flag_1"><el-button size="mini" type="text" @click="handleEdit(scope.row,'edit')">修改</el-button></div>
                    <div v-if="flag_2"><el-button size="mini" type="text" @click="handleEdit(scope.row)">合同执行</el-button></div>
                    <!-- <div><el-button size="mini" type="text" @click="handleNew(scope.row)">新增收款计划</el-button></div> -->
                </template>
            </el-table-column>
        </el-table>

        <div class="text-right mt10" v-if="dataList.length">
            <el-pagination background layout="prev, pager, next" :page-count="totalPage" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog :visible.sync="execVisible">
            <el-form :model="exec" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户名">
                            <el-input v-model="exec.customer" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同编号">
                            <el-input v-model="exec.contractNO" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合同标题">
                            <el-input v-model="exec.contractTitle" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="执行日期">
                            <el-date-picker type="date" placeholder="选择日期" v-model="exec.extStartDateStr"  value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>               
                <el-form-item label="执行状态">
                    <el-select v-model="exec.extState">
                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in CONTRACT_EXEC_STATE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="执行内容">
                    <el-input type="textarea" v-model="exec.contractContent"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="exec.remarks"></el-input>
                </el-form-item>
                <el-form-item label="记录人">
                    <el-input v-model="exec.noteTaker" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="execVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleExec">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="contractVisible" :modal-append-to-body="false">
            <el-form :model="contract" ref="contract" :rules="contractRules" label-width="110px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户名">
                            <el-input v-model="contract.customer"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组织类型">
                            <el-select v-model="contract.orgType">
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
                            <el-select v-model="contract.contractState" disabled>
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
                        :on-preview="handlePictureCardPreview"
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
                <el-button type="primary" @click="handleEditContract">修改</el-button>
            </div>
        </el-dialog>
        
        <el-dialog :visible.sync="dialogVisible" size="tiny" :modal-append-to-body="false">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-dialog :visible.sync="gatherVisible">
            <el-form :model="curRow" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合同标题">
                            <el-input v-model="curRow.contractTitle" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同总额">
                            <el-input v-model="curRow.contractPrice" disabled>
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="托运方">
                            <el-input v-model="curRow.customer" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="接单员">
                            <el-input v-model="username"  disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-card class="box-card" v-for="(item, index) in gather" :key="index">
                    <div slot="header">
                        <span>明细表</span>
                        <el-button type="text" @click="addDetail">新增</el-button>
                        <el-button type="text" @click="deleteDetail(index)" v-show="gather.length > 1">删除</el-button>
                    </div>
                    <el-row>
                        <el-col :span="12">
                        <el-form-item label="期次">
                                <el-input v-model="item.periodTime"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="占比">
                                <el-input v-model="item.proportion" placeholder="%"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="计划收款日期">
                                <el-date-picker type="date" v-model="item.plannedReceiptDateStr" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收款金额">
                                <el-input v-model="item.amountCollected"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>  
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="逾期状态">
                                <el-select v-model="item.overdueState">
                                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in OVERDUE_STATE"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="逾期天数">
                                <el-input v-model="item.overdueDays"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>                      
                    <el-form-item label="备注">
                        <el-input v-model="item.remarks"></el-input>
                    </el-form-item>
                </el-card>                                   
                                                      
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="gatherVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleGather">确 定</el-button>
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
.table-expand img{
    width: 150px;
    height: 150px;
    margin-right: 10px;
}
</style>
<script>
import { ORGANIZ_TYPE, CONTRACT_STATE, CONTRACT_TYPE, CONTRACT_PRICE_TYPE, PAYMENT, CONTRACT_EXEC_STATE, OVERDUE_STATE } from '@/utils/constant'
import { getHandle } from '@/utils/http'

export default {
    data() {
        return {
            flag_1:false,
            flag_2:false,            
            dialogImageUrl: '',
            dialogVisible: false,
            ORGANIZ_TYPE,
            CONTRACT_STATE, 
            CONTRACT_TYPE, 
            CONTRACT_PRICE_TYPE, 
            PAYMENT,
            CONTRACT_EXEC_STATE,
            OVERDUE_STATE,
            queryType: 'contractNO',
            dataList: [],
            contractVisible: false,
            execVisible: false,
            contract: {},
            exec: {
                extState: '1'
            },
            transCode: 'OCON01',
            curRow: {},
            gatherVisible: false,
            gather: [],
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
            paymentTermType: {
                1: '1333付款',
                2: '3331付款',
                3: '145付款',
            },
            fileList: [],
            uploadData: {
                userId: this.$store.state.user.userInfo.userId,
                uploadType: 'contract',
                type: 'add',
                picturesKey: ''
            },
            imgUrl: []
        }
    },
    methods: {
        handleRemove(file, fileList) {
            // console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        queryCallBack(data) {
            this.dataList = data.contractList || [];
        },
        handleEdit(row,type) {
            this.curRow = row;
            if (type === 'edit') {
                this.contractVisible = true;
                this.contract = {...row};
                this.imgUrl = row.contractTextAnnex.split(';');
                this.fileList = this.imgUrl.map(item => ({url: this.$ossUrl + item}))
            } else {
                this.execVisible = true;
                this.exec.contractTitle = row.contractTitle;
                this.exec.customer = row.customer;
                this.exec.contractNO = row.contractNO;
                this.exec.noteTaker = this.username;
                this.exec.noteTakerId = this.userId;
            }
        },
        handleExec() {
            this.$http.post({
                transCode: 'OCON02',
                funType: 'add',
                contractId: this.curRow.contractId,
                bizInfoId: this.curRow.bizInfoId,
                ...this.exec
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
            this.execVisible = false;
        },
        uploadSuccess(res, file, fileList) {
            this.imgUrl.push(res.fileUrl)
        },
        uploadRemove(file,fileList) {
            this.imgUrl = fileList.map(item => item.response || item.url)
            this.imgUrl = this.imgUrl.map(item => item.replace(this.$ossUrl,''))
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleEditContract() {
            this.$refs.contract.validate(valid => {
                if (valid) {
                    this.contractVisible = false;
                    this.$http.post({
                        transCode: this.transCode,
                        funType: 'update',
                        id: this.curRow.contractId,
                        ...this.contract,
                        contractTextAnnex: this.imgUrl.join(';')
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
        },
        handleNew(row) {
            this.gatherVisible = true;
            this.curRow = row;
        },
        handleGather() {
            this.gatherVisible = false;
            this.gather.creater = this.username;
            this.gather.createrId = this.userId;
            this.$http.post({
                transCode: 'OREA01',
                funType: 'add',
                contractTitle: this.curRow.contractTitle,
                contractTotal: this.curRow.contractPrice,
                shipper: this.curRow.customer,
                shipperId: this.curRow.bizInfoId,
                contractId: this.curRow.contractId ,
                individualMember: this.username,
                individualMemberId: this.userId,
                receivablesPlanDtls: JSON.stringify(this.gather)
            }).then(data => {
                this.messageTip(data);
            })
        },
        addDetail() {
            this.gather.push({
                creater: this.username,
                createrId: this.userId
            });
        },
        deleteDetail(index) {
            this.gather.splice(index,1);
        }
    },
    created() {
        getHandle().indexOf('修改') != -1 ? this.flag_1 = 'true' : '';
        getHandle().indexOf('合同执行') != -1 ? this.flag_2 = 'true' : '';        
        let userInfo = this.$store.state.user.userInfo;
        this.username = userInfo.userName;
        this.userId = userInfo.userId;
        this.gather.push({
            creater: this.username,
            createrId: this.userId
        });
        this.getData()
    }
}
</script>
