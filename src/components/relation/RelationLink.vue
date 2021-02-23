<template>
    <div class="d-flex flex-column h-100 relation-link-config">
        <div style="margin-left: auto; margin-right:auto">
            <span class="fs-15 mt-1">
                 Columns links
            </span>
        </div>
        <div class="mx-1 ">
            <VuePerfectScrollbar :style="{'max-height': menuItemsHeight}">
                <v-expansion-panels multiple>
                    <v-expansion-panel
                        v-for="(item,i) in relationLinkData"
                        :key="i"
                    >
                        <v-expansion-panel-header>
                            <div class="flex-grow-1">
                                 {{item.title}}
                            </div>
                           <div class="d-flex flex-row-reverse">
                                <v-icon small @click="removeGroup(i, $event)">
                                    mdi-close
                                </v-icon>
                           </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div v-for="(childItem, j) in item.childItem" :key="j">
                                <RelationLinkItem
                                    @remove-column="removeColumn(i, j)"
                                />
                            </div>
                            <v-btn
                                small
                                color="gray"
                                @click="addColumn(i)"
                            >
                                <v-icon  x-small class="mr-2">mdi-plus</v-icon>
                                <span class="fs-13">
                                        {{ $t('common.add-column')}}
                                </span>
                            </v-btn>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                 <v-btn
                    small
                    color="gray"
                    class="mt-1"
                    @click="addGroup"
                >
                    <v-icon  x-small class="mr-2">mdi-plus</v-icon>
                    <span class="fs-13">
                        Thêm group
                    </span>
                </v-btn>
            </VuePerfectScrollbar>
        </div>
    </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from "@/plugins/util.js";
import RelationLinkItem from '@/components/relation/RelationLinkItem'

export default {
    components:{
        VuePerfectScrollbar,
        RelationLinkItem
    },
    data(){
        return{
            menuItemsHeight: "",
            relationLinkData:[
                {
                    title: "Group link 1",
                    childItem:[
                        {
                            dataset:'',
                            column:""
                        },
                        
                    ]
                },
                {
                    title: "Group link 2",
                    childItem:[
                        {
                            dataset:'',
                            column:""
                        },
                        
                    ]
                },
            ]
        }
    },
    mounted(){
        this.menuItemsHeight = (util.getComponentSize(this).h - 60)+'px';
    },
    methods:{
        removeGroup(idx, event){
            event.preventDefault()
            event.stopPropagation()
            this.relationLinkData.splice(idx, 1)
        },
        addGroup(){
            let index = this.relationLinkData.length + 1 
            let obj =  {
                    title: "Group link "+ index,
                    childItem:[
                        {
                            dataset:'',
                            column:""
                        },
                        
                    ]
                }
            this.relationLinkData.push(obj)
        },
        addColumn(idx){
            this.relationLinkData[idx].childItem.push({
                dataset:'',
                column:""
            },)
        },
        removeColumn(i, j){
             this.relationLinkData[i].childItem.splice(j ,1)
        }
       
    }
}
</script>

<style scoped>
.relation-link-config >>> .v-expansion-panel-header{
    min-height: unset !important;
    padding: 8px !important;
    font-size: 13px;
}
.relation-link-config >>> .v-expansion-panel::before{
    box-shadow: unset !important;
}
.relation-link-config >>> .v-expansion-panel-content__wrap{
    padding-bottom: unset;
}
</style>