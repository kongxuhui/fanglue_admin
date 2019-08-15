<template>
    <div class="main">
        <el-form :inline="true">
            <el-form-item label="查询条件">
                <el-select v-model="queryType" @change="handleChange">
                    <el-option label="下单时间" value="orderTimeStr"></el-option>
                    <el-option label="接单员" value="individualMember"></el-option>
                    <el-option label="托运方" value="shipper"></el-option>
                    <el-option label="物流状态" value="logisticsState"></el-option>
                    <el-option label="付款状态" value="paymentState"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryType === 'orderTimeStr'">
                <el-date-picker type="date" placeholder="选择日期" v-model="queryContent" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item v-else-if="queryType === 'paymentState'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in PAY_STATE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else-if="queryType === 'logisticsState'">
                <el-select v-model="queryContent">
                    <el-option :label="value" :value="key" :key="key" v-for="(value, key) in LOGISTICS_STATE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else>
                <el-input v-model="queryContent" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
        </el-form>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="全部订单" name="all"></el-tab-pane>
            <el-tab-pane label="我的订单" name="my"></el-tab-pane>
        </el-tabs>
        <el-table :data="userList" border>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="订单号">
                            <span>{{ props.row.orderNo }}</span>
                        </el-form-item>
                        <el-form-item label="下单时间">
                            <span>{{ new Date(props.row.orderTime || Date.now()).Format('yyyy-MM-dd') }}</span>
                        </el-form-item>
                        <!-- <el-form-item label="订单总额">
                            <span>{{ props.row.orderTotal }}元</span>
                        </el-form-item>
                        <el-form-item label="订单名称">
                            <span>{{ props.row.orderName }}</span>
                        </el-form-item> -->
                        <el-form-item label="对应合同名">
                            <span>{{ props.row.correspondingContractTitle }}</span>
                        </el-form-item>
                        <el-form-item label="区域类型">
                            <span>{{ ZONE_TYPE[props.row.areaType] }}</span>
                        </el-form-item>
                        <el-form-item label="运输方式">
                            <span>{{ TRANS_TYPE[props.row.transType] }}</span>
                        </el-form-item>                       
                        <el-form-item label="托运方">
                            <span>{{ props.row.shipper }}</span>
                        </el-form-item>
                        <el-form-item label="始发地">
                            <span>{{ props.row.originatingPlace }}</span>
                        </el-form-item>
                        <el-form-item label="目的地">
                            <span>{{ props.row.destination }}</span>
                        </el-form-item>
                        <el-form-item label="货物名">
                            <span>{{ props.row.goodsName }}</span>
                        </el-form-item>
                        <el-form-item label="货物重量">
                            <span>{{ props.row.goodsWeight }}吨</span>
                        </el-form-item>
                        <el-form-item label="货物体积">
                            <span>{{ props.row.goodsVolume }}m³</span>
                        </el-form-item>
                         <el-form-item label="货物件数">
                            <span>{{ props.row.goodsSum }}件</span>
                        </el-form-item>
                        <el-form-item label="收货人">
                            <span>{{ props.row.consignee }}</span>
                        </el-form-item>
                        <el-form-item label="收货人电话">
                            <span>{{ props.row.consigneeTel }}</span>
                        </el-form-item>
                        <el-form-item label="收货地址">
                            <span>{{ props.row.receivingAddr }}</span>
                        </el-form-item>
                        <el-form-item label="发货人">
                            <span>{{ props.row.consignor }}</span>
                        </el-form-item>
                        <el-form-item label="发货人电话">
                            <span>{{ props.row.consignorTel }}</span>
                        </el-form-item>
                        <el-form-item label="发货地址">
                            <span>{{ props.row.shippingAddr }}</span>
                        </el-form-item>
                        <el-form-item label="物流状态">
                            <span>{{ props.row.logisticsState }}</span>
                        </el-form-item>
                        <el-form-item label="付款状态">
                            <span>{{ props.row.paymentState }}</span>
                        </el-form-item>
                        <el-form-item label="接单员">
                            <span>{{ props.row.individualMember }}</span>
                        </el-form-item>
                        <el-form-item label="备注">
                            <span>{{ props.row.remarks }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column label="下单时间">
                <template slot-scope="scope">{{new Date(scope.row.orderTime || Date.now()).Format('yyyy-MM-dd')}}</template>
            </el-table-column>
            <!-- <el-table-column prop="orderName" label="订单名称"></el-table-column>
            <el-table-column prop="orderTotal" label="订单总额">
                <template slot-scope="scope">{{scope.row.orderTotal}}元</template>
            </el-table-column> -->
            <el-table-column prop="correspondingContractTitle" label="对应合同名"></el-table-column>
            <el-table-column label="区域类型">
                <template slot-scope="scope">{{ZONE_TYPE[scope.row.areaType]}}</template>
            </el-table-column>
            <el-table-column prop="transType" label="运输方式">
                <template slot-scope="scope">{{TRANS_TYPE[scope.row.transType]}}</template>
            </el-table-column>
            
            <el-table-column prop="shipper" label="托运方"></el-table-column>
            <el-table-column prop="goodsName" label="货物名"></el-table-column>
            <el-table-column prop="consignee" label="收货人"></el-table-column>
            <el-table-column prop="consignor" label="发货人"></el-table-column>
            <el-table-column prop="orderState"  label="订单状态">
                <template slot-scope="scope">{{ORDER_STATE[scope.row.orderState]}}</template>
            </el-table-column>
            <el-table-column prop="logisticsState"  label="物流状态"></el-table-column>
            <el-table-column prop="paymentState" label="付款状态"></el-table-column>
            <el-table-column prop="individualMember" label="接单员"></el-table-column>
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <!-- <div><el-button size="mini" type="text" @click="handleContract(scope.row)">关联合同</el-button></div> -->
                    <div v-if="flag_1"><el-button size="mini" type="text" @click="handEdit(scope.row)">修改</el-button></div>                    
                    <router-link :to="{name:'carryPlan',query:{id:scope.row.orderId}}" v-if="scope.row.planNo && flag_2"><el-button size="mini" type="text">查看分承运计划</el-button></router-link>
                    <div v-if="scope.row.planNo == '' && flag_2"><el-button size="mini" type="text" @click="handleNew(scope.row,'carry')">新增分承运计划</el-button></div>
                    <div>
                        <el-button size="mini" type="text" @click="handleNew(scope.row,'gather')" v-if="scope.row.orderTotal == 0 && flag_3">应收账款</el-button>
                        <div v-if="scope.row.orderTotal != 0 && flag_3">
                            <el-button size="mini" type="text" @click="handleNew(scope.row,'gather')">新增应收账款</el-button>
                            <el-button size="mini" type="text">
                                <router-link :to="{name:'receivable',query:{orderId:scope.row.orderId}}">查看应收账款</router-link>
                            </el-button>
                        </div>
                    </div>
                    <div>
                        <el-button size="mini" type="text" @click="handleNew(scope.row,'pack')" v-if="scope.row.packingNo == '' && flag_4">装箱信息</el-button>
                        <div v-if="scope.row.packingNo != '' && flag_4">
                            <el-button size="mini" type="text" @click="handleNew(scope.row,'pack')">新增装箱信息</el-button>
                            <el-button size="mini" type="text">
                                <router-link :to="{name:'packInfo',query:{orderId:scope.row.orderId}}">查看装箱信息</router-link>
                            </el-button>
                        </div>
                    </div>
                    <div v-if="flag_5"><el-button size="mini" type="text" @click="handleNew(scope.row,'service')">新增其他服务</el-button></div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 新增分承运计划 -->
        <el-dialog :visible.sync="dialogVisible">
            <el-form :model="carryModel" ref="carryRef" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单号">
                            <el-input v-model="curRow.orderNo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单日期">
                            <el-input :value="new Date(curRow.orderTime).Format('yyyy-MM-dd')" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                   
                    <el-col :span="12">
                        <el-form-item label="托运方">
                            <el-input v-model="curRow.shipper" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="货物名">
                            <el-input v-model="curRow.goodsName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                   
                    <el-col :span="12">
                        <el-form-item label="总起运地">
                            <el-input v-model="carryModel.originatingPlace" disabled></el-input>
                        </el-form-item>
                    </el-col>  
                    <el-col :span="12">
                        <el-form-item label="总目的地">
                            <el-input v-model="carryModel.destination" disabled></el-input>
                        </el-form-item>
                    </el-col>                   
                </el-row>  
                <el-card class="box-card" v-for="(item, index) in carryModel.carrys" :key="index">
                    <div slot="header">
                        <span>明细表</span>
                        <el-button type="text" @click="addDetail('carry')">新增</el-button>
                        <el-button type="text" @click="deleteDetail(index,'carry')" v-show="carryModel.carrys.length > 1">删除</el-button>
                    </div>
                    <div>
                        <el-row>
                            <el-col :span="12">
                            <el-form-item label="运程数名称" :prop="'carrys.'+index+'.transNUM'" :rules="{required: true, message: '请输入运程数', trigger: 'blur'}">
                                    <el-input v-model.trim="item.transNUM"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="运输方式" :prop="'carrys.'+index+'.shippingType'" :rules="{required: true, message: '请输入运输工具', trigger: 'blur'}">
                                    <el-input v-model.trim="item.shippingType"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>                        
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="出发地" :prop="'carrys.'+index+'.departurePlace'" :rules="{required: true, message: '请输入出发地', trigger: 'blur'}">
                                    <el-input v-model.trim="item.departurePlace"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="到达地" :prop="'carrys.'+index+'.destination'" :rules="{required: true, message: '请输入到达地', trigger: 'blur'}">
                                    <el-input v-model.trim="item.destination"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row> 
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="班次名" :prop="'carrys.'+index+'.flightsOrTrain'" :rules="{required: true, message: '请输入班次名', trigger: 'blur'}">
                                    <el-input v-model.trim="item.flightsOrTrain"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="运输状态" :prop="'carrys.'+index+'.transState'" :rules="{required: true, message: '请选择运输状态', trigger: 'blur'}">
                                    <el-select v-model="item.transState" disabled>
                                        <el-option :label="value" :value="key" :key="key" v-for="(value, key) in TRANSPORT_STATE"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>    
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="发生日期" :prop="'carrys.'+index+'.planSendDateStr'" :rules="{required: true, message: '请选择发生日期', trigger: 'blur'}">
                                    <el-date-picker type="date" v-model="item.planSendDateStr" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="到达日期" :prop="'carrys.'+index+'.planArrivalDateStr'" :rules="{required: true, message: '请选择到达日期', trigger: 'blur'}">
                                    <el-date-picker type="date" v-model="item.planArrivalDateStr" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>                   
                        </el-row>    
                        <el-row>                  
                            <el-col :span="12">
                                <el-form-item label="运输数量">
                                    <el-input v-model="item.transQuantity"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                            <el-form-item label="承运方" :prop="'carrys.'+index+'.carrier'" :rules="{required: true, message: '请输入承运方', trigger: 'blur'}">
                                    <el-input v-model.trim="item.carrier"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>          
                        <el-row>                   
                            <el-col :span="12">
                                <el-form-item label="联系电话" :prop="'carrys.'+index+'.carrierTel'" :rules="{required: true, message: '请输入联系电话', trigger: 'blur'}">
                                    <el-input v-model.trim="item.carrierTel"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人" :prop="'carrys.'+index+'.carrierContacts'" :rules="{required: true, message: '请输入联系人', trigger: 'blur'}">
                                    <el-input v-model.trim="item.carrierContacts"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>    
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="提单号" :prop="'carrys.'+index+'.ordinalNO'" :rules="{required: true, message: '请选择提单号', trigger: 'blur'}">
                                    <el-input v-model.trim="item.ordinalNO"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序号">
                                    <el-input v-model="item.sortNo"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>   
                        <el-form-item label="备注">
                            <el-input v-model="item.remarks"></el-input>
                        </el-form-item>                                   
                    </div>
                </el-card>                                    
                    
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增其他服务 -->
        <el-dialog :visible.sync="serviceVisible">
            <el-form :model="append" ref="serviceRef" label-width="100px">
                <el-row>
                    <el-col :span="12">
                       <el-form-item label="订单编号">
                            <el-input v-model="curRow.orderNo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="托运货物">
                            <el-input v-model="curRow.goodsName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="服务项目名" prop="serviceProject" :rules="{required: true, message: '请输入服务项目名', trigger: 'blur'}">
                            <el-input v-model.trim="append.serviceProject"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="服务内容">
                            <el-input v-model="append.serviceContent"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="计划开始时间">
                            <el-date-picker type="date" v-model="append.planDateStartStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划结束时间">
                            <el-date-picker type="date" v-model="append.planDateEndStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>                             
                <el-row>
                    <!-- <el-col :span="12">
                        <el-form-item label="项目进程环节">
                            <el-input v-model="append.serviceProcessOption"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="项目进程状态">
                            <el-select v-model="append.serviceProcessState">
                                <el-option :label="value" :value="key" :key="key" v-for="(value, key) in PROJECT_PROCESS_STATE"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="12">
                        <el-form-item label="排序号">
                            <el-input v-model="append.sortNo"></el-input>
                        </el-form-item>
                    </el-col>                  
                </el-row>                              
                <!-- <el-form-item label="备注">
                    <el-input type="textarea" v-model="append.remark"></el-input>
                </el-form-item>                         -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="serviceVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitService">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增应收账款 -->
        <el-dialog :visible.sync="gatherVisible">
            <el-form :model="gatherModel" ref="gatherRef" label-width="110px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单编号">
                            <el-input v-model="curRow.orderNo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单id">
                            <el-input v-model="curRow.orderId" disabled>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="下单日期">
                            <el-input :value="new Date(curRow.orderTime).Format('yyyy-MM-dd')" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="托运方">
                            <el-input v-model="curRow.shipper"  disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="货物名">
                            <el-input v-model="curRow.goodsName"  disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编制人">
                            <el-input v-model="username"  disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-card class="box-card" v-for="(item, index) in gatherModel.gather" :key="index">
                    <div slot="header">
                        <span>明细表</span>
                        <el-button type="text" @click="addDetail('gather')">新增</el-button>
                        <el-button type="text" @click="deleteDetail(index,'gather')" v-show="gatherModel.gather.length > 1">删除</el-button>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="应收款项" :prop="'gather.'+index+'.roption'" :rules="{required: true, message: '请输入应收款项', trigger: 'blur'}">
                                <el-input v-model.trim="item.roption"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="应收金额" 
                                :prop="'gather.'+index+'.money'" 
                                :rules="[
                                    {required: true, message: '请输入应收金额', trigger: 'blur'},
                                    { type: 'number', message: '金额必须为数字', trigger: 'blur'}
                                ]">
                                <el-input v-model.number="item.money">
                                    <template slot="append">元</template></el-input>                                
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>                                              
                        <el-col :span="12">
                            <el-form-item label="预计付款时间" :prop="'gather.'+index+'.planPayTimeStr'" :rules="{required: true, message: '请选择预计付款时间', trigger: 'blur'}">
                                <el-date-picker type="date" v-model="item.planPayTimeStr" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注">
                                <el-input v-model="item.remarks"></el-input>
                            </el-form-item>
                        </el-col>                        
                    </el-row>                                          
                </el-card>                                                                                         
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="gatherVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleGather">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增装箱信息 -->
        <el-dialog :visible.sync="packVisible">
            <el-form :model="packModel" ref="packRef" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单编号">
                            <el-input v-model="curRow.orderNo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单id">
                            <el-input v-model="curRow.orderId" disabled>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="货物名">
                            <el-input v-model="curRow.goodsName"  disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="托运方">
                            <el-input v-model="curRow.shipper"  disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="timeStr">
                    <el-col :span="12">
                        <el-form-item label="装箱时间" prop="packingTimeStr" :rules="{required: true, message: '请选择装箱时间', trigger: 'blur'}">
                            <el-date-picker type="date" v-model="packModel.packingTimeStr" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-card class="box-card" v-for="(item, index) in packModel.pack" :key="index">
                    <div slot="header">
                        <span>明细表</span>
                        <el-button type="text" @click="addDetail('pack')">新增</el-button>
                        <el-button type="text" @click="deleteDetail(index,'pack')" v-show="packModel.pack.length > 1">删除</el-button>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="箱规格型号" :prop="'pack.'+index+'.specifications'" :rules="{required: true, message: '请输入箱规格型号', trigger: 'blur'}">
                                <el-input v-model.trim="item.specifications"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="集中箱编号" :prop="'pack.'+index+'.boxNo'" :rules="{required: true, message: '请输入箱规格型号', trigger: 'blur'}">
                                <el-input v-model.trim="item.boxNo"></el-input>                                
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>                                              
                        <el-col :span="12">
                            <el-form-item label="货物内容" :prop="'pack.'+index+'.goodsContent'" :rules="{required: true, message: '请输入箱规格型号', trigger: 'blur'}">
                                <el-input v-model.trim="item.goodsContent"></el-input> 
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="货物数量" :prop="'pack.'+index+'.goodsSum'" :rules="{required: true, message: '请输入箱规格型号', trigger: 'blur'}">
                                <el-input v-model.trim="item.goodsSum"></el-input>
                            </el-form-item>
                        </el-col>                        
                    </el-row>                       
                    <el-form-item label="备注">
                        <el-input v-model="item.remarks"></el-input>
                    </el-form-item>
                </el-card>                                                                                         
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="packVisible = false">取 消</el-button>
                <el-button type="primary" @click="handlePack">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 关联合同 -->
        <el-dialog :visible.sync="contractVisible">
            <el-form label-width="100px">
                <el-form-item label="合同">
                    <el-select v-model="contractId">
                        <el-option :label="item.contractTitle" :value="item.contractId" :key="item.contractId" v-for="(item, index) in contractList"></el-option>
                    </el-select>
                </el-form-item>                        
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="contractVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitContract">关 联</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog :visible.sync="orderVisible">
            <el-form :model="order" ref="order" :rules="orderRules" label-width="110px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合同名">
                            <el-input v-model="order.correspondingContractTitle" disabled></el-input>
                            <!-- <el-select v-model="contractIndex" @change="handleContractChange">
                                <el-option :label="item.contractTitle" :value="index" :key="index" v-for="(item, index) in contractList"></el-option>
                            </el-select> -->
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
                <el-button type="primary" @click="handleNewOrder(order.orderId)">确定</el-button>
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
.box-card{
    margin-bottom: 10px;
}
.el-button+.el-button {
    margin-left: 0px;
}
</style>

