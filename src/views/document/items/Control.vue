<template>
<v-list-item draggable class="sym-control" :control-type="type">
        <v-list-item-icon class="icon-control">
          <v-icon small>{{dataControl.icon}}</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="fs-13">{{dataControl.title}}</v-list-item-title>
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
       
    }
    
}
</script>
<style scoped>
    .icon-control{
        margin: 8px 16px 8px 4px !important;
    }
    .sym-control{
        min-height: unset;
    }
    .sym-control:hover{
        background: #fafafa;
        cursor: pointer;
    }
</style>