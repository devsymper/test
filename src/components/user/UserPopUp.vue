<template>
    <div style="width: 300px;background-color:white;" class="user-popup">
        <div class="pt-3 pl-4 fs-15 fw-430" style="background-color:white;">
            {{detailUser.firstName?detailUser.firstName:' '+' '+ detailUser.lastName?detailUser.lastName:' '}}
            <div  v-if="rolesOgchart.length>0" class="fs-13 fw-430"  >
                <v-menu :nudge-left="175">
                    <template  v-slot:activator="{ on}">
                        <span  v-on="on" class='fm fw-400'>
                            {{rolesOgchart[0].name}} 
                            <span class="color-blue">
                            +{{rolesOgchart.length}}
                            </span>
                        </span>
                        </template>
                        <v-row class="pl-4 pt-2 fs-13" style=" width:180px!important; background-color:white!important" v-for="(rolesOg,index) in rolesOgchart" :key='index'>
                            {{rolesOg.name}}
                              <v-icon  color="green" v-if="currentRole.id == rolesOg.id">
                            mdi-check
                        </v-icon>
                        </v-row>
                </v-menu>	
            </div>
            <div v-else>
            </div>
        </div>
        <v-row class="ml-4">
            <v-col class="col-md-7">
                <v-row class="fs-13 mb-1">
                    <i class="mdi-20px mdi mdi-account-circle mr-1"></i>{{detailUser.userName}}
                </v-row>
                <v-row class="fs-13 mb-1" v-if="detailUser.phone">
                    <i class="mdi-20px mdi mdi-phone mr-1"></i>{{detailUser.phone}}
                </v-row>
                <v-row class="fs-13 mb-1"  v-if="detailUser.email">
                   <i class="mdi-20px mdi mdi-email mr-1"></i>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <span v-on="on" style="width:90%" class="text-ellipsis">{{detailUser.email}}</span>
                        </template>
                        <span>{{ detailUser.email }}</span>
                    </v-tooltip>
                </v-row>
                <v-row class="fs-13 mb-1">
                   <i class="mdi-20px mdi mdi-border-color mr-1"></i> Ngày tạo: {{detailUser.createAt}}
                </v-row>
                <v-row class="fs-13 mb-1">
                    <i class="mdi-20px mdi mdi-phone mr-1"></i>Tình trạng: <span class="ml-1" v-html="detailUser.status"></span>
                </v-row>
            </v-col>
            <v-col class="col-md-5">
                <symperAvatar :size="100" style="margin-left:-20px; border-radius:1px solid red" :userId="detailUser.id" />
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { orgchartApi } from "./../../api/orgchart.js";
import symperAvatar from './../../components/common/SymperAvatar';
import dayjs from 'dayjs';
import {userApi} from './../../api/user'
export default {
    props:['userId'],
    watch: {
        userId(){
            this.getDetailUser();
            this.getRoleOrgchartByUser();
        }
    },
    components:{
        symperAvatar
    },
    created () {
        this.getDetailUser();
        this.getRoleOrgchartByUser();
      },
    computed:{
        currentRole(){
                return this.$store.state.app.endUserInfo.currentRole;
            }
    },
  methods: {
      reNameStatus(status){
          if(status==1){
              return "<span class='color-green'> Hoạt động</span> "
          }else if(status==0){
              return "<span style='color:orange'> Khóa</span> "
          }else{
              return "<span class='color-red'> Tạo mới</span> "
          }
      },
    async getRoleOrgchartByUser(){
        const self = this;
        let res = await orgchartApi.getRolesByUser([{idUser: this.userId}])
        if (res.status === 200) {
            self.rolesOgchart = res.data[0].roles
        }	
	},
     async getDetailUser(){
        const self= this;
        let res = await userApi.getDetailUser(this.userId);
            if(res.status==200){
                self.detailUser = res.data.user;
                self.detailUser.createAt = dayjs(self.detailUser.createAt).format('DD/MM/YYYY');
                self.detailUser.status= self.reNameStatus(self.detailUser.status);
            }               
        }
  
    },
    data () {
        return {
            detailUser:{},
            rolesOgchart:[]
        }
    },
    
}
</script>
<style scoped>
    .user-popup ::v-deep .v-menu__content{
        background-color: white!important
    }
 
    .color-blue:hover{
        cursor: pointer;
        text-decoration-line:underline;
    }
</style>