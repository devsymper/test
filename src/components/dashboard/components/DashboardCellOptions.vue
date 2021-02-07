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
                class="py-1 " 
                divided
                @click="handleCellAction({action:'sort', value: 'asc'})" 
                :class="{
                    'selected-for-sort': sortMode == 'asc'
                }" >
                <i class="mdi fs-14 mdi-arrow-up"></i> <span class="ml-2 fs-13">Sắp xếp tăng dần</span>
            </v-list-item>

            <v-list-item 
                class="py-1 " 
                @click="handleCellAction({action:'sort', value: 'desc'})"
                :class="{
                    'selected-for-sort': sortMode == 'desc'
                }"  >
                <i class="mdi fs-14 mdi-arrow-down"></i> <span class="ml-2 fs-13">Sắp xếp giảm dần</span>
            </v-list-item>

            <!-- <v-list-item 
 class="py-1 ">
                <el-dropdown class="w-100 " @command="handleCellAction" size="mini" placement="bottom-end">
                    <span class="w-100 fs-13">
                        <i class="el-icon-sort" style="line-height: inherit;"></i>
                        Sort by
                        <i  class="el-icon-arrow-right float-right" style="line-height: inherit; margin-right:-8px"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <v-list-item 
 class="py-1 " 
                            v-for="(column, idx) in getSortableColumns()" 
                            :key="idx" 
                            :command="{action: 'sort-column-select', column:column}"
                            :class="{
                                'selected-for-sort': column.name == sortColumn.name
                            }" >
                            {{column.as}}
                        </v-list-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </v-list-item> -->
            
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
export default {
    computed: {
        dashboardConfigs(){
            return this.$store.state.dashboard.allDashboard[this.instanceKey].dashboardConfigs;
        },
    },
    methods: {
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
            sortColumn: {}
        }
    }
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
.symper-dashboard-cell .cell-options-select .icon-as-btn{
    background-color: #ececec;
    border-radius: 0px!important;
}

.symper-dashboard-cell:hover .cell-options-select{
    visibility: visible!important;
}

</style>