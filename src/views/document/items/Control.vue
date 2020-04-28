<template>
<v-list-item class="sym-control" :control-type="type">
        <v-list-item-icon class="icon-control">
          <img :src="`https://hoangnd.dev.symper.vn/`+dataControl.icon">
        </v-list-item-icon>

        <v-list-item-title @click="clickItem(type)" class="fs-11">{{dataControl.title}}</v-list-item-title>
      </v-list-item>
</template>
<script>
import { getControlElement } from '../../../components/document/controlPropsFactory';
export default {
    
    props:{
        type:{
            type: String,
            default :""
        }
    },
    data(){
        return{
            dataControl : "",
            currentIndex: 1,
        }
    },
    mounted(){
        this.dataControl = getControlElement(this.type);
    },
    methods:{
        clickItem(type){
            this.$emit('click-item',type);
        }
    }
    
}
</script>
<style scoped>
    .icon-control{
        margin: 4px 0px 4px 0px !important;
    }
    .icon-control img{
        height: 14px;
        width: 14px;
    }
    .sym-control{
        min-height: unset;
    }
    .sym-control:hover{
        background: #fafafa;
        cursor: pointer;
    }
    
</style>