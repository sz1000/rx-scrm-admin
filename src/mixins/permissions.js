export default {
    data() {
        return {
            expandedKeys: [],
        }
    },
    mounted() {
        let permissionsList = JSON.parse(sessionStorage.getItem('permissionsList'))
        this.setName(permissionsList)
            // console.log('---permissionsList----', permissionsList)
    },
    methods: {
        setName(datas) {
            for (var i in datas) {
                let url = location.hash.slice(1)
                if (datas[i].url == url) {
                    // console.log('----url--', url)
                    // console.log('---caidan---', datas[i])
                    this.expandedKeys = datas[i].childrenList
                        // console.log('---expandedKeys---', this.expandedKeys)
                }
                if (datas[i].childrenList) {
                    this.setName(datas[i].childrenList)
                }
            }
        },
    },
}