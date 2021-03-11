<template>
<div class="calendar-viewmode d-flex justify-end">
    <v-select 
        @change="changeView" 
        :value="type" 
        class="viewmode mr-1" 
        :menu-props="{'nudge-top':-40}" 
        :items="types" 
        label="View" >
        <template v-slot:item="data">
            <span class="viewmode-item">{{ format(data.item) }}
                <v-icon v-if="data.item === type" color="success"> mdi-check</v-icon>
            </span>
        </template>
        <template v-slot:selection >
          <span class="pl-1 color-black"> {{format(type)}}</span>
        </template>
    </v-select>
     <v-btn 
        x-small depressed v-for="(view, index) in viewType.filter(v=>v.show&&type!='month')" 
        :key="index"  
        @click="switchView(view.name)" 
        class="h-28px">
         <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-icon small v-on="on">{{view.icon}}</v-icon>
            </template>
            <span> {{view.name}} </span>
        </v-tooltip>
    </v-btn>
    <v-menu offset-y nudge-bottom='8' :max-width="280" :min-width="280" :close-on-content-click="false">
        <template v-slot:activator="{ on:menu }">
            <v-tooltip top>
            <template v-slot:activator="{ on:tooltip }">
                    <v-btn depressed class="ml-1 h-28px" v-on="{ ...tooltip, ...menu }" x-small  >
                    <v-icon class="mdi-18px">mdi mdi-cog-outline</v-icon>
                </v-btn>
            </template>
            <span>Cài đặt</span>
        </v-tooltip>
        </template>
        <v-tabs centered v-model="tab" color="orange" >
            <v-tab v-for="(item, index) in tabs" :key="index" :href="item.href"> 
                <span class="fs-13">
                    {{item.name}}
                </span>
            </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item :key="1" :value="'tab-' + 1" >
                    <div class="mr-2">
                       <PickColor 
                            v-model="logColor" :random="true" :swatchesColor="swatch" 
                            :randomColor="randomColor" :showSaveBtn="true" 
                            :name="'Chọn màu cho log time'" @save="saveColor"/>
                    </div>
                </v-tab-item>
                <v-tab-item :key="2" :value="'tab-' + 2" >
                    <div>
                        <CategoryColor :listColor="listColor" :value="listCate" @input="setListCateColor" @save="saveCategoryColor"/>
                    </div> 
                </v-tab-item>
            </v-tabs-items>
     </v-menu>
     <v-tooltip top>
        <template v-slot:activator="{ on }">
                <v-btn x-small class="ml-1 h-28px"  v-on="on"  depressed @click="$router.push('/category')">
                <v-icon class="mdi-18px">mdi mdi-file-tree</v-icon>
            </v-btn>
        </template>
        <span>{{$t('timesheet.category')}}</span>
    </v-tooltip>
    
</div>
</template>

<script>
import _debounce from 'lodash/debounce';

