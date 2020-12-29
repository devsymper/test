<template>
    <v-card 
    :id="'autocomplete-control-'+key"
    v-show="isShowAutoComplete" 
    class="card-autocomplete" :style="positionBox">
        <div v-if="inputType == 'combobox'" class="search-data-input">
            <input v-model="search" type="text" :placeholder="$t('common.search')">
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
                <td v-for="(key,value) in item" :key="key+value" :class="{'row-item':true,'d-none':(value == 'active' || value == 'document_object_id')}">{{ (value != 'active') ? key : '' }}</td>
            </tr>
            <tr @click="handleClickRow(item)" v-else class="row-item">
                <td v-for="(key,value) in item" :key="key+value" :class="{'d-none':(value == 'active' || value == 'checked'|| value == 'document_object_id')}">{{ key }}</td>
                <span class="mdi mdi-check icon-checked" v-if="item.checked"></span>
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
            inputType:false,
            controlValueKey:null,
            isSingleSelectCombobox:true,
            dataSelected:{}
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
        setControlValueKey(controlValueKey){
            this.controlValueKey = controlValueKey
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
            for (let index = 0; index < this.dataTable.length; index++) {
                let rowData = this.dataTable[index];
                for (let i = 0; i < Object.values(rowData).length; i++) {
                    const cellValue = Object.values(rowData)[i];
                    if(this.dataSelected[this.alias].includes(cellValue)){
                        this.$set(this.dataTable[index],'checked',true)
                    }
                }
               
            }
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
                let inputOffset = $(e.target).offset();
            
                if(window.innerWidth < inputOffset.left + $('.card-autocomplete').width() + 10){
                    this.positionBox = {'top':'26px','right':'0px'};
                }
                else{
                    this.positionBox = {'top':'26px','left':'0px'};
                }
                if(window.innerHeight < inputOffset.top + $('.card-autocomplete').height() + 40){
                    delete this.positionBox.top;
                    this.positionBox['bottom'] = '26px';
                }
            }
        },
        setSearch(query){
            this.search = query;
        },
        setAliasControl(aliasControl){
            this.alias = aliasControl;
            if(!this.dataSelected.hasOwnProperty(this.alias)){
                this.dataSelected[this.alias] = []
            }
        },
        setTypeInput(controlType=false){
            this.inputType = controlType;
        },
        setSingleSelectCombobox(isSingleSelectCombobox=false){
            this.isSingleSelectCombobox = isSingleSelectCombobox;
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
            
            if(this.inputType =='combobox'){
                if(this.isSingleSelectCombobox){
                    for (let index = 0; index < this.dataTable.length; index++) {
                        let row = this.dataTable[index];
                        this.$set(row,'checked',false);
                    }
                    if(this.dataSelected[this.alias].indexOf(value) === -1){
                        this.dataSelected[this.alias] = [value];
                        this.$set(item,'checked',true);
                    }
                    else{
                        this.dataSelected[this.alias] = [];
                    }
                }
                else{
                    if(this.dataSelected[this.alias].indexOf(value) !== -1){
                        this.dataSelected[this.alias].splice(this.dataSelected[this.alias].indexOf(value), 1);
                        this.$set(item,'checked',false);
                    }
                    else{
                        this.dataSelected[this.alias].push(value);
                        this.$set(item,'checked',true);
                    }
                }
                
                let dataValue = []
                for (let index = 0; index < this.dataSelected[this.alias].length; index++) {
                    const element = this.dataSelected[this.alias][index];
                    dataValue.push(element)
                }
                value = dataValue.join(",");
            }
            else{
                this.dataTable = [];
                this.hide();
            }
            if(this.controlValueKey){
                value = {inputDislay:value, inputValue:item[this.controlValueKey]};
            }
            else{
                value = {inputDislay:value, inputValue:value};
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
    .card-autocomplete >>> tr{
        position: relative;
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
    .icon-checked{
        position: absolute;
        color: green;
        right: 6px;
    }
    .row-item{
        position: relative;
    }
</style>