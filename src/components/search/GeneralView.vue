<template>
<div style="width:100%;" class= "mb-10 d-flex justify-start "  >
    <v-col cols="md-2 sm-2 lg-2" style="border-right:1px solid rgba(0,0,0,0.1); height:100%!important">
        <v-list-item-content>
            <v-list-item-title class="fs-15 ml-5 fm">
                <i class="mdi mdi-magnify"></i>
                    Vị trí tìm kiếm</v-list-item-title>
            </v-list-item-content>
        <v-list dense>
            <v-list-item v-for="(item,menuIdx) in menu" :key="menuIdx">
                <v-list-item-icon>
                    <v-icon>{{getIcon(item)}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content @click="detailView(item)">
                    <v-list-item-title>{{formatGroupName(item)}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-col>
    <v-col cols="md-10 sm-10 lg-10 mb-10 pb-10" style="height:100vh; overflow:scroll!important" class="ml-1 mr-2">
        <!-- dòng kết quả tìm kiếm -->
        <v-row>
            <v-list-item-content class="fm mb-2">
                <v-list-item-title class="fs-15 fm ml-3 mb-2">
                    Kết quả tìm kiếm trong {{nameResult}}
                </v-list-item-title>
                <v-list-item-subtitle class="sub-title fs-12 ml-3 fm">Từ khoá "{{wordSearch}}" có {{countResult}} kết quả phù hợp</v-list-item-subtitle>
            </v-list-item-content>
        </v-row>
        <!-- danh sách kết quả màn hình chung  -->
        <!-- danh sách kết quả màn hình chung- group   -->
        <div v-if="showGeneral">
            <v-row 
                class="general"  
                v-for="(item,generalOthersIdx) in newSearch.filter(x => x.group!= 'user'&&x.type!= 'user'&&x.group!= 'application_deninition'&&x.type!= 'application_deninition')"  
                :key="generalOthersIdx"
                style="margin-top:-18px">
                <v-row v-if="item.group" style="magrin-left:2px" class="ml-2 mt-1 mr-2">
                    <v-list-item class=" mr-3 pl-1 " >
                        <v-list-item-content class="ml-1"  >
                            <v-list-item-title class="item-header">{{formatGroupName(item.group)}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action class="mr-2">
                            <button @click="detailView(item.group)" class="fs-11 color-blue fm">Xem tất cả</button>
                        </v-list-item-action>
                    </v-list-item>
                </v-row>
                    <!-- danh sách kết quả màn hình chung- danh sách    -->
                <v-row v-else-if="item.type != 'user'" 
                    @mouseleave="hideDotButton(generalOthersIdx)" 
                        @mousemove="showDotButton(generalOthersIdx)" 
                    class="mt-2 mr-2 mb-1" style="margin-left:2px">
                    <v-list-item class="ml-2 mr-3">
                        <v-list-item-content class="ml-2">
                            <v-list-item-title style="margin-left: 0.5rem" class="item-title fs-13 mb-2">{{formatName(item.displayName,230)}}
                            </v-list-item-title>
                            <v-list-item-subtitle style="margin-left: 0.5rem" class="fs-12 sub-title">{{item.description}}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action v-show="item.enable&&item.actions.length>0" >
                            <v-menu  max-height="180" max-width="120" offset-y 
                                style="background-color:white" nudge-left="100">
                                <template v-slot:activator="{ on }">
                                    <button v-on="on">
                                        <i style="height:20px!important;width:20px!important" 
                                        class="dot mdi mdi-dots-horizontal"></i>
                                    </button>
                                </template>
                                <v-list>
                                    <v-row>
                                        <v-list-item-title 
                                            v-for="(itemsAction, itemActionIdx) in item.actions"
                                            class="fm fs-13 mt-1 action-button ml-4 mr-6" 
                                            @click="gotoPage(itemsAction,item.type,item.id,item.displayName)"
                                            :key="itemActionIdx">
                                            <span class="ml-2">{{formatAction(itemsAction)}}</span>
                                        </v-list-item-title>
                                    </v-row>
                                </v-list>
                            </v-menu>
                        </v-list-item-action>
                    </v-list-item>
                </v-row>
            </v-row>
        </div>
        <!-- danh sách kết quả màn hình chung- nhân viên    -->
        
        <div v-if="showGeneral"  >
            <v-row  
                v-for="(item, itemIndex) in newSearch.filter(x => x.group == 'user' )"  
                :key="itemIndex"
                style="margin-top:-18px">
                <v-row v-if="item.group"  style="magrin-left:2px" class="ml-2 mt-2 mr-2 mb-1">
                    <v-list-item class="pl-1 mr-3">
                        <v-list-item-content class="ml-1">
                            <v-list-item-title  class="item-header">{{formatGroupName(item.group)}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action class="" >
                            <button @click="detailView(item.group)" style="margin-right:-9px" class="fs-11 color-blue fm ">Xem tất cả</button>
                        </v-list-item-action>
                    </v-list-item>
                </v-row>
            </v-row>
        </div>
        
        <v-row  v-if="showGeneral" >
            <!-- kết thúc danh sách tìm  -->
            <v-sheet max-width="93%">
                <v-slide-group multiple  prev-icon="mdi-minus">
                    <template v-slot:next>
                        <div class="slider-user-button slider-button-right"> 
                           <v-icon> mdi mdi-chevron-right</v-icon>
                        </div>
                    </template>
                    <template v-slot:prev >
                        <div class="slider-user-button">
                           <v-icon> mdi mdi-chevron-left</v-icon>
                        </div>
                    </template>
                    <v-slide-item 
                        v-for="(item, newSearchAllIdx) in  newSearchAll.filter(x => x.type== 'user' ).slice(0, 10)"  
                        :key="newSearchAllIdx">
                        <div class="d-flex justify-start ml-3 mr-3 slider-user ">
                            <v-list-item-avatar class="item-avatar ml-3">
                                <img :src="item.avatar || require('@/assets/image/avatar_default.jpg')">
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title style="margin-left: 0.5" class="item-title fs-13 fm" v-html="item.displayName">
                                </v-list-item-title>
                                <v-list-item-subtitle style="margin-left:0" class="sub-title fs-12" v-html="item.displayName">
                                </v-list-item-subtitle>
                                <v-list-item-subtitle style="margin-left:0" class="sub-title fs-12" v-html="item.email">
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </div>
                    </v-slide-item>
                </v-slide-group>
            </v-sheet>
        </v-row>
        <!-- danh sách kết quả màn hình chung-   -->
        <div v-if="showGeneral">
            <v-row 
                v-for="(item, newSearchIdx) in newSearch.filter(x => x.group == 'application_deninition' )"
                :key="newSearchIdx">
                <v-row v-if="item.group" style="magrin-left:2px" class="ml-2 mr-2">
                    <v-list-item class="pl-1 mr-3"> 
                        <v-list-item-content class="ml-1">
                            <v-list-item-title class="item-header">{{formatGroupName(item.group)}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <button @click="detailView(item.group)" style="margin-right:-9px" class="fs-11 color-blue fm">Xem tất cả</button>
                        </v-list-item-action>
                    </v-list-item>
                </v-row>
            </v-row>
        </div>

        <v-row  v-if="showGeneral" class="">
            <v-col 
            cols="12" 
            md="6" 
            v-for="(item, newSearchAllIdx) in newSearchAll.filter(x => x.type== 'application_deninition' )"
            :key="newSearchAllIdx">
                <div class="d-flex justify-start mr-3 " style="width: 250px!important">
                    <v-list-item-avatar class="ml-3">
                        <v-icon v-if="item.iconType=='icon'">{{item.iconName}}</v-icon>
                        <img v-else-if="item.iconType=='img'" :src="item.iconName">
                        <v-icon v-else>mdi-star</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title style="margin-left: 0.5" class="item-title fs-13 fm">{{item.displayName}}
                        </v-list-item-title>
                        <v-list-item-subtitle style="color:rgba(0,0,0,0.3); margin-left: 0.5" class="item-title fs-12 fm">{{item.description}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </div>
            </v-col>
        </v-row>
        <!-- danh sách tìm kiếm chi tiết -->
        <!-- kết thúc tìm kiếm chi tiết -->
        <!-- trang dành cho user -->

        <div v-if="showDetail && type != 'application_deninition' && type!='user'">
            <v-row  v-for="(item,ind) in newSearchAll.filter(x => x.type== type )" :key="ind" >
                <v-row
                    @mouseleave="hideDotButton(ind)" 
                        @mousemove="showDotButton(ind)" 
                    class="mr-3">
                    <!-- danh sách tìm thấy không bao gồm user -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title style="margin-left: 0.5rem" class="item-title fs-13 mb-2">{{formatName(item.displayName,230)}}
                            </v-list-item-title>
                            <v-list-item-subtitle style="margin-left: 0.5rem" class="fs-12 sub-title">{{item.description}}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action v-show="item.enable&&item.actions.length>0" >
                            <v-menu offset-y transition="scale-transition" style="width:50px!important">
                                <template v-slot:activator="{ on }">
                                    <button v-on="on">
                                        <i style="height:20px!important;width:20px!important" 
                                        class="mr-10 dot mdi mdi-dots-horizontal"></i>
                                    </button>
                                </template>
                                <v-list>
                                    <v-row>
                                        <v-list-item-title 
                                            v-for="(itemsAction, itemsActionIdx) in item.actions" 
                                            :key="itemsActionIdx"
                                            @click="gotoPage(itemsAction,item.type,item.id,item.displayName)"
                                            class="fm fs-13 ml-6 action-button" style="width:50px!important" >
                                                {{formatAction(itemsAction)}}
                                        </v-list-item-title>
                                    </v-row>
                                </v-list>
                            </v-menu>
                        </v-list-item-action>
                    </v-list-item>
                </v-row>
            </v-row>
        </div>


        <v-row  v-if="showDetail&&type=='user'" class="d-flex mb-3" >
            <v-col 
                cols="12" 
                md="4" 
                v-for="(item, newSearchAllIdx) in newSearchAll.filter(x => x.type== 'user' )"
                :key="newSearchAllIdx">
                <div class="d-flex justify-start mr-3 " style="width: 100%!important; border:1px solid rgba(0,0,0,0.2">
                    <v-list-item-avatar class="item-avatar ml-3">
                        <img :src="item.avatar || require('@/assets/image/avatar_default.jpg')">
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title style="margin-left: 0.5" class="item-title fs-13 fm" v-html="item.displayName">
                        </v-list-item-title>
                        <v-list-item-subtitle style="margin-left:0" class="sub-title fs-12" v-html="item.displayName">
                        </v-list-item-subtitle>
                        <v-list-item-subtitle style="margin-left:0" class="sub-title fs-12" v-html="item.email">
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </div>
            </v-col>
        </v-row>


        <v-row  v-if="showDetail&&type=='application_deninition'">
            <v-col 
                cols="12" 
                md="6" 
                v-for="(item, newSearchAllIdx) in newSearchAll.filter(x => x.type== 'application_deninition' )" 
                :key="newSearchAllIdx">
                <div class="d-flex justify-start mr-3 " style="width: 90%!important">
                    <v-list-item-avatar class="ml-3">
                        <v-icon v-if="item.iconType=='icon'">{{item.iconName}}</v-icon>
                        <img v-else-if="item.iconType=='img'" :src="item.iconName">
                        <v-icon v-else>mdi-star</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title style="margin-left: 0.5" class="item-title fs-13 fm" v-html="item.displayName">
                        </v-list-item-title>
                        <v-list-item-subtitle style="margin-left:0" class="sub-title fs-12" v-html="item.description">
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </div>
            </v-col>
        </v-row>
        <!-- dành cho user -->
    </v-col>
</div>
</template>
<script>
export default {
     computed: {
        newSearch() {
            return this.$store.state.search.newSearch;
        },
        newSearchAll() {
            return this.$store.state.search.newSearchAll;
        },
        wordSearch() {
            return this.$store.state.search.wordSearch;
        },
        menu() {
            return this.$store.state.search.menu;
        },
        countResult() {
            return this.$store.state.search.countResult;
        },
        showGeneral() {
            return this.$store.state.search.showGeneral;
        }
    },
    methods: {
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
                return "danh sách nháp"
             }else if (value == 'list_instance'){
                return "list instance"
            }else{
                return value;
            }
        },
        getIcon(value){
             let icon = 'mdi-star-outline';
            if (value == 'document_object') {
                icon = 'mdi mdi-file-document-outline';
            } else if (value == 'user') {
                icon = 'mdi-account-multiple-outline';
            } else if (value == 'Tất cả') {
                icon = 'mdi-all-inclusive';
            } else if (value == 'document_definition') {
                 icon = 'mdi mdi-file-outline';
            } else if (value == 'workflow_definition') {
                icon = 'mdi mdi-lan';
            } else if (value == 'orgchart') {
                 icon = 'mdi mdi-sitemap';
            } else if (value == 'process_definition') {
                 icon = 'mdi mdi-sitemap';          
            } else if (value == 'application_deninition') {
                 icon = 'mdi mdi-apps';         
            } else if (value == 'syql') {
                 icon = 'mdi mdi-alpha-f';          
            } else if (value == 'dataflow') {
                 icon = 'mdi mdi-arrange-send-to-back';          
            } else {
                 icon = 'mdi mdi-sitemap';     }
            return icon

        },
        formatGroupName(value) {
            let name = '';
            if (value == 'document_object') {
                name = 'Văn bản';
            } else if (value == 'user') {
                name = 'Nhân viên'
            } else if (value == 'document_definition') {
                name = 'Loại văn bản'
            } else if (value == 'workflow_definition') {
                name = 'Workflow'
            } else if (value == 'orgchart') {
                name = 'Sơ đồ tổ chức'
            } else if (value == 'orgchart') {
                name = 'Loại văn bản'
            } else if (value == 'process_definition') {
                name = 'Quy trình'
            } else if (value == 'application_deninition') {
                name = 'Ứng dụng'
            } else if (value == 'syql') {
                name = 'Công thức'
            } else if (value == 'dataflow') {
                name = 'Data flow'
            } else {
                name = value;
            }
            return name
        },
        showDotButton(id) {
            this.newSearch[id].enable = true;
        },
        hideDotButton(id) {
            this.newSearch[id].enable = false;
        },
        setMenu(){
          //  debugger
            let menu = ['Tất cả'];
            for (let i = 0; i < this.newSearch.length; i++) {
                // console.log(this.newSearch[i].group);
                let name = Object.keys(this.newSearch[i]);
                if (name[0] == 'group') {
                    menu.push(this.newSearch[i].group);
                }
            };
            this.$store.commit('search/setMenu', menu);
        },
        detailView(type) {
            if(type=="Tất cả"){
                 this.$store.commit('search/setShowGeneral', true);
            }else{
             this.$store.commit('search/setShowGeneral', false);
            this.showDetail = true;
            this.type = type;
            this.nameResult = this.formatGroupName(type);
            this.$store.commit('search/setCountResult', this.newSearchAll.filter(x => x.type== type ).length);
           // debugger
            if(type=='user'){this.checkUser==true};
            this.$store.commit('search/setType', type);}
           // this.$router.push('/search/detail');
        },
         formatName(name,number){
            if(name.length>number){
                return name.slice(0,number)+"...";
            }
            else{
                return name
            }
        },
         gotoPage(action, type,id, name) {
            this.defineAction[type].action = action;
            //console.log(this.defineAction[type]);
            this.$evtBus.$emit('symper-app-call-action-handler', this.defineAction[type], this, {id:id,name:name, title:name});
        },
    },
    watch: {
        newSearch() {
            this.$store.commit('search/setCountResult', this.newSearchAll.length);
            this.setMenu();
        },
        wordSearch() {
            if(this.wordSearch==''||this.wordSearch==null){
                debugger
                this.$store.commit('search/setMenu', []);
                this.$store.commit('search/setCountResult', 0);
                this.$store.commit('search/setSearch', []);
                this.$store.commit('search/setSearchAll', []);
                 this.nameResult ='toàn bộ hệ thống';

            }else{
                this.showDetail = false;
                this.$store.commit('search/setCountResult', this.newSearch.length);
                this.$store.commit('search/setShowGeneral', true);
                
            }
        },
        
        showGeneral(){
            if(this.showGeneral==false){this.showDetail = true;};
            if(this.showGeneral){this.showDetail = false;  this.nameResult ='toàn bộ hệ thống';};
        },
    },
    data: () => {
        return {
            showDetail:false,
            nameResult:' toàn bộ hệ thống',
            type:'',
            listSearchAll: [],
            checkUser:false,
            action:{

            },
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
        }
    }
}
</script>  
<style scoped>
.fm {
    font-family: Roboto;
}

.v-list-item:hover {
    background: rgba(0, 0, 0, 0.05);
}

.sub-title {
    color: rgba(0, 0, 0, 0.3) !important
}

.color-blue {
    color: #0D66D0;
}

.action-button:hover {
    background: rgba(0, 0, 0, 0.05);
}

</style>
<style scoped lang="scss">
.general ::v-deep .v-list-item{
    padding: 0px
}
.slider-button-right{
   margin-left:-55px;
}
.slider-button-left{
   margin-left:-55px;
}
.slider-user-button{
    border-radius: 20px; 
    border: 1px solid grey;
    background-color:white;
    z-index:3
}
.slider-user{
     width: 250px!important; 
     border:1px solid rgba(0,0,0,0.2)
}
.general ::v-deep .v-slide-group__prev{
    margin-right:-35px!important;
    margin-top:15px;
     z-index:1!important; position: absolute!important;
    min-width: -1px!important;
}
</style>
<style >
    .v-slide-group__next,.v-slide-group__prev{
    min-width: -1px!important;
     margin-right:-35px!important;
}
</style>
