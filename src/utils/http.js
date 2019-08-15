import axios from 'axios';
import qs from 'qs';
import { Loading } from 'element-ui';

const URL = '/bank/dis/prepose.action';

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

export function setTreeData(arr){
    let map = {}; // 构建map
    arr.forEach(i => {
        map[i.value] = i; // 构建以id为键 当前数据为值
    });

    let treeData = [];
    arr.forEach(child => {
        const mapItem = map[child.rootId]; // 获取当前数据的parentId是否存在map中
        delete child.rootId;
        if (mapItem) { // 存在则表示当前数据不是最顶层数据
            // 注意: 这里的map中的数据是引用了arr的它的指向还是arr, 当mapItem改变时arr也会改变
            
            (mapItem.children || ( mapItem.children = [] )).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
            // this.$set((mapItem.children || ( mapItem.children = [] )), index, child)
        } else { // 不存在则是组顶层数据
            treeData.push(child);
        }
    });
    return treeData;
}


export function getHandle(){
    const str = window.location.href;
    const index = str.lastIndexOf("\/");  
    const url = '/' + str.substring(index + 1, str.length);
    let perList = [];
    if(sessionStorage.getItem("roles")){
        let perObj = JSON.parse(sessionStorage.getItem("roles"))[0] || '{}';
        for(let i=0; i<perObj.functions.length; i++){
            let per = perObj.functions[i].childFunction;
            for(let j=0; j<per.length; j++){
                if(per[j].funcUrl == url){
                    let pers = per[j].childFunction;
                    for(let k=0; k<pers.length; k++){
                        perList.push(pers[k].funName);
                    }
                }
            } 
        }
    }
    return perList;
}
export default {
    setTreeData,   
    getHandle, 
    post(param) {
        let data = qs.stringify({
			...param,
	    	corpCode: '1111',
	    	channelCode: '2222'
        });
        let loadingInstance = Loading.service({
            target: document.querySelector('.el-main')
        });
        return axios({
            method: 'POST',
            url: URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            data,
            timeout: 20000
        })
        .then(res => {
            loadingInstance.close();
            return res.data;
        })
        .catch(error => {
            if (error.response) {
                // The request was made, but the server responded with a status code 
                // that falls out of the range of 2xx 
                console.log(error.response);
            } else {
                // Something happened in setting up the request that triggered an Error 
                console.log('Error', error.message);
            }
        })
    },
}