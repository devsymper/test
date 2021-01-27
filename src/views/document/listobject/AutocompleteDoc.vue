<template>
	<div>
		 <v-menu 
			v-model="showDelegatedUser"
			:offset-y="true"
			nudge-bottom='0'
			:close-on-content-click="false"
		>
			<template v-slot:activator="{ on: menu, attrs }">
				<v-tooltip bottom z-index="200">
					<template v-slot:activator="{ on: tooltip }">
						<v-btn
							x-small
							text
							v-bind="attrs"
							depressed
							v-on="{ ...tooltip, ...menu }">
							<div class=" title-document-autocomplete fs-13" style="font-weight: 400!important ;color: orange">
								{{sDoc.currentTitle == "" ? param : sDoc.currentTitle}}
							</div>
						</v-btn>
					</template>
					<span>Switch document</span>
				</v-tooltip>
			</template>
			<div class="bg-white" style='width: 270px'>
				<div class="mt-1 mb-1">
					<v-icon class="ml-3 fs-15">mdi-file-document-edit-outline</v-icon>
					<span class="fs-13 mt-3 mb-2 ml-4"> Chọn document </span>
				</div>
				<v-autocomplete
					ref="selectDelegateUser"
					:menu-props="{ maxHeight:300,width:270, minWidth:270,maxWidth:270, nudgeLeft:8, nudgeBottom:3}"
					class="mr-2 ml-2"
					full-width
					solo
					:items="sAllDoc"
					background-color="grey lighten-4"
					flat
					dense
					color="blue-grey lighten-2"
					item-text="title"
					return-object
					@change="changeDocument"
				>
					<template v-slot:append>
						<v-icon style= "font-size:18px;">mdi mdi-magnify</v-icon>
					</template>
					<template v-slot:label>
						<span class="fs-13">{{$t('common.search')}}</span>
					</template>
					<template v-slot:item="data">
						<div class="fs-13 py-1" >
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<div 
										v-bind="attrs"
										v-on="on" 
										class="fs-13 ml-1 title-document-switch"
									> 
										{{data.item.title}}
									</div>
								</template>
								<span>{{data.item.title}}</span>
							</v-tooltip>
						</div>
					</template>
				</v-autocomplete>
				</div>
		</v-menu>
	</div>

</template>

<script>
import {documentApi} from '@/api/Document'
export default {
	computed:{
		sDoc() {
            return this.$store.state.document;
		},
		sAllDoc(){
			let arr = []
			for(let i in this.$store.state.document.listAllDocument){
				arr.push(this.$store.state.document.listAllDocument[i])
			}
			return arr
		},
		id(){
			return this.$route.params.id
		},
		param(){
			return this.$store.state.appConfig.param.title
		}
	},
	data(){
		return {
			showDelegatedUser: '',
		}
	},
	methods:{
		changeDocument(value){
			let id = value.id
			this.$store.commit('document/setCurrentTitle',value.title)
			this.$router.push('/documents/'+id+'/objects')
			this.$emit('change',id )
		}
	},
	created(){
		this.$store.dispatch('document/setListDocuments')
	},
	watch:{
		id(val){
			let self = this
			if(val){
				this.sAllDoc.forEach(function(e){
					if(e.id == val){
						self.$store.commit('document/setCurrentTitle',e.title)
					}
				})
			}
			
		},
		param(val){
			if(val){
				this.$store.commit('document/setCurrentTitle',val)
			}
		}
	}
}
</script>

<style>
.title-document-autocomplete{
	white-space: nowrap; 
	max-width: 250px; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
.v-input__control input {
	font-size: 13px !important
}
.title-document-switch{
	white-space: nowrap; 
	width: 215px; 
	overflow: hidden;
	text-overflow: ellipsis; 
}

</style>