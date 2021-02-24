<template>
<div class="calendar-viewmode">
    <v-btn style="float:left" v-if="type !='month'&&timebtn" class="mr-2" icon @click="timeView()">
        <v-tooltip top>
                    <!-- màn hình month - header ngày, giờ -->
            <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-clock-outline</v-icon>
            </template>
            <span>
                Time view
            </span>
        </v-tooltip>
    </v-btn>       
    <v-btn style="float:left" class="mr-2" v-if="type !='month'&&!timebtn" icon @click="listView()">
         <v-tooltip top>
          <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-apps</v-icon>
                </template>
                <span>
                    List view
                </span>
            </v-tooltip>
    </v-btn>
    <span style="padding-right: 10px" v-if="type === 'month'"> </span>
    <v-select style="margin-top:0px;float:left" 
        @change="changeView" 
        :value="type" 
        class="viewmode" 
        :menu-props="{'nudge-top':-40}" 
        :items="types" 
        item-color="white" 
        label="View" 
        background-color="#F7F7F7">
        <template v-slot:item="data">
            <span class="viewmode-item">{{ format(data.item) }}
                <v-icon v-if="data.item === type" color="success">
                    mdi-check</v-icon>
            </span>
        </template>
        <template v-slot:selection >
          <span style= "color:black!important; padding-left:4px"> {{format(type)}}</span>
        </template>
    </v-select>
    <v-menu offset-y nudge-bottom='8' :max-width="280" :min-width="280" :close-on-content-click="false">
        <template v-slot:activator="{ on:menu }">
            <v-tooltip top>
            <template v-slot:activator="{ on:tooltip }">
                    <v-btn class="mt-1 ml-1 btn" v-on="{ ...tooltip, ...menu }" style="float:right" small text >
                    <v-icon class="mdi-18px">mdi mdi-cog-outline</v-icon>
                </v-btn>
            </template>
            <span>
                Cài đặt
            </span>
        </v-tooltip>
        </template>
            <v-tabs centered v-model="tab" color="orange" >
                <v-tab href="#tab-1" class="tab">
                    <span class="fs-13">
                        Logtime
                    </span>
                </v-tab>
                <v-tab href="#tab-2" class="tab">
                     <span class="fs-13">
                         Loại c.việc
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
                <v-btn class="mt-1 ml-1 btn"  v-on="on" style="float:right" small text @click="$router.push('/category')">
                <v-icon class="mdi-18px">mdi mdi-file-tree</v-icon>
            </v-btn>
        </template>
        <span>
            {{$t('timesheet.category')}}
        </span>
    </v-tooltip>
 
</div>
</template>

<script>
import {uiConfigApi} from "./../../api/uiConfig";
import CategoryColor from './form/ConfigCategoryColor';
import PickColor from "./../common/listItemComponents/PickColor"
export default {
  
    data: () => ({
        types: ['day', 'weekday', 'week', 'month'],
        timebtn:true,
        events:[],
        randomColor:false,
        tab:1,
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
            return this.$store.state.timesheet.listColor;
        },
        listCate() {
            return this.$store.state.timesheet.listCate;
        }
    },
    components:{
        PickColor,
        CategoryColor
    },
    methods: {
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
        timeView() {
            this.timebtn = false;
            this.$emit('list_view');
           
        },
        listView() {
            this.timebtn = true;
             this.$emit('time_view');
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
.v-btn:not(.v-btn--round).v-size--small {
    padding: 0 4px !important;
}

.calendar-viewmode {
    float: right;
    height: 30px;
    padding-right: 30px;
    margin-top: 11px;
    padding-bottom: 34px;
   // border-left: 1px solid lightgrey
}

span {
    font-size: 13px !important;
    font-family: Roboto !important;
    font-weight: normal !important;
}

button {
    font-weight: normal;
    font-size: 13px !important;
    font-family: Roboto !important;
    color: black;
}

.viewmode {
    margin-top:2px!important;
    width: 125px;
    float: right;
    padding-top: 0px !important;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 2px;
    padding-left: 0px;
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
.btn{
    height: 32px!important;
    min-width: 30px!important
}
</style>
