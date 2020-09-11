<template>
    <v-combobox @keydown="enter" class="auto-complete" style="border-radius:4px"
        :hide-no-data="true" no-filter :items="searchItems"
        :menu-props="{ maxHeight:300, maxWidth:330, nudgeBottom:5}"
        :search-input.sync="value" label="Tìm kiếm">
         <template v-slot:append>
            <i aria-hidden="true" style = "font-size:20px" class="fs- 13 v-icon notranslate mdi mdi-magnify theme--light"></i>
        </template>
        <template v-slot:item="{ item, attrs }">
            <template v-if="item.group">
                <v-list-item style="margin-top:-10px; margin-bottom:-10px">
                    <v-list-item-content>
                        <v-list-item-title class="item-header">{{formatGroupName(item.group)}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <template v-else>
                <v-list-item 
                    @mouseleave="hideDotButton(searchItems.indexOf(item))" 
                    @mousemove="showDotButton(searchItems.indexOf(item))" 
                    class="pl-7 search-menu" 
                    :attrs="attrs">
                    <SymperAvatar 
                        v-if="item.type === 'user'" 
                        style="height: 35px!important; width:35px!important; margin-left:-5px" 
                        class="mr-4" :userId="item.userId"/>
                    <v-list-item-content v-if="item.type!='syql'" style="margin-left:-15px">
                        <v-list-item-title v-if="item.type!= 'document_definition'&&item.type!='workflow_definition'&&item.type!='user'"
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}" 
                            class="item-title" v-html="item.displayName">
                        </v-list-item-title>
                           <v-list-item-title v-else
                            class="item-title" >
                            <span v-if="item.searchField!=undefined" v-html="item.searchField"></span>
                            <span v-else v-html="item.displayName"></span>
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="item.type!= 'document_definition'&&item.type!='workflow_definition'&&item.type!='user'"
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}"
                            class="item-subtitle mt-1" v-html="item.searchField">
                        </v-list-item-subtitle>
                          <v-list-item-title v-else-if="item.type!='user'"
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}" 
                            class="item-subtitle" v-html="item.description">
                        </v-list-item-title>
                         <v-list-item-title v-else
                            class="item-subtitle" v-html="item.email">
                        </v-list-item-title>
                    </v-list-item-content>
                    <!-- sql -->
                        <v-list-item-content v-else style="margin-left:-15px">
                        <v-list-item-title 
                            class="item-title">Nguồn: {{item.objectType}} - Tên: {{item.nameSql}}
                        </v-list-item-title>
                        <v-list-item-subtitle
                            class="item-subtitle mt-1">{{item.displayName}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <!-- sql -->
                    <v-list-item-action v-show="item.enable && item.actions.length>0" class="dot">
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
import SymperAvatar from '../../components/common/SymperAvatar'
import searchApi from "../../api/search.js";
export default {
    components:{
        SymperAvatar
    },
     data: function () {
        return {
            value: '',
            syqlId:{},
            syqlIdInfo:'',
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
                document_instance:{
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
     created: function () {
        this.debouncedGetValueSearch = _.debounce(this.getValueSearch, 250)
    },
     watch: {
        value(){
            this.debouncedGetValueSearch();
        }
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
            if (event.code == "Enter"){
            this.setMenu();
            this.$store.commit('search/setSearch',  this.searchItems);
            this.$store.commit('search/setSearchAll',  this.searchItemsAll);
            this.$store.commit('search/setShowGeneral', true);
            this.$store.commit('search/setCountResult', this.searchItems.filter(x=>x.type).length);
            this.$router.push('/search/general');
            };
            this.menu = this.searchItemsAll;
            this.searchItems =[];
            this.$store.commit('search/setSearch', this.menu );

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
            debugger
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
         getValueSearch() {
        //debugger
            let newVal = this.value;
           // this.debouncedGetAnswer();
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
                                 if(data.type=='application_definition'){
                                    returnObjSearch.iconType = data.iconType;
                                    returnObjSearch.iconName = data.iconName;
                                }
                                if(data.type=== 'user'){
                                    returnObjSearch.displayName = data.displayName? data.displayName:"Không có tên";
                                    returnObjSearch.email = data.email;
                                    returnObjSearch.userId = data.id;
                                }else if(data.type=='document_definition'){
                                     returnObjSearch.displayName = data.title?data.title:"Không có tên";
    
                                     returnObjSearch.description = data.note?data.note:'Chưa điền mô tả';
                                }else if(data.type=='syql'){
                    debugger
                                    let name = self.getNameSyql(self.getInfoSyql(data.id));
                        
                    
                                     returnObjSearch.displayName = data.lastContent?data.lastContent:"Không có công thức";
                                   //  debugger
                                     returnObjSearch.nameSql = name.content;
                                     returnObjSearch.objectType = name.objectType;
                                     // lấy api của tên
                                }else{
                                     returnObjSearch.displayName = data.name? data.name:"Không có tên";
                                }
                                const keys = Object.keys(data);
                                // xử lý bôi cam
                                for (let i = 0, len = keys.length; i < len; i++) {
                                    const key = keys[i];
                                    if (typeof data[key] === 'string' && data[key].toLowerCase().includes(newVal.trim().toLowerCase())) {
                                        returnObjSearch.searchField = data[key].substring(0, 40)
                                            .replace(regex, x => '<span style="color: orange; font-weight: bold">'+x+'</span>');
                                        break;
                                    }
                                }
                                returnObjSearch.searchField = returnObjSearch.searchField!=undefined?(returnObjSearch.searchField.indexOf('{')>-1?'Không có mô tả':returnObjSearch.searchField):undefined;
                                returnObjSearch.avatar = data.avatar;
                                returnObjSearch.type = data.type;
                                returnObjSearch.id = data.id;
                                returnObjSearch.actions = data.actions;
                                returnObjSearch.enable = false;
                                if(data.type!='document_definition'){
                                      returnObjSearch.description = data.description?data.description:(data.description==null||data.description==''?"Mô tả đang để trống":"Symper");
                                }
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
                            self.$store.commit('search/setCountResult', self.searchItems.filter(x=>x.type).length);
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
       },
       getNameSyql(id){
          id =  this.syqlIdInfo;
           let name = this.getInfoSyql(this.syqlIdInfo);
           if(JSON.stringify(name) === '{}'){
               debugger
            // this.getNameSyql(id);
           }
            debugger
           return name;
       },
       // lấy API hiển thì nguồn công thức
         getInfoSyql(syqlId){
             debugger
           const self = this;
           this.syqlIdInfo = syqlId;
           searchApi.getInfoSyql(syqlId)
            .then(res => {
                 if (res.status === 200) {
                     self.syqlId.content= res.data[0].context;
                     self.syqlId.objectType = res.data[0].objectType!='workflow'?'Document':'Workflow';
                 }
            })
            .catch(err => {
                console.log('Đã gửi mà lỗi');
                console.log(err);
                //this.$store.commit('search/setSearch', []);

            });
             return this.syqlId;
       },
        //hiển thị tên của các menu
        formatGroupName(value){
            let name = '';
            if(value=='document_instance'){
                name =  'Bản ghi dữ liệu';
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
            }else if(value == 'application_definition'){
                name =  'Ứng dụng'
            }else if(value == 'syql'){
                name =  'Công thức'
            }else if(value == 'dataflow'){
                name =  'Data flow'
            }else if(value == 'file'){
                name =  'Tệp'
            }else if(value == 'knowledge'){
                name =  'Knowledge'
            }else if(value == 'comment'){
                name =  'Bình luận'
            }else{
                name = value;}
            return name
        }
    },
   
   
}
</script>
<style scoped >
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
    margin-top: -2px!important;
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
    height: 28px
}

.auto-complete ::v-deep .v-input__icon {
    padding-bottom: 6px !important
}

.auto-complete ::v-deep .v-select__slot>input {
    padding-top: 12px;
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
.auto-complete ::v-deep .v-list-item:hover{
    background:rgba(0,0,0,0.05);
}
.auto-complete ::v-deep .v-select__slot{
    font-size:13px;
}
.auto-complete >>> .v-autocomplete__content{
    max-width: 330px!important;
    top: 40px!important;
    z-index:108;
    min-height: 100px!important;
    background-color:white
}

.v-list-item:hover{
      background:rgba(0,0,0,0.05);
}
.search-menu{
    margin-top:-10px; 
    margin-bottom:-10px;
    margin-left:-5px
}

</style>