/**
 * 函数防抖
 */

export function debounce(func, delay, immediate = false) {
    let timer,
        context = this
    return (...args) => {
        if (immediate) {
            func.apply(context, args)
            immediate = false
            return
        }
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(context, args)
        }, delay)
    }
}
//深复制
export function deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                objClone[key] = deepClone(obj[key])
            } else {
                objClone[key] = obj[key]
            }
        }
    }
    return objClone
}

// 时间转换
export function formatDate(dateTime, fmt) {
    if (typeof dateTime == 'string') {
        dateTime = dateTime.replace(/-/g, '/')
    }
    // console.log('dateTime', dateTime)
    let date = new Date(dateTime)
        // console.log(date, fmt)
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            )
        }
    }
    // console.log('-----fmt---', fmt)
    return fmt
}

export function formatDuring(mss) {
    let days = parseInt(mss / (1000 * 60 * 60 * 24))
    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = (mss % (1000 * 60)) / 1000

    if (days > 0) {
        return days + '天 ' + hours + '小时 ' + minutes + '分钟 ' + seconds + '秒'
    } else if (hours > 0) {
        return hours + '小时 ' + minutes + '分钟 ' + seconds + '秒'
    } else if (minutes > 0) {
        return minutes + '分钟 ' + seconds + '秒'
    } else if (seconds > 0) {
        return seconds + '秒'
    } else {
        return '0秒'
    }
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}

export function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true
        }
    }
    return false
}

// 文件大小单位转换
export function byteConvert(bytes) {
    if (isNaN(bytes)) {
        return
    }
    let symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    let exp = Math.floor(Math.log(bytes) / Math.log(2)) // 获取以2为底的bytes的对数（向下取整）

    if (exp < 1) {
        exp = 0
    }
    let i = Math.floor(exp / 10)

    bytes = bytes / Math.pow(2, 10 * i)

    // 取两位小数
    if (bytes.toString().length > bytes.toFixed(2).toString().length) {
        bytes = bytes.toFixed(2)
    }

    return bytes + '' + symbols[i]
}

/**
 * 事件节流
 */
let lastClickTime = 0

export function throttle(delay = 1000, key = null) {
    const currentTime = new Date().getTime()

    if (key) {
        const event = this.events[key]

        if (event) {
            if (currentTime >= event + delay) {
                this.events[key] = currentTime
                return true
            }
        } else {
            this.events[key] = 0
        }
    } else {
        if (currentTime >= lastClickTime + delay) {
            lastClickTime = currentTime
            return true
        }
    }
    return false
}

export function getHumanDate(dateStr) {
    let publishTime = getDateTimeStamp(dateStr) / 1000, d_seconds, d_minutes, d_hours, d_days, 
    timeNow = parseInt(new Date().getTime() / 1000), d, date = new Date(publishTime * 1000),
    Y = date.getFullYear(), M = addZero(date.getMonth() + 1), D = addZero(date.getDate()), H = addZero(date.getHours()), m = addZero(date.getMinutes()), s = addZero(date.getSeconds())
    
    d = timeNow - publishTime
    d_days = parseInt(d / 86400)
    d_hours = parseInt(d / 3600)
    d_minutes = parseInt(d / 60)
    d_seconds = parseInt(d)

    if (d_days > 0 && d_days < 3) {
        return d_days + '天前'
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + '小时前'
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + '分钟前'
    } else if (d_seconds < 60) {
        if (d_seconds <= 0) {
                return '刚刚';
        } else {
                return d_seconds + '秒前'
        }
    } else if (d_days >= 3 && d_days < 30) {
        return M + '-' + D + ' ' + H + ':' + m;
    } else if (d_days >= 30) {
        return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
    }
}

function getDateTimeStamp(dateStr) {
    return Date.parse(dateStr.replace(/-/gi, "/"));
}

// 小于10的在前面补0
function addZero(num) {
    if (num < 10) {
        return '0' + num
    }
    return num
}