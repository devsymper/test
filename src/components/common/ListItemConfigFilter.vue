<template>
     <v-list dense class="px-2">
        <v-list-item dense class="filter-menu fs-13" v-for="(item,key) in filter" :key="key">
            <v-list-item-content style="margin-left:-29px!important" @click="selectFilter(key)">
                <v-list-item-title  class="col-md-10 fw-400" style="margin-top:-5px">
                    <span class="ml-2" >{{item.name}}</span>
                </v-list-item-title>
                <v-list-item-subtitle  class="fw-400 ml-5" style="font-size:9px!important;margin-top:-19px">
                    <span :style="{opacity:item.isDefault?1:0}">Mặc định</span>
                </v-list-item-subtitle>
            </v-list-item-content>
                <v-list-item-icon class="show-icon col-md-2" style="margin-right:-10px">
                    <v-menu offset-y nudge-left='310' nudge-top="28" >
                            <template v-slot:activator="{ on:config }">
                                <i class="mdi mdi-cog-outline config-filter-icon mr-1" v-on="{ ...config}"></i>
                            </template>
                            <v-list dense >
                                <v-list-item  v-if="!item.isDefault" class="action-filter" @click="selectActionFilter(2,key)">
                                    <v-icon  class=" mr-1 " style="font-size:14px!important">mdi-check-box-multiple-outline</v-icon>
                                    <span class="fs-13"> 
                                        {{$t('table.filter.Default')}}
                                    </span>
                                </v-list-item>
                                <v-list-item v-else class="action-filter" @click="selectActionFilter(3,key)">
                                    <v-icon  class=" mr-1 " style="font-size:14px!important">mdi-check-box-multiple-outline</v-icon>
                                    <span class="fs-13"> 
                                        {{$t('table.filter.Delete Default')}}
                                    </span>
                                </v-list-item>
                                <v-list-item class="action-filter" v-for="(action,keyAction) in actionFilter" :key="keyAction" @click="selectActionFilter(keyAction,key)">
                                    <v-icon  class=" mr-1 " style="font-size:14px!important">{{action.icon}}</v-icon>
                                    <span class="fs-13"> 
                                        {{$t('table.filter.'+action.content)}}
                                    </span>
                                </v-list-item>
                            </v-list>
                    </v-menu>
                </v-list-item-icon>
        </v-list-item>
        <v-list-item  class="w-100 fs-13 add-filter" @click="addFilter()"> 
            <i style="margin-left:-12px" class="mdi mdi-plus mr-1 color-green"></i>
            <span class="color-green"> Thêm bộ lọc</span>
        </v-list-item>
    </v-list>
</template>
<script>
export default {
  data () {
    return {
          actionFilter:[
                {icon:'mdi-lead-pencil',content:"Edit"},
                {icon:'mdi mdi-close',content:"Delete"},
            ],
    }
  },
  methods: {
    addFilter(){
        this.$emit('add-filter-config');
    },
    selectFilter(filterIdx){
        this.$emit('select-filter',filterIdx)
    },
    selectActionFilter(actionIdx,filterIdx){
        let data ={
            type:'',
            filterIdx:filterIdx
        }
        switch(actionIdx){
            case 2:
                data.type="setDefaultFilter";
                break;
            case 3:
                data.type="unsetDefaultFilter";
                break;
            case 0:
                data.type="editFilter";
                break;
            case 1:
                data.type="deleteFilter";
            break;
        }
            this.$emit('config-filter-action',data)
    },
  },
  props: {
      filter:{
			type: Array,
			default(){
				return []
			}
		},
  },
    
}
</script>
<style scoped>
    .filter-menu{
        height:35px!important
    }
    .config-filter-icon{
        margin-top:-15px;
    }
    .filter-menu:hover,.add-filter:hover,.action-filter:hover{
        background: #f5f5f5;
    }
</style>