<template>
    <div style= "width:100%; height:100%">
        <v-card class="d-flex justify-start" height="100%">
        <v-col cols="md-2">
      <v-navigation-drawer
        absolute
        permanent
        left
      >
        <template v-slot:prepend>
            <v-list-item-content>
              <v-list-item-title class= "fs-15 ml-5 fm">
                  <i class="mdi mdi-magnify"></i>
                  Vị trí tìm kiếm</v-list-item-title>
            </v-list-item-content>
        </template>
        <v-list dense>
          <v-list-item
            v-for="item in menu"
            :key="item.title"
          >
            <v-list-item-icon>
              <v-icon>mdi mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content @click="getDataMenu()"> 
              <v-list-item-title>{{ item}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
       </v-col>
       <v-col cols="md-10" class="ml-1 mr-3" style="margin-top:-11px">
         <!-- dòng kết quả tìm kiếm -->
           <v-row>
             <v-list-item-content class="fm mb-2">
                <v-list-item-title class= "fs-15 ml-5 fm mb-2">
                  Kết quả tìm kiếm trong toàn bộ hệ thống
              </v-list-item-title>
               <v-list-item-subtitle  class= "sub-title fs-12 ml-5 fm" >Từ khoá "{{wordSearch}}" có {{getCountResult()}} kết quả phù hợp</v-list-item-subtitle>
            </v-list-item-content>
           </v-row>
           <!-- kết thúc kết quả tìm kiếm -->
           <!-- danh sách kết quả  -->
          <v-row v-for="item in listSearch"  style="margin-top:-18px">
            <v-row v-if="item.group" class="ml-1 mb-1 mr-4">
                <v-list-item >
                    <v-list-item-content >
                        <v-list-item-title class="item-header" v-html="item.group"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <button class="fs-11 color-blue fm">Xem tất cả</button>
                    </v-list-item-action>
                </v-list-item>
            </v-row >
            <v-row v-else class="ml-3 mb-2">
                <v-list-item>
                    <v-list-item-avatar class="item-avatar" v-if="item.type === 'user'">
                        <img :src="item.avatar || require('@/assets/image/avatar_default.jpg')">
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title 
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}" 
                            class="item-title fs-13 mb-2" v-html="item.displayName">
                        </v-list-item-title>
                        <v-list-item-subtitle 
                            :style="{'margin-left': item.type === 'user' ? '0' : '0.5rem'}" 
                            class="fs-12 sub-title" >{{item.description}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
           </v-row>
          </v-row>
           <!-- kết thúc danh sách  -->
        <div class="d-flex ml-4 mr-10" style="width:100%" height="100%">
    </div>
     </v-col>
    </v-card>
    <v-col>
</v-col>
    </div>
</template>
<script>
export default {
    computed:{
        newSearch(){
          return this.$store.state.search.newSearch;
        } ,
        wordSearch() {
          return this.$store.state.search.wordSearch;
         
      }
    },
    methods:{
        getDataMenu(){
            alert('menu');
        },
        getCountResult(){
            return this.listSearch.length;
        },
        getMenu(){
           // debugger
            this.menu = [];
            this.listSearch = this.newSearch;
            let menu = []
            for(let i = 0; i<this.newSearch.length; i++){
               // console.log(this.newSearch[i].group);
                let name = Object.keys(this.newSearch[i]);
                if(name[0] =='group'){
                   this.menu.push(this.newSearch[i].group);
                }
            }
           // console.log(this.menu)
        }
    },
    watch:{
        newSearch(){
            this.getMenu(); 
        },
        wordSearch(){
          this.listSearch = [];
          this.menu = [];

         // this.getMenu();
        }
    },
    data:()=> {
        return {
            menu:[],
            listSearch:[],
            }
        }
    }
</script>
<style>
.fm{
    font-family:Roboto;
}
.v-list-item:hover{
    background:rgba(0,0,0,0.05);
}
.sub-title{
    color:rgba(0,0,0,0.3)!important
}
.color-blue{
  color:#0D66D0;
}
</style>