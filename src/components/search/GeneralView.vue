<template>
<div style="width:100%; height:100%">
    <v-card class="d-flex justify-start" height="100%">
<v-col cols="md-2">
        <v-navigation-drawer absolute permanent left>
            <template v-slot:prepend>
                <v-list-item-content>
                    <v-list-item-title class="fs-15 ml-5 fm">
                        <i class="mdi mdi-magnify"></i>
                        Vị trí tìm kiếm</v-list-item-title>
                </v-list-item-content>
            </template>
            <v-list dense>
                <v-list-item v-for="(item,menuIdx) in menu" :key="menuIdx">
                    <v-list-item-icon>
                        <v-icon>mdi mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content @click="detailView(item)">
                        <v-list-item-title>{{formatGroupName(item)}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-col>
     <v-col cols="md-10" class="ml-1 mr-3">
            <!-- dòng kết quả tìm kiếm -->
            <v-row>
                <v-list-item-content class="fm mb-2">
                    <v-list-item-title class="fs-15 ml-5 fm mb-2">
                        Kết quả tìm kiếm trong {{nameResult}}
                    </v-list-item-title>
                    <v-list-item-subtitle class="sub-title fs-12 ml-5 fm">Từ khoá "{{wordSearch}}" có {{countResult}} kết quả phù hợp</v-list-item-subtitle>
                </v-list-item-content>
            </v-row>
            <!-- kết thúc kết quả tìm kiếm -->
            <!-- danh sách kết quả  -->
            <v-row v-if="showGeneral" v-for="(item,i) in listSearch.filter(x => x.group!= 'user'&&x.type!= 'user')" :key="i" style="margin-top:-18px">
                <v-row v-if="item.group" class="ml-1 mt-2 mr-4">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="item-header">{{formatGroupName(item.group)}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <button @click="detailView(item.group)" class="fs-11 color-blue fm">Xem tất cả</button>
                        </v-list-item-action>
                    </v-list-item>
                </v-row>
                <v-row v-else-if="item.type !== 'user'" 
                    @mouseleave="hideDotButton(i)" 
                     @mousemove="showDotButton(i)" 
                    class="mt-1 ml-1">
                    <!-- danh sách tìm thấy không bao gồm user -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title style="margin-left: 0.5rem" class="item-title fs-13 mb-2" v-html="item.displayName">
                            </v-list-item-title>
                            <v-list-item-subtitle style="margin-left: 0.5rem" class="fs-12 sub-title">{{item.description}}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action v-show="item.enable&&item.actions.length>0" class="dot" >
                            <v-menu offset-y transition="scale-transition" style="width:50px!important">
                                <template v-slot:activator="{ on }">
                                    <button v-on="on">
                                        <i style="height:20px!important;width:20px!important" 
                                        class="mr-10 dot mdi mdi-dots-horizontal"></i>
                                    </button>
                                </template>
                                <v-list>
                                    <v-row>
                                        <v-list-item-title v-for="itemsAction in item.actions" 
                                         @click="gotoPage(itemsAction,item.type,item.id,item.displayName)">
                                            {{itemsAction}}
                                        class="fm fs-13 ml-6 action-button" style="width:50px!important" >
                                            {{itemsAction}}
                                        </v-list-item-title>
                                    </v-row>
                                </v-list>
                            </v-menu>
                        </v-list-item-action>
                    </v-list-item>
                </v-row>
            </v-row>
            <v-row v-for="item in listSearch.filter(x => x.group == 'Nhân viên' )" style="margin-top:-18px">
                <v-row v-if="item.group" class=" mt-2 ml-1 mb-2 mr-4">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="item-header">{{formatGroupName(item.group)}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <button @click="detailView(item.group)" class="fs-11 color-blue fm">Xem tất cả</button>
                        </v-list-item-action>
                    </v-list-item>
                </v-row>
            </v-row>
            <v-row  v-if="showGeneral" class="ml-2">
                <!-- kết thúc danh sách tìm  -->
                <v-sheet max-width="1100">
                    <v-slide-group multiple show-arrows>
                        <v-slide-item v-for="item in listSearch.filter(x => x.type== 'user' )" >
                            <div class="d-flex justify-start mr-3 " style="width: 250px!important; border:1px solid rgba(0,0,0,0.2">
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
            <!-- kết thúc danh sách  -->
            <!-- danh sách tìm kiếm chi tiết -->
            <v-row class="mb-2" v-if="showDetail" v-for="(item,i) in newSearchAll.filter(x => x.type== type||x.group==type )" :key="i" style="margin-top:-18px">
                    <v-row v-if="item.group" class="ml-1 mt-2 mr-4">
                </v-row>
                <v-row v-else-if="item.type != 'user'&&item.type !='application'" 
                    @mouseleave="hideDotButton(i)" 
                     @mousemove="showDotButton(i)" 
                    class="mt-1 ml-1">
                    <!-- danh sách tìm thấy không bao gồm user -->
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title style="margin-left: 0.5rem" class="item-title fs-13 mb-2" v-html="item.displayName">
                            </v-list-item-title>
                            <v-list-item-subtitle style="margin-left: 0.5rem" class="fs-12 sub-title">{{item.description}}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action v-show="item.enable&&item.actions.length>0" class="dot" >
                            <v-menu offset-y transition="scale-transition" style="width:50px!important">
                                <template v-slot:activator="{ on }">
                                    <button v-on="on">
                                        <i style="height:20px!important;width:20px!important" 
                                        class="mr-10 dot mdi mdi-dots-horizontal"></i>
                                    </button>
                                </template>
                                <v-list>
                                    <v-row>
                                        <v-list-item-title v-for="itemsAction in item.actions" 
                                         @click="gotoPage(itemsAction,item.type,item.id,item.displayName)"
                                        class="fm fs-13 ml-6 action-button" style="width:50px!important" >
                                            {{itemsAction}}
                                        </v-list-item-title>
                                    </v-row>
                                </v-list>
                            </v-menu>
                        </v-list-item-action>
                    </v-list-item>
                </v-row>
                <!-- phần user -->
                <v-row v-else-if="item.type == 'user'" 
                    class="mt-1 ml-1">
                    <!-- danh sách tìm thấy không bao gồm user -->
                </v-row>
            </v-row>
            <!-- kết thúc tìm kiếm chi tiết -->
            <!-- trang dành cho user -->
             <v-row  v-if="showDetail&&checkUser" class="mt-4">
               <v-col cols="12" 
          md="3" v-for="item in listSearch.filter(x => x.type== 'user' )" >
                            <div class="d-flex justify-start mr-3 " style="width: 250px!important; border:1px solid rgba(0,0,0,0.2">
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
            <!-- dành cho user -->
        </v-col>
           </v-card>
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
        }
    },
    methods: {
        getDataMenu() {
            alert('menu');
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
            this.listSearch[id].enable = true;
        },
        hideDotButton(id) {
            this.listSearch[id].enable = false;
        },
        detailView(type) {
            this.showGeneral = false;
            this.showDetail = true;
            this.type=type;
            this.nameResult = this.formatGroupName(type);
            this.countResult = this.newSearchAll.filter(x => x.type== type ).length
            if(type=='user'){this.checkUser==true};
            this.$store.commit('search/setType', type);
           // this.$router.push('/search/detail');
        },
         gotoPage(action, type,id, name) {
            debugger
            this.defineAction[type].action = action;
            //console.log(this.defineAction[type]);
            this.$evtBus.$emit('symper-app-call-action-handler', this.defineAction[type], this, {id:id,name:name, title:name});
        },
        getMenu() {
            // debugger
            this.menu = [];
            this.listSearch = this.newSearch;
            // console.log("list Search");
            // console.log(this.listSearch);
            let menu = [];
            for (let i = 0; i < this.newSearch.length; i++) {
                // console.log(this.newSearch[i].group);
                let name = Object.keys(this.newSearch[i]);
                if (name[0] == 'group') {
                    this.menu.push(this.newSearch[i].group);
                }
            }
            // console.log(this.menu)
        }
    },
    watch: {
        newSearch() {
            this.getMenu();
            this.countResult = this.listSearch.length;
        },
        wordSearch() {
            this.showGeneral= true;
            this.showDetail = false;

            // this.listSearch = [];
            // this.menu = [];

            // this.getMenu();
        },
    },
    data: () => {
        return {
            showGeneral:true,
            showDetail:false,
            menu: [],
            nameResult:' toàn bộ hệ thống',
            type:'',
            listSearch: [],
            listSearchAll: [],
            checkUser:false,
            countResult: 0,
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
<style>
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

.v-menu__content {
    width: 100px;
}
</style>