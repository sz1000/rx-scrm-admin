<template>
  <el-container>
    <el-header>
      <div class="header">
        <div class="logo">
          <!--图片logo-->
          <img alt="element-logo" src="../../assets/images/logo_top.png" class="logo_top" v-if="!isCollapse" />
          <img alt="element-logo" src="../../assets/images/logo_min.png" class="logo_icon" v-else />
        </div>
        <div class="header-tabs-box">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelectHeader" router>
            <el-menu-item index="/readme">首页</el-menu-item>
            <el-menu-item v-for="(menu, index) in topMenuList" :key="index" :index="menu.url" :tabindex="index + 1" @click="goLeftMenu(menu)">
              {{ menu.name }}
            </el-menu-item>
          </el-menu>
        </div>
        <div class="header-user">
          <div class="header-user-title">
            <el-popover placement="bottom" popper-class="invitCode" trigger="hover">
              <img src="../../assets/images/invitation.png" alt="" style="width: 19px; height: 19px" slot="reference" />
              <div class="absolute pointer">
                <div id="qrcodeTop" ref="qrcodeTop"></div>
                <div class="downCode">
                  <a :href="hrefCode" download="二维码">下载二维码</a>
                </div>
              </div>
            </el-popover>
          </div>
          <div class="headPhoto">
            <img :src="avatar" alt="" style="width: 24px; height: 24px" v-if="avatar.indexOf('http')>-1" />
            <div class="defautImg" v-else>
              {{ userName.slice(0, 1) }}
            </div>
          </div>
          <span class="title_name" :title="userName">{{ userName }}</span>
          <div class="header-user-exit">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <img slot="reference" class="pointer" src="../../assets/images/icon_more@2x.png" alt="" style="width: 18px; height: 18px" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item command="slectEnterprise">切换企业</el-dropdown-item> -->
                <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-header>
    <el-container :class="{'min_width':!$route.meta.home}">
      <div :class="isCollapse ? 'smallBar' : 'sideBar'" class="relative" v-show="showSide">
        <img src="../../assets/images/open_right.png" alt="" class="openSide" @click="openAside" v-if="isCollapse" />
        <img src="../../assets/images/icon_pack up@2x.png" alt="" :class="isCollapse ? 'openSide' : 'hideSide'" @click="openAside" v-else />
        <!-- 仅支持3级菜单 -->
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :default-active="menu" active-text-color="#4168f6" :router="true"
                 :default-openeds="opends" v-for="(item, index) in menuList" :key="index" v-loading='loading'>
          <el-submenu v-if="item.childrenList" :index="'0-'+index" :route="item.url" class="edit_wrapper">
            <template slot="title">
              <img :src="item.icon" alt="" style="width: 14px; height: 14px; margin-right: 16px" />
              <span slot="title" class="inlineBlock">{{ item.title }}</span>
            </template>
            <el-submenu v-show="item1.childrenList" v-for="(item1, index) in item.childrenList" :key="index" :index="item1.url" :route="item1.url">
              <template slot="title">
                <img :src="item1.icon" alt="" style="width: 14px; height: 14px; margin-right: 16px" />
                <span slot="title" class="inlineBlock">{{ item1.title }}</span>
              </template>
              <el-submenu v-for="(item2, index) in item1.childrenList" :key="index" v-show="item2.childrenList" :index="item2.url" :route="item2.url">
                <template slot="title">
                  <img :src="`../../assets/images/${item2.icon}.png`" alt="" style="width: 14px; height: 14px; margin-right: 16px" />
                  <span slot="title" class="inlineBlock">{{
                    item2.title
                  }}</span>
                </template>
                <el-submenu v-for="(item3, index) in item2.childrenList" :key="index" v-show="item3.childrenList" :index="item3.url"
                            :route="item3.url">
                  <template slot="title">
                    <img :src="item3.icon" alt="" style="width: 14px; height: 14px; margin-right: 16px" />
                    <span slot="title" class="inlineBlock">{{
                      item3.title
                    }}</span>
                  </template>
                  <el-menu-item v-for="(item4, index) in item3.childrenList" :key="index" v-show="item4.childrenList == null" :index="item4.url"
                                :route="item4.url">
                    <span>{{ item4.title }}</span>
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-for="(item3, index) in item2.childrenList" :key="index + item3.title" v-show="item3.childrenList == null"
                              :index="item3.url" :route="item3.url">
                  <span>{{ item3.title }}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-for="(item2, index) in item1.childrenList" :key="index + item2.title" v-show="item2.childrenList == null"
                            :index="item2.url" :route="item2.url">
                <span>{{ item2.title }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-for="(item1, index) in item.childrenList" :key="index + item1.title" v-show="item1.childrenList == null"
                          :index="item1.url" :route="item1.url">
              <span>{{ item1.title }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="item.url" :route="item.url">
            <img :src="item.icon" alt="" style="width: 14px; height: 14px; margin-right: 16px" />
            <span slot="title" class="inlineBlock">{{ item.title }}</span>
          </el-menu-item>

        </el-menu>
      </div>
      <el-main class="main" :class="{'npd':$route.meta.noPadding,'home':$route.meta.home}">
        <router-view @father="routerUpdate"></router-view>
      </el-main>
    </el-container>
    <div class="companyBox">
      <el-dialog title="请选择公司" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="520px">
        <div v-for="(item, index) in items" :key="index" class="selectCompany" :class="(item.corpId == activeId) ? 'bgCompany' :''"
             @click="changeCompany(item)">
          <span>{{ item.corpName }}</span>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
// import {
//   systList,
//   markTool,
//   customeList,
//   interactive,
//   riskControl,
//   dataReport,
// } from './menuList.js'
import QRCode from 'qrcodejs2'
export default {
  components: {
    QRCode,
  },
  data() {
    return {
      loading: false,
      showSide: null,
      menuList: '',
      topMenuList: [],
      leftMenu: [],
      menu: '',
      isCollapse: false,
      levelList: null,
      userName: '',
      activeIndex: 1,
      showImg: false,
      hrefCode: '',
      link: '',
      avatar: '',
      avtive: '',
      dialogVisible: false,
      items: [],
      phone: '',
      activeId: '',
      opends: ['0'],
    }
  },
  created() {
    this.$nextTick(() => {
      this.getMenu()
    })
    this.getCode()
  },

  computed: {
    // menu() {
    // 	return this.$route.path
    // },
  },

  methods: {
    //首页跳转
    routerUpdate(val,query) {
      console.log('------father---', val,query)
      // console.log('---111---', this.leftMenu)
      let splitVal = '/' + val.split('/')[1]
      let tempUrl = JSON.parse(JSON.stringify(this.leftMenu))
      this.menuList = []
      tempUrl.forEach((item) => {
        // console.log('-----item---', item)
        if (item.url == splitVal) {
          let p = JSON.parse(JSON.stringify(item.childrenList))
          p.forEach((item) => {
            if (
              item.childrenList.length &&
              item.childrenList[0].typeCode !== 'button'
            ) {
              item.icon = require(`../../assets/images/${item.icon}.png`)
            } else {
              item.icon = require(`../../assets/images/${item.icon}.png`)
              item.childrenList = null
            }
          })
          this.menuList = p
          // console.log('-----this.menuList', this.menuList)
          this.$router.push({
            path: val,
            query
          })
        }
      })
    },
    getMenu() {
      this.loading = true
      this.$network
        .get('/user-service/user/getUserName', { endPoint: 'pc' })
        .then((res) => {
          this.loading = false
          this.userName = res.data.userEntity.name
          this.avatar = res.data.userEntity.avatar
          this.$store.commit('SET_DATAPERMISSION',res.data.userEntity.dataPermission)
          console.log(this.avatar)
          let tempMenuList = res.data.userEntity.permissionList
          let list = JSON.parse(
            JSON.stringify(res.data.userEntity.permissionList)
          )
          this.processTree(list)
          let tempArr = []
          // this.$store.commit('permissionsList', tempMenuList)
          // localStorage.setItem('userName')
          sessionStorage.setItem(
            'permissionsList',
            JSON.stringify(tempMenuList)
          )
          tempMenuList.forEach((item) => {
            let obj = {
              name: item.title,
              url: item.url,
            }
            tempArr.push(obj)
            this.topMenuList = tempArr.map((item) => {
              if (item.url == '') {
                item.url = '/404'
              }
              return item
            })
          })
          // console.log('----this.topMenuList---', this.topMenuList)
          this.leftMenu.forEach((item) => {
            if (item.url == this.activeIndex) {
              let p =
                item.childrenList.length > 0
                  ? JSON.parse(JSON.stringify(item.childrenList))
                  : item
              p.forEach((item) => {
                if (
                  item.childrenList.length &&
                  item.childrenList[0].typeCode !== 'button'
                ) {
                  item.icon = require(`../../assets/images/${item.icon}.png`)
                } else {
                  item.icon = require(`../../assets/images/${item.icon}.png`)
                  item.childrenList = null
                  // delete item.childrenList
                }
              })
              this.menuList = p
              // console.log('-----p----', this.menuList)
            }
          })

          // this.loading = false
        })
    },
    goLeftMenu(objUrl) {
      this.leftMenu.forEach((item) => {
        // console.log('---url=--==', objUrl, item)
        if (item.url == objUrl.url) {
          // console.log(item)
          let p =
            item.childrenList.length > 0
              ? JSON.parse(JSON.stringify(item.childrenList))
              : item
          if (p && p.length) {
            p.forEach((item) => {
              // console.log(p, item, '---ppp---')

              if (
                item.childrenList.length &&
                item.childrenList[0].typeCode !== 'button'
              ) {
                item.icon = require(`../../assets/images/${item.icon}.png`)
              } else {
                item.icon = require(`../../assets/images/${item.icon}.png`)
                item.childrenList = null
              }
            })
            let children = item.childrenList[0]
            let url =
              children.childrenList.length > 0
                ? children.childrenList[0].url
                : children.url
            // this.menu = url
            // this.opends.push(url)
            // console.log(url, 'url-------')
            this.$router.push(url)
            this.menuList = p
          }
          // console.log('--------', item.url)
          console.log(this.menuList)
        }
      })
    },
    getCode() {
      this.$network.get('/user-service/user/getWXtoaddUser').then((res) => {
        let domain = ''
        if (
          location.hostname == 'dev-console.jzcrm.com' ||
          location.hostname == 'localhost'
        ) {
          domain = 'https://dev-console.jzcrm.com'
        } else if (location.hostname == 'test-console.jzcrm.com') {
          domain = 'https://test-console.jzcrm.com'
        } else {
          domain = 'https://console.jzcrm.com'
        }
        this.link = `${domain}/#/writeCodeInfo?corpid=${res.data.corpid}&permanent_code=${res.data.permanentcode}`
        this.qrcodeTop()
      })
    },
    qrcodeTop() {
      this.$refs.qrcodeTop.innerHTML = ''
      let qrcodeTop = new QRCode('qrcodeTop', {
        width: 120,
        height: 120,
        text: this.link,
        render: 'canvas',
        colorDark: '#000000',
        colorLight: '#ffffff',
      })
      this.hrefCode = document
        .getElementById('qrcodeTop')
        .getElementsByTagName('canvas')[0]
        .toDataURL('image/png')
      this.$refs.qrcodeTop.title = ''
    },
    processTree(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].typeCode == 'page') {
          data[i].childrenList = null
        } else {
          this.processTree(data[i].childrenList)
        }
      }
      this.leftMenu = JSON.parse(JSON.stringify(data))
    },
    handleSelectHeader(key, keyPath) {
      // console.log(key, keyPath, 'dasdsadsadsad-----')
      this.menuList = []
      this.activeIndex = key

      // let tempUrl = this.leftMenu
      // tempUrl.forEach((list) => {
      //   if (list.url == key) {
      //     let children = list.childrenList[0]
      //     let url =
      //       children.childrenList.length > 0
      //         ? children.childrenList[0].url
      //         : children.url
      //     // console.log(url)
      //     this.$router.push(url)
      //     this.getMenu()
      //   }
      // })
    },
    // handleSelect(key) {
    //   console.log(key)
    //   this.menu = key
    // },
    openAside() {
      this.isCollapse = !this.isCollapse
    },
    handleCommand(command) {
      if (command == 'loginout') {
        this.$network.post('/user-service/user/logout').then((res) => {
          localStorage.removeItem('token')
          window.name = ''
          this.$router.push('/login')
        })
      } else if (command == 'slectEnterprise') {
        this.dialogVisible = true
        this.$network.get('/user-service/user/choseCorp').then((res) => {
          if (res.result) {
            this.items = res.data.userCorpList
            this.phone = res.data.phone
            this.activeId = res.data.corpId
          }
        })
      }
    },
    changeCompany(item) {
      // console.log(item)
      this.$network
        .get('/user-service/user/tovalidateSms', {
          phone: this.phone,
          corpId: item.corpId,
        })
        .then((res) => {
          this.dialogVisible = false
          localStorage.setItem('token', res.data.access_token)
          this.$store.dispatch('getCorpId').then(() => {})
          location.reload()
          this.getMenu()
        })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
  },
  watch: {
    $route: {
      handler(to, from) {
        // console.log(to, from)
        this.activeIndex = to.matched[0].path
        if (to.query.menuFlag) {
          this.showSide = true
          return
        } else {
          this.menu = to.path
          // console.log(this.menu)
        }
        if (this.activeIndex == '/readme' || this.activeIndex == '/dataView') {
          this.showSide = false
        } else {
          this.showSide = true
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
<style lang="less" scoped>
.invitCode {
  .downCode {
    text-align: center !important;
    margin-top: 2px !important;
  }
}
.el-menu-vertical-demo {
  border-right: none;
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    min-width: 0 !important;
    color: #3c4353 !important;
  }
  .el-menu {
    .el-menu-item {
      padding-left: 50px !important;
      height: 40px;
      line-height: 40px;
    }
  }
  .el-menu-item.is-active {
    border-right: 2px solid #4168f6;
    color: #4168f6 !important;
    background: #f4f6fe;
    height: 40px;
    line-height: 40px;
  }
  .edit_wrapper {
    // height: 40px !important;
    // line-height: 40px !important;
    /deep/.el-submenu__title {
      height: 40px !important;
      line-height: 40px !important;
    }
  }
}
.logo {
  text-align: center;
}
.logo_top {
  width: 120px;
  height: 28px;
  margin: 17px 20px;
}
.logo_icon {
  width: 24px;
  height: 28px;
  margin: 17px 20px;
}
.el-header {
  // border-bottom: 1px #d8d8d8 solid;
  min-width: 1200px;
  padding: 0 !important;
  box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.04);
  height: 56px !important;
}
.el-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  &.min_width{
    min-width: 1200px;
  }
}
.sideBar {
  width: 180px;
  overflow-y: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
    // height: 0;
  }
}
.smallBar {
  width: 64px;
  overflow-y: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
    // opacity: 0;
    // display: none;
  }
}
.openSide {
  width: 28px;
  height: 56px;
  position: fixed;
  left: 57px;
  top: 50%;
  z-index: 10;
  cursor: pointer;
}
.hideSide {
  width: 28px;
  height: 56px;
  position: fixed;
  left: 173px;
  top: 50%;
  z-index: 10;
  cursor: pointer;
}
// .main_container{
//   width: 100%;
//   min-height: calc(100vh - 56px);
//   background: #f6f7f9;
//   padding: 16px;
//   -ms-overflow-style: none;
//   overflow: -moz-scrollbars-none;
//   &.npd {
//     padding: 0;
//   }
//   &::-webkit-scrollbar {
//     width: 0 !important;
//   }
//   scrollbar-width: none;
// }
.el-main {
  background: #f6f7f9;
  padding: 16px;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  flex-basis: 0;
  &.npd {
    padding: 0;
  }
  &.home{
    min-width: 850px;
  }
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
}
.header {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 56px;
  position: relative;
  // line-height: 56px;
}
.header-title {
  // float: left;
  text-indent: 20px;
}
.header-tabs-box {
  margin-left: 20px;
  .el-menu-demo {
    height: 55px !important;
    .el-menu-item {
      margin-left: 30px;
      padding: 0;
      height: 55px;
      color: #3c4353;
      &:hover {
        color: #4168f6;
      }
    }
    .el-menu-item.is-active {
      // border-color: #4168f6;
      border-bottom: 2px solid #4168f6;
      color: #4168f6;
    }
  }
}
.header-title img {
  width: 120px;
  vertical-align: middle;
}
.header-user {
  padding-right: 20px;
  position: absolute;
  right: 0;
  // width: 200px;
  display: flex;
  align-items: center;
  .header-user-title {
    margin-right: 19px;
  }
  .headPhoto {
    margin-right: 8px;
    img {
      border-radius: 50%;
    }
    .defautImg {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #4168f6;
      color: #fff;
      text-align: center;
      font-size: 8px;
      line-height: 24px;
    }
    // padding-top: 8px;
  }
  .inlineBlock {
    line-height: 44px;
    margin-right: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100px;
    height: 40px;
  }
  .title_name {
    max-width: 160px;
    height: 40px;
    line-height: 37px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.header-user-exit-btn {
  text-align: center;
  cursor: pointer;
  color: #3c4353;
  &:hover {
    color: #4168f6;
  }
}
.el-menu.el-menu--horizontal {
  height: 58px;
  border-bottom: 0;
}
.companyBox {
  /deep/.el-dialog {
    height: 490px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
      background: #fafbff;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid #f0f2f7;
      padding: 14px 16px;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
        color: #3c4353;
      }
    }
    .el-dialog__body {
      overflow-y: auto;
      height: 400px;
    }
    .selectCompany {
      width: 456px;
      height: 40px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #d9dae4;
      font-size: 14px;
      color: #3c4353;
      margin-bottom: 16px;
      padding-left: 16px;
      line-height: 40px;
      cursor: pointer;
    }
    .bgCompany {
      background: #f4f6fe;
    }
  }
}
</style>
