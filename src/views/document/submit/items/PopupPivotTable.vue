<template>
    <v-dialog
        v-model="isShow"
        width="350"
        scrollable
        style="overflow:hidden;"
        >
        <v-card :height="250">
            <v-card-title class="s-card-title">
                Đặt dữ liệu
            </v-card-title>
            <v-card-text class="s-card-text">
                <div v-for="(item,i) in data" :key="i">
                    <div v-if="!item.isDisable ">
                        <div :class="{'mt-1':i > 0}">Giá trị cho {{item.controlTitle}}</div>
                        <v-combobox
                        class="sym-small-size sym-style-input"
                        hide-selected
                        hide-details
                        :label="item.detailTitle"
                        solo
                        v-model="item.selected"
                        :items="item.value"
                        ></v-combobox>
                    </div>
                    
                </div>
                <div v-for="(item,i) in dataColPivot" :key="i+item.controlName" class="mt-1">
                    <div>
                        Giá trị cho {{item.controlTitle}}
                    </div>
                    <v-text-field
                    class="sym-small-size sym-style-input"
                        dense
                        solo
                        hide-details
                        v-model="item.selected"
                        
                    ></v-text-field>
                </div>
                
                
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="green darken-1"
                text
                right
                @click="saveData"
            >
                {{$t('common.save')}}
            </v-btn>

            <v-btn
                color="green darken-1"
                text
                right
                @click="isShow = false"
            >
                {{$t('common.close')}}
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props:{
        data:{
            type:Array,
        },
        dataColPivot:{
            type:Array,
        },
    },
    watch:{
        isShow(vl){
            this.selected = null;
        }
    },
    data(){
        return {
            isShow:false,
            type:null,
            tableName:null
        }
    },
    methods:{
        saveData(){
            this.$emit('before-add-pivot-data',{tableName:this.tableName, type:this.type,dataColPivot:this.dataColPivot,dataRowGroup:this.data})
        },
        show(type, tableName){
            this.type = type;
            this.tableName = tableName;
            this.isShow = true;
        },
        hide(){
            this.isShow = false;
        }
    }
}
</script>
<style scoped>
    .s-card-title{
        padding: 4px 8px !important;
        font-size: 15px !important;
    }
    .s-card-text{
        padding: 12px !important;
        font-size: 13px;
    }
    .sym-small-size >>> .v-input__slot{
        box-shadow: unset !important;
        font-size: 12px;
    }
</style>
