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
                                 Group link {{i}}
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
                                    :listDatasetSelected="listDatasetSelected"
                                    :item="childItem"
                                    @change-value="handleChangeValue(item)"
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
    props:{
        listDatasetSelected:{
            type: Array,
            default(){
                return []
            }
        }
    },
    data(){
        return{
            menuItemsHeight: "",
            relationLinkData: {
            }
        }
    },
  
    mounted(){
        this.menuItemsHeight = (util.getComponentSize(this).h - 60)+'px';
    },
    methods:{
        reduceLinks(allLinks){
            this.relationLinkData = {}
            for(let i in allLinks){
                let firstLinkInfo = this.translateLinkToGroupItem(allLinks[i])
                let subItem = []
                let obj = {
                    uid: allLinks[i].uid,
                    childItem: firstLinkInfo
                }
                subItem.push(allLinks[i].to)
                for(let j = 1; j < allLinks.length; j++){
                    if(allLinks[j]){
                        if(subItem.includes(allLinks[j].from)){
                            let item =  this.translateLinkToGroupItem(allLinks[j])
                            obj.childItem = obj.childItem.concat(item[1])
                            subItem.push(allLinks[j].to)
                            delete allLinks[j]
                        }
                    }
                    
                }
                this.$set(this.relationLinkData, Object.keys(this.relationLinkData).length + 1, obj)
            }
        },

        translateLinkToGroupItem(link){
            let arrFrom = link.from.split("_")
            let arrTo = link.to.split("_")
            return[
                {
                    dataset:arrFrom[0],
                    column:  arrFrom.slice(1).join("_"),
                },
                {
                    dataset:arrTo[0],
                    column:  arrTo.slice(1).join("_"),
                },

            ]
        },
        removeGroup(idx, event){
            event.preventDefault()
            event.stopPropagation()
            this.relationLinkData.splice(idx, 1)
        },
        addGroup(){
            let index = Object.keys(this.relationLinkData).length + 1 
            let obj =  {
                childItem:[
                    {
                        dataset:'',
                        column:""
                    },
                ]
            }
            this.$set(this.relationLinkData, index, obj)
        },
        addColumn(idx){
            this.relationLinkData[idx].childItem.push({
                dataset:'',
                column:""
            },)
        },
        removeColumn(i, j){
            this.relationLinkData[i].childItem.splice(j ,1)
            if(this.relationLinkData[i].childItem.length == 1){
                this.$emit('delete-link', this.relationLinkData[i].uid)
            }
        },
        handleChangeValue(data){
            if(data.childItem.length > 1){
                for(let i = 0 ; i < data.childItem.length - 1; i++ ){
                    let obj = this.translateItemToLink(data.uid, data.childItem[i], data.childItem[i+1])
                    this.$emit("add-link", obj)
                }
            }
        },
        translateItemToLink(uid, from , to){
            return{
                source:{
                    id: from.dataset,
                    port: from.dataset+"_" +from.column
                },
                symperLinkType: "oo",
                target: { 
                    id: to.dataset,
                    port: to.dataset+"_" +to.column
                },
                uid: uid
            }
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
    padding: 0 10px !important;
}
</style>