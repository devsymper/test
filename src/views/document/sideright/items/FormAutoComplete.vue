<template>
    <div class="form-autocomplete">
        <span>Auto complete</span>
         <v-card
            class="mx-auto"
            outlined
        >
            <div class="wrapper-form">
                <div class="row-autocomplete">
                    <div class="title-row-autocomplete">Document</div>
                     <v-autocomplete
                        :items="listDocument"
                        item-text="title"
                        dense
                        solo
                    ></v-autocomplete>
                </div>
                <div class="row-autocomplete">
                    <div  class="title-row-autocomplete">Trường</div>
                    <v-text-field
                        :label="$t('apps.search')"
                        single-line
                        solo
                        @click:append="showColumn"
                        append-icon="mdi-magnify"
                        v-model="searchKey"
                    ></v-text-field>
                </div>
                <div class="list-columm-selected">
                    <div class="empty-column" v-if="listColumnSelected.length == 0">Chưa có trường nào được chọn</div>
                    <v-list-item
                        v-else
                        v-for="(item,i) in listColumnSelected"
                        :key="i"
                    >
                        <v-list-item-avatar>
                        <v-icon
                            class="grey lighten-1 icon-default-column"
                            dark
                        >
                            {{item.icon}}
                        </v-icon>
                        <v-icon
                            class="red lighten-1 icon-remove"
                            dark
                            @click="removeItem(item)"
                        >
                            mdi-close
                        </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                        <v-list-item-title > <span>{{item.title}}</span> <span style="font:11px roboto;font-weight:200;padding-left:4px">{{item.subTitle}}</span></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                        <v-btn icon tile @click="pinnedItem(item)">
                            <v-icon color="green lighten-1">mdi-key-outline</v-icon>
                        </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </div>
            </div>
            <TreeSqlConfig @tree-renderer="handleTreeRenderer" />
        </v-card>
            <ListColumnAutoComplete 
                ref="listColumnn"
                @item-clicked="handleItemClick"
                :showListColumn="showListColumn"  
                :listColumnSelected="listColumnSelected" 
                :searchKey="searchKey"
            />
    </div>
</template>
<script>
import ListColumnAutoComplete from './ListColumnAutoComplete'
import {documentApi} from "@/api/Document.js"
import TreeSqlConfig from "./TreeSqlConfig.vue"
export default {
    data(){
        return{
            searchKey:"",
            showListColumn:false,
            listDocument:[],

            listColumnSelected:[
            ]
        }
    },
    created(){
        let self = this
        documentApi.getListDocument().then(res=>{
            self.listDocument = res.data.listObject
        }).catch(err=>{

        })
    },
    methods:{
        pinnedItem(item){
            item.pinned = !item.pinned;
        },
        showColumn(e){
            this.$refs.listColumnn.show(e)
        },
        handleItemClick(item){
            if(this.listColumnSelected.includes(item) == false){
                this.listColumnSelected.push(item)
            }else{
                 this.listColumnSelected.splice(this.listColumnSelected.indexOf(item),1)
            }
        },
        removeItem(item){
            this.listColumnSelected.splice(this.listColumnSelected.indexOf(item),1)
        },
        handleTreeRenderer(data){
        }
    },
    components:{
        ListColumnAutoComplete,
        TreeSqlConfig
    }
}
</script>
<style scoped>
.form-autocomplete >>> .v-text-field__details{
    display:none
}
.form-autocomplete >>> .v-input__control{
    min-height: unset;
    height: 30px;
}
.form-autocomplete >>> .v-input{
    margin:6px;
}
.form-autocomplete >>> .v-select__slot{
    font:11px roboto;
}
.form-autocomplete  .list-columm-selected {
    margin-top:8px;
}
.form-autocomplete  .list-columm-selected .empty-column{
    width:160px;
    margin-left: auto;
    margin-right:auto;
    padding-bottom:10px;
}

.form-autocomplete >>> .v-input__control{
    height: 30px !important;
    min-height: unset !important;
    padding:0px 4px 0px 0px
}
.form-autocomplete  >>> .v-input__control .v-input__slot{
    box-shadow: unset !important;
    background-color: #f7f7f7;
    margin-bottom:unset;
    height: 30px !important;
    padding:0px 8px !important;
}
.form-autocomplete  >>> .v-input__control .v-input__slot label{
    font:13px roboto
}
.form-autocomplete  >>> .v-input__control .v-input__slot .v-icon{
    font-size:13px
}
.form-autocomplete  >>> .v-input__control .v-input__slot .v-text-field__slot{
    font:13px roboto
}
.form-autocomplete  >>> .v-input__control .v-input__slot .v-text-field__slot label {
    padding-top:2px;
    font:11px roboto !important
}
.form-autocomplete >>> .v-input__control .v-text-field__details {
    display: none;
}
.wrapper-form{
    display:flex;
    flex-direction:column
}
.wrapper-form .row-autocomplete{
    display:flex;
    align-items: center;
    padding: 0px 8px;
}
.wrapper-form .row-autocomplete .title-row-autocomplete{
    width: 60px;
}
.form-autocomplete >>> .list-columm-selected .v-icon{
    font-size: 10px !important;
}
.form-autocomplete >>> .list-columm-selected .v-avatar{
    height: 12px !important;
    width: 12px !important;
    min-width: unset !important;
}
.form-autocomplete >>> .list-columm-selected .v-list-item__content .v-list-item__title{
    font:13px roboto;
}
.form-autocomplete >>> .list-columm-selected .v-list-item__action .v-btn{
    width: 12px;
    height: 12px;
}
.form-autocomplete >>> .list-columm-selected .v-list-item{
    min-height: unset;
    height: 30px;
    padding:0px 4px;
    margin-left:4px !important;
}
.form-autocomplete >>> .list-columm-selected .v-list-item .icon-remove{
    display: none;
}
.form-autocomplete >>> .list-columm-selected .v-list-item:hover .icon-remove{
    display: block;
}
.form-autocomplete >>> .list-columm-selected .v-list-item:hover .icon-default-column{
    display: none;
}
.form-autocomplete >>> .list-columm-selected .v-list-item:hover {
    background-color: #F2F2F2 !important;
}

</style>