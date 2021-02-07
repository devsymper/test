<template>
    <v-dialog
        v-if="isShow"
        v-model="isShow"
        persistent
        max-width="500px"
        scrollable
    >
        <v-card>
        <v-card-title>
            <span class="fs-16">Version</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <div>
                    <form-tpl
                    :allInputs="dataVersionProps"/>
                </div>
                <div class="d-flex justify-space-between">
                    <div style="width:47%">
                        <span class="mt-2 fs-11">Start Date</span>
                        <v-menu
                            ref="menuStart"
                            v-model="menuStart"
                            :close-on-content-click="false"
                            :return-value.sync="dateStart"
                            transition="scale-transition"
                            offset-y
                            style="width:150px"
                            min-width="100"
                            >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                class="fs-13 symper-text"
                                :error-messages="msgErrStartTime"
                                v-model="dateStart"
                                dense
                                outlined
                                single-line
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                background-color="grey lighten-3"
                                flat
                                @changeStart="handleChangeInputStart"
                                v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="datePickerValueStart" 
                                no-title
                                scrollable
                                :min="currDate"
                                @input="selectDateStart"
                            >
                            </v-date-picker>
                        </v-menu>
                    </div>
                    <div style="width:47%">
                        <span class="mt-2 fs-11">End Date</span>
                        <v-menu
                            ref="menuEnd"
                            v-model="menuEnd"
                            :close-on-content-click="false"
                            :return-value.sync="dateEnd"
                            transition="scale-transition"
                            offset-y
                            style="width:150px"
                            min-width="100"
                            >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                class="fs-13 symper-text"
                                v-model="dateEnd"
                                :error-messages="msgErrEndTime"
                                dense
                                outlined
                                single-line
                                background-color="grey lighten-3"
                                flat
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                @changeEnd="handleChangeInputEnd"
                                v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="datePickerValueEnd" 
                                no-title
                                scrollable
                                :min="currDate"
                                @input="selectDateEnd"
                            >
                            </v-date-picker>
                        </v-menu>
                    </div>
                </div>
                
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                v-if="!statusDetail"
                :loading="isLoadingAdd"
                class="btn-add"
                @click="handleAddVersion"
            >
                {{$t("common.add")}}
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                v-else
                :loading="isLoadingAdd"
                :disabled="disabled"
                class="btn-add"
                @click="handleUpdateVersion()"
            >
                {{$t("common.update")}}
            </v-btn>

            <v-btn
            color="red darken-1"
            text
            @click="isShow = false"
            >
                {{$t("common.close")}}
            </v-btn>
        
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import { taskManagementApi } from "@/api/taskManagement.js";
import VersionWorker from 'worker-loader!@/worker/taskManagement/version/Version.Worker.js';