import {uiConfigApi} from "./../../api/uiConfig";
import CategoryColor from './form/ConfigCategoryColor';
import PickColor from "./../common/listItemComponents/PickColor"
export default {
  created () {
    // this.debouncedGetValueSearch = _debounce(this.getValueSearch, 200)
  },
  
    data: () => ({
        types: ['day', 'weekday', 'week', 'month'],
        events:[],
        viewType:[
            {name:'List view',icon:'mdi-apps',show:false},
            {name:'Time view',icon:'mdi-clock-outline',show:true},
        ],
        tabs:[
            {name:"Log time",href:"#tab-1"},
            {name:" Loại c.việc",href:"#tab-2"},

        ],
        showSearch:false,
        randomColor:false,
        tab:1,
        list:['123'],
        log:{},
        searchLog:null,
        listLog:[],
        swatch:[
            ['#FF0000', '#AA0000', '#550000','#00FFFF', '#00AAAA' ],
            ['#FFFF00', '#AAAA00', '#555500','#0000FF', '#0000AA'],
            ['#00FF00', '#00AA00', '#005500','#000055','#005555'],
            ['#00FF01', '#00AA01', '#005501','#000051','#005551'],
             
        ],
        logColor:'green',
        colorLog:{},
        colorCate:{}
    }),
    computed: {
        type() {
            return this.$store.state.timesheet.calendarType;
        },
        listColor() {
            let listColor = this.$store.state.timesheet.listColor
             if(listColor.detail&&Object.keys(listColor.detail).length> 0){
                 debugger
                  this.logColor  = listColor.detail.colorLog?listColor.detail.colorLog.color:'#F0F8FF';

             }else{
                 this.logColor = '#F0F8FF';
                
             }
            return listColor;
        },
        listCate() {
            return this.$store.state.timesheet.listCate;
        }
    },
    watch:{
      

    },
    components:{
        PickColor,
        CategoryColor
    },
    methods: {
        switchView(name){
            this.viewType.map(v=>v.show=!v.show)
            name=='List view'?this.$emit('time_view'):this.$emit('list_view');
        },
        setListCateColor(cate){
            this.$store.commit("timesheet/getListCategory", cate )
        },
        saveCategoryColor(listCateColor){
            let data = {...this.listColor};
             if(Object.keys(data).length== 0){
                 data.detail = {colorCate:listCateColor}
             }else{
                  data.detail.colorCate  = listCateColor;
             }
            this.$emit('change-cate-color',listCateColor, this.logColor);
            data.detail = JSON.stringify(data.detail);
            uiConfigApi.saveUiConfig(data).then(res=>{
                if(res.status == 200){
                }
            })
        },
        saveColor(randomColor){
            let data = {...this.listColor};
            let colorLog = {
                isRandom: randomColor, 
                color:this.logColor
            };
            if(Object.keys(data).length== 0){
                 data.detail = {colorLog:colorLog};
            }else{
                 data.detail.colorLog = colorLog;
            }
                this.$emit('change-color',data.detail.colorLog,this.listCate);
                data.detail = JSON.stringify(data.detail);
          
          
            uiConfigApi.saveUiConfig(data).then(res=>{
                if(res.status == 200){
                }
            })
        },
        changeView(_type) {
            this.$store.commit("timesheet/changeCalendarType", _type);
        },
     
        format(date) {
            switch (date) {
                case 'week':
                    return this.$t('timesheet.week');
                    break;
                case 'day':
                    return this.$t('timesheet.day');
                    break;
                case 'month':
                    return this.$t('timesheet.month');
                    break;
                case 'weekday':
                    return this.$t('timesheet.weekday');
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.calendar-viewmode {
    height: 28px;
    margin-left: -3px;
}

.viewmode {
    background-color:#F7F7F7;
    margin-top:0px!important;
    width: 125px;
    padding-top: 0px !important;
    height: 28px !important;
    border-radius: 2px;
}

.viewmode ::v-deep .v-input__control .v-input__slot {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.viewmode ::v-deep .v-input__control .v-select__selection {
    margin-left: 4px;

}

.viewmode ::v-deep .v-label--active {
    display: none;
}

.viewmode ::v-deep .v-list-item__title {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.viewmode ::v-deep .v-input__slot:before {
    border-color: transparent !important;
    height:25px!important;margin-top:3px;
}

.viewmode ::v-deep .v-input__slot:after {
    border-color: transparent !important;
    margin-top:3px;
}

.viewmode-item {
    color: rgba(0, 0, 0, 0.87) !important;
    caret-color: rgba(0, 0, 0, 0.87) !important;
}
.auto-complete ::v-deep .v-list {
    width: 385px !important;
}

.auto-complete ::v-deep .v-input__slot {
    background-color: #F7F7F7;
    margin-top: -19px;
}

.auto-complete ::v-deep .v-label {
    font-size: 13px;
    padding-left: 10px;
}

.auto-complete ::v-deep .v-input__slot:after,
.auto-complete ::v-deep .v-input__slot:before  {
    border-color: transparent !important
}

.auto-complete ::v-deep .v-label--active {
    display: none;
}

.auto-complete ::v-deep .v-list {
    width: 385px !important;
}

.auto-complete ::v-deep .v-select__slot {
    height: 25px
}

.auto-complete ::v-deep .v-input__icon {
    padding-bottom: 6px !important
}

.auto-complete ::v-deep .v-select__slot>input {
    padding-top: 15px;
}

.auto-complete ::v-deep .v-input__icon>button {
    font-size: 14px !important
}
</style>
