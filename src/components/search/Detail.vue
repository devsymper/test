<template>
     <v-col cols="md-10" class="ml-1 mr-3">
            <!-- dòng kết quả tìm kiếm -->
            <v-row>
                <v-list-item-content class="fm mb-2">
                    <v-list-item-title class="fs-15 ml-5 fm mb-2">
                        Kết quả tìm kiếm trong toàn bộ hệ thống
                    </v-list-item-title>
                    <v-list-item-subtitle class="sub-title fs-12 ml-5 fm">Từ khoá "{{wordSearch}}" có {{getCountResult()}} kết quả phù hợp</v-list-item-subtitle>
                </v-list-item-content>
            </v-row>
            <!-- kết thúc kết quả tìm kiếm -->
            <!-- danh sách kết quả  -->
            <v-row v-for="(item,i) in listSearch.filter(x => x.group!= 'user'&&x.type!= 'user')" :key="i" style="margin-top:-18px">
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
            <v-row v-for="item in listSearch.filter(x => x.group== 'Nhân viên' )" style="margin-top:-18px">
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
            <v-row class="ml-3">
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
        </v-col>
</template>
<script>
export default {
     computed: {
        newSearch() {
            return this.$store.state.search.newSearch;
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
        getCountResult() {
            return this.listSearch.length;
        },
        showDotButton(id) {
            this.listSearch[id].enable = true;
        },
        hideDotButton(id) {
            this.listSearch[id].enable = false;
        },
        detailView(type) {
            this.$store.commit('search/setType', type);
            this.$router.push('/search/detail');
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
        },
        wordSearch() {
            // this.listSearch = [];
            // this.menu = [];

            // this.getMenu();
        },
        rule: () => {
            if (this.rule == null) this.clearRule()
        }
    },
    data: () => {
        return {
            menu: [],
            listSearch: [],
            nothing: null
        }
    }
}
</script>  
<style>
/* .fm {
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
} */
</style>