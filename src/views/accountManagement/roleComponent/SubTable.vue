<template>
  <div class="wrap">
    <div class="table">
      <div class="one_box" v-for="(item,i) in list" :key="item.id">
        <div class="item navItem">
          <el-checkbox v-model="item.checked" :indeterminate="item.isIndeterminate"
                       @change="changeFun(item)">{{item.title}}</el-checkbox>
        </div>
        <div class="item">
          <div class="row" v-for="(o,oi) in item.childrenList" :key="o.id">
            <div class="item menuItem">
              <el-checkbox v-if="o.title" v-model="o.checked" :indeterminate="o.isIndeterminate"
                           @change="changeFun(o,item,i)">
                {{o.title}}</el-checkbox>
            </div>
            <div class="item flex_center">
              <div class="row_item" v-if="!o.ispage">
                <div class="row" v-for="(w,wi) in o.childrenList" :key="w.id">
                  <div class="name">
                    <el-checkbox v-model="w.checked" :indeterminate="w.isIndeterminate"
                                 @change="changeFun(w,o,i,oi)">
                      {{w.title}}</el-checkbox>
                  </div>
                  <div class="foure_box page_box">
                    <el-checkbox class="btn_box" v-model="t.checked"
                                 @change="changeFun(t,w,i,oi,wi)" v-for="t in w.childrenList"
                                 :key="t.id">{{t.title}}</el-checkbox>

                  </div>
                </div>
              </div>
              <div class="row" v-else>
                <div class="name"></div>
                <div class="foure_box end_box">
                  <el-checkbox class="btn_box" v-model="t.checked" @change="changeFun(t,w,i,oi)"
                               v-for="t in o.childrenList" :key="t.id">{{t.title}}</el-checkbox>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateList: [],
      temporary: null, //checked 临时
      type: null, //类型 临时
      id: null, //id   临时
      list: [],
      idList: [],
      characterName: '',
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getDetail()
    } else {
      this.getDataList()
    }
  },
  methods: {
    getDataList() {
      this.loading = true
      this.$network
        .get('/user-service/role/getRole2PermissionList', {
          endPoint: 'pc',
        })
        .then((res) => {
          this.dateList = res.data.pc
          this.setData(this.dateList)
          // let list = res.data.pc
          // this.phoneList = res.data.mobile
          this.loading = false
        })
    },
    getDetail() {
      this.loading = true
      this.$network
        .get('/user-service/role/getDetail', {
          id: this.$route.query.id,
        })
        .then((res) => {
          this.characterName = res.data.role.name
          this.idList = res.data.pcList
          // this.mobileList = res.data.mobileList
          this.role = res.data.role
          this.getDataList()
          this.loading = false
        })
    },
    setData(treeList) {
      for (var i in treeList) {
        treeList[i].checked = false
        treeList[i].isIndeterminate = false
        if (
          treeList[i].childrenList &&
          treeList[i].childrenList.length &&
          treeList[i].childrenList[0].typeCode == 'button'
        ) {
          treeList[i].ispage = true
        }
        if (treeList[i].childrenList.length) {
          this.setData(treeList[i].childrenList)
        }
      }
      this.list = treeList
      this.showRow(this.list)
      // console.log('----treeList--', this.list)
    },
    showRow(list) {
      // console.log('---list----', list)
      list.forEach((item) => {
        // console.log('----this.idList---', this.idList)
        this.idList.forEach((pid) => {
          if (item.id == pid) {
            item.checked = true
          }
        })
        if (item.childrenList && item.childrenList.length !== 0) {
          this.showRow(item.childrenList)
        }
      })
    },
    listInitFun(el) {
      //半选
      console.log('el', el)
      let n = 0,
        i = 0
      if (el.childrenList && el.childrenList.length > 0) {
        el.children.forEach((item) => {
          if (item.checked) {
            n++
          }
          if (item.isIndeterminate) {
            i++
          }
          if (item.childrenList) {
            this.listInitFun(item.childrenList)
          }
        })
        if (n) {
          el.checked = true
          if (el.childrenList.length == n && n != i) {
            el.isIndeterminate = false
          } else {
            el.isIndeterminate = true
          }
        }
      }
    },
    changeFun(row, obj, i, oi, wi) {
      this.$forceUpdate()
      console.log('--row------', i, oi, wi, row)
      // console.log('------', this.list)
      let data = row
      this.type = row.type
      this.id = row.id
      // data.isIndeterminate = false
      if (data.childrenList && data.childrenList.length > 0) {
        if (data.checked) {
          //全选
          this.temporary = data.checked
          if (obj) {
            obj.checked = true
            obj.isIndeterminate = true
            let state = true
            obj.childrenList.forEach((el) => {
              if (!el.checked) {
                state = false
              }
            })
            if (state) {
              obj.isIndeterminate = false
            }

            let estatus1 = false,
              n = 0,
              isInd = false
            this.list[i].childrenList.forEach((el) => {
              if (el.checked) {
                n++
                estatus1 = true
              }
              if (el.isIndeterminate) {
                isInd = true
              }
            })
            if (estatus1) {
              if (this.list[i].childrenList.length == n && !isInd) {
                this.list[i].isIndeterminate = false
              } else {
                this.list[i].isIndeterminate = true
              }
              this.list[i].checked = true
            }
          }
          this.listCheckedFun(data.childrenList)
        } else {
          //反选 or 半选
          console.log('开始半选了 checked', data, data.parentArr)
          data.isIndeterminate = false
          this.checkedNoFun(data.childrenList)
          let len =
            data.parentArr && data.parentArr.length > 0
              ? data.parentArr.length
              : 0
          if (len) {
            this.list.forEach((el) => {
              if (el.id == data.parentArr[0]) {
                el.isIndeterminate = true
                el.childrenList.forEach((o) => {
                  if (data.parentArr[1] && o.id == data.parentArr[1]) {
                    o.isIndeterminate = true
                    o.childrenList.forEach((w) => {
                      if (data.parentArr[2] && w.id == data.parentArr[2]) {
                        w.isIndeterminate = true
                      }
                    })
                  }
                })
              }
            })
          }
          // console.log('asd', obj)
          let state = false
          if (obj) {
            obj.childrenList.forEach((el) => {
              if (el.checked) {
                state = true
              }
            })
            if (!state) {
              obj.isIndeterminate = false
              obj.checked = false
            }
          }

          let estatus1 = true
          if (
            this.list[i].childrenList &&
            this.list[i].childrenList.length > 0
          ) {
            this.list[i].childrenList.forEach((el) => {
              if (el.checked) {
                estatus1 = false
              }
            })
          }
          if (estatus1) {
            this.list[i].isIndeterminate = false
            this.list[i].checked = false
          }
        }
      } else {
        console.log('开始半选了', i, oi, wi, this.list)

        this.list.forEach((el) => {
          if (el.id == this.list[i].id) {
            el.isIndeterminate = true
            el.checked = true
            el.childrenList.forEach((o) => {
              if (oi > -1 && o.id == this.list[i].childrenList[oi].id) {
                o.isIndeterminate = true
                o.checked = true
                o.childrenList.forEach((w) => {
                  if (wi > -1 && w.id == obj.id) {
                    w.isIndeterminate = true
                    w.checked = true
                  }
                })
              }
            })
          }
        })

        if (!data.checked) {
          console.log('no checked')
          // if(wi > -1 && !data.checked){
          let status = false
          this.list[i].childrenList[oi].childrenList[wi].childrenList.forEach(
            (el) => {
              if (el.checked) {
                status = true
              }
            }
          )
          if (!status) {
            this.list[i].childrenList[oi].childrenList[
              wi
            ].isIndeterminate = false
            this.list[i].childrenList[oi].childrenList[wi].checked = false
            let ostatus = false
            this.list[i].childrenList[oi].childrenList.forEach((el) => {
              console.log('el.checked', el.checked)
              if (el.checked) {
                ostatus = true
              }
            })
            console.log(
              'oi',
              this.list[i].childrenList[oi].childrenList,
              status
            )
            if (!ostatus) {
              this.list[i].childrenList[oi].isIndeterminate = true
              this.list[i].childrenList[oi].checked = false
              let estatus = false
              this.list[i].childrenList.forEach((el) => {
                if (el.checked) {
                  estatus = true
                }
              })
              if (!estatus) {
                this.list[i].isIndeterminate = true
                this.list[i].checked = false
              }
            }
          }
        } else {
          console.log('checked')
          let status1 = true
          this.list[i].childrenList[oi].childrenList[wi].childrenList.forEach(
            (el) => {
              if (!el.checked) {
                status1 = false
              }
            }
          )
          if (status1) {
            this.list[i].childrenList[oi].childrenList[
              wi
            ].isIndeterminate = false
            this.list[i].childrenList[oi].childrenList[wi].checked = true
          }
          console.log(
            'checked last',
            this.list[i].childrenList[oi].childrenList[wi]
          )

          let ostatus1 = true
          this.list[i].childrenList[oi].childrenList.forEach((el) => {
            if (!el.checked) {
              ostatus1 = false
            }
          })
          if (ostatus1) {
            this.list[i].childrenList[oi].isIndeterminate = false
            this.list[i].childrenList[oi].checked = true
          }

          let estatus1 = true
          this.list[i].childrenList.forEach((el) => {
            if (!el.checked) {
              estatus1 = false
            }
          })
          if (estatus1) {
            this.list[i].isIndeterminate = false
            this.list[i].checked = true
          }
        }

        let state = false
        obj.childrenList.forEach((el) => {
          if (el.checked) {
            state = true
          }
        })
        if (!state) {
          obj.isIndeterminate = false
          obj.checked = true
        }
      }
    },

    listCheckedFun(list) {
      //list checked
      list.forEach((el) => {
        el.checked = this.temporary
        el.isIndeterminate = false
        if (el.childrenList && el.childrenList.length > 0) {
          this.listCheckedFun(el.childrenList)
        }
      })
    },
    checkedNoFun(list) {
      // console.log('1111111111')
      //下级反选
      list.forEach((el) => {
        el.checked = false
        el.isIndeterminate = false
        if (el.childrenList && el.childrenList.length > 0) {
          this.checkedNoFun(el.childrenList)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  .table {
    // width: 1200px;
    min-height: 80vh;
    // margin: 0 auto;
    border: 1px solid #f0f2f7;
    .one_box {
      padding-left: 16px;
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f0f2f7;
      .row_item {
        // display: flex;
        // width: 100%;
      }
      .item,
      .row_item {
        width: 197px;
        box-sizing: border-box;
        border-right: 1px solid #f0f2f7;
        &:last-child {
          width: calc(~'100% - 197px');
          width: 100%;
          border-left: 1px solid #f0f2f7;
        }
        .flex_center {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          width: calc(~'100% - 197px');
        }
        .name {
          width: 197px;
          border-right: 1px solid #f0f2f7;
          padding-left: 16px;
          height: 40px;
          line-height: 40px;
          .btn_box {
            margin-right: 20px;
            padding-left: 16px;
          }
        }
        .page_box {
          // width:100%
          // display: flex;
          // border-bottom: 1px solid #f0f2f7;
        }
      }
      .menuItem,
      .navItem {
        padding: 10px 0;
        // border-right: 1px solid #f0f2f7;
      }
      .foure_box {
        // padding-left: 16px;
        width: calc(~'100% - 197px');
        .btn_box {
          // margin-right: 20px;
          padding-left: 16px;
        }
      }
    }
  }
  .row {
    padding-left: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f2f7;
    &:last-child {
      border: none;
    }
  }
  /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #4168f6 !important;
    border-color: #4168f6 !important;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #4168f6 !important;
  }
}
</style>