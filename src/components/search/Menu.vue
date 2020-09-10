<template>
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
                    <v-list-item-content @click="getDataMenu()">
                        <v-list-item-title>{{formatGroupName(item)}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
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
            }else if(value == 'orgchart'){
                name =  'Loại văn bản'
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
        },
        detailView(type){
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
    },
    data: () => {
        return {
            menu: [],
            listSearch: [],
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
} */

</style>
