<template>
    <div class="home h-100 w-100">
         <v-dialog
            v-model="dialog"
            width="397"
        >
            <NotificationChangePass @cancel="cancelDialog()"/>
        </v-dialog>
        <Dashboard></Dashboard>
    </div>
</template>
<script>
import Dashboard from "@/views/dashboard/Dashboard.vue";
import NotificationChangePass from "./../components/notification/notificationChangeFirstPass";
import { userApi } from "./../../src/api/user";

export default {
    name: "Home",
    methods: {
        runDataflow(){
            this.$refs.dataflow.runDataflow();
        },
        addNum() {
            this.num += 1;
        },
        cancelDialog(){
            this.dialog = false;
            this.$store.commit('app/changeStatus', 1)
        },
        checkStatus(){
            if(this.sapp.endUserInfo.status==2){
                this.dialog = true;
            }
        },
        setDetailInfo(){
            this.detailInfoUser.lastName =this.sapp.endUserInfo.lastName;
            this.detailInfoUser.displayName =this.sapp.endUserInfo.displayName;
			this.detailInfoUser.firstName =this.sapp.endUserInfo.firstName;
			this.detailInfoUser.email =this.sapp.endUserInfo.email;
			this.detailInfoUser.phone =this.sapp.endUserInfo.phone;
			this.detailInfoUser.status =this.sapp.endUserInfo.status;
            this.detailInfoUser.avatarUrl =this.sapp.endUserInfo.avatar;
            this.detailInfoUser.id = this.sapp.endUserInfo.id
            
		},
        getUserInfo(){
            userApi.getDetailUser(this.sapp.endUserInfo.id).then(res => {
                if (res.status == 200) {
                  if(res.status){
                      this.isShowChangePassFirstLogin = true
                  } 
                }
            })
            .catch(err => {
                console.log("error from change pass user api!!!", err);
            })
        }
    },
    created(){
        this.getUserInfo();
        this.checkStatus();
    },
    watch:{
        showUserInfo(){
            this.setDetailInfo();
            if(this.showUserInfo==false){
                this.$store.commit('user/setShowUser', false);
            }
        }
    },
     computed:{
         sapp() {
            return this.$store.state.app;
        },
        showUserInfo(){
            return this.$store.state.user.showUserInfo;
        }
    },
    data() {
        return {
            editorTest: 'abc xys',
            testData: [],
            detailInfoUser:{},
            dialog:false,
            searchKey:"",
            isShowChangePassFirstLogin:false,
            selectedPermission: [
                    {
                        id: 'xxx',
                        name: 'Permission 1',
                        description: 'Permission 1 description',
                    },
                    {
                        id: 'yyy',
                        name: 'Permission 1',
                        description: 'Permission 1 description',
                    },
            ],
            color: '#000000',
            formula: 'SELECT * FROM abc',
            testModel: [{"idNode":"14bcc081-771e-490a-8254-bced2d7acab2","idOrgchart":"689"},{"idNode":"919ba806-73e5-4cb6-bbd8-6c7e3c44455a","idOrgchart":"689"}],
            num: 0,
            allInputs: {
                numeric: {
                    title: "Numeric",
                    type: "numeric",
                    value: 12365,
                    validate: ["empty", "phone"]
                },
                text: {
                    title: "Text",
                    type: "text",
                    value: 12365,
                    validate: ["empty", "phone"]
                },
                sex: {
                    title: "Giới tính",
                    type: "select",
                    value: "male",
                    validate: [],
                    options: [
                        {
                            text: "Nam",
                            value: "male",
                            icon: "mdi-human-male"
                        },
                        {
                            text: "Nữ",
                            value: "female",
                            icon: "mdi-human-female"
                        }
                    ]
                }
            }
        };
    },
    components: {
        NotificationChangePass,
        Dashboard,
    }
};
</script>
