<template>
    <div class="w-100 h-100 mt-4 ml-6">
        <div class="body" style='margin-top:-25px'>
             <v-list :expand="true" dense class=" notification" >
                <v-list-group
                    active-class="black--text"
                    link
                    dense
                    v-for="item in items"
                    :key="item.title"
                    v-model="item.active"
                    :prepend-icon="item.action"
                    no-action
                    class="mr-3"
                    style="border-bottom:1px solid rgba(0,0,0,0.07)"
                >
                <template v-slot:activator>
                    <v-list-item-content class="mb-2"  style="margin-left:-17px">
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <v-list-item-subtitle class="fw-400 fs-11">{{item.title}}</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
                <div class="mb-3 ml-10">
                    <span class="fs-13 fw-430" style="color:black">Nhận thông báo khi có những hành động sau</span>
                </div>
                <v-list-item
                    style="margin-top:-20px; margin-bottom:-10px; "
                    v-for="child in item.items"
                    :key="child.title"
                >
                    <v-list-item-content class="ml-10" >
                    <v-list-item-title class="fs-13 font-normal" style="color:rgba(0,0,0,0.8)">{{child.title}}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                          <v-switch style="font-size:13px"
                                dense
                                color="success"
                            ></v-switch>
                     </v-list-item-action>
                </v-list-item>
                </v-list-group>
            </v-list>
        </div>   
    </div>
</template>
<script>
export default {
  props: ['type','listItems'],
    methods: {
       
    },
    data(){
        return{
            items:this.listItems
            
        }
        
    }
    
}
</script>
<style scoped>
    /* .v-list-group__header{
        margin-bottom:8px!important
    } */
    .notification ::v-deep .v-list-item{
        padding:0px!important
    }
</style>