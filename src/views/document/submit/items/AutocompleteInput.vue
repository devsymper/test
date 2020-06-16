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
        dense
        calculate-widths
        
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
        $(document).on('keyup',function(e){
            if(thisCpn.dataTable != undefined && thisCpn.dataTable.length > 0){
                console.log(e.keyCode);
                
                if(e.keyCode == 38){    //len
                
                    if(thisCpn.indexActive == 0){
                        return false;
                    }
                    Vue.set(thisCpn.dataTable[thisCpn.indexActive], 'active', false);
                    thisCpn.indexActive--;
                    Vue.set(thisCpn.dataTable[thisCpn.indexActive], 'active', true);
                    
                }   
                else if(e.keyCode == 40){
                    if(thisCpn.indexActive == thisCpn.dataTable.length - 1){
                        return false;
                    }
                    Vue.set(thisCpn.dataTable[thisCpn.indexActive], 'active', false);
                    thisCpn.indexActive++;
                    Vue.set(thisCpn.dataTable[thisCpn.indexActive], 'active', true);
                }
                else if(e.keyCode == 13){
                    let rowActive = thisCpn.dataTable[thisCpn.indexActive];
                    thisCpn.handleClickRow(rowActive);
                }
            }
            
        })
    
    },
    
    methods:{
        show(e){
            this.isShowAutoComplete = true;
            this.calculatorPositionBox(e);
            // this.search = $(e.target).val();
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
            if($(e.target).closest('.handsontable').length > 0){
                let autoEL = $(this.$el).detach();
                $(e.target).closest('.wrap-table').append(autoEL);
                let edtos = $(e.target).offset();
                if(!$(e.target).is('.handsontableInput')){
                    edtos = $(e.target).closest('td.htAutocomplete.current.highlight').offset();
                }
                
                let tbcos = $(e.target).closest('.wrap-table').find('[s-control-type="table"]').offset();
                this.positionBox = {'top':edtos.top - tbcos.top + $(e.target).height() +'px','left':edtos.left - tbcos.left+'px'};
            }
            //nêu là ngoài bảng
            else{
                let autoEL = $(this.$el).detach();
                $(e.target).parent().append(autoEL);
                this.positionBox = {'top':'20px','left':'0px'};
            }
            console.log(e);
            
            
            
        },
        setSearch(query){
            this.search = query;
        },
        setAliasControl(aliasControl){
            this.alias = aliasControl;
        },
        handleClickRow(item){
            console.log(this.alias);
            console.log(item);
            
            let value = ""
            if(item.hasOwnProperty(this.alias)){
                value = item[this.alias];
            }
            else if(item.hasOwnProperty('column1')){
                value = item['column1'];
            }
            this.$emit('after-select-row',{value:value});
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
        z-index: 99999;
        max-width: unset !important;
    }
    .active-row{
        background: #f0f0f0;
    } 
    .card-autocomplete >>> .text-start.sortable{
        display: flex!important;
    }

</style>