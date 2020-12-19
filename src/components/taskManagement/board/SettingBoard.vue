<template>
    <div class="w-100 h-100">
        <div class="d-flex">
            <div class="symper-title pt-2 pl-2" style="height:40px">Setting for Board XXX</div>
        
        </div>
        <div  style="height:calc(100% - 40px); width:100%; background:#333">
            <v-tabs 
                class="w-100 h-100 fs-13 tab-board" 
                vertical>
                <v-tab class="fs-13">
                    <v-icon class="fs-15" left>
                    mdi-image-filter-tilt-shift
                    </v-icon>
                    General
                </v-tab>
                <v-tab class="fs-13">
                    <v-icon class="fs-15" left>
                    mdi-format-columns
                    </v-icon>
                    Columns
                </v-tab>

                <v-tab-item>
                    <detail-board 
                        :infoBoard="infoBoard"
                    />
                </v-tab-item>
                <v-tab-item>
                    <column-setting
                        :listColumn="listColumn"
                        class="h-100"
                    />
                </v-tab-item>
            </v-tabs>
        </div>
    </div>
</template>

<script>
import ColumnSetting from './ColumnSetting.vue';
import DetailBoard from './DetailBoard.vue';
export default {
  components: { DetailBoard, ColumnSetting },
    name:"compSettingBoard",
    props:{
        infoBoard:{
            type:Object,
            default() {
                return {};
            }
        },
        listColumn:{
            type:Array,
            default() {
                return [];
            }
        }
    },
    methods:{

    },
    created(){

    }
}
</script>

<style scoped>
.tab-board >>>.v-slide-group__wrapper{
    width:200px;
}
.save-setting-btn{
    margin-left: auto;
    margin-right: 12px;
}
.tab-board >>>.v-tab
{
    height: 35px;
    justify-content: left;
    text-transform: unset;
}
</style>