<template>
    <div style="border-left: 1px solid #dedede;padding-left: 12px;" class="wraper-comment" :style="style">
        <div class="comment-task" style="height:100%">
			<Comment style="margin-left:-12px;margin-right:8px;" :showComment="true"  :objectIdentifier="objectIdentifier" :objectType="objectType!=''?objectType:'task'" :height="'90%'" :buttonClose="true" @close-comment="hide" />
        </div>
	</div>
</template>
<script>
import Comment from '@/components/common/comment/Comment.vue'
export default {
	props:{
		objectIdentifier:{
			type: String,
		},
		objectType:{
			type:String,
			default:""
		}
	},
	watch:{
		"objectIdentifier":function(newVl){
			this.objectIdentifier=newVl
		}
	},
	components:{
		Comment
	},
    data () { 
        return {
			style:'transform:translateX(400px)',
        }
    },
    methods:{
        hide(){
			this.style = 'transform:translateX(400px)'
			this.$emit('close-comment')
		},
		show(){
            this.style = 'transform:translateX(0px)'
		},
    }
}
</script>
<style scoped>
    .wraper-comment{
		position: absolute;
		top: 0;
		right: 0;
		width: 400px;
		height: 100%;
		background: white;
		z-index: 9999;
		padding: 12px 6px 6px 11px;
		transition: all ease-in-out 250ms;
	}
	.wraper-comment .mdi-keyboard-backspace{
		font-size: 15px;
		cursor: pointer;
		margin-right: 8px;
	}
	.wraper-comment >>> .comment-task .v-window{
	    height: calc(100% - 110px);
	}
	.wraper-comment >>> .comment-task .input-comment{
		/* position: unset;
		bottom: unset; */
	}
</style>