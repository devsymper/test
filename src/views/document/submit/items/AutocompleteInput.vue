<template>
    <v-card 
    :id="'autocomplete-control-'+key"
    v-show="isShowAutoComplete" 
    class="card-autocomplete" :style="positionBox">
        <v-data-table
        :headers="headers"
        :items="dataTable"
        :search="search"
        disable-pagination
        fixed-header
        hide-default-footer
        
        >
        <template v-slot:item="{ item }">
            <tr v-on:click="handleClickRow(item)" class="active-row" v-if="item.active">
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
            headers: [
            {
                text: 'Dessert (100g serving)',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Calories', value: 'calories' },
            { text: 'Fat (g)', value: 'fat' },
            ],
            dataTable: [
            {
                name: 'Frozen Yogurt',
                calories: 159,
                fat: 6.0,
                active:true
            },
            {
                name: 'Ice cream sandwich',
                calories: 237,
                fat: 9.0,
            },
            {
                name: 'Eclair',
                calories: 262,
                fat: 16.0,
            },
            {
                name: 'Cupcake',
                calories: 305,
                fat: 3.7,
            },
            {
                name: 'Gingerbread',
                calories: 356,
                fat: 16.0,
            },
            {
                name: 'Jelly bean',
                calories: 375,
                fat: 0.0,
            },
            {
                name: 'Lollipop',
                calories: 392,
                fat: 0.2,
            },
            {
                name: 'Honeycomb',
                calories: 408,
                fat: 3.2,
            },
            {
                name: 'Donut',
                calories: 452,
                fat: 25.0,
            },
            {
                name: 'KitKat',
                calories: 518,
                fat: 26.0,
            },
            ],
        }
    },
    created(){
        let thisCpn = this;
        this.$evtBus.$on('document-submit-autocomplete-input-change',e=>{
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
                thisCpn.handleClickRow(rowActive)
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
        calculatorPositionBox(e){   
            this.positionBox = {'top':$(e.target).offset().top + 30 +'px','left':$(e.target).offset().left - $(e.target).width()/2+'px'};
            
        },
        setSearch(query){
            this.search = query;
        },
        handleClickRow(item){
            let name = item.name
            let rowActive = this.dataTable.filter(row=>{
                return row.active === true
            });
            rowActive[0].active = false;
            item.active = true;
            $('.autocompleting').val(name);
            $('.autocompleting').removeClass('autocompleting');
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