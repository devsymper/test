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
							<span class="fs-13" style="font-weight: 400!important ;color: orange">
								{{sDoc.currentTitle}}
							</span>
						</v-btn>
					</template>
					<span>Switch document</span>
				</v-tooltip>
			</template>
			<div class="bg-white" style="width: 251px">
				<div>
					<v-icon class="ml-3 fs-16">mdi mdi-account-check-outline</v-icon>
					<span class="fs-13 mt-3 mb-2 ml-4"> Chọn document </span>
				</div>
				<v-autocomplete
					ref="selectDelegateUser"
					:menu-props="{ maxHeight:300, minWidth:251,maxWidth:251, nudgeLeft:8, nudgeBottom:3}"
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
							<span  class="fs-13 ml-1"> {{data.item.title}}</span>
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
		
	}
}
</script>

<style>

</style>