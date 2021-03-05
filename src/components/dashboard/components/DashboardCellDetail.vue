<template>
    <v-dialog
        v-model="showDialog"
        persistent
        class="h-100 w-100"
        content-class="overflow-hidden"
    >

    <div class="d-flex flex-column ml-1 w-100 h-100 bg-white overflow-hidden" style="height: 700px">
        <div class="d-flex border-bottom-1 w-100 align-items-center" style="height: 30px">
                <div class="flex-grow-1 d-flex border-left-1  fs-15">
                    <div class="mx-2 mt-1">
                        Chi tiết 
                    </div>
                    <div class="mt-1">
                        <span class="text-uppercase" style="color: orange">
                            {{dashboardTitle}}
                        </span>
                    </div>
                </div>
                <v-btn icon tile small class=" mr-1" @click="print"> 
                    <v-icon small>
                        mdi-printer
                    </v-icon>
                </v-btn>
                <v-btn icon tile small class="mr-1" @click="exportExcel"> 
                    <v-icon small>
                        mdi-microsoft-excel
                    </v-icon>
                </v-btn>
                <v-btn icon tile small class="mr-1" @click="hide"> 
                    <v-icon small>
                        mdi-close
                    </v-icon>
                </v-btn>
        </div>
            <div class="d-flex w-100 h-100 mt-1">
                <div style="width: 50%;">
                    <DashboardCell 
                        :layoutItem="item"
                        ref="dashboardCell"
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
    </v-dialog>
</template>

<script>
import DashboardCell from "@/components/dashboard/components/DashboardCell.vue";
import TableDataAgGrid from "@/components/common/agDataTable/TableDataAgGrid"
export default {
    data(){
        return {
            showDialog: false,
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
           this.$refs.dashboardCell.handlePrintReport()

        },
        exportExcel(){
            this.$emit('download-excel')
        },
        show(){
            this.showDialog = true
        },
        hide(){
            this.showDialog = false
        }
    }
}
</script>

<style>

</style>