<template>
  <div class="edit_dialog">
    <el-dialog title="预览图片(支持.jpg或.png格式)"
    						:visible.sync="isImg"
               width="736px"
               :before-close="closePop"
               :close-on-click-modal='false'>
				<img v-if="imgUrl" class="imgClass" :src="imgUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>

export default {
	components: {

  },
  props: {
    isImg: {
      type: Boolean,
    },
    imgUrl:{
    	type: String,
    }
  },

  data() {
    return {

    }
  },
  created() {
 
  },
  mounted(){
  	console.log('imgUrl---->>>',this.imgUrl)
  },
  methods: {
  	closePop(){
  		this.$emit('closeYulanPop')
  	},
  },
}
</script>
<style lang="less" scoped>
.imgClass{
	margin: 0 auto;
	height: 100%;
}
.edit_dialog {
		  /deep/.el-dialog {
		  	text-align: center;
		 		position: relative;
		  	/*overflow-y: scroll;*/
		    height: 606px;
		    background: #ffffff;
		    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
		    border-radius: 8px;
		    .el-dialog__header {
		      height: 50px;
		      background: #fafbff;
		      border-radius: 8px 8px 0px 0px;
		      border-bottom: 1px solid #f0f2f7;
		      .el-dialog__title {
		        font-size: 16px;
		        font-weight: 500;
		        color: #3c4353;
		      }
		    }
		    .el-dialog__body {
		  /*    padding: 42px;
		      overflow-y: scroll;*/
		      height: 491px;
		      .el-textarea__inner {
		        width: 634px !important;
		      }
		      .titleAdd {
		        display: inline-block;
		        font-size: 16px;
		        font-weight: 600;
		        margin-left: 8px;
		      }
		      .bottom_form {
		        margin-top: 40px;
		      }
		    }
	}
}
</style>
