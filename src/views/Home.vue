<template>
    <div class="home h-100 w-100">
        <!-- <v-text-field
            label="Prepend"
            prepend-icon="mdi-map-marker"
            v-model="searchKey"
          ></v-text-field>
        <OrgchartElementSelector v-model="testData" :searchKey="searchKey"/> -->
        <!-- <v-btn @click="runDataflow" color="primary">Primary</v-btn> -->
         <v-dialog
            v-model="dialog"
            width="397"
        >
            <NotificationChangePass @cancel="cancelDialog()"/>
        </v-dialog>
        <Dashboard></Dashboard>
        <!-- <SymperActionView 
            :actionDef="{
                module: 'document',
                resource: 'document_definition',
                scope: 'document',
                action: 'edit'
            }"
            :param="{
                id: 1944,
                title: 'xxxx',
                name: 'yyyy'
            }" /> -->
    </div>
</template>
<script>
import FormTpl from "./../components/common/FormTpl.vue";
import OrgchartElementSelector from "./../components/common/OrgchartElementSelector.vue";
import OrgchartSelector from "./../components/user/OrgchartSelector.vue";
import TimelineTreeview from "./../components/common/TimelineTreeview";
import Handsontable from 'handsontable';
import FormulaEditor from "./../components/formula/editor/FormulaEditor";
import SymperColorPicker from "@/components/common/symperInputs/SymperColorPicker.vue";
import PermissionSelector from "@/components/permission/PermissionSelector.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import EmbedDataflow from "./../components/dataflow/EmbedDataflow";
import NotificationChangePass from "./../components/notification/notificationChangeFirstPass";
import { userApi } from "./../../src/api/user";
import SymperActionView from "./../action/SymperActionView";

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
        OrgchartElementSelector,
        "form-tpl": FormTpl,
        'orgchart-selector': OrgchartSelector,
        TimelineTreeview,
        NotificationChangePass,
        FormulaEditor: FormulaEditor,
        SymperColorPicker: SymperColorPicker,
        PermissionSelector,
        Dashboard,
        EmbedDataflow,
        SymperActionView
    }
};
</script>
