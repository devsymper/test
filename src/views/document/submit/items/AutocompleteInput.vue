<template>
    <v-card 
    :id="'autocomplete-control-'+key"
    v-show="isShowAutoComplete" 
    class="card-autocomplete" :style="positionBox">
        <div class="search-data-input">
            <input v-model="search" type="text">
        </div>
        <v-data-table
        :headers="headers"
        :items="dataTable"
        :search="search"
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
                <v-btn text small @click="openSubForm">{{$t('common.add')}}</v-btn>
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
            isHideHeader:false,
            search: '',
            inputType:false
        }
    },
   
    methods:{
       
        show(e){
            this.isShowAutoComplete = true;
            this.calculatorPositionBox(e);
            this.setEvent();
            // this.search = $(e.target).val();
        },
        setEvent(){
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
            if(data.headers == undefined){
                this.dataTable = []
                return
            }
            if(data.headers.length > 0)
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
        setTypeInput(controlType=false){
            this.inputType = controlType;
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
            
            if(!this.inputType){
                this.dataTable = [];
                this.hide();
            }
            else{
                value = this.curInput.val()+","+value
            }
            this.$emit('after-select-row',{value:value,fromEnterKey:fromEnterKey});

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
        max-height: 500px;
        overflow: auto;
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
    .search-data-input{
        width: 150px;
        padding: 8px;
    }
    .search-data-input input{
        padding: 0 4px;
        width: 100%;
        background: var(--symper-background-default);
        height: 25px;
        border-radius: 4px;
    }
    .search-data-input input:focus{
        outline: none;
    }
</style>