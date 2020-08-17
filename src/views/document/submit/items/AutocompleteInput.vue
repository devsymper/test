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
        :hide-default-header="isHideHeader"
        dense
        no-data-text="Không có dữ liệu"
        calculate-widths
        
        >
        <template v-slot:item="{ item }">
            <tr @click="handleClickRow(item)" class="active-row" v-if="item.active" style="background: #f0f0f0">
                <td v-for="(key,value) in item" :key="key+value" :class="{'d-none':(value == 'active')}">{{ (value != 'active') ? key : '' }}</td>
            </tr>
            <tr @click="handleClickRow(item)" v-else>
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
    props: {
        tableWrapper: {
            default: null
        }
    },
    data () { 
        return {
            key:Date.now(),
            isShowAutoComplete:false,
            positionBox:{'top':0,'left':0},
            indexActive:0,
            search: '',
            headers: [],
            dataTable: [],
            alias:'',
            curInput:null,
            isHideHeader:false
        }
    },
    created(){
        
    
    },
    
    methods:{
        show(e){
            this.isShowAutoComplete = true;
            this.calculatorPositionBox(e);
            let thisCpn = this;
            this.curInput.off('keydown');
            this.curInput.on('keydown',function(e){
                if(thisCpn.dataTable != undefined && thisCpn.dataTable.length > 0){
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
                        thisCpn.handleClickRow(rowActive,true);
                    }
                }
                
        })
            // this.search = $(e.target).val();
        },
        hide(){
            this.isShowAutoComplete = false;
            this.resetData();
        },
        resetData(){
            this.headers = []
            this.dataTable = []
        },
        isShow(){
            return this.isShowAutoComplete;
        },
        setData(data){
            this.showHeader();
            this.headers = data.headers;
            this.dataTable = data.dataBody;
            this.indexActive = 0;
        },
        showHeader(){
            this.isHideHeader = false;
        },
        hideHeader(){
            this.isHideHeader = true;
        },
        calculatorPositionBox(e){
            // nếu autocomplete từ cell của handsontable  
            if(e.hasOwnProperty('curTarget')){
                this.curInput = $(e.curTarget);
                let autoEL = $(this.$el).detach();
                $(e.curTarget).closest('.wrap-table').append(autoEL);
                let edtos = $(e.curTarget).offset();
                if(!$(e.curTarget).is('.handsontableInput')){
                    edtos = $(e.curTarget).closest('td.htAutocomplete.current.highlight').offset();
                }
                if($(e.curTarget).is('div.select-cell')){
                    edtos = $(e.curTarget).parent().offset();
                }
                if($(e.curTarget).is('div.select-cell .select-chervon-bottom')){
                    edtos = $(e.curTarget).parent().parent().offset();
                }
                console.log(e); 
                
                let tbcos = $(e.curTarget).closest('.wrap-table').find('[s-control-type="table"]').offset();
                this.positionBox = {'top':edtos.top - tbcos.top + $(e.curTarget).height() +'px','left':edtos.left - tbcos.left+'px'};
            }
            //nêu là ngoài bảng
            else{
                this.curInput = $(e.target);
                let autoEL = $(this.$el).detach();
                $(e.target).parent().append(autoEL);
                this.positionBox = {'top':'26px','left':'0px'};
            }
        },
        setSearch(query){
            this.search = query;
        },
        setAliasControl(aliasControl){
            this.alias = aliasControl;
        },
        handleClickRow(item,fromEnterKey = false){
            this.curInput.off('keydown');
            let value = ""
            if(item.hasOwnProperty(this.alias)){
                value = item[this.alias];
            }
            else if(item.hasOwnProperty('column1')){
                value = item['column1'];
            }
            this.$emit('after-select-row',{value:value,fromEnterKey:fromEnterKey});
            this.dataTable = []
            this.hide();
        },
        openSubForm(){
            this.hide();
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
 
    .card-autocomplete >>> td{
        /* display: flex!important; */
        white-space: nowrap;
    }
    .card-autocomplete >>> th{
        /* display: flex!important; */
        white-space: nowrap;
    }

</style>