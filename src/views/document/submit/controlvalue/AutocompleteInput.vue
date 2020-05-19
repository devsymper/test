<template>
    <v-card v-show="isShowAutoComplete" class="card-autocomplete" :style="positionBox">
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
            isShowAutoComplete:false,
            positionBox:{'top':0,'left':0},
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
            console.log(e.keyCode);
            
            if(e.keyCode == 38){    //len
                let rowActive = thisCpn.dataTable.filter(row=>{
                    return row.active === true
                });
                if(rowActive.length>0){
                    let index = thisCpn.dataTable.indexOf(rowActive[0]);
                    if(index == 0){
                        return false;
                    }
                    rowActive[0].active = false;
                    if(index > 0){
                        Vue.set(thisCpn.dataTable[index - 1], 'active', true);

                    }
                }
            }   
            else if(e.keyCode == 40){
                let rowActive = thisCpn.dataTable.filter(row=>{
                    return row.active === true
                });
                if(rowActive.length>0){
                    let index = thisCpn.dataTable.indexOf(rowActive[0]);
                    if(index == thisCpn.dataTable.length - 1){
                        return false;
                    }
                    rowActive[0].active = false;
                    
                    if(index < thisCpn.dataTable.length){
                        Vue.set(thisCpn.dataTable[index + 1], 'active', true);
                    }
                }
            }
            else if(e.keyCode == 13){
                let rowActive = thisCpn.dataTable.filter(row=>{
                    return row.active === true
                });
                thisCpn.handleClickRow(rowActive[0])
            }
            
            
        });
    },
    mounted(){
        $('.card-autocomplete').on('keyup',function(){
            console.log('sssssssssssss');
            
        })
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
            $('.autocompleting').removeClass('autocompleting')
            this.hide()
            
            
        },
       
        openSubForm(){
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