<template>
    <v-menu
        top
        offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                x-small
                icon
                class="float-right d-inline-block cell-options-select"
            >
                <i class="fs-16 mdi mdi-dots-horizontal"></i>
            </v-btn>
        </template>

        <v-list class="dashboard-options">
            <v-list-item 
                class="py-1 "
                v-if="!isView"  
                @click="handleCellAction({action:'clone'})">
                <i class="fs-14 mdi mdi-content-duplicate"></i> <span class="ml-2 fs-13">Nhân bản</span> 
            </v-list-item>
            <v-list-item 
                class="py-1 " 
                v-if="!isView"  
                @click="handleCellAction({action:'copy'})">
                <i class="mdi fs-14 mdi-content-copy "></i> <span class="ml-2 fs-13">Copy</span>
                <span style="position: absolute; right: 8px; font-size: 13px; color: grey; margin-left: 8px">Ctrl+C</span>
            </v-list-item>
            <v-list-item 
                class="py-1 " 
                v-if="!isView"  
                @click="handleCellAction({action:'cut'})">
                <i class="mdi fs-14 mdi-content-cut"></i> <span class="ml-2 fs-13">Cut</span>
                <span style="position: absolute; right: 8px; font-size: 13px; color: grey; margin-left: 8px">Ctrl+X</span>
            </v-list-item>

            <v-list-item 
                class="item-sort" 
                divided
			>
				<v-menu
					bottom
					offset-x
					:close-on-content-click="closeOnContentClick"
				>
					<template v-slot:activator="{ on, attrs }">
						<div 
							v-bind="attrs"
							v-on="on"
							class="menu-item-sort h-100 w-100"
						>
						<i 	class="mdi fs-14 mdi-sort" ></i> <span class="ml-1 fs-13">Sắp xếp</span>
						</div>
						
					</template>
					<div class="sort-content p-2">
						<VuePerfectScrollbar style="max-height: 200px" >
							<div v-for="(item, i) in selectedColumns" :key="i" class="d-flex mt-1 mb-1 mr-2 ml-2">
								<v-tooltip bottom>
									<template v-slot:activator="{ on }">
										<span class="text-ellipsis flex-grow-1" v-on="on" style="max-width: 100px">
											{{item.name}}
										</span>
									</template>
									<span>{{item.name}}</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on }">
										<v-btn 
											x-small
											text-white
											@click="changeItemSortType(item)"
											v-on="on"
											:color="item.sort != 'none' ? 'orange' : 'gray'"
										>
											<span class="text-uppercase text-white" :style="{color: item.sort != 'none' ?'white' : 'black'}">
												{{ item.sort }}
											</span>
										</v-btn>
									</template>
									<span>Click để thay đổi kiểu sort</span>
								</v-tooltip>
							</div>
						</VuePerfectScrollbar>
					
						<div class="d-flex flex-row-reverse mt-2">
							<v-btn color="primary" small @click="applySort"> 
								{{$t('common.apply')}}
							</v-btn>
						</div>
					</div>
				</v-menu>
            </v-list-item>
            <v-list-item 
                class="py-1 " 
                @click="handleCellAction({action:'download-excel'})"
                :class="{
                    'selected-for-sort': sortMode == 'desc'
                }"  >
                <i class="mdi fs-14 mdi-microsoft-excel"></i> <span class="ml-2 fs-13">Xuất excel</span>
            </v-list-item>

            <v-list-item 
                class="py-1 " 
                @click="handleCellAction({action:'print-report'})">
                <i class="mdi fs-14 mdi-printer"></i> <span class="ml-2 fs-13">In báo cáo này</span>
            </v-list-item>
            <v-list-item  
                v-if="!isView"  
                @click="handleCellAction({action:'remove'})" 
                class="py-1 red-item">
                <i class="mdi fs-14 mdi-trash-can-outline"></i> <span class="ml-2 fs-13">Xóa</span>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
	components:{
		VuePerfectScrollbar
	},
    computed: {
        dashboardConfigs(){
            return this.$store.state.dashboard.allDashboard[this.instanceKey].dashboardConfigs;
		},
		selectedColumns(){
			let arr = []
			for(let i in this.cell.rawConfigs.setting){
				arr = arr.concat(this.cell.rawConfigs.setting[i].selectedColums)
			}
			let self = this
			if(arr.length > 0){
				arr.forEach(function(e){
					if(!e.sort){
						self.$set(e, 'sort', 'none')
					}
				})
			}
			return arr
		}
    },
    methods:{
		applySort(){
			this.closeOnContentClick = true
			setTimeout((self) => {
				self.closeOnContentClick = false
			}, 1000, this);
			this.$$evtBus.$emit('bi-report-change-display', {
				id: this.cell.sharedConfigs.cellId,
				type: 'data',
				instanceKey: this.instanceKey
			})
		},
		changeItemSortType(item){
			let value = item.sort == 'none' ? 'asc' : item.sort == 'asc' ? 'desc' : 'none'
			this.$set(item, 'sort', value)
		},
        removeCell(){
            this.$store.commit('dashboard/removeReport', {
                instanceKey: this.instanceKey,
                reportId: this.cell.sharedConfigs.cellId
            });
        },
        cloneReport(){
            let reportId = this.cell.sharedConfigs.cellId;
            let cellConfig = this.dashboardConfigs.allCellConfigs[reportId];
            let currentLayout = this.dashboardConfigs.info.layout[this.dashboardConfigs.info.currentTabPageKey];
            let oldCellLayout = currentLayout.filter((el) => {
                return el.cellId == reportId;
            })[0];

            let cellSize = {
                h: oldCellLayout.h,
                w: oldCellLayout.w,
            };
            this.$store.commit('dashboard/addCellToLayout', {
                instanceKey: this.instanceKey,
                type: cellConfig.sharedConfigs.type,
                cellSize,
                active: true,
                autoSelectedCell: false
            });

            setTimeout((self) => {
                let newCellId = currentLayout[currentLayout.length - 1].i;
                self.$set(self.dashboardConfigs.allCellConfigs[newCellId], 'rawConfigs', _.cloneDeep(cellConfig.rawConfigs));
                this.$store.commit('dashboard/setSelectedCell', {
                    id: newCellId,
                    instanceKey: this.instanceKey
                });
                this.$evtBus.$emit('bi-report-change-display', {
                    id: newCellId,
                    type: 'data',
                    instanceKey: this.instanceKey
                });
            }, 0, this);
        },
        handleCellAction(cmd){
            if(cmd.action == 'remove'){
                this.removeCell();
            }else if(cmd.action == 'sort'){
                // this.sortMode = cmd.value; 
                // if($.isEmptyObject(this.sortColumn)){
                //     this.sortColumn = this.getSortableColumns()[0];
                // }
                // this.refreshReportData();
            }else if(cmd.action == 'sort-column-select'){
                // this.sortColumn = cmd.column;
                // if(!this.sortMode){
                //     this.sortMode = 'asc';
                // }
                // this.refreshReportData();
            }else if(cmd.action == 'clone'){
                this.cloneReport();
            }else if(cmd.action == 'copy'){
                this.$store.commit('dashboard/copyReport', {
                    dashboardConfigs: this.dashboardConfigs,
                    reportId: this.cell.sharedConfigs.cellId,
                    instanceKey: this.instanceKey
                });
            }else if(cmd.action == 'cut'){
                this.$store.commit('dashboard/cutReport', {
                    dashboardConfigs: this.dashboardConfigs,
                    reportId: this.cell.sharedConfigs.cellId,
                    instanceKey: this.instanceKey
                });
            }else if(cmd.action == 'download-excel'){
                // SDashboardEditor.downloadAsExcel(this.cellConfigs.sharedConfigs.cellId);
            }else if(cmd.action == 'print-report'){
                // let headerHTML = this.$refs.cellTitle.outerHTML;
                // this.$refs[this.cellConfigs.sharedConfigs.type].printInnerHTML(headerHTML);
            }
        },
    },
    props: {
        cell: {
            default(){
                return {}
            }
        },
        isView: {
            default(){
                return true
            }
        },
        instanceKey: {
            defaul: ''
        },
    },
    data(){
        return {
            sortMode: '',
			sortColumn: {},
			closeOnContentClick: false
        }
	},
	
}
</script>

<style>
.symper-dashboard-cell .cell-options-select{
    visibility: hidden;
    z-index: 999;
    position: absolute;
    top: 2px;
    right: 2px;
}
.menu-item-sort:hover{
	background-color: #f5f5f5;
}
.sort-content{
	background-color: #ffffff;
	z-index: 10000;
	max-height: 400px;
}
.menu-item-sort{
	height: 30px !important;
	padding-top: 4px;
	padding-left: 16px;
}
.item-sort {
	padding: unset !important;
}
.symper-dashboard-cell .cell-options-select .icon-as-btn{
    background-color: #ececec;
    border-radius: 0px!important;
}

.symper-dashboard-cell:hover .cell-options-select{
    visibility: visible!important;
}
.btn-swap-sort{
	cursor: pointer;
}
</style>