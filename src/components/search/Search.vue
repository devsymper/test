<template>
    <v-combobox @keydown="enter" class="auto-complete" style="border-radius:4px"
        :hide-no-data="true" no-filter :items="searchItems"
        menu-props="{offset-y:true, maxHeight:300}"
        :search-input.sync="value" label="Tìm kiếm">
        <template v-slot:item="{ item, attrs }">
            <template v-if="item.group">
                <v-list-item style="margin-top:-10px; margin-bottom:-10px">
                    <v-list-item-content>
                        <v-list-item-title class="item-header">{{formatGroupName(item.group)}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <template v-else>
                <v-list-item @mouseleave="hideDotButton(searchItems.indexOf(item))" 
                 @mousemove="showDotButton(searchItems.indexOf(item))" style="margin-top:-10px; margin-bottom:-10px" class="pl-7" :attrs="attrs">
                    <v-list-item-avatar 
                        class="item-avatar" style="width:29px!important; height:30px!important" 
                        v-if="item.type === 'user'">
                        <img :src="item.avatar || require('@/assets/image/avatar_default.jpg')">
                    </v-list-item-avatar>
                    <v-list-item-content style="margin-left:-10px">
                        <v-list-item-title v-if="item.type!= 'document_definition'"
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}" 
                            class="item-title" v-html="item.displayName">
                        </v-list-item-title>
                           <v-list-item-title v-else
                            style="margin-left: 0.5rem" 
                            class="item-title" >
                            <span v-if="item.searchField!=undefined" v-html="item.searchField"></span>
                            <span v-else v-html="item.displayName"></span>
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="item.type!= 'document_definition'"
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}"
                            class="item-subtitle mt-1" v-html="item.searchField">
                        </v-list-item-subtitle>
                          <v-list-item-title v-else
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}" 
                            class="item-subtitle" v-html="item.description">
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action v-show="item.enable&&item.actions.length>0" class="dot">
                        <v-menu
                            bottom offset-y 
                            transition="scale-transition" >
                            <template v-slot:activator="{ on }">
                                <button v-on="on">
                                <i style="height:20px!important;width:20px!important" 
                                    class="dot mdi mdi-dots-horizontal"></i>
                                </button>
                            </template>
                            <v-list>
                                 <v-list-item-title v-for="(itemsAction,index) in item.actions" :key="index" 
                                        class="fm fs-13 mt-1 action-button ml-2" style="width:130px!important" 
                                        @click="gotoPage(itemsAction,item.type,item.id,item.displayName)">
                                             {{formatAction(itemsAction)}}
                                    </v-list-item-title>
                            </v-list>
                        </v-menu>
                    </v-list-item-action>
                </v-list-item>
            </template>
        </template>
    </v-combobox>