<script>
import { PAY_STATE, TRANSPORT_STATE, LOGISTICS_STATE, TRANS_TYPE, SERVICE_PROJECT, PROJECT_PROCESS_STATE, ZONE_TYPE } from '@/utils/constant'
import { getHandle } from '@/utils/http'

export default {
    data() {
        return {
            flag_1: false,
            flag_2: false,
            flag_3: false,
            flag_4: false,
            flag_5: false,
            queryType: 'orderTimeStr',
            PAY_STATE,
            TRANSPORT_STATE,
            LOGISTICS_STATE,
            TRANS_TYPE,
            SERVICE_PROJECT,
            PROJECT_PROCESS_STATE,
            ZONE_TYPE,
            ORDER_STATE: {
                1: '待运输',
                2: '运输中',
                3: '已收货',
            },
            transCode_1: '',
            userList: [],
            dialogFormVisible: false,
            activeName: 'all',
            transCode: 'OORD01',
            dialogVisible: false,
            orderVisible: false,
            append: {
                serviceProcessState: '1'
            },
            curRow: {},
            carryModel: {
                carrys: [{transState:'1'}],
            },
            order: {
                individualMember: this.$store.state.user.userInfo.userName,
                transType: '1',
            },
            serviceVisible: false,
            contractVisible: false,
            contractList: [],
            contractId: '',
            gatherVisible: false,
            gatherModel: {
                gather: [{}],
            },      
            timeStr: true,      
            packVisible: false,
            packModel: {
                pack: [{}],
                packingTimeStr:''
            },
            contractIndex: 0,
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
            this.userList = data.orderList || [];
        },
        handleChange(val) {
            if (this.queryType === 'logisticsState' || this.queryType === 'paymentState') {
                this.queryContent = '1';
            } else {
                this.queryContent = '';
            }
        },
        handleNew(row, type) {
            this.curRow = row;
            switch (type) {
                case 'carry':
                    this.dialogVisible = true;
                    this.carryModel.originatingPlace = row.originatingPlace;
                    this.carryModel.destination = row.destination;
                    break;
                case 'gather':
                    this.gatherVisible = true;
                    break;
                case 'pack':
                    this.packVisible = true;
                    this.$http.post({
                        transCode: 'OPAC01',
                        funType: 'findAll',
                        orderId: this.curRow.orderId,
                    }).then((data) => {
                        if(data.totalCount != 0){
                            this.timeStr = false;
                        }else{
                            this.timeStr = true;
                        }
                    })
                    break;
                case 'service':
                    this.serviceVisible = true;
                    break;
                default:
                    break;
            }
        },
        addDetail(type) {
            switch (type) {
                case 'carry':
                    this.carryModel.carrys.push({transState:'1'});
                    break;
                case 'gather':
                    this.gatherModel.gather.push({});
                    break;
                case 'pack':
                    this.packModel.pack.push({});
                    break;
                default:
                    break;
            }
        },
        deleteDetail(index, type) {
            switch (type) {
                case 'carry':
                    this.carryModel.carrys.splice(index,1);
                    break;
                case 'gather':
                    this.gatherModel.gather.splice(index,1);
                    break;
                case 'pack':
                    this.packModel.pack.splice(index,1);
                    break;
                default:
                    break;
            }
            
        },
        handleSubmit() {
            this.$refs.carryRef.validate(valid => {
                if (valid) {
                    this.dialogVisible = false;
                    this.$http.post({
                        transCode: 'TTSP01',
                        funType: 'add',
                        orderId: this.curRow.orderId,
                        shipper: this.curRow.shipper,
                        shipperId: this.curRow.shipperId,
                        orderDateStr: new Date(this.curRow.orderTime).Format('yyyy-MM-dd'),
                        creater: this.username,
                        createrId: this.userId,
                        // individualMember: this.curRow.individualMember,
                        // individualMemberId: this.curRow.individualMemberId,
                        goodsName: this.curRow.goodsName,
                        transportplanDtls: JSON.stringify(this.carryModel.carrys),
                        originatingPlace: this.carryModel.originatingPlace,
                        destination: this.carryModel.destination,
                    }).then(data => {
                        this.messageTip(data);
                        if (data.code === '000000') {
                            this.fetchData();
                        }
                    })
                }
            })           
        },
        handleTabClick() {
            this.fetchData();
        },
        fetchData() {
            this.getData({
                individualMemberId: this.activeName === 'all' ? '' : this.userId
            });
        },
        handleSubmitService() {
            this.$refs.serviceRef.validate(valid => {
                if (valid) {
                    this.serviceVisible = false;
                    this.$http.post({
                        transCode: 'TOTS01',
                        funType: 'add',
                        orderId: this.curRow.orderId,
                        goodsName: this.curRow.goodsName,
                        orderDateStr: new Date(this.curRow.orderTime).Format('yyyy-MM-dd'),
                        shipper: this.curRow.shipper,
                        shipperId: this.curRow.shipperId,
                        creater: this.username,
                        updater: this.username,
                        ...this.append
                    }).then(data => {
                        this.messageTip(data);
                    })
                }
            })      
        },
        handleContract(row) {
            this.contractVisible = true;
            this.curRow = row;
            if (this.contractList.length === 0) {
                this.$http.post({
                    transCode: 'OCON01',
                    funType: 'findAll',
                    bizInfoId: row.shipperId,
                    pageCount: 100,
                    currentPageNum: 1
                }).then(data => {
                    this.contractList = data.contractList || []
                })
            }
        },
        handleSubmitContract() {
            this.contractVisible = false;
            this.$http.post({
                transCode: 'OCON03',
                funType: 'add',
                contractId: this.contractId,
                orderId: this.curRow.orderId,
                createrId: this.userId
            }).then(data => {
                if (data.code === '000000') {
                    this.$message({
                        message: '关联成功',
                        type: 'success'
                    });
                        this.getData();
                    }
            })
        },
        handleGather() {
            this.$refs.gatherRef.validate((valid) => {
                if (valid) {
                    this.gatherVisible = false;
                    if(this.curRow.orderTotal === 0){
                        this.transCode = 'OREA04';
                    }else{
                        this.transCode = 'OREA05';
                    }
                    this.$http.post({
                        transCode: this.transCode,
                        funType: 'add',
                        orderId: this.curRow.orderId,
                        orderNo: this.curRow.orderNo,
                        shipper: this.curRow.shipper,
                        goodsName: this.curRow.goodsName,
                        shipperId: this.curRow.shipperId,
                        orderDateStr: new Date(this.curRow.orderTime).Format('yyyy-MM-dd'),
                        creater: this.username,
                        createrId: this.userId,
                        receivablesDtls: JSON.stringify(this.gatherModel.gather)
                    }).then(data => {
                        if (data.code === '000000') {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                        }
                    })
                }
            })           
        },       
        handlePack() {
            this.$refs.packRef.validate((valid) => {
                if (valid) {
                    this.packVisible = false;
                    if(this.curRow.orderTotal === 0){
                        this.transCode_1 = 'OPAC01';
                    }else{
                        this.transCode_1 = 'OPAC02';
                    }
                    this.$http.post({
                        transCode: this.transCode_1,
                        funType: 'add',
                        orderId: this.curRow.orderId,
                        orderNo: this.curRow.orderNo,
                        shipper: this.curRow.shipper,
                        goodsName: this.curRow.goodsName,
                        shipperId: this.curRow.shipperId,
                        packingTimeStr: new Date(this.packModel.packingTimeStr).Format('yyyy-MM-dd'),
                        creater: this.username,
                        createrId: this.userId,
                        packinginfoDtls: JSON.stringify(this.packModel.pack)
                    }).then(data => {
                        if (data.code === '000000') {
                            this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.getData();
                    }
                        this.fetchData();
                    })
                }
            })    
        },
        handEdit(row){
            if(row.orderId){
                this.$http.post({
                    transCode: 'OORD01',
                    funType: 'findUpdateFlag',
                    id: row.orderId,
                }).then(data => {
                    if(data.flag){
                        this.$http.post({
                            transCode: 'OORD01',
                            funType: 'findDetail',
                            id: row.orderId
                        }).then(data => {
                            console.log(data)
                            this.curRow = row;
                            this.orderVisible = true;
                            this.order.orderId = row.orderId;
                            this.order.shipper = row.shipper;
                            this.order.shipperId = row.bizInfoId;
                            this.order.originatingPlace = row.originatingPlace;
                            this.order.goodsName = row.goodsName; 
                            this.order.goodsWeight = row.goodsWeight;                
                            this.order.goodsVolume = row.goodsVolume;    
                            this.order.destination = row.destination;          
                            this.order.goodsSum = row.goodsSum;                
                            this.order.consignee = row.consignee;                
                            this.order.consigneeTel = row.consigneeTel;                
                            this.order.receivingAddr = row.receivingAddr;        
                            this.order.receivingTime = row.receivingTime;                                               
                            this.order.consignor = row.consignor;                                               
                            this.order.consignorTel = row.consignorTel;                                               
                            this.order.shippingAddr = row.shippingAddr;         
                            this.order.individualMember = row.individualMember;                                                                                                      
                            this.order.remarks = row.remarks; 
                            this.order.correspondingContractTitle = row.correspondingContractTitle;
                        })
                    }else{
                        this.$message({
                            message: '该订单暂不可修改',
                            type: 'warning'
                        });
                    }
                })
                
                     
                // let contranct = this.contractList[this.contractIndex];
                // this.order.correspondingContractTitle = contranct.contractTitle;
                // this.order.correspondingContract = contranct.contractId;                                                            
            }
        },
        handleNewOrder(orderId) {
            this.$refs.order.validate(valid => {
                if (valid) {
                    this.orderVisible = false;
                    this.$http.post({
                        transCode: 'OORD01',
                        funType: 'update',
                        individualMemberId: this.$store.state.user.userInfo.userId,
                        id: orderId,
                        ...this.order
                    }).then(data => {
                        if (data.code === '000000') {
                            this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getData();
                    }
                        this.fetchData();
                    })
                }
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
        getHandle().indexOf('查看分承运计划') != -1 || getHandle().indexOf('新增分承运计划') != -1 ? this.flag_2 = 'true' : '';
        getHandle().indexOf('应收账款') != -1 || getHandle().indexOf('新增应收账款') != -1 || getHandle().indexOf('查看应收账款') != -1 ? this.flag_3 = 'true' : '';
        getHandle().indexOf('装箱信息') != -1 || getHandle().indexOf('新增装箱信息') != -1 || getHandle().indexOf('查看装箱信息') != -1 ? this.flag_4 = 'true' : '';      
        getHandle().indexOf('新增其他服务') != -1 ? this.flag_5 = 'true' : ''; 
        let userInfo = this.$store.state.user.userInfo
        this.userId = userInfo.userId;
        this.username = userInfo.userName;
        this.fetchData();
    }
}
</script>
