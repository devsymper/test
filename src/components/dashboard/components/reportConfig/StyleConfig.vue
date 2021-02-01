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
		<preloader 
			v-if="loadding"
			style="height:100px!important;width:185px"
			class="mx-auto"
		/>
		<VuePerfectScrollbar v-else style="height:calc(100% - 44px)">
			<template>
				<v-expansion-panels
					:multiple="true"
					:hover="true"
					:accordion="true"
					:focusable="true"
					:flat="true"
					v-model="openPanel"
					class="sym-small-size"
					style="overflow:hidden"
				>
					<v-expansion-panel
						v-for="(groupData, key) in styleConfig"
						:key="key"
						v-show="groupData.show"
					>
						<v-expansion-panel-header ><span class="fs-13">{{groupData.label}}</span> </v-expansion-panel-header>
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
import DashboardStyleConfig from 'worker-loader!@/worker/dashboard/dashboard/DashboardStyleConfig.Worker.js';
export default {
	components:{
		VuePerfectScrollbar,
		FormTpl,
	},
	props:{
		instanceKey:{
			default: null
		}
	},
	computed:{
		storeDashboard(){
			return this.$store.state.dashboard;
		},
		styleConfig(){
			return this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs.rawConfigs.style;
		}
	},
	data(){
		return{
			dashboardStyleConfig:null,
			openPanel:[],
			loadding:false,
		}
	},
	methods:{
		onSearch(vl){
			if(this.delayTimer){
                clearTimeout(this.delayTimer);
            }
            this.delayTimer = setTimeout((self) => {
                this.loadding = true;
				if (!vl) {
					self.openPanel = [];
					self.loadding = false;
                }else{
					self.setOpenPanelStyleConfig();
				}
                self.dashboardStyleConfig.postMessage({
                    action: 'searchStyleConfig',
                    data:{
                        styleConfig: self.styleConfig,
                        vl:vl
                    }
                });
            }, 300,this);
		},   
		setOpenPanelStyleConfig(){
			this.openPanel = [];
			for (let i = 0; i < Object.keys(this.styleConfig).length; i++) {
				this.openPanel.push(i);
			}
			setTimeout((self) => {
				self.loadding = false;
			}, 100,this);
		},
		searchStyleConfigAfter(data){
			this.styleConfig = data.styleConfig;
		},
		listenFromWorker(){
            let self = this;
            this.dashboardStyleConfig.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
        },
	},
	created(){
        this.dashboardStyleConfig = new DashboardStyleConfig();
        this.listenFromWorker();
    }

}
</script>

<style>

</style>