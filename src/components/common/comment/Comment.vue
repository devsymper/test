<template>
	<div class="symper-comment">
		<v-card 
			 v-show="showComment"
			:width="widthComment"
			:height="heightComment"
			:style="{top:top+'px',left:left+'px'}"
		>
			<v-toolbar
				flat
			>
				<v-toolbar-title>Bình luận</v-toolbar-title>
					<v-btn icon>
					<v-icon>mdi-comment-text-outline</v-icon>
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn icon @click="hide()">
					<v-icon>mdi-close</v-icon>
				</v-btn>
					<!-- <TargetArea :showTargetArea="showTargetArea" :content="contentTargetArea" />  -->
				<template v-slot:extension>
				<v-tabs
					v-model="tab"
					align-with-title
				>
					<v-tabs-slider color="yellow"></v-tabs-slider>
					<v-tab v-for="item in itemsTab" :key="item.value">
						<span > {{ item.title }} </span> <v-icon style='padding-left:4px'>{{item.icon}}</v-icon>
					</v-tab>
				</v-tabs>
				<v-spacer></v-spacer>

				<v-text-field
					solo
					v-if="showInput"
					label="Append"
					append-icon="mdi-close"
					@click:append="clickClose"
					></v-text-field>
				<v-btn v-else icon>
					<v-icon  @click="clickSearch">mdi-magnify</v-icon>
				</v-btn>
				</template>
			</v-toolbar>
			<v-tabs-items v-model="tab">
				<v-tab-item
				v-for="item in itemsTab"
				:key="item.value"
				>
				<v-card flat>
					<!-- <v-card-text v-text="text"></v-card-text> -->
					<list-comment />
				</v-card>
				</v-tab-item>
				 <div class="input-comment">
					 <v-avatar>
						<img
						src="https://cdn.vuetifyjs.com/images/john.jpg"
						alt="John"
						>
					</v-avatar>
					 <v-text-field
						filled
						clear-icon="mdi-close-circle"
						clearable
						label="Message"
						type="text"
						v-on:keyup.50="tagUser($event)"
						>
							<template slot="append">
								<v-icon>mdi-attachment</v-icon>
								<v-icon>mdi-send-circle-outline</v-icon>
							</template>
						</v-text-field>
				 </div>
			</v-tabs-items>
			</v-card>
	</div>
</template>

<script>
import TargetArea from './TargetArea.vue';
import ListComment from './ListComment.vue'
export default {
	components:{
		TargetArea,
		ListComment
	},
	created(){
		
	},
	mounted(){
		if(this.contentTargetArea != ''){
			this.showTargetArea = true
		}
	},
	 data() {
        return {
            tab: null,
			showInput:false,
			showSpan:true,
			showMagnity:true,
			showTargetArea:false,
			itemsTab: [
				{
					title:'Comment',
					value:'comment',
					icon: 'mdi-comment-processing-outline'
				},
				{
					title: 'Resolve',
					value:'resolve',
					icon: 'mdi-comment-check'
				}
			],
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        };
    },
	 props: {
        showComment: {
            type: Boolean,
            default: false
		},
        widthComment: {
            type: String,
            default: "450px"
		},
        heightComment: {
            type: String,
            default: "1000px"
		},
		top:{
			type: Number,
			default:0
		},
		left:{
			type: Number,
			default:600
		},
		contentTargetArea:{
			type: String,
			default:''
		},
	},
	methods:{
		clickSearch(){
      		this.showInput = true
  		},
		clickClose(){
			this.showInput = false
		},
		hide(){
			console.log('hide');
			this.showComment = false
		},
		tagUser(event){
			console.log(event);
		}
	}
}
</script>

<style scoped>
.symper-comment{
	font:13px roboto
}
.symper-comment >>> .target-area{
	width: 100%;
}
.symper-comment >>> .input-comment{
	display: flex;
	width: 400px;
	margin-left: auto;
	margin-right:auto;
}
</style>