export default {
    components:{
        FormTpl,
    },
    props:{
        dataVersionProps: {
            type: Object,
            default() {
                return {
                    name : { 
                        title: "Name",
                        type: "text",
                        value: '',
                        validateStatus:{
                            isValid:true,
                            message:"Error"
                        },
                        validate(){
                            if (this.value=="") {
                                this.validateStatus.isValid=false;
                                this.validateStatus.message="Không bỏ trống";
                            }else{
                                this.validateStatus.isValid=true;
                                this.validateStatus.message="";
                            }
                        }
                    },
                    description : {
                        title: "Mô tả",
                        type: "text",
                        value: '',
                        validateStatus:{
                            isValid:true,
                            message:""
                        },
                        validate(){
                        }
                    },
                   
                }
            }
        },
        infoVersion: {
            type: Object,
            default() {
                return {
                    id:"",
                    name: "",
                    description: "",
                    startTime:"",
                    status:0,
                    endTime:"",
                }
            }
        },
        statusDetail:{
            type:Boolean,
            default:false,
        },
     
    },
    watch: {
        infoVersion:{
            deep:true,
            immediate:true,
            handler(newVl){
                this.dateStart=newVl.startTime;
                this.dateEnd=newVl.endTime;
            }
        },
        dataVersionProps: {
            deep: true,
            immediate:true,
            handler(newVl){
                if (newVl.name.value == this.infoVersion.name &&
                    newVl.description.value == this.infoVersion.description )
                {
                    this.disabled=true;
                }else{
                    this.disabled=false;
                }
            }
        },
        dateStart(val){
            if(!val){
                this.datePickerValueStart = this.$moment(val)._isValid ? val : this.$moment().format("YYYY-MM-DD");
            }
            if (val && this.dateEnd) {
                if( (new Date(val).getTime() > new Date(this.dateEnd).getTime()))
                {
                    this.msgErrStartTime="Ngay khong hop le !!!";
                    this.msgErrEndTime='';
                }else{
                    this.msgErrStartTime='';
                    this.msgErrEndTime='';
                }
            }
            if (val == this.infoVersion.startTime) {
                this.disabled=true;
            }else{
                this.disabled=false;
            }
        },
        dateEnd(val){
            if(!val){
                this.datePickerValueEnd = this.$moment(val)._isValid ? val : this.$moment().format("YYYY-MM-DD");
            }
            if (val && this.dateStart) {
                if( (new Date(val).getTime() < new Date(this.dateStart).getTime()))
                {
                    this.msgErrEndTime="Ngay khong hop le !!!";
                    this.msgErrStartTime='';

                }else{
                    this.msgErrStartTime='';
                    this.msgErrEndTime='';
                }
            }
            
            if (val == this.infoVersion.endTime) {
                this.disabled=true;
            }else{
                this.disabled=false;
            }
        },
     
    },
    data(){
        return{
            versionWorker:null,
            msgErrStartTime:'',
            msgErrEndTime:'',
            dateStart: "",
            menuStart: false,
            datePickerValueStart: '',
            dateEnd: "",
            menuEnd: false,
            datePickerValueEnd: '',
            currDate: this.$moment().format("YYYY-MM-DD"),
            isLoadingAdd:false,
            disabled:true,
            isShow:false,
        
        }
    },
    methods:{
        handleChangeInputStart(val){
            if(this.$moment(val)._isValid){
                this.datePickerValueStart = val;
                this.selectDateStart();
            }
        },
        selectDateStart() {
            this.menuStart = false;
            this.$refs.menuStart.save(this.datePickerValueStart);
            this.$emit("changeStart", this.datePickerValueStart);
            this.$emit("inputStart", this.datePickerValueStart);
            this.dateStart = this.datePickerValueStart;
        },
        handleChangeInputEnd(val){
            if(this.$moment(val)._isValid){
                this.datePickerValueEnd = val;
                this.selectDateEnd();
            }
        },
        selectDateEnd() {
            this.menuEnd = false;
            this.$refs.menuEnd.save(this.datePickerValueEnd);
            this.$emit("changeEnd", this.datePickerValueEnd);
            this.$emit("inputEnd", this.datePickerValueEnd);
            this.dateEnd = this.datePickerValueEnd;
        },

        handleAddVersion(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                let projectId=this.$route.params.id;
                data.name=this.dataVersionProps.name.value;
                data.description=this.dataVersionProps.description.value;
                if (this.dateStart) {
                    data.startTime=this.dateStart;
                }
                if (this.dateEnd) {
                    data.endTime=this.dateEnd;
                }
                data.projectId=projectId;
                // đẩy xuống worker xử lý
                this.versionWorker.postMessage({
                    action:'handleAddVersion',
                    data:data
                });
            }else{
                this.isLoadingAdd=false;
            }
        },
        handleUpdateVersion(){
            this.isLoadingAdd = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                data.name=this.dataVersionProps.name.value;
                data.description=this.dataVersionProps.description.value;
                data.status=this.infoVersion.status;
                if (this.dateStart) {
                    data.startTime=this.dateStart;
                }
                if (this.dateEnd) {
                    data.endTime=this.dateEnd;
                }
                // đẩy xuống worker xử lý
                this.versionWorker.postMessage({
                    action:'handleUpdateVersion',
                    data:{id:this.infoVersion.id,data:data}
                });
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoadingAdd=false;
            }
        },
        show(){
            this.isShow=true;
        },
        validateData(){
            let data=this.dataVersionProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            if (this.msgErrStartTime!="" || this.msgErrEndTime!="") {
                return false;
            }
            return true;
        },
    },
    created(){
        let self = this;
        this.versionWorker = new VersionWorker();
        this.versionWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'actionError':
                    self.isShow=false;
                    self.isLoadingAdd=false;
                case 'handleUpdateVersion':
                    self.$snotifySuccess("Update version success!");
                    self.$emit("add-version"); // emit sự kiện để reload data
                    self.isShow=false;
                    self.isLoadingAdd=false;
                    break;
                case 'handleAddVersion':
                    self.$emit("add-version");
                    self.$snotifySuccess("Add version completed!");
                    self.isShow=false;
                    self.isLoadingAdd=false;
                    break;
                default:
                    break;
            }
        });
    }
    
}
</script>

<style scoped>
.symper-text >>>.v-icon{
    font-size: 18px;
}
.symper-text >>> .v-input__slot{
    height: 32px;
    min-height: unset;
}
</style>