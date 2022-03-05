import moment from 'moment'

const $time = function(dataStr, pattern = 'YYYY-MM-DD') {
    return dataStr ? moment(dataStr).format(pattern) : ''
}

const $textEmpty = function(text,unit = '-') {
    return text ? text : unit
}

const $customerType = function(val) {
    let obj = {
        1: '微信用户',
        2: '企微用户'
    }
    return obj ? obj[val] : '未知'
}

const $alt = function(val) {
    return Number(val.externalType) ? val.externalType == 1 ? '@微信' : `@${val.customerName}` || `@${val.cropFullName}` : ''
}

const $textAvatar = function(val) {
    return val ? val.substring(0,1) : ''
}

const $gender = function(val) {
    let obj = {
        0: '未知',
        1: '男',
        2: '女',
    }
    return val ? obj[val] : '未知'
}

export default {
    $textEmpty,
    $customerType,
    $time,
    $gender,
    $alt,
    $textAvatar,
}