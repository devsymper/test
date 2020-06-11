<template>
    <v-card 
    :id="'autocomplete-control-'+key"
    v-show="isShowAutoComplete" 
    class="card-autocomplete" :style="positionBox">
        <v-data-table
        :headers="headers"
        :items="dataTable"
        disable-pagination
        fixed-header
        hide-default-footer
        
        >
        <template v-slot:item="{ item }">
            <tr v-on:click="handleClickRow(item)" class="active-row" v-if="item.active" style="background: #f0f0f0">
                <td v-for="(key,value) in item" :key="key+value" :class="{'d-none':(value == 'active')}">{{ (value != 'active') ? key : '' }}</td>
            </tr>
            <tr v-on:click="handleClickRow(item)" v-else>
                <td v-for="(key,value) in item" :key="key+value" :class="{'d-none':(value == 'active')}">{{ key }}</td>
            </tr>
        </template>
        <template v-slot:no-results v-if="$parent.$options.name == 'submitDocument'">
            <div>
                <v-btn text small @click="openSubForm">Thêm</v-btn>
            </div>
        </template>
        </v-data-table>
    </v-card>
</template>
<script>
export default {
    data () { 
        return {
            key:Date.now(),
            isShowAutoComplete:false,
            positionBox:{'top':0,'left':0},
            indexActive:0,
            search: '',
            headers: [],
            dataTable: [],
            alias:''
        }
    },
    created(){
        let thisCpn = this;
        this.$evtBus.$on('document-submit-autocomplete-input-change',e=>{
            console.log(e);
            if(thisCpn.dataTable.length > 0){
                if(e.e.keyCode == 38){    //len
                
                    if(thisCpn.indexActive == 0){
                        return false;
                    }
                    Vue.set(thisCpn.dataTable[thisCpn.indexActive], 'active', false);
                    thisCpn.indexActive--;
                    Vue.set(thisCpn.dataTable[thisCpn.indexActive], 'active', true);
                    
                }   
                else if(e.e.keyCode == 40){
                    if(thisCpn.indexActive == thisCpn.dataTable.length - 1){
                        return false;
                    }
                    Vue.set(thisCpn.dataTable[thisCpn.indexActive], 'active', false);
                    thisCpn.indexActive++;
                    Vue.set(thisCpn.dataTable[thisCpn.indexActive], 'active', true);
                }
                else if(e.e.keyCode == 13){
                    let rowActive = thisCpn.dataTable[thisCpn.indexActive];
                    thisCpn.handleClickRow(rowActive,e.cell, e.tableInstance);
                }
            }
            
        });
    },
    
    methods:{
        show(e){
            this.isShowAutoComplete = true;
            this.calculatorPositionBox(e);
            this.search = $(e.target).val();
        },
        hide(){
            this.isShowAutoComplete = false;
        },
        setData(data){
            this.headers = data.headers;
            this.dataTable = data.dataBody;
        },
        calculatorPositionBox(e){
            // nếu autocomplete từ cell của handsontable  
            if($(e.target).is('.handsontableInput')){
                this.positionBox = {'top':$(e.target).offset().top + 25 +'px','left':$(e.target).offset().left - $(e.target).width()+'px'};
            }
            //nêu là ngoài bảng
            else{
                $(e.target).parent().append(this.$el);
                this.positionBox = {'top':'20px','left':'0px'};
            }
            
            
        },
        setSearch(query){
            this.search = query;
        },
        setAliasControl(aliasControl){
            this.alias = aliasControl;
        },
        handleClickRow(item, cellTable, tableInstance){
            let value = item[this.alias];
            this.$emit('after-select-row',{value:value,cell:cellTable, tableInstance:tableInstance});
            this.hide();
        },
        openSubForm(){
            this.hide();
            $('.autocompleting').removeClass('autocompleting');
            this.$emit('open-sub-form');

        }
    }
}
</script>
<style scoped>
    .card-autocomplete{
        position: absolute;
        top: 0;
        left: 100px;
        z-index: 9999;
    }
    .active-row{
        background: #f0f0f0;
    }
</style>