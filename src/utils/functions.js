import { Message } from 'element-ui'
import { oss_uploadfileparam } from '@/api/base'
const bases = function(Vue) {
    Vue.prototype.$httpReg = function(link) {   //是否http或https开头
        var myhttpReg = /(http|https):\/\/([\w.]+\/?)\S*/;
        return myhttpReg.test(link);
    }
    Vue.prototype.$linkReg = function(link) {   //是否是域名
        var myLinkReg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/;
        return myLinkReg.test(link);
    }
    /**
     * 文件大小 字节转换单位
     * @param size
     * @returns {string|*}
     */
    Vue.prototype.$filterSize = function(size){
        if(!size){ return false }
        if(size < this.pow1024(1)) return size + ' B'
        if(size < this.pow1024(2)) return (size / this.pow1024(1)).toFixed(2) + ' KB'
        if(size < this.pow1024(3)) return (size / this.pow1024(2)).toFixed(2) + ' MB'
        if(size < this.pow1024(4)) return (size / this.pow1024(3)).toFixed(2) + ' GB'
        return (size / this.pow1024(4)).toFixed(2) + ' TB'
    },
    Vue.prototype.pow1024 = function(num){     //求次幂
        return Math.pow(1024,num)
    },
    Vue.prototype.$colorRGB = function(val){
        // 16进制颜色值的正则
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 把颜色值变成小写
        var color = val.toLowerCase();
        if (reg.test(color)) {
            // 如果只有三位的值，需变成六位，如：#fff => #ffffff
            if (color.length === 4) {
                var colorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                }
                color = colorNew;
            }
            // 处理六位的颜色值，转为RGB
            var colorChange = [];
            for (var i = 1; i < 7; i += 2) {
                colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
            }
            return colorChange.join(",");
        } else {
            return color;
        }
    }
    Vue.prototype.$uploadFun = function(e, fileType, type, size, accept) { //上传图片
        let allowFileType = accept ? accept.split(',') : []
        let fileName = e.target.files[0].name
        let nameData = fileName.toLowerCase().split('.')
        let fileSize = e.target.files[0].size
        return new Promise((resolve, reject) => {
            if (allowFileType && allowFileType.length > 0 && allowFileType.indexOf(nameData[nameData.length - 1]) == -1) {
                Message({
                    message: '请上传' + allowFileType.join('、') + '格式的文件',
                    duration: 2000,
                    type: 'error'
                })
                e.target.value = ''
                reject(false)
                return false
            }
            if (size && size > 0 && fileSize > size * 1024 * 1024) {
                Message({
                    message: '文件大小不能超过' + size + 'M',
                    duration: 2000,
                    type: 'error'
                })
                e.target.value = ''
                reject(false)
                return false
            }
            oss_uploadfileparam(e,fileType,type).then(res => {
                if (res.result) {
                    e.target.value = ''
                    let data = res.data
                    resolve(data)
                } else {
                    reject(false)
                }
            })
        }).catch(error => {
            console.log('error', error)
        })
    }
    Vue.prototype.$accMul = function(arg1,arg2){    //乘法
        var m=0,s1=arg1.toString(),s2=arg2.toString(); 
        try{m+=s1.split(".")[1].length}catch(e){} 
        try{m+=s2.split(".")[1].length}catch(e){} 
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
    }
    Vue.prototype.$percentageFun = function(data){    //小数转百分比
        let val = this.$accMul(data,100)
        let arr = val ? val.toString().split('.') : []
        let num = arr.length == 2 && arr[1].length > 1 ? val.toFixed(2) : val
        return num
    }
    Vue.prototype.$gender = function(val) {   //性别
        let obj = {
            0: '未知',
            1: '男',
            2: '女',
        }
        return val ? obj[val] : '未知'
    }
    Vue.prototype.$getTextFun = function(obj){  //线索and客户(动态)
        // console.log('asd',obj.optType)
        let val = obj.optType,str = ''
        switch (val) {
            case 0:
                str = obj.context
                break;
            case 1:
                str = '建立了客户档案'
                break;
            case 2:
                str = '导入了客户'
                break;
            case 3:
                str = '从企微同步了'
                break;
            case 4:
                str = `将线索“${obj.customerCalled}”转为客户了`
                break;
            case 5:
                str = '更新了客户信息'
                break;
            case 6:
                str = obj.context
                break;
            case 7:
                str = '将客户分配给了'
                break;
            case 8:
                if(obj.optUserName){
                    str = '领取了客户'
                }else{
                    str = obj.context
                }
                break;
            case 9:
                str = '放弃了客户，客户已回到公海'
                break;
            case 11:
                str = '上传了附件'
                break;
            case 12:
                str = '删除了附件'
                break;
            case 13:
                str = `新增了一条记录“${obj.context}”`
                break;
            case 14:
                str = '拜访了客户'
                break;
            case 15:
                str = `新增了商机“${obj.context}”`
                break;
            case 16:
                str = '更新了商机'
                break;
            case 17:
                str = '删除了商机'
                break;
            case 18:
                if(obj.optUserName){
                    if(obj.createBy){
                        let _val = null,arr = []
                        if(obj.toUser){
                            if(Array.isArray(obj.toUser)){
                                if(obj.toUser.length){
                                    let str = ''
                                    obj.toUser.forEach(el => {
                                        str = el.name && el.depId ? `${el.name}-${el.depId}` : el.name
                                    })
                                    arr.push(str)
                                }
                                _val = arr && arr.length ? arr.join('、') : ''
                            }else{
                                _val = obj.toUser.name && obj.toUser.depId ? `${obj.toUser.name}-${obj.toUser.depId}` : obj.toUser.name
                            }
                        }
                        str = '新增协作人' + _val
                    }else{
                        str = obj.context
                    }
                }else{
                    str = obj.context
                }
                break;
            case 20:
                let val = null
                if(obj.toUser){
                    if(Array.isArray(obj.toUser)){
                        let _val = obj.toUser[0]
                        val = _val.name && _val.depId ? `${_val.name}-${_val.depId}` : _val.name
                    }else{
                        val = obj.toUser.name && obj.toUser.depId ? `${obj.toUser.name}-${obj.toUser.depId}` : obj.toUser.name
                    }
                }
                str = `删除了协作人“${val}”` 
                break;
            case 21:
                let alt,list = obj.context.receiveUserInfo
                if(list && list.length){
                    if(list.length == 1 && !list[0].userName){
                        alt = '@所有人'
                    }else{
                        let arr = []
                        list.forEach(el => {
                            let str = '@' + el.userName
                            arr.push(str)
                        })
                        alt = arr.join(' ')
                    }
                }
                str = alt + ' ' + obj.context.content
                break;
            case 26:
                let name = obj.ossObjectname ? obj.ossObjectname : obj.context
                str = `新增标签“${name}”`
                break;
            case 27:
                str = `移除了标签“${obj.ossObjectname}”`
                break;
            case 28:
                str = obj.context
                break;
            case 29:
                str = '发起激活客户'
                break;
            case 30:
                str = obj.context
                break;
            case 36:
                str = obj.context
                break;
            case 37:
                str = '新建了客户线索'
                break;
            case 39:
                str = '更新了协助人信息'
                break;
            case 40:
                str = `线索客户“${obj.customerCalled}”浏览了“${obj.ossObjectname}”`
                break;
            case 41:
                str = `将“${obj.customerCalled}”${obj.context}`
                break;
            case 44:
                let _str = ''
                if(obj.optResult == 1){
                    _str = '(已通过)'
                }else if(obj.optResult == 0){
                    _str = '(已拒绝)'
                }
                str = '申请成为协助人' + _str
                break;
            case 46:
                str = '已自动成为协助人'
                break;
            case 47:
                break;
            case 48:
                break;
            case 50:
                str = '新建了客户线索'
                break;
            case 53:
                str = '更新了线索信息'
                break;
            case 57:
                str = obj.context
                break;
            case 59:
                str = `${obj.context}${obj.customerCalled}`
                break;
            case 60:
                str = `${obj.context}“${obj.customerCalled}”`
                break;
            case 70:
                str = `客户“${obj.customerCalled}”加入了群“${obj.ossObjectname}”`
                break;
            case 71:
                if(!obj.optUserName){
                    str = `客户“${obj.customerCalled}”退出群聊“${obj.ossObjectname}”`
                }else{
                    str = obj.context
                }
                break;
            case 72:
                if(obj.ossObjectname){
                    str = `将线索“${obj.ossObjectname}”和客户“${obj.customerCalled}”合并了`
                }else{
                    str = `将客户“${obj.customerCalled}”与相关线索进行了合并`
                }
                break;
            default:
                break;
        }
        return str
    }
    Vue.prototype.$listFilter = function(list,url){    //获取路由权限
        let data = null
        list.forEach(el => {
            if(el.url == url){
                localStorage.setItem('nowPermissions',JSON.stringify(el.childrenList))
                console.log('this.$nowPermissions')
            }
            if(data == null){
                if(el.childrenList && el.childrenList.length){
                    this.$listFilter(el.childrenList,url)
                }
            }
        })
    }
}
export default bases