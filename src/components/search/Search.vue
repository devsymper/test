<template>
<div >
    <v-autocomplete @keydown="enter" style = "width: 400px" class="auto-complete"  
        :hide-no-data="true" no-filter :items="searchItems"
        menu-props="offset-y top=40"
        :search-input.sync="value" label="Tìm kiếm" >
        <template v-slot:item="{ item, attrs, on }">
            <template v-if="item.group">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="item-header" v-html="item.group"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <template v-else>
                <v-list-item :attrs="attrs">
                    <v-list-item-avatar class="item-avatar" v-if="item.type === 'user'">
                        <img :src="item.avatar || require('@/assets/image/avatar_default.jpg')">
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title 
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}" 
                            class="item-title" v-html="item.displayName">
                        </v-list-item-title>
                        <v-list-item-subtitle 
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}" 
                            class="item-subtitle" v-html="item.searchField">
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
     
            </template>
        </template>
    </v-autocomplete>
</div>
</template>
<script>
import _ from 'lodash';
import searchApi from "../../api/search.js";
export default {
     data: function () {
        return {
            value: '',
            searchItems: [],
        };
    },
    methods:{
        enter(event){
            if (event.code == "Enter"){
            this.$router.push('/search/general');
            };
            this.searchItems = [];

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
                name =  'Quy trình'
            }else if(value == 'orgchart'){
                name =  'Sơ đồ tổ chức'
            }else if(value == 'orgchart'){
                name =  'Loại văn bản'
            }else if(value == 'process_definition'){
                name =  'Quy trình'
            }else if(value == 'application_deninition'){
                name =  'Ứng dụng'
            }else if(value == 'sql'){
                name =  'Công thức'
            }else{
                name = value;}
            return name
        }
    },
    watch: {
        value(newVal) {
            this.searchItems = [];
            this.$store.commit('search/setWordSearch', newVal);  
            if (newVal) {
                const self = this;
                if(newVal){
                searchApi.getData(newVal)
                    .then(res => {
                        if (res.status === 200) {
                            console.log('Đã gửi thành công');
                            // display name, search field, type, avatar (user)
                            const regex = new RegExp(newVal,"gi");
                            const normalizedData = res.data.map(data => {
                                const returnObjSearch = {};
                                returnObjSearch.displayName = data.type === 'user' ? data.displayName : data.name;
                                const keys = Object.keys(data);
                                // xử lý bôi cam
                                for (let i = 0, len = keys.length; i < len; i++) {
                                    const key = keys[i];
                                    if (typeof data[key] === 'string' && data[key].toLowerCase().includes(newVal.trim().toLowerCase())) {
                                        returnObjSearch.normalField = key + ": " + data[key];
                                        returnObjSearch.searchField = key + ": " + data[key].substring(0, 40)
                                            .replace(regex, x => '<span style="color: orange; font-weight: bold">'+x+'</span>');
                                        break;
                                    }
                                }
                                //console.log(data);
                                returnObjSearch.searchField = returnObjSearch.searchField || "";
                                returnObjSearch.avatar = data.avatar;
                                returnObjSearch.type = data.type;
                                returnObjSearch.description = data.description?data.description:(data.description==null||data.description==''?"Mô tả đang để trống":"Symper");
                                return returnObjSearch;
                            })
                            const groupByType = _.groupBy(normalizedData, 'type');
                            const searchData = [];
                            const allData = [];
                            Object.keys(groupByType).forEach(type => {
                                let name = self.formatGroupName(type);
                                searchData.push({group: name });
                                allData.push({group: name });
                                searchData.push(...groupByType[type].slice(0, 3));
                                allData.push(...groupByType[type]);
                            })
                            self.searchItems = searchData;
                            self.$store.commit('search/setSearch', searchData);
                          
                        }
                    })
                    .catch(err => {
                        console.log('Đã gửi mà lỗi');
                        console.log(err);
                       self.searchItems = [];
                    });
            }
        }
         else{
            this.searchItems = [];
            this.$store.commit('search/setSearch', this.searchItems); 
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
    margin-left: 0.5rem;
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
    font-size: 13px;
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
    height: 25px
}

.auto-complete ::v-deep .v-input__icon {
    padding-bottom: 6px !important
}

.auto-complete ::v-deep .v-select__slot>input {
    padding-top: 10px;
    padding-left:5px;
}

.auto-complete ::v-deep .v-input__icon>button {
    font-size: 14px !important
}

</style>
<style >
.v-autocomplete__content{
    max-width: 400px!important;
    /* top: 40px!important; */
  
}
.v-list-item:hover{
    background:rgba(0,0,0,0.05);
}
.v-select__slot{
    font-size:13px;

}
</style>