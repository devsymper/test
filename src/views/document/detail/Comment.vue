<template>
    <div class="wraper-comment" :style="style">
		<div style="display:flex;">
			<span class="mdi mdi-keyboard-backspace" @click="hide"></span>
			<span style="font-size:15px;">{{$t('document.detail.comment.heading')}}</span>
		</div>

		<v-divider></v-divider>
        <div class="comment-content">
            <!-- comment hear -->
        </div>
	</div>
</template>
<script>

export default {

    data () { 
        return {
            style:'transform:translateX(300px)'
        }
    },
 
    
    methods:{
        hide(){
			this.style = 'transform:translateX(300px)'
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
		width: 99%;
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