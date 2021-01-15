<template>
	<div class="w-100 h-100">
		<v-text-field
            v-on:input="onSearch($event)"
            class="d-inline-block pa-2 sym-small-size"
            single-line
            append-icon="mdi-magnify"
            outlined
            hide-details
            dense
            flat
            label="Search"
            :placeholder="$t('common.search')"
            style="width: inherit"
        ></v-text-field>
		<VuePerfectScrollbar style="height:calc(100% - 44px)">
			<template>
				<v-expansion-panels
					:multiple="true"
					:hover="true"
					:accordion="true"
					:focusable="true"
					:flat="true"
					class="sym-small-size"
				>
					<v-expansion-panel
						v-for="(groupData, key) in styleConfig"
						:key="key"
					>
						<v-expansion-panel-header>{{groupData.label}}</v-expansion-panel-header>
						<v-expansion-panel-content>
							<form-tpl
								:allInputs="groupData.children"
							></form-tpl>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</template>
		</VuePerfectScrollbar>
	</div>
	
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FormTpl from "@/components/common/FormTpl.vue";

export default {
	components:{
		VuePerfectScrollbar,
		FormTpl
	},
	computed:{
		styleConfig(){
			return {"headerFormat":{"label":"Header Style","name":"headerFormat","show":true,"children":{"fontColor":{"title":"Font Corlor","type":"color","default":"#344750","value":"#344750","name":"fontColor"},"textSize":{"title":"Text Size","type":"number","default":"13","value":"13","name":"textSize"},"bgColor":{"title":"Background Corlor","type":"color","default":"#ffffff","value":"#ffffff","name":"bgColor"},"tableColumnWidthMode":{"title":"Column width mode","type":"select","default":"auto","options":[{"value":"auto","text":"Auto"},{"value":"fitData","text":"Fit data only"},{"value":"fitCell","text":"Fit cell width"},{"value":"fitDataAndHeader","text":"Fit data and header"}],"value":"fitDataAndHeader","name":"tableColumnWidthMode"},"borderWidth":{"title":"Border Width","type":"number","default":0,"value":0,"name":"borderWidth"},"borderColor":{"title":"Border Corlor","type":"color","default":"#000000","value":"#000000","name":"borderColor"}}},"cellFormat":{"label":"Row data Style","name":"cellFormat","show":true,"children":{"verticalLine":{"title":"Vertical line","type":"switch","default":false,"value":false,"name":"verticalLine"},"fontColor":{"title":"Font Corlor","type":"color","default":"#344750","value":"#344750","name":"fontColor"},"textSize":{"title":"Text Size","type":"number","default":"13","value":"13","name":"textSize"},"borderBottomWidth":{"title":"Border Width","type":"number","default":1,"value":1,"name":"borderBottomWidth"},"borderBottomColor":{"title":"Border Corlor","type":"color","default":"#ededed","value":"#ededed","name":"borderBottomColor"},"zeroValueDisplay":{"title":"Zero value display","type":"select","default":"-","options":[{"value":"original","text":"Original"},{"value":"-","text":"-"},{"value":"blank","text":"Blank"}],"value":"-","name":"zeroValueDisplay"},"tooltipDecimalNumber":{"title":"Decimal number","type":"number","default":2,"value":2,"name":"tooltipDecimalNumber"}}},"total":{"label":"Total","name":"total","show":true,"children":{"verticalLine":{"title":"Vertical line","type":"switch","default":false,"value":false,"name":"verticalLine"},"fontColor":{"title":"Font Corlor","type":"color","default":"#344750","value":"#344750","name":"fontColor"},"textSize":{"title":"Text Size","type":"number","default":"13","value":"13","name":"textSize"},"bgColor":{"title":"Background Corlor","type":"color","default":"#ffffff","value":"#dbdbdb","name":"bgColor"}}},"general":{"label":"General","name":"general","show":true,"children":{"fontFamily":{"title":"Font family","type":"select","default":"roboto","options":[{"value":"roboto","text":"Roboto"}],"value":"roboto","name":"fontFamily"},"bgColor":{"title":"Background Corlor","type":"color","default":"#ffffff","value":"#ffffff","name":"bgColor"},"borderWidth":{"title":"Border Width","type":"number","default":0,"value":1,"name":"borderWidth"},"borderColor":{"title":"Border Corlor","type":"color","default":"#000000","value":"#e5e5e5","name":"borderColor"}}}}
		}	// return this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs.rawConfigs.style;
	},
	data(){
		return{

		}
	},
	methods:{
		onSearch(vl){

		}
	},
	created(){

	}

}
</script>

<style>

</style>