<template>
    <div 
        v-show="isShow" 
        class="h-100 w-100 card-history-control"
        :style="positionBox"
    >
        <v-data-table
            :headers="headers"
            :items="dataTable"
            disable-pagination
            fixed-header
            hide-default-footer
            :height="tableHeight"
            dense
            class="fs-13"
            no-data-text="Không có dữ liệu"
            calculate-widths
        >
            <template v-slot:item.userupdate="{ item }">
                <InfoUser :userId="item.userupdate"/>
            </template>
        </v-data-table>
    </div>
</template>
<script>
import { getControlInstanceFromStore } from "./../common/common.js";
import InfoUser from "@/components/myItem/InfoUser.vue";
import { util } from '../../../plugins/util.js';

export default {
    mounted(){
    },
    components: {
        InfoUser
    },
    props: {
        focusingControlName: {
            type: String,
            default: ''
        },
        instance: {
            type: Number,
            default: 0
        },
    },
    watch:{
        focusingControlName(vl){
            if(vl){
                this.computeDataTable();
                setTimeout((self) => {
                    self.tableHeight = util.getComponentSize(self).h;
                }, 10, this);
            }
        }
    },
    data () { 
        return {
            tableHeight: 200,
            isShow:false,
            positionBox:{'top':0,'left':0},
            headers: [
                {text:'Ngày',value:'date'},
                {text:'Người cập nhật',value:'userupdate'},
                {text:'Giá trị trước',value:'beforeValue'},
                {text:'Giá trị sau',value:'afterValue'}
            ],
            dataTable: [],
            controlId:""
        }
    },
 
    
    methods:{
        computeDataTable(){
            let ctrlName = this.focusingControlName;
            let ctrlObj = getControlInstanceFromStore(this.instance, ctrlName);
            let trackChange = this.$store.state.document.detail[this.instance].trackChange;
            let inTable = ctrlObj.inTable;
            let tableControl = (inTable != false) ? getControlInstanceFromStore(this.instance, inTable) : false;
            let hotTable = null, cellMeta, rowId;
            if(tableControl != false){
                hotTable = tableControl.tableInstance.tableInstance;
                cellMeta = hotTable.getSelected();
                if(cellMeta && cellMeta.length > 0){
                    let curRowData = hotTable.getDataAtRow(cellMeta[0][0]);
                    rowId = curRowData[curRowData.length - 2];
                }
            }
            let data = [];
            for(let item of trackChange){
                let info = {
                    date: item.date,
                    userupdate: item.userUpdate,
                };
                for(let ctrl of item.controls){
                    if(inTable != false){
                        if(ctrl.name == inTable){
                            let dataRow = ctrl.data[rowId];
                            for(let child of dataRow){
                                if(child.name == ctrlName){
                                    info.beforeValue = child.data.old;
                                    info.afterValue = child.data.new;
                                    data.push(info);
                                }
                            }
                        }
                    }
                    else{
                        if(ctrl.name == ctrlName){
                            info.beforeValue = ctrl.data.old;
                            info.afterValue = ctrl.data.new;
                            data.push(info);
                        }
                    }
                    
                }
            }
            this.dataTable = data;
        },
        show(el = null){
            this.isShow = true;
            if(el){
                this.calculatorPositionBox(el);
            }
        },
        hide(){
            this.isShow = false;
            this.resetData();
        },
        resetData(){
            // this.dataTable = []
        },
      
        setData(data){
            this.dataTable = data.dataBody;
        },
        calculatorPositionBox(el){
            let autoEL = $(this.$el).detach();
            el.parent().append(autoEL);
            this.positionBox = {'top':el.height()+2+'px','left':'0px'};
        },
       
    }
}
</script>
<style scoped>
    .card-history-control{
        position: absolute;
        top: 0;
        left: 400px;
        z-index: 99999;
        max-width: unset !important;
    }
    .active-row{
        background: #f0f0f0;
    } 
    .card-history-control >>> tbody tr{
        font-size: 13px;
        color: #212529;
    }
    .card-history-control >>> td{
        /* display: flex!important; */
        height: 30px;
        font-size: 13px;
        white-space: nowrap;
    }
    .card-history-control >>> th{
        /* display: flex!important; */
        white-space: nowrap;
    }
    .row-item{
        color: red;
    }

</style>