</template>
<script>
import _ from 'lodash';
import searchApi from "../../api/search.js";
export default {
     data: function () {
        return {
            value: '',
            menu:[],
            searchItemsAll:[],
            searchItems: [],
            dataResultSearch:[],
            defineAction:{
                document_definition:{
                    "module": "document",
                    "resource": "document_definition",
                    "scope": "document",
                },
                workflow_definition:{
                    "module": "workflow",
                    "resource": "workflow_definition",
                    "scope": "workflow",
                },
                user:{
                    "module": "orgchart",
                    "resource": "orgchart",
                    "scope": "orgchart",
                },
                dataflow:{
                    "module": "bi",
                    "resource": "dataflow",
                    "scope": "bi",
                },
                document_object:{
                    "module": "document",
                    "resource": "document_instance",
                    "scope": "document",
                },
                orgchart:{
                    "module": "orgchart",
                    "resource": "orgchart",
                    "scope": "orgchart",

                },
                process_definition:{
                },
                syql:{
                },
                application_deninition:{
                }
            }
        };
    },
    methods:{
          formatAction(value){
            if(value== 'create'){
                return "thêm";
            }else if (value == 'edit'){
                return "sửa"
            }else if (value == 'submit'){
                return "submit"
            }else if (value == 'list'){
                return "danh sách"
             }else if (value == 'list_trash'){
                return "danh sách bản nháp"
             }else if (value == 'list_instance'){
                return "list instance"
            }else{
                return value;
            }
        },
        enter(event){
            if (event.code == "Enter"){debugger
                if(this.value!=''&&this.value!=null){
                this.setMenu();
                this.$store.commit('search/setSearch',  this.searchItems);
                this.$store.commit('search/setSearchAll',  this.searchItemsAll);
                this.$store.commit('search/setShowGeneral', true);
                this.$store.commit('search/setCountResult', this.searchItems.length);
                this.$router.push('/search/general');}
                else{
                    this.$store.commit('search/setSearch', [] );
                }
            };
            if(this.value!=''&&this.value!=null){
                this.menu= this.searchItemsAll;
                this.searchItems =[];
                this.$store.commit('search/setSearch', this.menu );}
            else{
                this.$store.commit('search/setSearch', [] );
            }
            

        },
        setMenu(){
            debugger
            let menu = [];
            for (let i = 0; i < this.menu.length; i++) {
                // console.log(this.newSearch[i].group);
                let name = Object.keys(this.menu[i]);
                if (name[0] == 'group') {
                    menu.push(this.menu[i].group);
                }
            };
            this.$store.commit('search/setMenu', menu);
        },
        gotoPage(action, type,id, name) {
            this.defineAction[type].action = action;
            this.$evtBus.$emit('symper-app-call-action-handler', this.defineAction[type], this, {id:id,name:name, title:name});
        },
        showDotButton(id){
           this.searchItems[id].enable = true;
        },
        hideDotButton(id){
           this.searchItems[id].enable = false;

        },
        //hiển thị tên của thuộc tính
        formatContentName(value){
            let name = '';
            if(value=='content'){
                name =  'Nội dung';
            }else if(value =='lastName'){
                name =  'Nhân viên'
            }else if(value == 'workflow_definition'){
                name =  'Quy trình'
            }else if(value == 'orgchart'){
                name =  'Sơ đồ tổ chức'
            }else{
                name = value;}
            return name;
        },
        //hiển thị tên của các menu
        formatGroupName(value){
            let name = '';
            if(value=='document_object'){
                name =  'Văn bản';
            }else if(value =='user'){
                name =  'Nhân viên'
            }else if(value =='document_definition'){
                name =  'Loại văn bản'
            }else if(value == 'workflow_definition'){
                name =  'Workflow'
            }else if(value == 'orgchart'){
                name =  'Sơ đồ tổ chức'
            }else if(value == 'process_definition'){
                name =  'Quy trình'
            }else if(value == 'application_deninition'){
                name =  'Ứng dụng'
            }else if(value == 'syql'){
                name =  'Công thức'
            }else if(value == 'dataflow'){
                name =  'Data flow'
            }else{
                name = value;}
            return name
        }
    },
    watch: {
        value(newVal) {
            console.log(typeof newVal);
            this.searchItems = [];
            this.$store.commit('search/setWordSearch', newVal);  
            if (newVal) {
                const self = this;
                if(newVal!=''){
                searchApi.getData(newVal)
                    .then(res => {
                        if (res.status === 200) {
                            self.dataResultSearch = res.data;
                            console.log('Đã gửi thành công');
                            // display name, search field, type, avatar (user)
                            const regex = new RegExp(newVal,"gi");
                            const normalizedData = res.data.map(data => {
                                const returnObjSearch = {};
                                 if(data.type=='application_deninition'){
                                    returnObjSearch.iconType = data.iconType;
                                    returnObjSearch.iconName = data.iconName;
                                }
                                if(data.type=== 'user'){
                                    returnObjSearch.displayName = data.displayName? data.displayName:"Không có tên";
                                }else if(data.type=='document_definition'){
                                     returnObjSearch.displayName = data.title?data.title:"Không có tên";
                                }else if(data.type=='syql'){
                                     returnObjSearch.displayName = data.lastContent?data.lastContent:"Không có công thức";
                                }else{
                                     returnObjSearch.displayName = data.name? data.name:"Không có tên";
                                }
                                const keys = Object.keys(data);
                                // xử lý bôi cam
                                for (let i = 0, len = keys.length; i < len; i++) {
                                    const key = keys[i];
                                    if (typeof data[key] === 'string' && data[key].toLowerCase().includes(newVal.trim().toLowerCase())) {
                                        returnObjSearch.normalField = data[key];
                                        returnObjSearch.searchField = data[key].substring(0, 40)
                                            .replace(regex, x => '<span style="color: orange; font-weight: bold">'+x+'</span>');
                                        break;
                                    }
                                }
                                //console.log(data);
                                //debugger
                                returnObjSearch.searchField = returnObjSearch.searchField!=undefined?(returnObjSearch.searchField.indexOf('{')>-1?'Không có mô tả':returnObjSearch.searchField):undefined;
                                returnObjSearch.avatar = data.avatar;
                                returnObjSearch.type = data.type;
                                returnObjSearch.id = data.id;
                                returnObjSearch.actions = data.actions;
                                returnObjSearch.enable = false;
                                returnObjSearch.description = data.description?data.description:(data.description==null||data.description==''?"Mô tả đang để trống":"Symper");
                               
                                //debugger
                               
                                return returnObjSearch;
                            })
                            const groupByType = _.groupBy(normalizedData, 'type');
                            const searchData = [];
                            const allData = [];
                            Object.keys(groupByType).forEach(type => {
                                let name = type;
                                searchData.push({group: name });
                                allData.push({group: name });
                                searchData.push(...groupByType[type].slice(0, 3));
                                allData.push(...groupByType[type]);
                            })
                            self.searchItemsAll = allData;
                            self.searchItems = searchData;
                            self.$store.commit('search/setSearch',  self.searchItems);
                            self.$store.commit('search/setSearchAll', allData);
                            self.$store.commit('search/setCountResult', self.searchItems.length);
                            self.$store.commit('search/setShowGeneral', true);
                           


                        }
                    })
                    .catch(err => {
                        console.log('Đã gửi mà lỗi');
                        console.log(err);
                        this.$store.commit('search/setSearch', []);
                        //this.$store.commit('search/setSearch', []);

                    });
            }
        }
         else{
            this.$store.commit('search/setSearch', []); 
            this.$store.commit('search/setMenu',  []);
            this.$store.commit('search/setWordSearch', newVal);  
        }
       }
       
    },
}
</script>
<style scoped lang="scss">
.item-header {
    font-size: 13px;
    font-weight: 600;
    color: rgba(0,0,0,0.6);
}
.item-avatar {
    margin-left: -0.3rem;
    height:30px!important;
    width:29px!important;
}
.item-title {
    font-size: 13px;
    margin-left: 0.5rem;
}
.item-subtitle {
    font-size: 11px;
    margin-left: 0.5rem;
    color: rgba(0,0,0,0.4);
}
.auto-complete ::v-deep .v-input__slot {
    background-color: #F7F7F7!important;
}

.auto-complete ::v-deep .v-label {
    font-size: 13px!important;
    font-family: Roboto!important;
    margin-top: -3px!important;
    padding-left: 10px;
}
.auto-complete ::v-deep .v-input__slot:after {
    border-color: transparent !important
}

.auto-complete ::v-deep .v-input__slot:before {
    border-color: transparent !important
}

.auto-complete ::v-deep .v-label--active {
    display: none;
}

.auto-complete ::v-deep .v-select__slot {
    height: 25px
}

.auto-complete ::v-deep .v-input__icon {
    padding-bottom: 6px !important
}

.auto-complete ::v-deep .v-select__slot>input {
    padding-top: 10px;
    padding-left: 5px;
}

.auto-complete ::v-deep .v-input__icon>button {
    font-size: 14px !important
}
.auto-complete {
    margin-top: 0 !important;
    padding-top: 6px !important;
}
.dot:hover{
 color:black;
}
.action-button:hover{
      background: rgba(0, 0, 0, 0.05);
}

</style>
<style >
 /* .v-autocomplete__content{
    max-width: 330px!important;
    top: 40px!important;
  
} */
.v-list-item:hover{
    background:rgba(0,0,0,0.05);
}
.v-select__slot{
    font-size:13px;
}
</style>