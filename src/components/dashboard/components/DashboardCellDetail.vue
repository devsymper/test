<template>
    <div class="d-flex flex-column ml-1">
       <div class="d-flex border-bottom-1 w-100 align-items-center" style="height: 30px">
            <v-btn icon tile x-small class="mt-1" @click="backToDashboard"> 
                <v-icon x-small>
					mdi-chevron-double-left
                </v-icon>
            </v-btn>
            <div class="flex-grow-1 d-flex border-left-1 ml-4">
                <div class="mx-2 mt-2">
                     Chi tiết 
                </div>
                <div class="mt-2">
                    <span class="text-uppercase" style="color: orange">
                         {{dashboardTitle}}
                    </span>
                </div>
            </div>
            <v-btn icon tile x-small class="mt-1 mr-1" @click="print"> 
                <v-icon x-small>
                    mdi-printer
                </v-icon>
            </v-btn>
            <v-btn icon tile x-small class="mt-1 mr-1" @click="exportExcel"> 
                <v-icon x-small>
                    mdi-microsoft-excel
                </v-icon>
            </v-btn>
       </div>
        <div class="d-flex w-100 h-100 mt-1">
            <div style="width: 50%;">
                <DashboardCell 
                    :layoutItem="item"
                    :instanceKey="instanceKey"
                    :cellConfigs="dashboardConfig.allCellConfigs[item.cellId]"
                />
            </div>
            <div style="width: 50%">
                <TableDataAgGrid 
                    :columnDefs="columnDefs"
                    :rowData="rowData"
                />
            </div>
        </div>
    </div>
</template>

<script>
import DashboardCell from "@/components/dashboard/components/DashboardCell.vue";
import TableDataAgGrid from "@/components/common/agDataTable/TableDataAgGrid"
export default {
    data(){
        return {
        }
    },
    computed:{
        dashboardTitle(){
            return this.dashboardConfig.allCellConfigs[this.item.cellId].viewConfigs.displayOptions.symperTitle.text
        },
        rowData(){
            return this.dashboardConfig.allCellConfigs[this.item.cellId].sharedConfigs.data
        },
        columnDefs(){
            let arr = []
            let rows = this.dashboardConfig.allCellConfigs[this.item.cellId].sharedConfigs.data
            if(rows.length > 0){
                for(let i in rows[0]){
                    let obj = {
                        headerName: i,
                        field: i
                    }
                    arr.push(obj)
                }
            }
            return arr
        }
    },
    props:{
        item:{
            type: Object,
            default(){
                return{}
            }
        },
        dashboardConfig:{
            type: Object,
            default(){
                return{}
            }
        },
        instanceKey: {
            defaul: ''
        },
    },
    components:{
        DashboardCell,
        TableDataAgGrid
    },
    methods:{
        backToDashboard(){
            this.$emit('back-to-dashboard')
        },
        print(){

        },
        exportExcel(){

        }
    }
}
</script>

<style>

</style>