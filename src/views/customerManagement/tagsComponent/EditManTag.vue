<template>
            <div class="tabBox">
              <span class="addBtn pointer" @click="addTag(index)"
                >+添加</span
              >
              <span class="perchInput" v-if="showInput == index && isShow">
                <el-input
                  class="addInput"
                  v-model.trim="tagName"
                  placeholder="输入后按回车完成"
                  @keyup.enter.native="onSubmit(item)"
                  maxlength="30"
                ></el-input>
              </span>
              	<span
                class="creatTag"
                v-for="(list, index) in personList"
                :key="index"
                v-show="list.name"
                >{{ list.name }}<div class="tabXBox">ｘ</div></span
              >
            </div>   
</template>
<script>
import Draggable from 'vuedraggable'
export default {
  components: { Draggable },
   props: {
    personList: {
      type: Array,
    },
  },
  data() {
    return {
		
    }
  },
  created() {

  },
  mounted(){
  	console.log(this.personList)
  },
  watch: {},
  methods: {

  },
}
</script>
<style lang="less" scoped>
.tabBox{
	height: 450px;
	/*overflow-y: scroll;*/
}
.addBtn{
	width: 78px;
	height: 28px;
	background: #FFFFFF;
	border: 1px solid #D9DAE4;
	border-radius: 4px;
	text-align: center;
	line-height: 28px;
	display: block;
	float: left;
	margin-left: 20px;
	margin-bottom: 20px;
}
.creatTag{
	padding-left: 15px;
	padding-right: 35px;
	height: 28px;
	background: #FAFBFF;
	border: 1px solid #D9DAE4;
	border-radius: 4px;
	text-align: center;
	line-height: 28px;
	display: block;
	float: left;
	margin-left: 20px;
	margin-bottom: 20px;
	position: relative;
	color: #838A9D;
}
.tabXBox{
	position: absolute;
    top: -2px;
    right: 3px;
    height: 28px;
    line-height: 28px;
    width: 28px;
}
</style>
