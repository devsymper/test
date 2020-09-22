<template>
    <div class="wraper-comment" :style="style">
        <div class="comment-content " style="height:100%">
				<!-- <span class="mdi mdi-keyboard-backspace" @click="hide"></span> -->
			<Comment style="margin-left:-12px;margin-right:8px" :showComment="true" :objectIdentifier="objectIdentifierCmt" :objectType="'document'" :height="'100%'" :buttonClose="true" @close-comment="hide" />
        </div>
	</div>
</template>
<script>
import Comment from '@/components/common/comment/Comment.vue'
export default {
	props:{
		objectIdentifier:{
			type: Number,
		}
	},
	watch:{
		objectIdentifier(after){
			debugger
			this.objectIdentifierCmt = after + ""
		}
	},
	components:{
		Comment
	},
    data () { 
        return {
			style:'transform:translateX(300px)',
			objectIdentifierCmt:""
        }
    },
    methods:{
        hide(){
			this.style = 'transform:translateX(300px)'
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
</style>