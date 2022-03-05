<template>
  <div class="edit_dialog">
    <el-dialog title="预览视频(支持.mp4或.avi格式)"
    						:visible.sync="isVideo"
               width="736px"
               :before-close="closeVideo"
               :close-on-click-modal='false'>
               
				<video v-if="videoUrl" class="videoClass" width="100%" height="480" :src="videoUrl" controls="controls" autoplay="autoplay">
					您的浏览器不支持播放视频。
				</video>
				
    </el-dialog>
  </div>
</template>
<script>

export default {
	components: {

  },
  props: {
    isVideo: {
      type: Boolean,
    },
    videoUrl:{
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
  	console.log('videoUrl---->>>',this.videoUrl)
  },
  methods: {
  	closeVideo(){
  		this.$emit('closeYulanVideo')
  	}
  },
}
</script>
<style lang="less" scoped>
.videoClass{
	margin: 0 auto;
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
