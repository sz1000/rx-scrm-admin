const focus = {
    inserted: function(el) {    //elemenet el-input
        // 聚焦元素
        el.children[0].focus()
        // el.focus()
    }
}

const initNumber = {
    bind: function(el) {
        el.addEventListener('input', function(e) {
            var value = e.target.value.replace(/[^\d]+/g, '')
            if (parseInt(value, 10).toString() == 'NaN') {
                e.target.value = ''
            } else {
                e.target.value = parseInt(value, 10)
            }
        })
    }
}

export default {
    focus,
    initNumber
}